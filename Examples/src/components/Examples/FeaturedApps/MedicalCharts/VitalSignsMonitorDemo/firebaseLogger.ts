import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get } from "firebase/database";

// Hardcoded Firebase configuration for immediate use
const firebaseConfig = {
    apiKey: "AIzaSyAIABSENYVcnKwyggBAxZCTWxXZRYZY4AE",
    authDomain: "respiratory-biofeedback.firebaseapp.com",
    databaseURL: "https://respiratory-biofeedback-default-rtdb.firebaseio.com",
    projectId: "respiratory-biofeedback",
    storageBucket: "respiratory-biofeedback.firebasestorage.app",
    messagingSenderId: "37990753006",
    appId: "1:37990753006:web:3cb23bd151ab1c2bb089ff",
};

// Debug: Log the config being used
console.log("Firebase Config being used:", {
    apiKey: firebaseConfig.apiKey.substring(0, 10) + "...",
    authDomain: firebaseConfig.authDomain,
    databaseURL: firebaseConfig.databaseURL,
    projectId: firebaseConfig.projectId,
});

// Initialize Firebase with error handling
let app: any = null;
let database: any = null;

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("✅ Firebase initialized successfully");
    console.log("📊 Database URL:", firebaseConfig.databaseURL);
} catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    // Create dummy objects to prevent crashes
    app = null;
    database = null;
}

// Type guard for Firebase errors
interface FirebaseError {
    code: string;
    message: string;
}

function isFirebaseError(error: unknown): error is FirebaseError {
    return typeof error === "object" && error !== null && "code" in error;
}

export interface ProcessedSensorData {
    timestamp: number;
    heartRate: number;
    respiratoryRate: number;
    gsrValue: number;
    gsrTrend: "increasing" | "decreasing" | "stable";
    ecgQuality: "good" | "fair" | "poor";
    hrvMetrics: {
        // Basic HRV metrics
        sdnn: number;
        rmssd: number;
        pnn50: number;
        lfPower: number;
        hfPower: number;
        lfHfRatio: number;
        nn50: number; // Number of successive RR intervals that differ by more than 50ms
        triangularIndex: number; // Triangular index of HRV
        stressIndex: number; // Stress index based on HRV
        vagalTone: number; // Vagal tone estimation

        // Advanced HRV metrics
        meanHR: number; // Mean heart rate
        meanIBI: number; // Mean inter-beat interval
        cvIBI: number; // Coefficient of variation of IBI

        // Non-linear HRV measures
        apEn: number; // Approximate entropy
        sampEn: number; // Sample entropy
        dfa: number; // Detrended fluctuation analysis
        lyapunov: number; // Lyapunov exponent
        correlationDimension: number; // Correlation dimension
        hurstExponent: number; // Hurst exponent
        fractalDimension: number; // Fractal dimension

        // Poincaré plot measures
        sd1: number; // Standard deviation of short-term variability
        sd2: number; // Standard deviation of long-term variability
        sd1sd2Ratio: number; // SD1/SD2 ratio

        // Power spectral analysis
        vlfPower: number; // Very low frequency power
        totalPower: number; // Total power
        normalizedLF: number; // Normalized low frequency power
        normalizedHF: number; // Normalized high frequency power
        peakLF: number; // Peak low frequency
        peakHF: number; // Peak high frequency

        // Wavelet analysis
        waveletLF: number; // Wavelet low frequency power
        waveletHF: number; // Wavelet high frequency power
        waveletTotal: number; // Wavelet total power

        // Overall health assessment
        overallHRVScore: number; // Overall HRV health score (0-100)
        autonomicBalance: "parasympathetic" | "sympathetic" | "balanced" | "unknown"; // Autonomic balance
        stressLevel: "low" | "moderate" | "high" | "critical" | "unknown"; // Stress level assessment
        recoveryStatus: "excellent" | "good" | "fair" | "poor" | "needs_attention" | "unknown"; // Recovery status

        // Signal quality
        signalQuality: number; // ECG signal quality (0-100)
        noiseLevel: number; // Noise level in ECG signal
    };
    respiratoryMetrics: {
        breathCount: number;
        inhalePercent: number;
        exhalePercent: number;
        breathingState: "inhale" | "exhale" | "transition";
        // Enhanced HW484 respiration sensor metrics
        tidalVolume: number; // Estimated tidal volume in ml
        minuteVolume: number; // Minute ventilation in L/min
        inspiratoryTime: number; // Time of inspiration in seconds
        expiratoryTime: number; // Time of expiration in seconds
        totalBreathTime: number; // Total breath cycle time in seconds
        inspiratoryExpiratoryRatio: number; // I:E ratio (normal: 1:2 to 1:3)
        peakInspiratoryFlow: number; // Peak inspiratory flow rate in L/min
        peakExpiratoryFlow: number; // Peak expiratory flow rate in L/min
        respiratoryEffort: number; // Respiratory effort index (0-100)
        breathingRegularity: number; // Coefficient of variation of breath intervals
        apneaHypopneaIndex: number; // AHI score for sleep apnea detection
        respiratorySinusArrhythmia: number; // RSA magnitude (heart rate variability with breathing)
        // Advanced respiratory analysis
        respiratoryPhaseCoherence: number; // Phase coherence between heart rate and respiration
        respiratoryRateVariability: number; // Variability in respiratory rate
        breathDepthConsistency: number; // Consistency of breath depth
        respiratoryEfficiency: number; // Efficiency of breathing pattern
        // Medical assessment scores
        respiratoryDistressScore: number; // Clinical respiratory distress assessment
        breathingPatternQuality: number; // Quality score of breathing pattern (0-100)
        respiratoryFatigueIndex: number; // Index of respiratory muscle fatigue
    };
    connectionStatus: {
        esp32Connected: boolean;
        sensorsConnected: {
            ecg: boolean;
            gsr: boolean;
            respiratory: boolean;
        };
    };
}

class FirebaseLogger {
    private isConnected: boolean = false;
    private lastLogTime: number = 0;
    private readonly LOG_INTERVAL = 30000; // 30 seconds
    private logCount: number = 0;

    constructor() {
        console.log("🔧 Firebase Logger initialized");
        this.testConnection();
    }

    /**
     * Test Firebase connection by trying to read from database
     */
    private async testConnection(): Promise<void> {
        if (!database) {
            console.log("⚠️ Firebase Logger: Database not available");
            return;
        }

        try {
            console.log("🧪 Testing Firebase connection...");
            console.log("📊 Database object:", database);
            console.log("🔗 Database URL:", firebaseConfig.databaseURL);

            // Try to read from a test path to verify connection
            const testRef = ref(database, "connection_test");
            console.log("📝 Test reference created:", testRef);

            const testData = {
                timestamp: Date.now(),
                message: "Connection test from frontend",
                status: "success",
                testId: Math.random().toString(36).substr(2, 9),
            };

            console.log("📤 Attempting to write test data:", testData);
            await set(testRef, testData);

            console.log("✅ Firebase Logger: Connection test successful");
            console.log("📊 Test data written to:", testRef.toString());
            this.isConnected = true;

            // Also try to read it back
            const snapshot = await get(testRef);
            if (snapshot.exists()) {
                console.log("📖 Test data read back successfully:", snapshot.val());
            } else {
                console.log("⚠️ Test data written but could not be read back");
            }
        } catch (error) {
            console.error("❌ Firebase Logger: Connection test failed:", error);
            console.error("🔍 Error details:", {
                name: error instanceof Error ? error.name : "Unknown",
                message: error instanceof Error ? error.message : String(error),
                code: isFirebaseError(error) ? error.code : "Unknown",
                stack: error instanceof Error ? error.stack : "No stack trace",
            });
            this.isConnected = false;

            // Check if it's a security rules issue
            if (isFirebaseError(error) && error.code === "PERMISSION_DENIED") {
                console.error("🔒 Firebase Security Rules Issue: Permission denied. Check your database rules.");
                console.log("💡 Make sure your Firebase Realtime Database rules allow write access.");
            }
        }
    }

    /**
     * Set connection status
     */
    setConnectionStatus(connected: boolean): void {
        this.isConnected = connected;
        console.log(`🔌 Firebase Logger: Connection status set to ${connected}`);
    }

    /**
     * Log processed sensor data to Firebase
     * Note: This logs both real sensor data and fallback data
     */
    async logProcessedData(data: ProcessedSensorData): Promise<void> {
        if (!database) {
            console.log("⚠️ Firebase Logger: Database not available, skipping log");
            return;
        }

        // Log both real sensor data and fallback data
        const dataSource = data.connectionStatus.esp32Connected
            ? "Real Sensors (ESP32 Connected)"
            : "Fallback Data (ESP32 Disconnected)";
        console.log(`📊 Firebase Logger: Logging ${dataSource}`);

        const currentTime = Date.now();
        if (currentTime - this.lastLogTime < this.LOG_INTERVAL) {
            console.log("⏰ Firebase Logger: Skipping log - too soon since last log");
            return; // Don't log too frequently
        }

        try {
            this.logCount++;

            // Create a unique timestamp for the log entry
            const logRef = push(ref(database, "processed_sensor_logs"));

            // Add the data with the generated key
            const logData = {
                ...data,
                logTimestamp: currentTime,
                logId: logRef.key,
                logSequence: this.logCount,
                source: "frontend",
                dataSource: dataSource,
            };

            await set(logRef, logData);

            this.lastLogTime = currentTime;
            console.log(`✅ Firebase Logger: Successfully logged ${dataSource} #${this.logCount} to Firebase`);
            console.log("📊 Logged data:", {
                timestamp: new Date(currentTime).toISOString(),
                dataSource: dataSource,
                heartRate: data.heartRate,
                respiratoryRate: data.respiratoryRate,
                gsrValue: data.gsrValue,
                esp32Connected: data.connectionStatus.esp32Connected,
                // Enhanced HRV metrics logging
                hrvMetrics: {
                    sdnn: data.hrvMetrics.sdnn,
                    rmssd: data.hrvMetrics.rmssd,
                    lfPower: data.hrvMetrics.lfPower,
                    hfPower: data.hrvMetrics.hfPower,
                    lfHfRatio: data.hrvMetrics.lfHfRatio,
                    nn50: data.hrvMetrics.nn50,
                    triangularIndex: data.hrvMetrics.triangularIndex,
                    stressIndex: data.hrvMetrics.stressIndex,
                    vagalTone: data.hrvMetrics.vagalTone,
                },
                // Enhanced respiratory metrics logging
                respiratoryMetrics: {
                    tidalVolume: data.respiratoryMetrics.tidalVolume,
                    minuteVolume: data.respiratoryMetrics.minuteVolume,
                    inspiratoryTime: data.respiratoryMetrics.inspiratoryTime,
                    expiratoryTime: data.respiratoryMetrics.expiratoryTime,
                    inspiratoryExpiratoryRatio: data.respiratoryMetrics.inspiratoryExpiratoryRatio,
                    peakInspiratoryFlow: data.respiratoryMetrics.peakInspiratoryFlow,
                    peakExpiratoryFlow: data.respiratoryMetrics.peakExpiratoryFlow,
                    respiratoryEffort: data.respiratoryMetrics.respiratoryEffort,
                    breathingRegularity: data.respiratoryMetrics.breathingRegularity,
                    apneaHypopneaIndex: data.respiratoryMetrics.apneaHypopneaIndex,
                    respiratorySinusArrhythmia: data.respiratoryMetrics.respiratorySinusArrhythmia,
                    respiratoryPhaseCoherence: data.respiratoryMetrics.respiratoryPhaseCoherence,
                    respiratoryRateVariability: data.respiratoryMetrics.respiratoryRateVariability,
                    breathDepthConsistency: data.respiratoryMetrics.breathDepthConsistency,
                    respiratoryEfficiency: data.respiratoryMetrics.respiratoryEfficiency,
                    respiratoryDistressScore: data.respiratoryMetrics.respiratoryDistressScore,
                    breathingPatternQuality: data.respiratoryMetrics.breathingPatternQuality,
                    respiratoryFatigueIndex: data.respiratoryMetrics.respiratoryFatigueIndex,
                },
            });

            // Also log to a summary path for easy monitoring
            const summaryRef = ref(database, "logs_summary");
            await set(summaryRef, {
                lastLogTime: currentTime,
                totalLogs: this.logCount,
                lastLogData: logData,
                lastUpdate: new Date().toISOString(),
                dataSource: dataSource,
                status: data.connectionStatus.esp32Connected
                    ? "Active logging - ESP32 connected"
                    : "Active logging - ESP32 disconnected (fallback data)",
            });
        } catch (error) {
            console.error("❌ Firebase Logger: Failed to log data:", error);

            // Detailed error analysis
            if (isFirebaseError(error)) {
                if (error.code === "PERMISSION_DENIED") {
                    console.error("🔒 Permission denied - check Firebase security rules");
                } else if (error.code === "UNAVAILABLE") {
                    console.error("🌐 Database unavailable - check internet connection");
                } else if (error.code === "QUOTA_EXCEEDED") {
                    console.error("💾 Quota exceeded - check Firebase usage limits");
                }
            }
        }
    }

    /**
     * Log a specific event (like connection status change)
     */
    async logEvent(eventType: string, eventData: any): Promise<void> {
        if (!database) {
            return;
        }

        try {
            const eventRef = push(ref(database, "events"));
            await set(eventRef, {
                type: eventType,
                data: eventData,
                timestamp: Date.now(),
                source: "frontend",
            });
            console.log(`📝 Firebase Logger: Logged event: ${eventType}`);
        } catch (error) {
            console.error("❌ Firebase Logger: Failed to log event:", error);
        }
    }

    /**
     * Log error or warning
     */
    async logError(errorType: string, errorMessage: string, errorData?: any): Promise<void> {
        if (!database) {
            return;
        }

        try {
            const errorRef = push(ref(database, "errors"));
            await set(errorRef, {
                type: errorType,
                message: errorMessage,
                data: errorData,
                timestamp: Date.now(),
                source: "frontend",
            });
            console.error(`❌ Firebase Logger: Logged error: ${errorType} - ${errorMessage}`);
        } catch (error) {
            console.error("❌ Firebase Logger: Failed to log error:", error);
        }
    }

    /**
     * Get the last log time
     */
    getLastLogTime(): number {
        return this.lastLogTime;
    }

    /**
     * Check if it's time to log again
     */
    shouldLog(): boolean {
        return Date.now() - this.lastLogTime >= this.LOG_INTERVAL;
    }

    /**
     * Get connection status
     */
    getConnectionStatus(): boolean {
        return this.isConnected;
    }

    /**
     * Get log count
     */
    getLogCount(): number {
        return this.logCount;
    }
}

// Create and export a singleton instance
// Force recompilation to resolve TypeScript errors
export const firebaseLogger = new FirebaseLogger();
