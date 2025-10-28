#include "analysis/ConversationTracker.h"
#include <QFile>
#include <QDataStream>
#include <QMutexLocker>
#include <algorithm>

ConversationTracker::ConversationTracker(QObject *parent)
    : QObject(parent)
    , m_nextStreamIndex(0)
    , m_maxConversations(100000)
    , m_conversationTimeout(3600)
    , m_enableStreamReassembly(true)
    , m_maxStreamSize(10 * 1024 * 1024) // 10 MB default
    , m_totalPackets(0)
    , m_totalBytes(0)
{
}

ConversationTracker::~ConversationTracker() {
    clear();
}

void ConversationTracker::addPacket(const std::shared_ptr<PacketModel> &packet) {
    if (!packet) return;

    QMutexLocker locker(&m_mutex);

    // Generate conversation ID
    QString convId = getConversationId(packet);
    if (convId.isEmpty()) return;

    // Update or create conversation
    if (m_conversations.contains(convId)) {
        updateConversation(convId, packet);
        emit conversationUpdated(convId);
    } else {
        // Create new conversation
        Conversation conv;
        conv.id = convId;
        conv.protocol = packet->protocol;
        conv.addressA = packet->srcIP;
        conv.portA = packet->srcPort;
        conv.addressB = packet->dstIP;
        conv.portB = packet->dstPort;
        conv.startTime = packet->timestamp;
        conv.endTime = packet->timestamp;
        conv.firstPacketNum = packet->number;
        conv.lastPacketNum = packet->number;
        conv.packetsAtoB = 1;
        conv.bytesAtoB = packet->length;
        conv.packetNumbers.append(packet->number);

        m_conversations.insert(convId, conv);
        emit conversationAdded(convId);

        // Enforce conversation limit
        if (m_conversations.size() > static_cast<int>(m_maxConversations)) {
            enforceConversationLimit();
        }
    }

    // Handle TCP streams
    if (packet->protocol == "TCP" && m_enableStreamReassembly) {
        processTcpPacket(packet);
    }

    // Update statistics
    m_totalPackets++;
    m_totalBytes += packet->length;
    emit statisticsUpdated();
}

void ConversationTracker::clear() {
    QMutexLocker locker(&m_mutex);
    m_conversations.clear();
    m_tcpStreams.clear();
    m_tcpStreamMap.clear();
    m_nextStreamIndex = 0;
    m_totalPackets = 0;
    m_totalBytes = 0;
}

void ConversationTracker::reset() {
    clear();
}

QString ConversationTracker::generateConversationId(const QString &proto, const QString &addrA,
                                                    quint16 portA, const QString &addrB,
                                                    quint16 portB) const {
    QString key = normalizeConversationKey(addrA, portA, addrB, portB);
    return QString("%1_%2").arg(proto, key);
}

QString ConversationTracker::normalizeConversationKey(const QString &addrA, quint16 portA,
                                                      const QString &addrB, quint16 portB) const {
    // Normalize so A->B and B->A have same ID
    if (addrA < addrB || (addrA == addrB && portA < portB)) {
        return QString("%1:%2_%3:%4").arg(addrA).arg(portA).arg(addrB).arg(portB);
    } else {
        return QString("%1:%2_%3:%4").arg(addrB).arg(portB).arg(addrA).arg(portA);
    }
}

QString ConversationTracker::getConversationId(const std::shared_ptr<PacketModel> &packet) const {
    if (!packet) return QString();
    return generateConversationId(packet->protocol, packet->srcIP, packet->srcPort,
                                  packet->dstIP, packet->dstPort);
}

void ConversationTracker::updateConversation(const QString &convId,
                                            const std::shared_ptr<PacketModel> &packet) {
    if (!m_conversations.contains(convId)) return;

    Conversation &conv = m_conversations[convId];

    // Determine direction
    bool isAtoB = (packet->srcIP == conv.addressA && packet->srcPort == conv.portA);

    // Update statistics
    if (isAtoB) {
        conv.packetsAtoB++;
        conv.bytesAtoB += packet->length;
    } else {
        conv.packetsBtoA++;
        conv.bytesBtoA += packet->length;
    }

    // Update timing
    conv.endTime = packet->timestamp;
    conv.duration = conv.startTime.msecsTo(conv.endTime) / 1000.0;
    conv.lastPacketNum = packet->number;
    conv.packetNumbers.append(packet->number);

    // TCP-specific handling
    if (packet->protocol == "TCP") {
        updateTcpState(conv, packet);
    }

    // Detect application protocol
    if (conv.applicationProtocol.isEmpty()) {
        detectApplicationProtocol(conv, packet);
    }
}

void ConversationTracker::updateTcpState(Conversation &conv,
                                        const std::shared_ptr<PacketModel> &packet) {
    // Check TCP flags from custom fields
    if (packet->customFields.contains("tcp.flags.syn") &&
        packet->customFields["tcp.flags.syn"].toBool()) {
        conv.hasSyn = true;
        if (conv.synPacketNum == 0) {
            conv.synPacketNum = packet->number;
        }
    }

    if (packet->customFields.contains("tcp.flags.fin") &&
        packet->customFields["tcp.flags.fin"].toBool()) {
        conv.hasFin = true;
        conv.finPacketNum = packet->number;
    }

    if (packet->customFields.contains("tcp.flags.rst") &&
        packet->customFields["tcp.flags.rst"].toBool()) {
        conv.hasRst = true;
    }

    // Check if connection is complete
    if (conv.hasSyn && (conv.hasFin || conv.hasRst)) {
        conv.isTcpComplete = true;
        emit conversationCompleted(conv.id);
    }
}

void ConversationTracker::detectApplicationProtocol(Conversation &conv,
                                                   const std::shared_ptr<PacketModel> &packet) {
    // Simple heuristics based on ports
    quint16 lowPort = qMin(conv.portA, conv.portB);
    
    if (lowPort == 80 || lowPort == 8080) {
        conv.applicationProtocol = "HTTP";
    } else if (lowPort == 443 || lowPort == 8443) {
        conv.applicationProtocol = "HTTPS";
    } else if (lowPort == 53) {
        conv.applicationProtocol = "DNS";
    } else if (lowPort == 21) {
        conv.applicationProtocol = "FTP";
    } else if (lowPort == 22) {
        conv.applicationProtocol = "SSH";
    } else if (lowPort == 25 || lowPort == 587) {
        conv.applicationProtocol = "SMTP";
    } else if (lowPort == 110 || lowPort == 995) {
        conv.applicationProtocol = "POP3";
    } else if (lowPort == 143 || lowPort == 993) {
        conv.applicationProtocol = "IMAP";
    }
}

QList<Conversation> ConversationTracker::getAllConversations() const {
    QMutexLocker locker(&m_mutex);
    return m_conversations.values();
}

QList<Conversation> ConversationTracker::getConversationsByProtocol(const QString &protocol) const {
    QMutexLocker locker(&m_mutex);
    QList<Conversation> result;
    for (const auto &conv : m_conversations) {
        if (conv.protocol == protocol) {
            result.append(conv);
        }
    }
    return result;
}

Conversation ConversationTracker::getConversation(const QString &conversationId) const {
    QMutexLocker locker(&m_mutex);
    return m_conversations.value(conversationId);
}

QList<quint64> ConversationTracker::getConversationPackets(const QString &conversationId) const {
    QMutexLocker locker(&m_mutex);
    if (m_conversations.contains(conversationId)) {
        return m_conversations[conversationId].packetNumbers;
    }
    return QList<quint64>();
}

void ConversationTracker::processTcpPacket(const std::shared_ptr<PacketModel> &packet) {
    quint32 streamIdx = getOrCreateTcpStream(packet);
    if (streamIdx == 0) return;

    TcpStream &stream = m_tcpStreams[streamIdx];
    addTcpSegment(stream, packet);
    detectTcpFlags(stream, packet);
    emit tcpStreamUpdated(streamIdx);
}

quint32 ConversationTracker::getOrCreateTcpStream(const std::shared_ptr<PacketModel> &packet) {
    QString convId = getConversationId(packet);
    
    if (m_tcpStreamMap.contains(convId)) {
        return m_tcpStreamMap[convId];
    }

    // Create new stream
    TcpStream stream;
    stream.streamIndex = m_nextStreamIndex++;
    stream.conversationId = convId;
    stream.clientAddress = packet->srcIP;
    stream.clientPort = packet->srcPort;
    stream.serverAddress = packet->dstIP;
    stream.serverPort = packet->dstPort;
    stream.startTime = packet->timestamp;

    // Get initial sequence numbers from SYN
    if (packet->customFields.contains("tcp.seq")) {
        stream.clientInitSeq = packet->customFields["tcp.seq"].toUInt();
        stream.clientNextSeq = stream.clientInitSeq + 1;
    }

    m_tcpStreams.insert(stream.streamIndex, stream);
    m_tcpStreamMap.insert(convId, stream.streamIndex);
    emit tcpStreamCreated(stream.streamIndex);

    return stream.streamIndex;
}

void ConversationTracker::addTcpSegment(TcpStream &stream,
                                       const std::shared_ptr<PacketModel> &packet) {
    bool isClientToServer = (packet->srcIP == stream.clientAddress &&
                             packet->srcPort == stream.clientPort);

    quint32 seq = packet->customFields.value("tcp.seq", 0).toUInt();
    quint32 payloadLen = packet->customFields.value("tcp.len", 0).toUInt();

    if (payloadLen == 0) return;

    // Check for retransmission
    if (isRetransmission(stream, seq, payloadLen, isClientToServer)) {
        stream.retransmissions++;
        return;
    }

    // Update statistics
    if (isClientToServer) {
        stream.clientPackets++;
        stream.clientBytes += payloadLen;
    } else {
        stream.serverPackets++;
        stream.serverBytes += payloadLen;
    }

    stream.endTime = packet->timestamp;
}

bool ConversationTracker::isRetransmission(const TcpStream &stream, quint32 seq, quint32 len,
                                          bool clientToServer) const {
    quint32 expectedSeq = clientToServer ? stream.clientNextSeq : stream.serverNextSeq;
    return (seq + len) <= expectedSeq;
}

void ConversationTracker::detectTcpFlags(TcpStream &stream,
                                        const std::shared_ptr<PacketModel> &packet) {
    bool hasFin = packet->customFields.value("tcp.flags.fin", false).toBool();
    bool hasRst = packet->customFields.value("tcp.flags.rst", false).toBool();

    if (hasFin || hasRst) {
        stream.isComplete = true;
        emit tcpStreamComplete(stream.streamIndex);
    }
}

QList<TcpStream> ConversationTracker::getAllTcpStreams() const {
    QMutexLocker locker(&m_mutex);
    return m_tcpStreams.values();
}

TcpStream ConversationTracker::getTcpStream(quint32 streamIndex) const {
    QMutexLocker locker(&m_mutex);
    return m_tcpStreams.value(streamIndex);
}

quint32 ConversationTracker::getTcpStreamIndex(const std::shared_ptr<PacketModel> &packet) const {
    QMutexLocker locker(&m_mutex);
    QString convId = getConversationId(packet);
    return m_tcpStreamMap.value(convId, 0);
}

quint64 ConversationTracker::getTotalConversations() const {
    QMutexLocker locker(&m_mutex);
    return m_conversations.size();
}

quint64 ConversationTracker::getTotalTcpStreams() const {
    QMutexLocker locker(&m_mutex);
    return m_tcpStreams.size();
}

void ConversationTracker::setMaxConversations(quint64 max) {
    QMutexLocker locker(&m_mutex);
    m_maxConversations = max;
}

void ConversationTracker::setConversationTimeout(int seconds) {
    m_conversationTimeout = seconds;
}

void ConversationTracker::setEnableStreamReassembly(bool enable) {
    m_enableStreamReassembly = enable;
}

void ConversationTracker::setMaxStreamSize(quint64 maxBytes) {
    m_maxStreamSize = maxBytes;
}

void ConversationTracker::enforceConversationLimit() {
    // Remove oldest conversations if limit exceeded
    while (m_conversations.size() > static_cast<int>(m_maxConversations)) {
        QString oldestId;
        QDateTime oldestTime = QDateTime::currentDateTime();

        for (auto it = m_conversations.constBegin(); it != m_conversations.constEnd(); ++it) {
            if (it.value().endTime < oldestTime) {
                oldestTime = it.value().endTime;
                oldestId = it.key();
            }
        }

        if (!oldestId.isEmpty()) {
            m_conversations.remove(oldestId);
            if (m_tcpStreamMap.contains(oldestId)) {
                quint32 streamIdx = m_tcpStreamMap.take(oldestId);
                m_tcpStreams.remove(streamIdx);
            }
        }
    }
}

QHash<QString, quint64> ConversationTracker::getConversationCountByProtocol() const {
    QMutexLocker locker(&m_mutex);
    QHash<QString, quint64> counts;
    for (const auto &conv : m_conversations) {
        counts[conv.protocol]++;
    }
    return counts;
}

QPair<quint64, quint64> ConversationTracker::getTotalTraffic() const {
    QMutexLocker locker(&m_mutex);
    return qMakePair(m_totalPackets, m_totalBytes);
}
