// Comprehensive Debugging and Logging System
// Provides different log levels, file output, and performance monitoring

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    CRITICAL = 4,
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    category: string;
    message: string;
    data?: any;
    performance?: {
        duration?: number;
        memory?: number;
    };
}

export interface DebugConfig {
    logLevel: LogLevel;
    enableConsole: boolean;
    enableFileLogging: boolean;
    enablePerformanceMonitoring: boolean;
    maxLogEntries: number;
    logDirectory: string;
}

export class DebugLogger {
    private static instance: DebugLogger;
    private config: DebugConfig;
    private logBuffer: LogEntry[] = [];
    private performanceTimers: Map<string, number> = new Map();
    private isRecording: boolean = false;
    private recordingStartTime: number = 0;
    private recordingData: any[] = [];

    // Periodic status logging
    private lastStatusLogTime: number = 0;
    private readonly STATUS_LOG_INTERVAL = 30000; // 30 seconds
    private statusData: Map<string, any> = new Map();

    private constructor(config: Partial<DebugConfig> = {}) {
        this.config = {
            logLevel: LogLevel.INFO, // Changed from DEBUG to INFO to reduce noise
            enableConsole: true,
            enableFileLogging: false,
            enablePerformanceMonitoring: false, // Disabled to reduce noise
            maxLogEntries: 1000,
            logDirectory: "./logs",
            ...config,
        };
    }

    public static getInstance(config?: Partial<DebugConfig>): DebugLogger {
        if (!DebugLogger.instance) {
            DebugLogger.instance = new DebugLogger(config);
        }
        return DebugLogger.instance;
    }

    // Start performance timer
    public startTimer(label: string): void {
        if (this.config.enablePerformanceMonitoring) {
            this.performanceTimers.set(label, performance.now());
            this.debug("PERFORMANCE", `Started timer: ${label}`);
        }
    }

    // End performance timer and log duration
    public endTimer(label: string, category: string = "PERFORMANCE"): number {
        if (this.config.enablePerformanceMonitoring) {
            const startTime = this.performanceTimers.get(label);
            if (startTime) {
                const duration = performance.now() - startTime;
                this.performanceTimers.delete(label);
                this.info(category, `Timer ${label} completed in ${duration.toFixed(2)}ms`);
                return duration;
            }
        }
        return 0;
    }

    // Log methods with different levels
    public debug(category: string, message: string, data?: any): void {
        this.log(LogLevel.DEBUG, category, message, data);
    }

    public info(category: string, message: string, data?: any): void {
        this.log(LogLevel.INFO, category, message, data);
    }

    public warn(category: string, message: string, data?: any): void {
        this.log(LogLevel.WARN, category, message, data);
    }

    public error(category: string, message: string, data?: any): void {
        this.log(LogLevel.ERROR, category, message, data);
    }

    public critical(category: string, message: string, data?: any): void {
        this.log(LogLevel.CRITICAL, category, message, data);
    }

    // Main logging method
    private log(level: LogLevel, category: string, message: string, data?: any): void {
        if (level < this.config.logLevel) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data,
        };

        // Add to buffer
        this.logBuffer.push(entry);
        if (this.logBuffer.length > this.config.maxLogEntries) {
            this.logBuffer.shift();
        }

        // Console output
        if (this.config.enableConsole) {
            this.outputToConsole(entry);
        }

        // File output
        if (this.config.enableFileLogging) {
            this.outputToFile(entry);
        }

        // Add to recording if active
        if (this.isRecording) {
            this.recordingData.push(entry);
        }
    }

    // Console output with colors
    private outputToConsole(entry: LogEntry): void {
        const levelColors = {
            [LogLevel.DEBUG]: "color: #666",
            [LogLevel.INFO]: "color: #0066cc",
            [LogLevel.WARN]: "color: #ff6600",
            [LogLevel.ERROR]: "color: #cc0000",
            [LogLevel.CRITICAL]: "color: #990000; font-weight: bold",
        };

        const levelNames = ["DEBUG", "INFO", "WARN", "ERROR", "CRITICAL"];
        const color = levelColors[entry.level];
        const levelName = levelNames[entry.level];

        console.groupCollapsed(`%c[${levelName}] ${entry.category}: ${entry.message}`, color);
        console.log("Timestamp:", entry.timestamp);
        if (entry.data) {
            console.log("Data:", entry.data);
        }
        if (entry.performance) {
            console.log("Performance:", entry.performance);
        }
        console.groupEnd();
    }

    // File output (simulated for browser environment)
    private outputToFile(entry: LogEntry): void {
        // In a real implementation, you'd use Node.js fs module
        // For browser, we'll simulate by storing in localStorage
        try {
            const logs = JSON.parse(localStorage.getItem("debugLogs") || "[]");
            logs.push(entry);
            if (logs.length > this.config.maxLogEntries) {
                logs.shift();
            }
            localStorage.setItem("debugLogs", JSON.stringify(logs));
        } catch (error) {
            console.error("Failed to save log to localStorage:", error);
        }
    }

    // Start recording session
    public startRecording(): void {
        this.isRecording = true;
        this.recordingStartTime = Date.now();
        this.recordingData = [];
        this.info("RECORDING", "Started recording session");
    }

    // Update status data for periodic logging
    public updateStatus(category: string, data: any): void {
        this.statusData.set(category, data);
    }

    // Log comprehensive status every 30 seconds
    public logPeriodicStatus(): void {
        const currentTime = Date.now();
        if (currentTime - this.lastStatusLogTime < this.STATUS_LOG_INTERVAL) {
            return;
        }

        this.lastStatusLogTime = currentTime;

        // Create comprehensive status report
        const statusReport = {
            timestamp: new Date().toISOString(),
            uptime: currentTime - (this.recordingStartTime || currentTime),
            logBufferSize: this.logBuffer.length,
            recordingActive: this.isRecording,
            performanceTimers: this.performanceTimers.size,
            categories: Object.fromEntries(this.statusData),
        };

        this.info("STATUS", "Comprehensive System Status Report", statusReport);

        // Clear old status data
        this.statusData.clear();
    }

    // Stop recording and export data
    public stopRecording(): void {
        if (!this.isRecording) return;

        this.isRecording = false;
        const duration = Date.now() - this.recordingStartTime;
        this.info(
            "RECORDING",
            `Stopped recording session. Duration: ${duration}ms, Entries: ${this.recordingData.length}`
        );

        // Export recording data
        this.exportRecordingData();
    }

    // Export recording data to file
    private exportRecordingData(): void {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const csvFilename = `vital-signs-recording-${timestamp}.csv`;

        // CSV export with structured data
        const csvHeaders = [
            "Timestamp",
            "Category",
            "Level",
            "Message",
            "Heart Rate (BPM)",
            "Respiratory Rate (breaths/min)",
            "GSR Value",
            "GSR Trend",
            "ECG Quality",
            "HRV SDNN (ms)",
            "HRV RMSSD (ms)",
            "HRV pNN50 (%)",
            "HRV LF Power (ms²)",
            "HRV HF Power (ms²)",
            "HRV LF/HF Ratio",
            "Breath Count",
            "Inhale %",
            "Exhale %",
            "Breathing State",
            "ESP32 Connected",
            "ECG Sensor Connected",
            "GSR Sensor Connected",
            "Respiratory Sensor Connected",
            "Data Source",
        ];

        let csvContent = csvHeaders.join(",") + "\n";

        this.recordingData.forEach((entry) => {
            // Extract vital signs data from entry.data if available
            const vitalSigns = entry.data?.vitalSigns || entry.data || {};

            const row = [
                new Date(entry.timestamp).toISOString(),
                entry.category,
                entry.level,
                entry.message,
                vitalSigns.heartRate || "",
                vitalSigns.respiratoryRate || "",
                vitalSigns.gsrValue ? vitalSigns.gsrValue.toFixed(3) : "",
                vitalSigns.gsrTrend || "",
                vitalSigns.ecgQuality || "",
                vitalSigns.hrvMetrics?.sdnn ? vitalSigns.hrvMetrics.sdnn.toFixed(2) : "",
                vitalSigns.hrvMetrics?.rmssd ? vitalSigns.hrvMetrics.rmssd.toFixed(2) : "",
                vitalSigns.hrvMetrics?.pnn50 ? vitalSigns.hrvMetrics.pnn50.toFixed(2) : "",
                vitalSigns.hrvMetrics?.lfPower ? vitalSigns.hrvMetrics.lfPower.toFixed(2) : "",
                vitalSigns.hrvMetrics?.hfPower ? vitalSigns.hrvMetrics.hfPower.toFixed(2) : "",
                vitalSigns.hrvMetrics?.lfHfRatio ? vitalSigns.hrvMetrics.lfHfRatio.toFixed(2) : "",
                vitalSigns.respiratoryMetrics?.breathCount || "",
                vitalSigns.respiratoryMetrics?.inhalePercent
                    ? vitalSigns.respiratoryMetrics.inhalePercent.toFixed(1)
                    : "",
                vitalSigns.respiratoryMetrics?.exhalePercent
                    ? vitalSigns.respiratoryMetrics.exhalePercent.toFixed(1)
                    : "",
                vitalSigns.respiratoryMetrics?.breathingState || "",
                vitalSigns.connectionStatus?.esp32Connected || "",
                vitalSigns.connectionStatus?.sensorsConnected?.ecg || "",
                vitalSigns.connectionStatus?.sensorsConnected?.gsr || "",
                vitalSigns.connectionStatus?.sensorsConnected?.respiratory || "",
                vitalSigns.source || entry.source || "",
            ];

            // Escape commas and quotes in CSV
            const escapedRow = row.map((cell) => {
                if (
                    cell &&
                    (cell.toString().includes(",") || cell.toString().includes('"') || cell.toString().includes("\n"))
                ) {
                    return `"${cell.toString().replace(/"/g, '""')}"`;
                }
                return cell;
            });

            csvContent += escapedRow.join(",") + "\n";
        });

        // Create downloadable CSV file
        const csvBlob = new Blob([csvContent], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement("a");
        csvLink.href = csvUrl;
        csvLink.download = csvFilename;
        document.body.appendChild(csvLink);
        csvLink.click();
        document.body.removeChild(csvLink);
        URL.revokeObjectURL(csvUrl);

        this.info("RECORDING", `Exported recording to ${csvFilename}`);
    }

    // Get recent logs
    public getRecentLogs(count: number = 50): LogEntry[] {
        return this.logBuffer.slice(-count);
    }

    // Clear logs
    public clearLogs(): void {
        this.logBuffer = [];
        this.info("SYSTEM", "Logs cleared");
    }

    // Get performance statistics
    public getPerformanceStats(): any {
        const logs = this.logBuffer.filter((log) => log.performance);
        const durations = logs.map((log) => log.performance?.duration).filter((d) => d !== undefined);

        if (durations.length === 0) return {};

        return {
            averageDuration: durations.reduce((sum, d) => sum + d!, 0) / durations.length,
            minDuration: durations.length > 0 ? Math.min(...durations) : 0,
            maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
            totalOperations: durations.length,
        };
    }

    // Update configuration
    public updateConfig(newConfig: Partial<DebugConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.info("SYSTEM", "Debug configuration updated", newConfig);
    }
}

// Convenience functions for quick logging
export const debug = (category: string, message: string, data?: any) =>
    DebugLogger.getInstance().debug(category, message, data);

export const info = (category: string, message: string, data?: any) =>
    DebugLogger.getInstance().info(category, message, data);

export const warn = (category: string, message: string, data?: any) =>
    DebugLogger.getInstance().warn(category, message, data);

export const error = (category: string, message: string, data?: any) =>
    DebugLogger.getInstance().error(category, message, data);

export const critical = (category: string, message: string, data?: any) =>
    DebugLogger.getInstance().critical(category, message, data);

export const startTimer = (label: string) => DebugLogger.getInstance().startTimer(label);
export const endTimer = (label: string, category?: string) => DebugLogger.getInstance().endTimer(label, category);
