#ifndef CONVERSATIONTRACKER_H
#define CONVERSATIONTRACKER_H

#include <QObject>
#include <QHash>
#include <QList>
#include <QDateTime>
#include <QMutex>
#include <memory>
#include "../models/PacketModel.h"

// Forward declarations
class StreamReassembler;

/**
 * @brief Represents a network conversation between two endpoints
 */
struct Conversation {
    QString id;                      // Unique conversation identifier
    QString protocol;                // Protocol (TCP, UDP, etc.)
    QString addressA;                // First endpoint address
    quint16 portA;                   // First endpoint port
    QString addressB;                // Second endpoint address
    quint16 portB;                   // Second endpoint port
    
    // Statistics
    quint64 packetsAtoB;            // Packets from A to B
    quint64 packetsBtoA;            // Packets from B to A
    quint64 bytesAtoB;              // Bytes from A to B
    quint64 bytesBtoA;              // Bytes from B to A
    
    // Timing
    QDateTime startTime;             // First packet time
    QDateTime endTime;               // Last packet time
    double duration;                 // Duration in seconds
    
    // Packet references
    QList<quint64> packetNumbers;    // All packet numbers in conversation
    quint64 firstPacketNum;          // First packet number
    quint64 lastPacketNum;           // Last packet number
    
    // TCP-specific
    bool isTcpComplete;              // TCP connection complete (SYN->FIN)
    bool hasSyn;                     // Has SYN flag
    bool hasFin;                     // Has FIN flag
    bool hasRst;                     // Has RST flag
    quint32 synPacketNum;            // SYN packet number
    quint32 finPacketNum;            // FIN packet number
    
    // Application layer
    QString applicationProtocol;     // Detected app protocol (HTTP, DNS, etc.)
    QHash<QString, QVariant> metadata; // Additional metadata
    
    Conversation() : portA(0), portB(0), packetsAtoB(0), packetsBtoA(0),
                     bytesAtoB(0), bytesBtoA(0), duration(0.0),
                     firstPacketNum(0), lastPacketNum(0), isTcpComplete(false),
                     hasSyn(false), hasFin(false), hasRst(false),
                     synPacketNum(0), finPacketNum(0) {}
};

/**
 * @brief Represents a TCP stream with reassembled data
 */
struct TcpStream {
    quint32 streamIndex;             // Unique stream index
    QString conversationId;          // Associated conversation
    
    // Endpoints
    QString clientAddress;
    quint16 clientPort;
    QString serverAddress;
    quint16 serverPort;
    
    // Stream data
    QByteArray clientData;           // Data from client to server
    QByteArray serverData;           // Data from server to client
    
    // Sequence tracking
    quint32 clientInitSeq;           // Client initial sequence number
    quint32 serverInitSeq;           // Server initial sequence number
    quint32 clientNextSeq;           // Client expected next sequence
    quint32 serverNextSeq;           // Server expected next sequence
    
    // Stream state
    bool isComplete;                 // Stream fully reassembled
    bool hasGaps;                    // Has missing segments
    QList<QPair<quint32, quint32>> clientGaps; // Client-side gaps (start, length)
    QList<QPair<quint32, quint32>> serverGaps; // Server-side gaps (start, length)
    
    // Statistics
    quint64 clientPackets;
    quint64 serverPackets;
    quint64 clientBytes;
    quint64 serverBytes;
    quint64 retransmissions;
    quint64 outOfOrder;
    
    // Timing
    QDateTime startTime;
    QDateTime endTime;
    
    TcpStream() : streamIndex(0), clientPort(0), serverPort(0),
                  clientInitSeq(0), serverInitSeq(0), clientNextSeq(0),
                  serverNextSeq(0), isComplete(false), hasGaps(false),
                  clientPackets(0), serverPackets(0), clientBytes(0),
                  serverBytes(0), retransmissions(0), outOfOrder(0) {}
};

/**
 * @brief Tracks network conversations and TCP stream reassembly
 */
class ConversationTracker : public QObject {
    Q_OBJECT

public:
    explicit ConversationTracker(QObject *parent = nullptr);
    ~ConversationTracker();

    // Conversation management
    void addPacket(const std::shared_ptr<PacketModel> &packet);
    void clear();
    void reset();

    // Conversation queries
    QList<Conversation> getAllConversations() const;
    QList<Conversation> getConversationsByProtocol(const QString &protocol) const;
    Conversation getConversation(const QString &conversationId) const;
    QString getConversationId(const std::shared_ptr<PacketModel> &packet) const;
    QList<quint64> getConversationPackets(const QString &conversationId) const;

    // Conversation filtering
    QList<Conversation> filterConversations(const QString &address) const;
    QList<Conversation> filterConversationsByPort(quint16 port) const;
    QList<Conversation> getActiveConversations(const QDateTime &since) const;
    QList<Conversation> getTopConversationsByPackets(int count) const;
    QList<Conversation> getTopConversationsByBytes(int count) const;

    // TCP stream management
    QList<TcpStream> getAllTcpStreams() const;
    TcpStream getTcpStream(quint32 streamIndex) const;
    TcpStream getTcpStreamForPacket(const std::shared_ptr<PacketModel> &packet) const;
    quint32 getTcpStreamIndex(const std::shared_ptr<PacketModel> &packet) const;
    
    // TCP stream reassembly
    bool reassembleTcpStream(quint32 streamIndex);
    QByteArray getStreamData(quint32 streamIndex, bool clientToServer) const;
    bool exportStreamData(quint32 streamIndex, const QString &filePath, bool clientToServer) const;
    bool exportStreamRaw(quint32 streamIndex, const QString &filePath) const;

    // Statistics
    quint64 getTotalConversations() const;
    quint64 getTotalTcpStreams() const;
    QHash<QString, quint64> getConversationCountByProtocol() const;
    QPair<quint64, quint64> getTotalTraffic() const; // (packets, bytes)

    // Configuration
    void setMaxConversations(quint64 max);
    void setConversationTimeout(int seconds);
    void setEnableStreamReassembly(bool enable);
    void setMaxStreamSize(quint64 maxBytes);

signals:
    void conversationAdded(const QString &conversationId);
    void conversationUpdated(const QString &conversationId);
    void conversationCompleted(const QString &conversationId);
    void tcpStreamCreated(quint32 streamIndex);
    void tcpStreamUpdated(quint32 streamIndex);
    void tcpStreamComplete(quint32 streamIndex);
    void statisticsUpdated();

private:
    // Conversation ID generation
    QString generateConversationId(const QString &proto, const QString &addrA, quint16 portA,
                                   const QString &addrB, quint16 portB) const;
    QString normalizeConversationKey(const QString &addrA, quint16 portA,
                                    const QString &addrB, quint16 portB) const;

    // Conversation tracking
    void updateConversation(const QString &convId, const std::shared_ptr<PacketModel> &packet);
    void detectApplicationProtocol(Conversation &conv, const std::shared_ptr<PacketModel> &packet);
    void updateTcpState(Conversation &conv, const std::shared_ptr<PacketModel> &packet);
    
    // TCP stream handling
    void processTcpPacket(const std::shared_ptr<PacketModel> &packet);
    quint32 getOrCreateTcpStream(const std::shared_ptr<PacketModel> &packet);
    void addTcpSegment(TcpStream &stream, const std::shared_ptr<PacketModel> &packet);
    void detectTcpFlags(TcpStream &stream, const std::shared_ptr<PacketModel> &packet);
    bool isRetransmission(const TcpStream &stream, quint32 seq, quint32 len, bool clientToServer) const;

    // Cleanup
    void cleanupOldConversations();
    void enforceConversationLimit();

    // Data members
    mutable QMutex m_mutex;
    QHash<QString, Conversation> m_conversations;     // Key: conversation ID
    QHash<QString, quint32> m_tcpStreamMap;          // Key: conversation ID, Value: stream index
    QHash<quint32, TcpStream> m_tcpStreams;          // Key: stream index
    
    quint32 m_nextStreamIndex;
    quint64 m_maxConversations;
    int m_conversationTimeout;                        // Seconds
    bool m_enableStreamReassembly;
    quint64 m_maxStreamSize;                          // Maximum stream size in bytes
    
    // Statistics cache
    quint64 m_totalPackets;
    quint64 m_totalBytes;
};

#endif // CONVERSATIONTRACKER_H
