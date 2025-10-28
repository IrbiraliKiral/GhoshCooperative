#ifndef STATISTICSENGINE_H
#define STATISTICSENGINE_H

#include <QObject>
#include <QHash>
#include <QList>
#include <QDateTime>
#include <QMutex>
#include <memory>
#include "../models/PacketModel.h"

/**
 * @brief Protocol distribution statistics
 */
struct ProtocolStats {
    QString protocol;
    quint64 packetCount;
    quint64 byteCount;
    double percentage;           // Percentage of total packets
    double bytesPercentage;      // Percentage of total bytes
    double avgPacketSize;        // Average packet size
    quint64 minPacketSize;
    quint64 maxPacketSize;
    QDateTime firstSeen;
    QDateTime lastSeen;

    ProtocolStats() : packetCount(0), byteCount(0), percentage(0.0),
                     bytesPercentage(0.0), avgPacketSize(0.0),
                     minPacketSize(0), maxPacketSize(0) {}
};

/**
 * @brief Endpoint (IP address) statistics
 */
struct EndpointStats {
    QString address;
    quint64 packetsSent;
    quint64 packetsReceived;
    quint64 bytesSent;
    quint64 bytesReceived;
    quint64 totalPackets;
    quint64 totalBytes;
    QSet<QString> protocols;     // Protocols used
    QSet<quint16> portsSrc;      // Source ports used
    QSet<quint16> portsDst;      // Destination ports contacted
    QDateTime firstSeen;
    QDateTime lastSeen;

    EndpointStats() : packetsSent(0), packetsReceived(0), bytesSent(0),
                     bytesReceived(0), totalPackets(0), totalBytes(0) {}
};

/**
 * @brief Time-series data point for packet rate analysis
 */
struct PacketRatePoint {
    QDateTime timestamp;
    quint64 packetCount;
    quint64 byteCount;
    double packetsPerSecond;
    double bitsPerSecond;

    PacketRatePoint() : packetCount(0), byteCount(0),
                       packetsPerSecond(0.0), bitsPerSecond(0.0) {}
};

/**
 * @brief Packet size distribution bucket
 */
struct PacketSizeBucket {
    quint64 minSize;
    quint64 maxSize;
    quint64 count;
    double percentage;

    PacketSizeBucket() : minSize(0), maxSize(0), count(0), percentage(0.0) {}
};

/**
 * @brief Overall capture statistics
 */
struct CaptureStatistics {
    // Packet counts
    quint64 totalPackets;
    quint64 totalBytes;
    quint64 displayedPackets;
    quint64 displayedBytes;
    quint64 markedPackets;
    quint64 droppedPackets;

    // Timing
    QDateTime captureStart;
    QDateTime captureEnd;
    double captureDuration;      // Seconds
    
    // Rates
    double avgPacketsPerSecond;
    double avgBitsPerSecond;
    double avgMbitsPerSecond;
    double peakPacketsPerSecond;
    double peakBitsPerSecond;

    // Packet sizes
    double avgPacketSize;
    quint64 minPacketSize;
    quint64 maxPacketSize;

    CaptureStatistics() : totalPackets(0), totalBytes(0), displayedPackets(0),
                         displayedBytes(0), markedPackets(0), droppedPackets(0),
                         captureDuration(0.0), avgPacketsPerSecond(0.0),
                         avgBitsPerSecond(0.0), avgMbitsPerSecond(0.0),
                         peakPacketsPerSecond(0.0), peakBitsPerSecond(0.0),
                         avgPacketSize(0.0), minPacketSize(0), maxPacketSize(0) {}
};

/**
 * @brief Comprehensive statistics engine for packet analysis
 */
class StatisticsEngine : public QObject {
    Q_OBJECT

public:
    explicit StatisticsEngine(QObject *parent = nullptr);
    ~StatisticsEngine();

    // Packet processing
    void addPacket(const std::shared_ptr<PacketModel> &packet);
    void clear();
    void reset();

    // Overall statistics
    CaptureStatistics getCaptureStatistics() const;
    void updateDisplayFilter(quint64 displayedPackets, quint64 displayedBytes);
    void setMarkedPackets(quint64 count);
    void setDroppedPackets(quint64 count);

    // Protocol statistics
    QList<ProtocolStats> getProtocolStatistics() const;
    ProtocolStats getProtocolStats(const QString &protocol) const;
    QHash<QString, quint64> getProtocolDistribution() const; // Protocol -> packet count
    QList<QString> getTopProtocols(int count) const;

    // Endpoint statistics
    QList<EndpointStats> getEndpointStatistics() const;
    EndpointStats getEndpointStats(const QString &address) const;
    QList<EndpointStats> getTopEndpointsByPackets(int count) const;
    QList<EndpointStats> getTopEndpointsByBytes(int count) const;

    // Time-series analysis
    QList<PacketRatePoint> getPacketRateTimeSeries(int intervalMs = 1000) const;
    QList<PacketRatePoint> getPacketRateForProtocol(const QString &protocol, int intervalMs = 1000) const;
    QPair<double, double> getPeakRate() const; // (packets/sec, bits/sec)

    // Packet size analysis
    QList<PacketSizeBucket> getPacketSizeDistribution() const;
    QList<PacketSizeBucket> getPacketSizeDistributionForProtocol(const QString &protocol) const;

    // Port analysis
    QHash<quint16, quint64> getTopSourcePorts(int count) const;
    QHash<quint16, quint64> getTopDestinationPorts(int count) const;
    QHash<quint16, quint64> getPortUsage() const; // Port -> packet count

    // Error analysis
    quint64 getErrorCount() const;
    QHash<QString, quint64> getErrorsByType() const;
    QList<std::shared_ptr<PacketModel>> getErrorPackets() const;

    // Export
    bool exportStatisticsToJson(const QString &filePath) const;
    bool exportStatisticsToCsv(const QString &filePath) const;
    QString getStatisticsSummary() const;

    // Configuration
    void setTimeSeriesInterval(int intervalMs);
    void setPacketSizeBuckets(const QList<quint64> &boundaries);
    void setMaxEndpoints(int max);

signals:
    void statisticsUpdated();
    void protocolStatsUpdated();
    void endpointStatsUpdated();
    void rateUpdated(double packetsPerSecond, double bitsPerSecond);

private:
    // Protocol tracking
    void updateProtocolStats(const std::shared_ptr<PacketModel> &packet);
    void recalculateProtocolPercentages();

    // Endpoint tracking
    void updateEndpointStats(const std::shared_ptr<PacketModel> &packet);
    void enforceEndpointLimit();

    // Time-series tracking
    void updateTimeSeries(const std::shared_ptr<PacketModel> &packet);
    void calculateRates();

    // Size distribution
    void updateSizeDistribution(const std::shared_ptr<PacketModel> &packet);
    int getSizeBucketIndex(quint64 size) const;

    // Port tracking
    void updatePortStats(const std::shared_ptr<PacketModel> &packet);

    // Error tracking
    void trackError(const std::shared_ptr<PacketModel> &packet);

    // Data members
    mutable QMutex m_mutex;

    // Overall statistics
    CaptureStatistics m_captureStats;
    QDateTime m_lastPacketTime;

    // Protocol statistics
    QHash<QString, ProtocolStats> m_protocolStats;

    // Endpoint statistics
    QHash<QString, EndpointStats> m_endpointStats;
    int m_maxEndpoints;

    // Time-series data
    QList<PacketRatePoint> m_timeSeriesData;
    int m_timeSeriesInterval;                    // Milliseconds
    QDateTime m_currentIntervalStart;
    quint64 m_currentIntervalPackets;
    quint64 m_currentIntervalBytes;

    // Packet size distribution
    QList<quint64> m_sizeBucketBoundaries;       // Bucket boundaries
    QList<PacketSizeBucket> m_sizeDistribution;

    // Port statistics
    QHash<quint16, quint64> m_srcPortStats;
    QHash<quint16, quint64> m_dstPortStats;

    // Error tracking
    quint64 m_totalErrors;
    QHash<QString, quint64> m_errorTypes;
    QList<std::shared_ptr<PacketModel>> m_errorPackets;
    int m_maxErrorPackets;

    // Peak tracking
    double m_peakPacketsPerSecond;
    double m_peakBitsPerSecond;
};

#endif // STATISTICSENGINE_H
