#include "analysis/StatisticsEngine.h"
#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QTextStream>
#include <QMutexLocker>
#include <algorithm>

StatisticsEngine::StatisticsEngine(QObject *parent)
    : QObject(parent)
    , m_maxEndpoints(10000)
    , m_timeSeriesInterval(1000)
    , m_currentIntervalPackets(0)
    , m_currentIntervalBytes(0)
    , m_totalErrors(0)
    , m_maxErrorPackets(1000)
    , m_peakPacketsPerSecond(0.0)
    , m_peakBitsPerSecond(0.0)
{
    // Default packet size buckets: 0-64, 64-128, 128-256, 256-512, 512-1024, 1024-1518, 1518+
    m_sizeBucketBoundaries = {0, 64, 128, 256, 512, 1024, 1518, UINT64_MAX};
    
    // Initialize size distribution buckets
    for (int i = 0; i < m_sizeBucketBoundaries.size() - 1; ++i) {
        PacketSizeBucket bucket;
        bucket.minSize = m_sizeBucketBoundaries[i];
        bucket.maxSize = m_sizeBucketBoundaries[i + 1];
        m_sizeDistribution.append(bucket);
    }
}

StatisticsEngine::~StatisticsEngine() {
    clear();
}

void StatisticsEngine::addPacket(const std::shared_ptr<PacketModel> &packet) {
    if (!packet) return;

    QMutexLocker locker(&m_mutex);

    // Update overall statistics
    m_captureStats.totalPackets++;
    m_captureStats.totalBytes += packet->length;

    if (m_captureStats.captureStart.isNull()) {
        m_captureStats.captureStart = packet->timestamp;
        m_currentIntervalStart = packet->timestamp;
    }
    
    m_captureStats.captureEnd = packet->timestamp;
    m_lastPacketTime = packet->timestamp;

    // Update min/max packet sizes
    if (m_captureStats.minPacketSize == 0 || packet->length < m_captureStats.minPacketSize) {
        m_captureStats.minPacketSize = packet->length;
    }
    if (packet->length > m_captureStats.maxPacketSize) {
        m_captureStats.maxPacketSize = packet->length;
    }

    // Update component statistics
    updateProtocolStats(packet);
    updateEndpointStats(packet);
    updateTimeSeries(packet);
    updateSizeDistribution(packet);
    updatePortStats(packet);

    // Track errors
    if (packet->hasError) {
        trackError(packet);
    }

    // Calculate derived statistics
    m_captureStats.captureDuration = 
        m_captureStats.captureStart.msecsTo(m_captureStats.captureEnd) / 1000.0;
    
    if (m_captureStats.captureDuration > 0) {
        m_captureStats.avgPacketsPerSecond = 
            m_captureStats.totalPackets / m_captureStats.captureDuration;
        m_captureStats.avgBitsPerSecond = 
            (m_captureStats.totalBytes * 8.0) / m_captureStats.captureDuration;
        m_captureStats.avgMbitsPerSecond = m_captureStats.avgBitsPerSecond / 1000000.0;
    }

    if (m_captureStats.totalPackets > 0) {
        m_captureStats.avgPacketSize = 
            static_cast<double>(m_captureStats.totalBytes) / m_captureStats.totalPackets;
    }

    emit statisticsUpdated();
}

void StatisticsEngine::clear() {
    QMutexLocker locker(&m_mutex);
    
    m_captureStats = CaptureStatistics();
    m_protocolStats.clear();
    m_endpointStats.clear();
    m_timeSeriesData.clear();
    m_srcPortStats.clear();
    m_dstPortStats.clear();
    m_errorPackets.clear();
    m_errorTypes.clear();
    m_totalErrors = 0;
    m_peakPacketsPerSecond = 0.0;
    m_peakBitsPerSecond = 0.0;
    
    // Reset size distribution
    for (auto &bucket : m_sizeDistribution) {
        bucket.count = 0;
        bucket.percentage = 0.0;
    }
}

void StatisticsEngine::reset() {
    clear();
}

void StatisticsEngine::updateProtocolStats(const std::shared_ptr<PacketModel> &packet) {
    QString proto = packet->protocol;
    
    if (!m_protocolStats.contains(proto)) {
        ProtocolStats stats;
        stats.protocol = proto;
        stats.firstSeen = packet->timestamp;
        stats.minPacketSize = packet->length;
        m_protocolStats.insert(proto, stats);
    }

    ProtocolStats &stats = m_protocolStats[proto];
    stats.packetCount++;
    stats.byteCount += packet->length;
    stats.lastSeen = packet->timestamp;

    if (packet->length < stats.minPacketSize) {
        stats.minPacketSize = packet->length;
    }
    if (packet->length > stats.maxPacketSize) {
        stats.maxPacketSize = packet->length;
    }

    stats.avgPacketSize = static_cast<double>(stats.byteCount) / stats.packetCount;

    recalculateProtocolPercentages();
    emit protocolStatsUpdated();
}

void StatisticsEngine::recalculateProtocolPercentages() {
    for (auto &stats : m_protocolStats) {
        stats.percentage = (m_captureStats.totalPackets > 0) ?
            (static_cast<double>(stats.packetCount) / m_captureStats.totalPackets) * 100.0 : 0.0;
        stats.bytesPercentage = (m_captureStats.totalBytes > 0) ?
            (static_cast<double>(stats.byteCount) / m_captureStats.totalBytes) * 100.0 : 0.0;
    }
}

void StatisticsEngine::updateEndpointStats(const std::shared_ptr<PacketModel> &packet) {
    // Update source endpoint
    if (!packet->srcIP.isEmpty()) {
        if (!m_endpointStats.contains(packet->srcIP)) {
            EndpointStats stats;
            stats.address = packet->srcIP;
            stats.firstSeen = packet->timestamp;
            m_endpointStats.insert(packet->srcIP, stats);
        }

        EndpointStats &srcStats = m_endpointStats[packet->srcIP];
        srcStats.packetsSent++;
        srcStats.bytesSent += packet->length;
        srcStats.totalPackets++;
        srcStats.totalBytes += packet->length;
        srcStats.protocols.insert(packet->protocol);
        srcStats.portsSrc.insert(packet->srcPort);
        srcStats.lastSeen = packet->timestamp;
    }

    // Update destination endpoint
    if (!packet->dstIP.isEmpty()) {
        if (!m_endpointStats.contains(packet->dstIP)) {
            EndpointStats stats;
            stats.address = packet->dstIP;
            stats.firstSeen = packet->timestamp;
            m_endpointStats.insert(packet->dstIP, stats);
        }

        EndpointStats &dstStats = m_endpointStats[packet->dstIP];
        dstStats.packetsReceived++;
        dstStats.bytesReceived += packet->length;
        dstStats.totalPackets++;
        dstStats.totalBytes += packet->length;
        dstStats.protocols.insert(packet->protocol);
        dstStats.portsDst.insert(packet->dstPort);
        dstStats.lastSeen = packet->timestamp;
    }

    // Enforce endpoint limit
    if (m_endpointStats.size() > m_maxEndpoints) {
        enforceEndpointLimit();
    }

    emit endpointStatsUpdated();
}

void StatisticsEngine::enforceEndpointLimit() {
    // Remove endpoints with lowest packet count
    while (m_endpointStats.size() > m_maxEndpoints) {
        QString minAddress;
        quint64 minPackets = UINT64_MAX;

        for (auto it = m_endpointStats.constBegin(); it != m_endpointStats.constEnd(); ++it) {
            if (it.value().totalPackets < minPackets) {
                minPackets = it.value().totalPackets;
                minAddress = it.key();
            }
        }

        if (!minAddress.isEmpty()) {
            m_endpointStats.remove(minAddress);
        }
    }
}

void StatisticsEngine::updateTimeSeries(const std::shared_ptr<PacketModel> &packet) {
    qint64 msSinceIntervalStart = m_currentIntervalStart.msecsTo(packet->timestamp);

    if (msSinceIntervalStart >= m_timeSeriesInterval) {
        // Finalize current interval
        PacketRatePoint point;
        point.timestamp = m_currentIntervalStart;
        point.packetCount = m_currentIntervalPackets;
        point.byteCount = m_currentIntervalBytes;

        double intervalSeconds = m_timeSeriesInterval / 1000.0;
        point.packetsPerSecond = m_currentIntervalPackets / intervalSeconds;
        point.bitsPerSecond = (m_currentIntervalBytes * 8.0) / intervalSeconds;

        m_timeSeriesData.append(point);

        // Update peak rates
        if (point.packetsPerSecond > m_peakPacketsPerSecond) {
            m_peakPacketsPerSecond = point.packetsPerSecond;
        }
        if (point.bitsPerSecond > m_peakBitsPerSecond) {
            m_peakBitsPerSecond = point.bitsPerSecond;
        }

        emit rateUpdated(point.packetsPerSecond, point.bitsPerSecond);

        // Start new interval
        m_currentIntervalStart = m_currentIntervalStart.addMSecs(m_timeSeriesInterval);
        m_currentIntervalPackets = 0;
        m_currentIntervalBytes = 0;
    }

    // Add to current interval
    m_currentIntervalPackets++;
    m_currentIntervalBytes += packet->length;
}

void StatisticsEngine::updateSizeDistribution(const std::shared_ptr<PacketModel> &packet) {
    int bucketIdx = getSizeBucketIndex(packet->length);
    if (bucketIdx >= 0 && bucketIdx < m_sizeDistribution.size()) {
        m_sizeDistribution[bucketIdx].count++;

        // Recalculate percentages
        for (auto &bucket : m_sizeDistribution) {
            bucket.percentage = (m_captureStats.totalPackets > 0) ?
                (static_cast<double>(bucket.count) / m_captureStats.totalPackets) * 100.0 : 0.0;
        }
    }
}

int StatisticsEngine::getSizeBucketIndex(quint64 size) const {
    for (int i = 0; i < m_sizeDistribution.size(); ++i) {
        if (size >= m_sizeDistribution[i].minSize && size < m_sizeDistribution[i].maxSize) {
            return i;
        }
    }
    return -1;
}

void StatisticsEngine::updatePortStats(const std::shared_ptr<PacketModel> &packet) {
    if (packet->srcPort > 0) {
        m_srcPortStats[packet->srcPort]++;
    }
    if (packet->dstPort > 0) {
        m_dstPortStats[packet->dstPort]++;
    }
}

void StatisticsEngine::trackError(const std::shared_ptr<PacketModel> &packet) {
    m_totalErrors++;
    
    QString errorType = packet->errorInfo.isEmpty() ? "Unknown" : packet->errorInfo;
    m_errorTypes[errorType]++;

    if (m_errorPackets.size() < m_maxErrorPackets) {
        m_errorPackets.append(packet);
    }
}

CaptureStatistics StatisticsEngine::getCaptureStatistics() const {
    QMutexLocker locker(&m_mutex);
    CaptureStatistics stats = m_captureStats;
    stats.peakPacketsPerSecond = m_peakPacketsPerSecond;
    stats.peakBitsPerSecond = m_peakBitsPerSecond;
    return stats;
}

QList<ProtocolStats> StatisticsEngine::getProtocolStatistics() const {
    QMutexLocker locker(&m_mutex);
    return m_protocolStats.values();
}

QList<EndpointStats> StatisticsEngine::getEndpointStatistics() const {
    QMutexLocker locker(&m_mutex);
    return m_endpointStats.values();
}

QList<PacketRatePoint> StatisticsEngine::getPacketRateTimeSeries(int intervalMs) const {
    QMutexLocker locker(&m_mutex);
    Q_UNUSED(intervalMs); // TODO: Support resampling
    return m_timeSeriesData;
}

QList<PacketSizeBucket> StatisticsEngine::getPacketSizeDistribution() const {
    QMutexLocker locker(&m_mutex);
    return m_sizeDistribution;
}

QHash<quint16, quint64> StatisticsEngine::getTopSourcePorts(int count) const {
    QMutexLocker locker(&m_mutex);
    
    QList<QPair<quint16, quint64>> sorted;
    for (auto it = m_srcPortStats.constBegin(); it != m_srcPortStats.constEnd(); ++it) {
        sorted.append(qMakePair(it.key(), it.value()));
    }
    
    std::sort(sorted.begin(), sorted.end(),
              [](const QPair<quint16, quint64> &a, const QPair<quint16, quint64> &b) {
                  return a.second > b.second;
              });

    QHash<quint16, quint64> result;
    for (int i = 0; i < qMin(count, sorted.size()); ++i) {
        result.insert(sorted[i].first, sorted[i].second);
    }
    return result;
}

QHash<quint16, quint64> StatisticsEngine::getTopDestinationPorts(int count) const {
    QMutexLocker locker(&m_mutex);
    
    QList<QPair<quint16, quint64>> sorted;
    for (auto it = m_dstPortStats.constBegin(); it != m_dstPortStats.constEnd(); ++it) {
        sorted.append(qMakePair(it.key(), it.value()));
    }
    
    std::sort(sorted.begin(), sorted.end(),
              [](const QPair<quint16, quint64> &a, const QPair<quint16, quint64> &b) {
                  return a.second > b.second;
              });

    QHash<quint16, quint64> result;
    for (int i = 0; i < qMin(count, sorted.size()); ++i) {
        result.insert(sorted[i].first, sorted[i].second);
    }
    return result;
}

void StatisticsEngine::setTimeSeriesInterval(int intervalMs) {
    m_timeSeriesInterval = intervalMs;
}

void StatisticsEngine::setMaxEndpoints(int max) {
    m_maxEndpoints = max;
}

QString StatisticsEngine::getStatisticsSummary() const {
    QMutexLocker locker(&m_mutex);
    
    QString summary;
    QTextStream stream(&summary);
    
    stream << "=== Capture Statistics ===" << "\n";
    stream << "Total Packets: " << m_captureStats.totalPackets << "\n";
    stream << "Total Bytes: " << m_captureStats.totalBytes << "\n";
    stream << "Duration: " << m_captureStats.captureDuration << " seconds\n";
    stream << "Avg Rate: " << m_captureStats.avgPacketsPerSecond << " packets/sec\n";
    stream << "Avg Bandwidth: " << m_captureStats.avgMbitsPerSecond << " Mbps\n";
    
    return summary;
}
