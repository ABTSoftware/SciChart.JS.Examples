import React, { useRef, useState, useEffect } from "react";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { connectionStatusEventHandler } from "./drawExample";
import { RespirationMetrics } from "./signalProcessor";
import { ECGMetrics } from "./ecgProcessor";
import { GSRTrend, GSRTrendAnalyzer } from "./gsrTrendAnalyzer";
import { DebugLogger, info } from "./debugLogger";
import { firebaseLogger, ProcessedSensorData } from "./firebaseLogger";
import { SessionRecorder, VitalSignsData, SessionReport } from "./sessionRecorder";

// Data point interface for rolling window calculations
interface DataPoint {
    value: number;
    timestamp: number;
}

interface EventPoint {
    timestamp: number;
    type: "heartbeat" | "breath";
}

// Rolling window calculator for rate-based metrics
class RollingWindowCalculator {
    private dataPoints: DataPoint[] = [];
    private eventPoints: EventPoint[] = []; // Track actual events
    private windowSize: number; // in milliseconds

    constructor(windowSizeMs: number = 60000) {
        // Default 60 seconds
        this.windowSize = windowSizeMs;
    }

    addDataPoint(value: number, timestamp: number): void {
        this.dataPoints.push({ value, timestamp });
        this.cleanOldData();
    }

    // Add event tracking for heartbeats and breaths
    addEvent(type: "heartbeat" | "breath", timestamp: number): void {
        this.eventPoints.push({ type, timestamp });
        this.cleanOldEvents();
    }

    private cleanOldData(): void {
        const cutoffTime = Date.now() - this.windowSize;
        this.dataPoints = this.dataPoints.filter((dp) => dp.timestamp >= cutoffTime);
    }

    private cleanOldEvents(): void {
        const cutoffTime = Date.now() - this.windowSize;
        this.eventPoints = this.eventPoints.filter((ep) => ep.timestamp >= cutoffTime);
    }

    calculateRate(): number {
        const timeSpanMinutes = this.windowSize / 60000; // Convert to minutes
        if (timeSpanMinutes <= 0) return 0; // Division by zero protection

        // Count actual events (heartbeats or breaths) instead of data points
        const eventCount = this.eventPoints.length;

        return eventCount / timeSpanMinutes;
    }

    // Calculate rate for specific event type
    calculateEventRate(eventType: "heartbeat" | "breath"): number {
        const timeSpanMinutes = this.windowSize / 60000;
        if (timeSpanMinutes <= 0) return 0;

        const eventCount = this.eventPoints.filter((ep) => ep.type === eventType).length;
        return eventCount / timeSpanMinutes;
    }

    getAverageValue(): number {
        if (this.dataPoints.length === 0) return 0;
        const sum = this.dataPoints.reduce((acc, dp) => acc + dp.value, 0);
        return sum / this.dataPoints.length;
    }

    getLatestValue(): number {
        return this.dataPoints.length > 0 ? this.dataPoints[this.dataPoints.length - 1].value : 0;
    }

    reset(): void {
        this.dataPoints = [];
        this.eventPoints = [];
    }
}

const VitalSignsMonitorDemo: React.FC = () => {
    const [infoEcg, setInfoEcg] = useState<number>(0);
    const [infoHrv, setInfoHrv] = useState<number>(0);
    const [infoGsr, setInfoGsr] = useState<number>(0);
    const [infoResp, setInfoResp] = useState<number>(0);
    const [infoBpm, setInfoBpm] = useState<number>(0);
    const [coherence, setCoherence] = useState<number>(0);
    const [wsConnected, setWsConnected] = useState<boolean>(false);
    const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
    const [respirationMetrics, setRespirationMetrics] = useState<RespirationMetrics | null>(null);
    const [inhalePercent, setInhalePercent] = useState<number>(40);
    const [breathingState, setBreathingState] = useState<string>("idle");
    const [ecgMetrics, setEcgMetrics] = useState<ECGMetrics | null>(null);
    const [gsrTrend, setGsrTrend] = useState<GSRTrend | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [sessionRecorder] = useState<SessionRecorder>(() => SessionRecorder.getInstance());
    const [sessionStatus, setSessionStatus] = useState<ReturnType<typeof sessionRecorder.getSessionStatus>>({
        isRecording: false,
        sessionId: "",
        elapsedTime: 0,
        remainingTime: 0,
        dataPoints: 0,
        currentPhase: "initial",
        phaseProgress: 0,
    });
    const [sessionReport, setSessionReport] = useState<SessionReport | null>(null);
    const debugLogger = DebugLogger.getInstance();
    const controlsRef = useRef<any>(null);
    const gsrAnalyzerRef = useRef<GSRTrendAnalyzer>(new GSRTrendAnalyzer());

    // Rolling window calculators for rate-based metrics
    const bpmCalculator = useRef<RollingWindowCalculator>(new RollingWindowCalculator(60000)); // 60 seconds for BPM
    const respCalculator = useRef<RollingWindowCalculator>(new RollingWindowCalculator(60000)); // 60 seconds for respiratory rate
    const gsrCalculator = useRef<RollingWindowCalculator>(new RollingWindowCalculator(60000)); // 60 seconds for GSR trends

    // Realistic medical value ranges based on actual patient data
    const realisticValues = {
        ecg: { min: -2.0, max: 3.0, unit: "mV" }, // Medical ECG amplitude range
        bpm: { min: 60, max: 100, unit: "BPM" }, // Normal resting heart rate
        hrv: { min: 20, max: 100, unit: "ms" }, // Normal HRV range
        gsr: { min: 1, max: 20, unit: "μS" }, // Galvanic skin response
        respiratory: { min: 12, max: 20, unit: "breaths/min" }, // Normal respiratory rate
        coherence: { min: 0, max: 100, unit: "%" }, // Heart rate coherence
        inhalePercent: { min: 35, max: 45, unit: "%" }, // Normal inhale percentage
    };

    // Calculate coherence based on HRV - higher HRV typically indicates better coherence
    const calculateCoherence = (hrv: number, bpm: number): number => {
        // Coherence is a measure of heart rate variability pattern
        // Higher HRV with regular patterns indicates better coherence
        const hrvScore = Math.min(100, (hrv / 100) * 100);
        const bpmStability = Math.max(0, 100 - Math.abs(bpm - 80) * 2); // Optimal around 80 BPM
        return Math.round((hrvScore + bpmStability) / 2);
    };

    // Generate realistic medical values
    // Fallback value generator for when ESP32 is disconnected
    const generateFallbackValue = (type: keyof typeof realisticValues): number => {
        const range = realisticValues[type];
        const baseValue = range.min + Math.random() * (range.max - range.min);

        // Generate simple fallback values when ESP32 is not connected
        switch (type) {
            case "ecg":
                return Math.round(baseValue * 10) / 10; // 1 decimal place for mV
            case "bpm":
                return Math.round(baseValue); // Whole numbers
            case "hrv":
                return Math.round(baseValue); // Whole numbers
            case "gsr":
                return Math.round(baseValue * 10) / 10; // 1 decimal place
            case "respiratory":
                return Math.round(baseValue); // Whole numbers
            case "inhalePercent":
                return Math.round(baseValue); // Whole numbers
            case "coherence":
                return Math.round(baseValue); // Whole numbers for coherence percentage
            default:
                return Math.round(baseValue);
        }
    };

    // Update values periodically to simulate real-time monitoring (only when not connected)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!wsConnected) {
                // Generate fallback values when ESP32 is disconnected
                const newEcg = generateFallbackValue("ecg");
                const newBpm = generateFallbackValue("bpm");
                const newHrv = generateFallbackValue("hrv");
                const newGsr = generateFallbackValue("gsr");
                const newResp = generateFallbackValue("respiratory");
                const newInhalePercent = generateFallbackValue("inhalePercent");
                const newCoherence = calculateCoherence(newHrv, newBpm);

                // Add data points to rolling window calculators
                const timestamp = Date.now();
                bpmCalculator.current.addDataPoint(newBpm, timestamp);
                respCalculator.current.addDataPoint(newResp, timestamp);
                gsrCalculator.current.addDataPoint(newGsr, timestamp);

                // Add data to session recorder if active
                if (isRecording && sessionRecorder.isSessionActive()) {
                    const vitalSignsData: VitalSignsData = {
                        timestamp,
                        heartRate: newBpm,
                        respiratoryRate: newResp,
                        gsrValue: newGsr,
                        ecgQuality: 0.8, // Fallback quality
                        hrvMetrics: {
                            sdnn: newHrv,
                            rmssd: newHrv * 0.8,
                            pnn50: newHrv * 0.6,
                            lfPower: newHrv * 0.5,
                            hfPower: newHrv * 0.3,
                            lfHfRatio: 1.67,
                            // Additional HRV metrics for medical analysis
                            nn50: Math.round(newHrv * 0.4),
                            triangularIndex: Math.round(newHrv * 0.3),
                            stressIndex: Math.round(newHrv * 0.7),
                            vagalTone: Math.round(newHrv * 0.6),
                        },
                        respiratoryMetrics: {
                            breathCount: Math.floor(newResp / 60), // Approximate breath count
                            inhalePercent: newInhalePercent,
                            exhalePercent: 100 - newInhalePercent,
                            breathingState: "idle",
                            averageCycleDuration: 5000, // 5 seconds default

                            // Enhanced HW484 respiration sensor metrics
                            tidalVolume: Math.round(newResp * 30), // Estimate based on respiratory rate
                            minuteVolume: Math.round(newResp * 30) / 1000, // Convert to L/min
                            inspiratoryTime: 1.2,
                            expiratoryTime: 2.8,
                            totalBreathTime: 4.0,
                            inspiratoryExpiratoryRatio: 0.43,
                            peakInspiratoryFlow: Math.round(newResp * 2),
                            peakExpiratoryFlow: Math.round(newResp * 1.5),
                            respiratoryEffort: 35,
                            breathingRegularity: 12,
                            apneaHypopneaIndex: 2,
                            respiratorySinusArrhythmia: Math.round(newHrv * 0.2),

                            // Advanced respiratory analysis
                            respiratoryPhaseCoherence: 88,
                            respiratoryRateVariability: 12,
                            breathDepthConsistency: 88,
                            respiratoryEfficiency: 77,

                            // Medical assessment scores
                            respiratoryDistressScore: 8,
                            breathingPatternQuality: 92,
                            respiratoryFatigueIndex: 15,
                        },
                        connectionStatus: {
                            esp32Connected: false,
                            sensorsConnected: { ecg: false, gsr: false, respiratory: false },
                        },
                    };
                    sessionRecorder.addDataPoint(vitalSignsData);
                }

                // Log fallback data for recording (reduced frequency)
                if (isRecording && Math.random() < 0.1) {
                    info("VITAL_SIGNS", "Fallback Data Generated", {
                        timestamp,
                        ecg: newEcg,
                        bpm: newBpm,
                        hrv: newHrv,
                        gsr: newGsr,
                        respiratory: newResp,
                        coherence: newCoherence,
                        inhalePercent: newInhalePercent,
                    });
                }

                // Use calculated rates from rolling windows
                // Generate medical-grade ECG values directly in millivolts
                setInfoEcg(newEcg);
                setInfoBpm(Math.round(bpmCalculator.current.calculateRate()));
                setInfoHrv(newHrv);
                setInfoGsr(gsrCalculator.current.getAverageValue());
                setInfoResp(Math.round(respCalculator.current.calculateRate()));
                // Update breathing pattern animation
                const animatedInhalePercent = 35 + Math.sin(Date.now() * 0.001) * 10;
                setInhalePercent(animatedInhalePercent);
                setCoherence(newCoherence);

                // Generate GSR trend data for fallback
                gsrAnalyzerRef.current.addDataPoint(newGsr, timestamp);
                const fallbackGsrTrend = gsrAnalyzerRef.current.getTrend();
                setGsrTrend(fallbackGsrTrend);

                // Set fallback respiration metrics
                setRespirationMetrics({
                    rate: Math.round(respCalculator.current.calculateRate()),
                    inhalePercent: animatedInhalePercent,
                    exhalePercent: 100 - animatedInhalePercent,
                    lastBreathTime: timestamp,
                    breathCount: 0,
                    averageCycleDuration: 60000 / Math.round(respCalculator.current.calculateRate()),

                    // Enhanced HW484 respiration sensor metrics
                    tidalVolume: 0,
                    minuteVolume: 0,
                    inspiratoryTime: 0,
                    expiratoryTime: 0,
                    totalBreathTime: 0,
                    inspiratoryExpiratoryRatio: 0,
                    peakInspiratoryFlow: 0,
                    peakExpiratoryFlow: 0,
                    respiratoryEffort: 0,
                    breathingRegularity: 0,
                    apneaHypopneaIndex: 0,
                    respiratorySinusArrhythmia: 0,

                    // Advanced respiratory analysis
                    respiratoryPhaseCoherence: 0,
                    respiratoryRateVariability: 0,
                    breathDepthConsistency: 0,
                    respiratoryEfficiency: 0,

                    // Medical assessment scores
                    respiratoryDistressScore: 0,
                    breathingPatternQuality: 0,
                    respiratoryFatigueIndex: 0,
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [wsConnected]);

    // Firebase logging effect
    useEffect(() => {
        // Only log to Firebase when ESP32 is connected (real sensor data)
        // Don't waste Firebase storage on fallback/demo data
        if (!wsConnected) {
            console.log("📊 Firebase Logging: DISABLED - ESP32 not connected (fallback data only)");
            return undefined;
        }

        console.log("📊 Firebase Logging: ENABLED - ESP32 connected, logging real sensor data every 30s");

        const firebaseLogInterval = setInterval(() => {
            // Only log when ESP32 is connected and it's time to log
            if (wsConnected && firebaseLogger.shouldLog()) {
                const processedData: ProcessedSensorData = {
                    timestamp: Date.now(),
                    heartRate: infoBpm,
                    respiratoryRate: infoResp,
                    gsrValue: infoGsr,
                    gsrTrend: gsrTrend?.direction || "stable",
                    ecgQuality: ecgMetrics?.signalQuality
                        ? ecgMetrics.signalQuality > 70
                            ? "good"
                            : ecgMetrics.signalQuality > 40
                            ? "fair"
                            : "poor"
                        : "fair",
                    hrvMetrics: {
                        sdnn: ecgMetrics?.sdnn || 0,
                        rmssd: ecgMetrics?.rmssd || 0,
                        pnn50: ecgMetrics?.pnn50 || 0,
                        lfPower: ecgMetrics?.lfPower || 0,
                        hfPower: ecgMetrics?.hfPower || 0,
                        lfHfRatio: ecgMetrics?.lfHfRatio || 0,
                        // Additional HRV metrics for medical analysis
                        nn50: ecgMetrics?.nn50 || 0,
                        triangularIndex: ecgMetrics?.triangularIndex || 0,
                        stressIndex: ecgMetrics?.stressIndex || 0,
                        vagalTone: ecgMetrics?.vagalTone || 0,
                    },
                    respiratoryMetrics: {
                        breathCount: respirationMetrics?.breathCount || 0,
                        inhalePercent: respirationMetrics?.inhalePercent || 0,
                        exhalePercent: respirationMetrics?.exhalePercent || 0,
                        breathingState: "idle" as "inhale" | "exhale" | "transition",

                        // Enhanced HW484 respiration sensor metrics
                        tidalVolume: respirationMetrics?.tidalVolume || 0,
                        minuteVolume: respirationMetrics?.minuteVolume || 0,
                        inspiratoryTime: respirationMetrics?.inspiratoryTime || 0,
                        expiratoryTime: respirationMetrics?.expiratoryTime || 0,
                        totalBreathTime: respirationMetrics?.totalBreathTime || 0,
                        inspiratoryExpiratoryRatio: respirationMetrics?.inspiratoryExpiratoryRatio || 0,
                        peakInspiratoryFlow: respirationMetrics?.peakInspiratoryFlow || 0,
                        peakExpiratoryFlow: respirationMetrics?.peakExpiratoryFlow || 0,
                        respiratoryEffort: respirationMetrics?.respiratoryEffort || 0,
                        breathingRegularity: respirationMetrics?.breathingRegularity || 0,
                        apneaHypopneaIndex: respirationMetrics?.apneaHypopneaIndex || 0,
                        respiratorySinusArrhythmia: respirationMetrics?.respiratorySinusArrhythmia || 0,

                        // Advanced respiratory analysis
                        respiratoryPhaseCoherence: respirationMetrics?.respiratoryPhaseCoherence || 0,
                        respiratoryRateVariability: respirationMetrics?.respiratoryRateVariability || 0,
                        breathDepthConsistency: respirationMetrics?.breathDepthConsistency || 0,
                        respiratoryEfficiency: respirationMetrics?.respiratoryEfficiency || 0,

                        // Medical assessment scores
                        respiratoryDistressScore: respirationMetrics?.respiratoryDistressScore || 0,
                        breathingPatternQuality: respirationMetrics?.breathingPatternQuality || 0,
                        respiratoryFatigueIndex: respirationMetrics?.respiratoryFatigueIndex || 0,
                    },
                    connectionStatus: {
                        esp32Connected: wsConnected,
                        sensorsConnected: {
                            ecg: wsConnected,
                            gsr: wsConnected,
                            respiratory: wsConnected,
                        },
                    },
                };

                // Log to Firebase only when ESP32 is connected (real sensor data)
                console.log("📊 Firebase Logging: Sending REAL sensor data to Firebase", {
                    timestamp: new Date().toISOString(),
                    esp32Connected: wsConnected,
                    dataSource: "Real Sensors",
                    heartRate: infoBpm,
                    respiratoryRate: infoResp,
                    gsrValue: infoGsr,
                });
                firebaseLogger.logProcessedData(processedData);
            }
        }, 30000); // Check every 30 seconds

        return () => {
            clearInterval(firebaseLogInterval);
        };
    }, [wsConnected, infoBpm, infoResp, infoGsr, gsrTrend, ecgMetrics, respirationMetrics]);

    // Update session status periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (isRecording && sessionRecorder.isSessionActive()) {
                setSessionStatus(sessionRecorder.getSessionStatus());
            }
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [isRecording, sessionRecorder]);

    // Periodic comprehensive logging every 30 seconds
    useEffect(() => {
        const debugLogger = DebugLogger.getInstance();
        const statusInterval = setInterval(() => {
            // Update debug logger with current system status
            debugLogger.updateStatus("WebSocket", { connected: wsConnected, timestamp: Date.now() });
            debugLogger.updateStatus("Sensors", {
                ecg: infoEcg,
                gsr: infoGsr,
                respiratory: infoResp,
                heartRate: infoBpm,
            });
            debugLogger.updateStatus("Firebase", {
                lastLogTime: firebaseLogger.getLastLogTime(),
                logCount: firebaseLogger.getLogCount(),
                connected: firebaseLogger.getConnectionStatus(),
            });
            debugLogger.updateStatus("Session", {
                recording: isRecording,
                dataPoints: sessionRecorder.getSessionStatus().dataPoints,
            });

            // Log comprehensive status
            debugLogger.logPeriodicStatus();
        }, 30000); // Every 30 seconds

        return () => clearInterval(statusInterval);
    }, [wsConnected, infoEcg, infoGsr, infoResp, infoBpm, isRecording, firebaseLogger]);

    // Cleanup on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (controlsRef.current) {
                controlsRef.current.stopUpdate();
            }
            // Clear all calculators to prevent memory leaks
            bpmCalculator.current.reset();
            respCalculator.current.reset();
            gsrCalculator.current.reset();
            gsrAnalyzerRef.current.reset();
        };
    }, []);

    const containerStyle = {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
    };

    const headerStyle = {
        padding: "15px 20px",
        backgroundColor: "#2d2d2d",
        borderBottom: "2px solid #444",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "60px",
    };

    const titleStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ffffff",
        margin: 0,
    };

    const buttonStyle = {
        padding: "12px 20px",
        backgroundColor: "#2E7D32", // Medical green
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        marginLeft: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        fontFamily: "system-ui, -apple-system, sans-serif",
    };

    const analysisButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#1976D2", // Medical blue
        border: "1px solid #1565C0",
    };

    const recordingButtonStyle = {
        ...buttonStyle,
        backgroundColor: isRecording ? "#D32F2F" : "#388E3C", // Medical red/green
        border: `1px solid ${isRecording ? "#C62828" : "#2E7D32"}`,
    };

    const mainContentStyle = {
        display: "flex",
        flex: 1,
        overflow: "hidden",
        minHeight: "calc(100vh - 90px)", // Account for header
    };

    const chartContainerStyle = {
        flex: 1,
        minHeight: "600px",
        height: "calc(100vh - 120px)", // Account for header and margins
        border: "2px solid #333", // Medical-grade border
        borderRadius: "8px",
        margin: "15px",
        backgroundColor: "#0A0A0A", // Medical-grade dark background
        overflow: "hidden", // Prevent overflow
        position: "relative" as const,
        boxShadow: "inset 0 0 20px rgba(0,255,0,0.1)", // Subtle medical green glow
    };

    const sidebarStyle = {
        width: "280px",
        backgroundColor: "#2d2d2d",
        borderLeft: "2px solid #444",
        padding: "12px",
        overflowY: "auto" as const,
    };

    const statusPanelStyle = {
        padding: "15px",
        backgroundColor: "#3d3d3d",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "2px solid #555",
    };

    const statusTitleStyle = {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#ffffff",
    };

    const statusIndicatorStyle = {
        padding: "8px 12px",
        borderRadius: "5px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center" as const,
        backgroundColor: wsConnected ? "#4caf50" : "#f44336",
        color: "#ffffff",
        marginBottom: "10px",
    };

    const sensorStatusStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
        fontSize: "11px",
    };

    const sensorIndicatorStyle = {
        padding: "2px 6px",
        borderRadius: "3px",
        fontSize: "10px",
        fontWeight: "bold",
        color: "#ffffff",
    };

    const parametersGridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginBottom: "20px",
    };

    const parameterCardStyle = {
        padding: "15px",
        backgroundColor: "#3d3d3d",
        borderRadius: "8px",
        border: "2px solid #555",
        textAlign: "center" as const,
    };

    const parameterLabelStyle = {
        fontSize: "12px",
        color: "#aaa",
        marginBottom: "8px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
    };

    const parameterValueStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: "5px",
    };

    const parameterUnitStyle = {
        fontSize: "10px",
        color: "#888",
        textTransform: "uppercase" as const,
    };

    const coherenceStyle = {
        ...parameterValueStyle,
        color: coherence > 70 ? "#4caf50" : coherence > 40 ? "#ff9800" : "#f44336",
    };

    // Breathing pattern display styles
    const breathingCardStyle = {
        ...parameterCardStyle,
        padding: "12px",
    };

    const breathingBarContainerStyle = {
        width: "100%",
        height: "12px",
        backgroundColor: "#555",
        borderRadius: "6px",
        margin: "6px 0",
        overflow: "hidden",
        position: "relative" as const,
    };

    const inhaleBarStyle = {
        width: `${wsConnected && respirationMetrics ? respirationMetrics.inhalePercent : inhalePercent}%`,
        height: "100%",
        backgroundColor: "#4CAF50",
        transition: "width 0.5s ease-in-out",
        borderRadius: "10px 0 0 10px",
    };

    const exhaleBarStyle = {
        width: `${wsConnected && respirationMetrics ? respirationMetrics.exhalePercent : 100 - inhalePercent}%`,
        height: "100%",
        backgroundColor: "#2196F3",
        transition: "width 0.5s ease-in-out",
        borderRadius: "0 10px 10px 0",
        position: "absolute" as const,
        right: 0,
        top: 0,
    };

    const breathingLabelStyle = {
        fontSize: "10px",
        color: "#aaa",
        marginTop: "5px",
    };

    const breathingStateStyle = {
        fontSize: "10px",
        color: breathingState === "inhaling" ? "#4CAF50" : breathingState === "exhaling" ? "#2196F3" : "#888",
        marginTop: "3px",
        fontWeight: "bold",
    };

    const analysisPanelStyle = {
        padding: "15px",
        backgroundColor: "#3d3d3d",
        borderRadius: "8px",
        border: "2px solid #555",
        display: showAnalysis ? "block" : "none",
    };

    const analysisTitleStyle = {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "15px",
        color: "#ffffff",
        textAlign: "center" as const,
    };

    const analysisGridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
    };

    const analysisItemStyle = {
        padding: "8px",
        backgroundColor: "#4d4d4d",
        borderRadius: "5px",
        fontSize: "12px",
    };

    const analysisLabelStyle = {
        color: "#aaa",
        marginBottom: "3px",
    };

    const analysisValueStyle = {
        color: "#ffffff",
        fontWeight: "bold",
    };

    const infoTextStyle = {
        fontSize: "11px",
        color: "#888",
        fontStyle: "italic",
        marginTop: "10px",
        lineHeight: "1.4",
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Vital Signs Monitor</h1>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        style={analysisButtonStyle}
                        onClick={() => setShowAnalysis(!showAnalysis)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1565C0";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#1976D2";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.15)";
                        }}
                    >
                        📊 {showAnalysis ? "Hide Analysis" : "Show Analysis"}
                    </button>
                    <button
                        style={recordingButtonStyle}
                        onClick={() => {
                            if (isRecording) {
                                try {
                                    const report = sessionRecorder.stopSession();
                                    setSessionReport(report);
                                    setIsRecording(false);
                                    console.log("📊 Session completed! Report generated:", report.sessionId);
                                } catch (error) {
                                    console.error("❌ Error stopping session:", error);
                                }
                            } else {
                                try {
                                    const sessionId = sessionRecorder.startSession();
                                    setIsRecording(true);
                                    setSessionReport(null);
                                    console.log("🔴 Session started:", sessionId);
                                } catch (error) {
                                    console.error("❌ Error starting session:", error);
                                }
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isRecording ? "#C62828" : "#2E7D32";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isRecording ? "#D32F2F" : "#388E3C";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.15)";
                        }}
                    >
                        {isRecording ? "⏹️ Stop Session" : "🔴 Start 20min Session"}
                    </button>

                    <button
                        style={{
                            ...recordingButtonStyle,
                            backgroundColor: "#FF9800",
                            marginTop: "10px",
                        }}
                        onClick={async () => {
                            console.log("🧪 Testing Firebase connection...");
                            try {
                                // Test with sample data
                                const testData = {
                                    timestamp: Date.now(),
                                    heartRate: 75,
                                    respiratoryRate: 16,
                                    gsrValue: 2048,
                                    gsrTrend: "stable" as const,
                                    ecgQuality: "good" as const,
                                    hrvMetrics: {
                                        sdnn: 45,
                                        rmssd: 35,
                                        pnn50: 25,
                                        lfPower: 120,
                                        hfPower: 80,
                                        lfHfRatio: 1.5,
                                        // Additional HRV metrics for medical analysis
                                        nn50: 8,
                                        triangularIndex: 15.2,
                                        stressIndex: 45.6,
                                        vagalTone: 65,
                                    },
                                    respiratoryMetrics: {
                                        breathCount: 5,
                                        inhalePercent: 50,
                                        exhalePercent: 50,
                                        breathingState: "inhale" as const,

                                        // Enhanced HW484 respiration sensor metrics
                                        tidalVolume: 500,
                                        minuteVolume: 8.0,
                                        inspiratoryTime: 1.2,
                                        expiratoryTime: 2.8,
                                        totalBreathTime: 4.0,
                                        inspiratoryExpiratoryRatio: 0.43,
                                        peakInspiratoryFlow: 25.0,
                                        peakExpiratoryFlow: 15.0,
                                        respiratoryEffort: 35,
                                        breathingRegularity: 12,
                                        apneaHypopneaIndex: 2,
                                        respiratorySinusArrhythmia: 18,

                                        // Advanced respiratory analysis
                                        respiratoryPhaseCoherence: 88,
                                        respiratoryRateVariability: 12,
                                        breathDepthConsistency: 88,
                                        respiratoryEfficiency: 77,

                                        // Medical assessment scores
                                        respiratoryDistressScore: 8,
                                        breathingPatternQuality: 92,
                                        respiratoryFatigueIndex: 15,
                                    },
                                    connectionStatus: {
                                        esp32Connected: false,
                                        sensorsConnected: {
                                            ecg: false,
                                            gsr: false,
                                            respiratory: false,
                                        },
                                    },
                                };

                                await firebaseLogger.logProcessedData(testData);
                                console.log("✅ Firebase test completed!");
                            } catch (error) {
                                console.error("❌ Firebase test failed:", error);
                            }
                        }}
                    >
                        🧪 Test Firebase
                    </button>
                </div>
            </div>

            <div style={mainContentStyle}>
                <div style={chartContainerStyle}>
                    <SciChartReact
                        initChart={drawExample}
                        onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                            const unsub = initResult.subscribeToDataUpdates((info: any) => {
                                if (!info) return undefined;

                                // Handle ESP32 data when connected
                                if (wsConnected) {
                                    const timestamp = Date.now();

                                    // Add data to session recorder if active
                                    if (isRecording && sessionRecorder.isSessionActive()) {
                                        const vitalSignsData: VitalSignsData = {
                                            timestamp,
                                            heartRate: info.bpm || 0,
                                            respiratoryRate: info.respiratory || 0,
                                            gsrValue: info.gsr || 0,
                                            ecgQuality: info.ecg ? 0.9 : 0.5, // High quality for real data
                                            hrvMetrics: {
                                                sdnn: info.hrv || 0,
                                                rmssd: (info.hrv || 0) * 0.8,
                                                pnn50: (info.hrv || 0) * 0.6,
                                                lfPower: (info.hrv || 0) * 0.5,
                                                hfPower: (info.hrv || 0) * 0.3,
                                                lfHfRatio: 1.67,
                                                // Additional HRV metrics for medical analysis
                                                nn50: Math.round((info.hrv || 0) * 0.4),
                                                triangularIndex: Math.round((info.hrv || 0) * 0.3),
                                                stressIndex: Math.round((info.hrv || 0) * 0.7),
                                                vagalTone: Math.round((info.hrv || 0) * 0.6),
                                            },
                                            respiratoryMetrics: {
                                                breathCount: respirationMetrics?.breathCount || 0,
                                                inhalePercent: respirationMetrics?.inhalePercent || 40,
                                                exhalePercent: respirationMetrics?.exhalePercent || 60,
                                                breathingState: breathingState || "idle",
                                                averageCycleDuration: respirationMetrics?.averageCycleDuration || 5000,

                                                // Enhanced HW484 respiration sensor metrics
                                                tidalVolume: respirationMetrics?.tidalVolume || 0,
                                                minuteVolume: respirationMetrics?.minuteVolume || 0,
                                                inspiratoryTime: respirationMetrics?.inspiratoryTime || 0,
                                                expiratoryTime: respirationMetrics?.expiratoryTime || 0,
                                                totalBreathTime: respirationMetrics?.totalBreathTime || 0,
                                                inspiratoryExpiratoryRatio:
                                                    respirationMetrics?.inspiratoryExpiratoryRatio || 0,
                                                peakInspiratoryFlow: respirationMetrics?.peakInspiratoryFlow || 0,
                                                peakExpiratoryFlow: respirationMetrics?.peakExpiratoryFlow || 0,
                                                respiratoryEffort: respirationMetrics?.respiratoryEffort || 0,
                                                breathingRegularity: respirationMetrics?.breathingRegularity || 0,
                                                apneaHypopneaIndex: respirationMetrics?.apneaHypopneaIndex || 0,
                                                respiratorySinusArrhythmia:
                                                    respirationMetrics?.respiratorySinusArrhythmia || 0,

                                                // Advanced respiratory analysis
                                                respiratoryPhaseCoherence:
                                                    respirationMetrics?.respiratoryPhaseCoherence || 0,
                                                respiratoryRateVariability:
                                                    respirationMetrics?.respiratoryRateVariability || 0,
                                                breathDepthConsistency: respirationMetrics?.breathDepthConsistency || 0,
                                                respiratoryEfficiency: respirationMetrics?.respiratoryEfficiency || 0,

                                                // Medical assessment scores
                                                respiratoryDistressScore:
                                                    respirationMetrics?.respiratoryDistressScore || 0,
                                                breathingPatternQuality:
                                                    respirationMetrics?.breathingPatternQuality || 0,
                                                respiratoryFatigueIndex:
                                                    respirationMetrics?.respiratoryFatigueIndex || 0,
                                            },
                                            connectionStatus: {
                                                esp32Connected: wsConnected,
                                                sensorsConnected: {
                                                    ecg: wsConnected && info.ecg !== undefined,
                                                    gsr: wsConnected && info.gsr !== undefined,
                                                    respiratory: wsConnected && info.respiratory !== undefined,
                                                },
                                            },
                                        };
                                        sessionRecorder.addDataPoint(vitalSignsData);
                                    }

                                    // Log vital signs data for recording
                                    if (isRecording) {
                                        info("VITAL_SIGNS", "ESP32 Data Received", {
                                            timestamp,
                                            ecg: info.ecg,
                                            hrv: info.hrv,
                                            gsr: info.gsr,
                                            respiratory: info.respiratory,
                                            bpm: info.bpm,
                                            sensorConnected: info.sensorConnected,
                                        });
                                    }

                                    if (typeof info.ecg === "number") {
                                        // ECG is already in millivolts from signalProcessor
                                        setInfoEcg(info.ecg);
                                    }
                                    if (typeof info.hrv === "number") setInfoHrv(info.hrv);

                                    // Use rolling window calculations for rate-based metrics
                                    if (typeof info.gsr === "number") {
                                        gsrCalculator.current.addDataPoint(info.gsr, timestamp);
                                        setInfoGsr(gsrCalculator.current.getAverageValue());
                                    }
                                    if (typeof info.respiratory === "number") {
                                        respCalculator.current.addDataPoint(info.respiratory, timestamp);
                                        setInfoResp(Math.round(respCalculator.current.calculateRate()));
                                    }
                                    if (typeof info.bpm === "number") {
                                        bpmCalculator.current.addDataPoint(info.bpm, timestamp);
                                        setInfoBpm(Math.round(info.bpm)); // Use direct BPM value
                                    }

                                    // Track actual events for accurate rate calculations
                                    if (info.type === "ibi" && info.value) {
                                        // IBI data indicates a heartbeat was detected
                                        bpmCalculator.current.addEvent("heartbeat", timestamp);
                                        // Use IBI to calculate BPM: 60000ms / IBI = BPM
                                        const calculatedBpm = info.value > 0 ? Math.round(60000 / info.value) : 0;
                                        setInfoBpm(calculatedBpm);
                                    }

                                    // Track breath events from respiration processor
                                    if (info.respirationMetrics && info.respirationMetrics.breathCount > 0) {
                                        // Add breath event when a new breath cycle is detected
                                        respCalculator.current.addEvent("breath", timestamp);
                                        setInfoResp(Math.round(respCalculator.current.calculateEventRate("breath")));
                                    }

                                    // Handle respiration metrics from signal processor
                                    if (info.respirationMetrics) {
                                        setRespirationMetrics(info.respirationMetrics);
                                        // Use event-based rate calculation if available
                                        const eventRate = respCalculator.current.calculateEventRate("breath");
                                        setInfoResp(
                                            eventRate > 0 ? Math.round(eventRate) : info.respirationMetrics.rate
                                        );
                                    } else if (typeof info.respiratory === "number") {
                                        // Update respiration metrics from rolling window
                                        const currentRate = Math.round(
                                            respCalculator.current.calculateEventRate("breath")
                                        );
                                        setRespirationMetrics({
                                            rate: currentRate,
                                            inhalePercent: 40, // Default fallback
                                            exhalePercent: 60,
                                            lastBreathTime: timestamp,
                                            breathCount: 0,
                                            averageCycleDuration: currentRate > 0 ? 60000 / currentRate : 5000,

                                            // Enhanced HW484 respiration sensor metrics
                                            tidalVolume: 0,
                                            minuteVolume: 0,
                                            inspiratoryTime: 0,
                                            expiratoryTime: 0,
                                            totalBreathTime: 0,
                                            inspiratoryExpiratoryRatio: 0,
                                            peakInspiratoryFlow: 0,
                                            peakExpiratoryFlow: 0,
                                            respiratoryEffort: 0,
                                            breathingRegularity: 0,
                                            apneaHypopneaIndex: 0,
                                            respiratorySinusArrhythmia: 0,

                                            // Advanced respiratory analysis
                                            respiratoryPhaseCoherence: 0,
                                            respiratoryRateVariability: 0,
                                            breathDepthConsistency: 0,
                                            respiratoryEfficiency: 0,

                                            // Medical assessment scores
                                            respiratoryDistressScore: 0,
                                            breathingPatternQuality: 0,
                                            respiratoryFatigueIndex: 0,
                                        });
                                    }

                                    // Handle breathing state
                                    if (info.breathingState) {
                                        setBreathingState(info.breathingState.state);
                                    }

                                    // Handle ECG metrics and signal quality
                                    if (info.ecgMetrics) {
                                        setEcgMetrics(info.ecgMetrics);
                                    }

                                    // Handle GSR trend analysis
                                    if (info.gsrTrend) {
                                        setGsrTrend(info.gsrTrend);
                                    } else if (typeof info.gsr === "number") {
                                        // Generate GSR trend from rolling window data
                                        gsrAnalyzerRef.current.addDataPoint(info.gsr, timestamp);
                                        const espGsrTrend = gsrAnalyzerRef.current.getTrend();
                                        setGsrTrend(espGsrTrend);
                                    }

                                    // Calculate coherence when we have both HRV and BPM
                                    if (typeof info.hrv === "number" && typeof info.bpm === "number") {
                                        const newCoherence = calculateCoherence(info.hrv, info.bpm);
                                        setCoherence(newCoherence);
                                    }
                                }

                                return undefined;
                            });
                            controlsRef.current = initResult.controls;
                            initResult.controls.startUpdate();

                            // Subscribe to connection status
                            const maybeUnsub = connectionStatusEventHandler.subscribe((status: any) => {
                                const connected = status === "connected";
                                setWsConnected(connected);
                                // Note: Firebase connection status tracks ESP32 connection
                                // Firebase logging is only enabled when ESP32 is connected
                                firebaseLogger.setConnectionStatus(connected);
                            });
                            const unsubStatus = typeof maybeUnsub === "function" ? maybeUnsub : (): void => {};

                            // Cleanup
                            return () => {
                                unsub();
                                unsubStatus();
                            };
                        }}
                    />
                </div>

                <div style={sidebarStyle}>
                    <div style={statusPanelStyle}>
                        <div style={statusTitleStyle}>System Status</div>
                        <div style={statusIndicatorStyle}>
                            {wsConnected ? "ESP32 Connected - Real Sensors" : "ESP32 Disconnected - Fallback Data"}
                        </div>
                        {/* Firebase Logging Status */}
                        <div
                            style={{
                                ...statusIndicatorStyle,
                                fontSize: "12px",
                                color: wsConnected ? "#4caf50" : "#ff9800",
                                marginTop: "5px",
                            }}
                        >
                            📊 Firebase Logging: {wsConnected ? "ACTIVE (Real Data)" : "DISABLED (Fallback Data)"}
                        </div>
                        {isRecording && sessionStatus.isRecording && (
                            <div
                                style={{
                                    ...statusIndicatorStyle,
                                    color: "#F44336",
                                    fontWeight: "bold",
                                    marginTop: "5px",
                                }}
                            >
                                🔴 Session Active: {sessionStatus.sessionId}
                            </div>
                        )}
                        {isRecording && sessionStatus.isRecording && (
                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#888",
                                    marginTop: "5px",
                                    textAlign: "center",
                                }}
                            >
                                Phase: {sessionStatus.currentPhase.toUpperCase()} (
                                {Math.round(sessionStatus.phaseProgress * 100)}%)
                            </div>
                        )}
                        {isRecording && sessionStatus.isRecording && (
                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#888",
                                    marginTop: "5px",
                                    textAlign: "center",
                                }}
                            >
                                Progress: {Math.round(sessionStatus.elapsedTime / 1000 / 60)}m / 20m | Data:{" "}
                                {sessionStatus.dataPoints} points
                            </div>
                        )}
                        {isRecording && sessionStatus.isRecording && (
                            <div
                                style={{
                                    width: "100%",
                                    height: "8px",
                                    backgroundColor: "#333",
                                    borderRadius: "4px",
                                    marginTop: "8px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${(sessionStatus.elapsedTime / (20 * 60 * 1000)) * 100}%`,
                                        height: "100%",
                                        backgroundColor: "#F44336",
                                        transition: "width 1s ease-in-out",
                                    }}
                                ></div>
                            </div>
                        )}
                        {isRecording && sessionStatus.isRecording && (
                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#888",
                                    marginTop: "5px",
                                    textAlign: "center",
                                }}
                            >
                                Remaining: {Math.round(sessionStatus.remainingTime / 1000 / 60)}m{" "}
                                {Math.round((sessionStatus.remainingTime % 60000) / 1000)}s
                            </div>
                        )}
                    </div>

                    <div style={parametersGridStyle}>
                        <div style={parameterCardStyle}>
                            <div style={parameterLabelStyle}>ECG Amplitude</div>
                            <div style={sensorStatusStyle}>
                                <span
                                    style={{
                                        ...sensorIndicatorStyle,
                                        backgroundColor: wsConnected ? "#4caf50" : "#ff9800",
                                    }}
                                >
                                    {wsConnected ? "REAL" : "SIM"}
                                </span>
                                <span style={{ color: "#888", fontSize: "10px" }}>
                                    {wsConnected ? "ESP32" : "Demo"}
                                </span>
                            </div>
                            <div style={parameterValueStyle}>{Math.abs(infoEcg).toFixed(1)}</div>
                            <div style={parameterUnitStyle}>mV</div>
                        </div>

                        <div style={parameterCardStyle}>
                            <div style={parameterLabelStyle}>Heart Rate</div>
                            <div style={parameterValueStyle}>{infoBpm.toFixed(0)}</div>
                            <div style={parameterUnitStyle}>BPM</div>
                        </div>

                        <div style={breathingCardStyle}>
                            <div style={parameterLabelStyle}>Breathing Pattern</div>
                            <div style={breathingBarContainerStyle}>
                                <div style={inhaleBarStyle}></div>
                                <div style={exhaleBarStyle}></div>
                            </div>
                            <div style={breathingLabelStyle}>
                                Inhale:{" "}
                                {wsConnected && respirationMetrics
                                    ? respirationMetrics.inhalePercent.toFixed(2)
                                    : inhalePercent.toFixed(2)}
                                % | Exhale:{" "}
                                {wsConnected && respirationMetrics
                                    ? respirationMetrics.exhalePercent.toFixed(2)
                                    : (100 - inhalePercent).toFixed(2)}
                                %
                            </div>
                            <div style={breathingStateStyle}>{breathingState.toUpperCase()}</div>
                        </div>

                        <div style={parameterCardStyle}>
                            <div style={parameterLabelStyle}>GSR</div>
                            <div style={sensorStatusStyle}>
                                <span
                                    style={{
                                        ...sensorIndicatorStyle,
                                        backgroundColor: wsConnected ? "#4caf50" : "#ff9800",
                                    }}
                                >
                                    {wsConnected ? "REAL" : "SIM"}
                                </span>
                                <span style={{ color: "#888", fontSize: "10px" }}>
                                    {wsConnected ? "ESP32" : "Demo"}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    minHeight: "40px",
                                }}
                            >
                                <span style={parameterValueStyle}>{infoGsr.toFixed(1)}</span>
                                {gsrTrend && (
                                    <span
                                        style={{
                                            color:
                                                gsrTrend.direction === "decreasing"
                                                    ? "#4CAF50"
                                                    : gsrTrend.direction === "increasing"
                                                    ? "#F44336"
                                                    : "#FF9800",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "24px",
                                            height: "24px",
                                            lineHeight: "1",
                                            verticalAlign: "middle",
                                        }}
                                        title={gsrTrend.recommendation}
                                    >
                                        {gsrTrend.direction === "decreasing"
                                            ? "↓"
                                            : gsrTrend.direction === "increasing"
                                            ? "↑"
                                            : "→"}
                                    </span>
                                )}
                            </div>
                            <div
                                style={{
                                    ...parameterUnitStyle,
                                    marginTop: "8px",
                                    textAlign: "center",
                                }}
                            >
                                μS
                            </div>
                        </div>

                        <div style={parameterCardStyle}>
                            <div style={parameterLabelStyle}>Respiratory Rate</div>
                            <div style={sensorStatusStyle}>
                                <span
                                    style={{
                                        ...sensorIndicatorStyle,
                                        backgroundColor: wsConnected ? "#4caf50" : "#ff9800",
                                    }}
                                >
                                    {wsConnected ? "REAL" : "SIM"}
                                </span>
                                <span style={{ color: "#888", fontSize: "10px" }}>
                                    {wsConnected ? "ESP32" : "Demo"}
                                </span>
                            </div>
                            <div style={parameterValueStyle}>{infoResp.toFixed(0)}</div>
                            <div style={parameterUnitStyle}>breaths/min</div>
                        </div>

                        <div style={parameterCardStyle}>
                            <div style={parameterLabelStyle}>Heart Rate Coherence</div>
                            <div style={coherenceStyle}>{coherence.toFixed(0)}</div>
                            <div style={parameterUnitStyle}>%</div>
                        </div>

                        {wsConnected && ecgMetrics && (
                            <div style={parameterCardStyle}>
                                <div style={parameterLabelStyle}>ECG Signal Quality</div>
                                <div
                                    style={{
                                        ...parameterValueStyle,
                                        color:
                                            ecgMetrics.signalQuality >= 80
                                                ? "#4CAF50"
                                                : ecgMetrics.signalQuality >= 60
                                                ? "#FF9800"
                                                : "#F44336",
                                    }}
                                >
                                    {ecgMetrics.signalQuality.toFixed(0)}
                                </div>
                                <div style={parameterUnitStyle}>%</div>
                            </div>
                        )}
                    </div>

                    {showAnalysis && (
                        <div>
                            <div style={analysisPanelStyle}>
                                <div style={analysisTitleStyle}>HRV Analysis</div>
                                <div style={analysisGridStyle}>
                                    <div style={analysisItemStyle}>
                                        <div style={analysisLabelStyle}>HRV Mean</div>
                                        <div style={analysisValueStyle}>
                                            {wsConnected && ecgMetrics
                                                ? ecgMetrics.meanIBI.toFixed(0)
                                                : infoHrv.toFixed(0)}{" "}
                                            ms
                                        </div>
                                    </div>
                                    <div style={analysisItemStyle}>
                                        <div style={analysisLabelStyle}>SDNN</div>
                                        <div style={analysisValueStyle}>
                                            {wsConnected && ecgMetrics
                                                ? ecgMetrics.sdnn.toFixed(0)
                                                : infoHrv.toFixed(0)}{" "}
                                            ms
                                        </div>
                                    </div>
                                    <div style={analysisItemStyle}>
                                        <div style={analysisLabelStyle}>RMSSD</div>
                                        <div style={analysisValueStyle}>
                                            {wsConnected && ecgMetrics
                                                ? ecgMetrics.rmssd.toFixed(0)
                                                : (infoHrv * 0.85).toFixed(0)}{" "}
                                            ms
                                        </div>
                                    </div>
                                    <div style={analysisItemStyle}>
                                        <div style={analysisLabelStyle}>LF Power</div>
                                        <div style={analysisValueStyle}>
                                            {wsConnected && ecgMetrics
                                                ? ecgMetrics.lfPower.toFixed(0)
                                                : (infoHrv * 45).toFixed(0)}{" "}
                                            ms²
                                        </div>
                                    </div>
                                    <div style={analysisItemStyle}>
                                        <div style={analysisLabelStyle}>HF Power</div>
                                        <div style={analysisValueStyle}>
                                            {wsConnected && ecgMetrics
                                                ? ecgMetrics.hfPower.toFixed(0)
                                                : (infoHrv * 35).toFixed(0)}{" "}
                                            ms²
                                        </div>
                                    </div>
                                    <div style={analysisItemStyle}>
                                        <div style={analysisLabelStyle}>LF/HF Ratio</div>
                                        <div style={analysisValueStyle}>
                                            {wsConnected && ecgMetrics
                                                ? ecgMetrics.lfHfRatio.toFixed(2)
                                                : (45 / 35).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {wsConnected && ecgMetrics && (
                                <div style={{ marginTop: "15px" }}>
                                    <div style={analysisTitleStyle}>ECG Quality Analysis</div>
                                    <div style={analysisGridStyle}>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Signal Quality</div>
                                            <div
                                                style={{
                                                    ...analysisValueStyle,
                                                    color:
                                                        ecgMetrics.signalQuality >= 80
                                                            ? "#4CAF50"
                                                            : ecgMetrics.signalQuality >= 60
                                                            ? "#FF9800"
                                                            : "#F44336",
                                                }}
                                            >
                                                {ecgMetrics.signalQuality.toFixed(0)}%
                                            </div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Noise Level</div>
                                            <div
                                                style={{
                                                    ...analysisValueStyle,
                                                    color:
                                                        ecgMetrics.noiseLevel < 0.05
                                                            ? "#4CAF50"
                                                            : ecgMetrics.noiseLevel < 0.1
                                                            ? "#FF9800"
                                                            : "#F44336",
                                                }}
                                            >
                                                {(ecgMetrics.noiseLevel * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Artifacts</div>
                                            <div
                                                style={{
                                                    ...analysisValueStyle,
                                                    color:
                                                        ecgMetrics.artifactCount === 0
                                                            ? "#4CAF50"
                                                            : ecgMetrics.artifactCount < 3
                                                            ? "#FF9800"
                                                            : "#F44336",
                                                }}
                                            >
                                                {ecgMetrics.artifactCount}
                                            </div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Valid Beats</div>
                                            <div style={analysisValueStyle}>{ecgMetrics.validBeats}</div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>pNN50</div>
                                            <div style={analysisValueStyle}>{ecgMetrics.pnn50.toFixed(1)}%</div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Coherence</div>
                                            <div
                                                style={{
                                                    ...analysisValueStyle,
                                                    color:
                                                        ecgMetrics.coherence >= 70
                                                            ? "#4CAF50"
                                                            : ecgMetrics.coherence >= 50
                                                            ? "#FF9800"
                                                            : "#F44336",
                                                }}
                                            >
                                                {ecgMetrics.coherence.toFixed(0)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {wsConnected && respirationMetrics && (
                                <div style={{ marginTop: "15px" }}>
                                    <div style={analysisTitleStyle}>Respiration Analysis</div>
                                    <div style={analysisGridStyle}>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Breath Count</div>
                                            <div style={analysisValueStyle}>{respirationMetrics.breathCount}</div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Avg Cycle Duration</div>
                                            <div style={analysisValueStyle}>
                                                {(respirationMetrics.averageCycleDuration / 1000).toFixed(1)}s
                                            </div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Last Breath</div>
                                            <div style={analysisValueStyle}>
                                                {respirationMetrics.lastBreathTime
                                                    ? `${Math.round(
                                                          (Date.now() - respirationMetrics.lastBreathTime) / 1000
                                                      )}s ago`
                                                    : "N/A"}
                                            </div>
                                        </div>
                                        <div style={analysisItemStyle}>
                                            <div style={analysisLabelStyle}>Signal Quality</div>
                                            <div style={analysisValueStyle}>
                                                {respirationMetrics.breathCount > 5
                                                    ? "Good"
                                                    : respirationMetrics.breathCount > 2
                                                    ? "Fair"
                                                    : "Poor"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Session Report Display */}
                {sessionReport && (
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "90vw",
                            maxWidth: "1200px",
                            maxHeight: "80vh",
                            backgroundColor: "#2d2d2d",
                            border: "2px solid #444",
                            borderRadius: "8px",
                            padding: "20px",
                            zIndex: 1000,
                            overflow: "auto",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                                borderBottom: "1px solid #444",
                                paddingBottom: "10px",
                            }}
                        >
                            <h2 style={{ margin: 0, color: "#ffffff" }}>
                                📊 Session Report: {sessionReport.sessionId}
                            </h2>
                            <button
                                onClick={() => setSessionReport(null)}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#666",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                ✕ Close
                            </button>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ color: "#4CAF50", marginBottom: "10px" }}>Session Overview</h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "15px",
                                }}
                            >
                                <div style={{ backgroundColor: "#333", padding: "15px", borderRadius: "6px" }}>
                                    <div style={{ color: "#888", fontSize: "12px" }}>Duration</div>
                                    <div style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold" }}>
                                        {(sessionReport.totalDuration / 1000 / 60).toFixed(1)} minutes
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#333", padding: "15px", borderRadius: "6px" }}>
                                    <div style={{ color: "#888", fontSize: "12px" }}>Data Points</div>
                                    <div style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold" }}>
                                        {sessionReport.totalDataPoints}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#333", padding: "15px", borderRadius: "6px" }}>
                                    <div style={{ color: "#888", fontSize: "12px" }}>Overall Quality</div>
                                    <div
                                        style={{
                                            color:
                                                sessionReport.qualityAssessment.overallQuality === "excellent"
                                                    ? "#4CAF50"
                                                    : sessionReport.qualityAssessment.overallQuality === "good"
                                                    ? "#8BC34A"
                                                    : sessionReport.qualityAssessment.overallQuality === "fair"
                                                    ? "#FF9800"
                                                    : "#F44336",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {sessionReport.qualityAssessment.overallQuality.toUpperCase()}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: "#333", padding: "15px", borderRadius: "6px" }}>
                                    <div style={{ color: "#888", fontSize: "12px" }}>Connection Reliability</div>
                                    <div style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold" }}>
                                        {sessionReport.qualityAssessment.connectionReliability.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ color: "#2196F3", marginBottom: "10px" }}>Phase Analysis</h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {(["initial", "main", "final"] as const).map((phaseName) => {
                                    const phase = sessionReport.phases[phaseName];
                                    const phaseDuration = (phase.duration / 1000 / 60).toFixed(1);

                                    return (
                                        <div
                                            key={phaseName}
                                            style={{
                                                backgroundColor: "#333",
                                                padding: "20px",
                                                borderRadius: "6px",
                                                border: "1px solid #444",
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    color:
                                                        phaseName === "initial"
                                                            ? "#FF9800"
                                                            : phaseName === "main"
                                                            ? "#4CAF50"
                                                            : "#2196F3",
                                                    marginBottom: "15px",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                {phaseName} Phase ({phaseDuration} min)
                                            </h4>

                                            <div style={{ marginBottom: "15px" }}>
                                                <div style={{ color: "#888", fontSize: "12px" }}>
                                                    Data Points: {phase.dataPoints}
                                                </div>
                                                <div style={{ color: "#888", fontSize: "12px" }}>
                                                    Connection Stability: {phase.quality.connectionStability.toFixed(1)}
                                                    %
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: "15px" }}>
                                                <h5
                                                    style={{ color: "#ffffff", marginBottom: "10px", fontSize: "14px" }}
                                                >
                                                    Vital Signs Statistics
                                                </h5>

                                                {/* Heart Rate Statistics */}
                                                <div
                                                    style={{
                                                        backgroundColor: "#444",
                                                        padding: "10px",
                                                        borderRadius: "4px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color: "#FF9800",
                                                            fontWeight: "bold",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        ❤️ Heart Rate
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, 1fr)",
                                                            gap: "8px",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ color: "#888" }}>Min</div>
                                                            <div style={{ color: "#ffffff", fontWeight: "bold" }}>
                                                                {phase.heartRate.min.toFixed(1)} BPM
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>Max</div>
                                                            <div style={{ color: "#ffffff", fontWeight: "bold" }}>
                                                                {phase.heartRate.max.toFixed(1)} BPM
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>Average</div>
                                                            <div style={{ color: "#4CAF50", fontWeight: "bold" }}>
                                                                {phase.heartRate.avg.toFixed(1)} BPM
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ color: "#888", fontSize: "10px", marginTop: "5px" }}>
                                                        StdDev: {phase.heartRate.stdDev.toFixed(2)} | Valid Readings:{" "}
                                                        {phase.heartRate.validReadings}
                                                    </div>
                                                </div>

                                                {/* Respiratory Rate Statistics */}
                                                <div
                                                    style={{
                                                        backgroundColor: "#444",
                                                        padding: "10px",
                                                        borderRadius: "4px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color: "#4CAF50",
                                                            fontWeight: "bold",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        🫁 Respiratory Rate
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, 1fr)",
                                                            gap: "8px",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ color: "#888" }}>Min</div>
                                                            <div style={{ color: "#ffffff", fontWeight: "bold" }}>
                                                                {phase.respiratoryRate.min.toFixed(1)} breaths/min
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>Max</div>
                                                            <div style={{ color: "#ffffff", fontWeight: "bold" }}>
                                                                {phase.respiratoryRate.max.toFixed(1)} breaths/min
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>Average</div>
                                                            <div style={{ color: "#4CAF50", fontWeight: "bold" }}>
                                                                {phase.respiratoryRate.avg.toFixed(1)} breaths/min
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ color: "#888", fontSize: "10px", marginTop: "5px" }}>
                                                        StdDev: {phase.respiratoryRate.stdDev.toFixed(2)} | Valid
                                                        Readings: {phase.respiratoryRate.validReadings}
                                                    </div>
                                                </div>

                                                {/* GSR Statistics */}
                                                <div
                                                    style={{
                                                        backgroundColor: "#444",
                                                        padding: "10px",
                                                        borderRadius: "4px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color: "#9C27B0",
                                                            fontWeight: "bold",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        ⚡ GSR (Galvanic Skin Response)
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, 1fr)",
                                                            gap: "8px",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ color: "#888" }}>Min</div>
                                                            <div style={{ color: "#ffffff", fontWeight: "bold" }}>
                                                                {phase.gsr.min.toFixed(3)} μS
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>Max</div>
                                                            <div style={{ color: "#ffffff", fontWeight: "bold" }}>
                                                                {phase.gsr.max.toFixed(3)} μS
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>Average</div>
                                                            <div style={{ color: "#4CAF50", fontWeight: "bold" }}>
                                                                {phase.gsr.avg.toFixed(3)} μS
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ color: "#888", fontSize: "10px", marginTop: "5px" }}>
                                                        StdDev: {phase.gsr.stdDev.toFixed(3)} | Valid Readings:{" "}
                                                        {phase.gsr.validReadings}
                                                    </div>
                                                </div>

                                                {/* HRV Statistics */}
                                                <div
                                                    style={{
                                                        backgroundColor: "#444",
                                                        padding: "10px",
                                                        borderRadius: "4px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color: "#2196F3",
                                                            fontWeight: "bold",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        💓 Heart Rate Variability (HRV)
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(2, 1fr)",
                                                            gap: "8px",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ color: "#888" }}>SDNN</div>
                                                            <div
                                                                style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(3, 1fr)",
                                                                    gap: "4px",
                                                                    fontSize: "10px",
                                                                }}
                                                            >
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Min</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.hrv.sdnn.min.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Max</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.hrv.sdnn.max.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Avg</div>
                                                                    <div style={{ color: "#4CAF50" }}>
                                                                        {phase.hrv.sdnn.avg.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>RMSSD</div>
                                                            <div
                                                                style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(3, 1fr)",
                                                                    gap: "4px",
                                                                    fontSize: "10px",
                                                                }}
                                                            >
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Min</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.hrv.rmssd.min.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Max</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.hrv.rmssd.max.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Avg</div>
                                                                    <div style={{ color: "#4CAF50" }}>
                                                                        {phase.hrv.rmssd.avg.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ color: "#888", fontSize: "10px", marginTop: "5px" }}>
                                                        pNN50: {phase.hrv.pnn50.avg.toFixed(1)}% | LF/HF Ratio:{" "}
                                                        {phase.hrv.lfHfRatio.avg.toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Respiratory Pattern Statistics */}
                                                <div
                                                    style={{
                                                        backgroundColor: "#444",
                                                        padding: "10px",
                                                        borderRadius: "4px",
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color: "#00BCD4",
                                                            fontWeight: "bold",
                                                            marginBottom: "5px",
                                                        }}
                                                    >
                                                        🌬️ Breathing Pattern
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(2, 1fr)",
                                                            gap: "8px",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ color: "#888" }}>Inhale %</div>
                                                            <div
                                                                style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(3, 1fr)",
                                                                    gap: "4px",
                                                                    fontSize: "10px",
                                                                }}
                                                            >
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Min</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.respiratoryPattern.inhalePercent.min.toFixed(
                                                                            1
                                                                        )}
                                                                        %
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Max</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.respiratoryPattern.inhalePercent.max.toFixed(
                                                                            1
                                                                        )}
                                                                        %
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Avg</div>
                                                                    <div style={{ color: "#4CAF50" }}>
                                                                        {phase.respiratoryPattern.inhalePercent.avg.toFixed(
                                                                            1
                                                                        )}
                                                                        %
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ color: "#888" }}>Exhale %</div>
                                                            <div
                                                                style={{
                                                                    display: "grid",
                                                                    gridTemplateColumns: "repeat(3, 1fr)",
                                                                    gap: "4px",
                                                                    fontSize: "10px",
                                                                }}
                                                            >
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Min</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.respiratoryPattern.exhalePercent.min.toFixed(
                                                                            1
                                                                        )}
                                                                        %
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Max</div>
                                                                    <div style={{ color: "#ffffff" }}>
                                                                        {phase.respiratoryPattern.exhalePercent.max.toFixed(
                                                                            1
                                                                        )}
                                                                        %
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{ color: "#888" }}>Avg</div>
                                                                    <div style={{ color: "#4CAF50" }}>
                                                                        {phase.respiratoryPattern.exhalePercent.avg.toFixed(
                                                                            1
                                                                        )}
                                                                        %
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ color: "#888", fontSize: "10px", marginTop: "5px" }}>
                                                        Total Breaths: {phase.respiratoryPattern.breathCount} | Avg
                                                        Cycle:{" "}
                                                        {(phase.respiratoryPattern.averageCycleDuration / 1000).toFixed(
                                                            1
                                                        )}
                                                        s
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ color: "#FF5722", marginBottom: "10px" }}>Overall Session Statistics</h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {/* Overall Heart Rate Statistics */}
                                <div
                                    style={{
                                        backgroundColor: "#333",
                                        padding: "20px",
                                        borderRadius: "6px",
                                        border: "1px solid #444",
                                    }}
                                >
                                    <h4 style={{ color: "#FF9800", marginBottom: "15px" }}>
                                        ❤️ Heart Rate (Entire Session)
                                    </h4>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, 1fr)",
                                            gap: "15px",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Minimum</div>
                                            <div style={{ color: "#F44336", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.heartRate.min.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>BPM</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Maximum</div>
                                            <div style={{ color: "#F44336", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.heartRate.max.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>BPM</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Average</div>
                                            <div style={{ color: "#4CAF50", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.heartRate.avg.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>BPM</div>
                                        </div>
                                    </div>
                                    <div style={{ color: "#888", fontSize: "12px", textAlign: "center" }}>
                                        Standard Deviation: {sessionReport.overall.heartRate.stdDev.toFixed(2)} BPM
                                    </div>
                                </div>

                                {/* Overall Respiratory Rate Statistics */}
                                <div
                                    style={{
                                        backgroundColor: "#333",
                                        padding: "20px",
                                        borderRadius: "6px",
                                        border: "1px solid #444",
                                    }}
                                >
                                    <h4 style={{ color: "#4CAF50", marginBottom: "15px" }}>
                                        🫁 Respiratory Rate (Entire Session)
                                    </h4>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, 1fr)",
                                            gap: "15px",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Minimum</div>
                                            <div style={{ color: "#F44336", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.respiratoryRate.min.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>breaths/min</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Maximum</div>
                                            <div style={{ color: "#F44336", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.respiratoryRate.max.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>breaths/min</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Average</div>
                                            <div style={{ color: "#4CAF50", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.respiratoryRate.avg.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>breaths/min</div>
                                        </div>
                                    </div>
                                    <div style={{ color: "#888", fontSize: "12px", textAlign: "center" }}>
                                        Standard Deviation: {sessionReport.overall.respiratoryRate.stdDev.toFixed(2)}{" "}
                                        breaths/min
                                    </div>
                                </div>

                                {/* Overall GSR Statistics */}
                                <div
                                    style={{
                                        backgroundColor: "#333",
                                        padding: "20px",
                                        borderRadius: "6px",
                                        border: "1px solid #444",
                                    }}
                                >
                                    <h4 style={{ color: "#9C27B0", marginBottom: "15px" }}>⚡ GSR (Entire Session)</h4>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, 1fr)",
                                            gap: "15px",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Minimum</div>
                                            <div style={{ color: "#F44336", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.gsr.min.toFixed(3)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>μS</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Maximum</div>
                                            <div style={{ color: "#F44336", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.gsr.max.toFixed(3)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>μS</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Average</div>
                                            <div style={{ color: "#4CAF50", fontSize: "18px", fontWeight: "bold" }}>
                                                {sessionReport.overall.gsr.avg.toFixed(3)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>μS</div>
                                        </div>
                                    </div>
                                    <div style={{ color: "#888", fontSize: "12px", textAlign: "center" }}>
                                        Standard Deviation: {sessionReport.overall.gsr.stdDev.toFixed(3)} μS
                                    </div>
                                </div>

                                {/* Overall HRV Statistics */}
                                <div
                                    style={{
                                        backgroundColor: "#333",
                                        padding: "20px",
                                        borderRadius: "6px",
                                        border: "1px solid #444",
                                    }}
                                >
                                    <h4 style={{ color: "#2196F3", marginBottom: "15px" }}>
                                        💓 HRV Metrics (Entire Session)
                                    </h4>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(2, 1fr)",
                                            gap: "15px",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>SDNN</div>
                                            <div style={{ color: "#4CAF50", fontSize: "16px", fontWeight: "bold" }}>
                                                {sessionReport.overall.hrv.avgSdnn.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>ms</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>RMSSD</div>
                                            <div style={{ color: "#4CAF50", fontSize: "16px", fontWeight: "bold" }}>
                                                {sessionReport.overall.hrv.avgRmssd.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>ms</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>pNN50</div>
                                            <div style={{ color: "#4CAF50", fontSize: "16px", fontWeight: "bold" }}>
                                                {sessionReport.overall.hrv.avgPnn50.toFixed(1)}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>%</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ color: "#888", fontSize: "12px" }}>Total Breaths</div>
                                            <div style={{ color: "#4CAF50", fontSize: "16px", fontWeight: "bold" }}>
                                                {sessionReport.overall.respiratoryPattern.totalBreaths}
                                            </div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>count</div>
                                        </div>
                                    </div>
                                    <div style={{ color: "#888", fontSize: "12px", textAlign: "center" }}>
                                        Breathing Pattern:{" "}
                                        {sessionReport.overall.respiratoryPattern.avgInhalePercent.toFixed(1)}% inhale,{" "}
                                        {sessionReport.overall.respiratoryPattern.avgExhalePercent.toFixed(1)}% exhale
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ color: "#9C27B0", marginBottom: "10px" }}>Export Options</h3>
                            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                                <button
                                    onClick={() => {
                                        const blob = new Blob([sessionReport.exportData.csv], { type: "text/csv" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `session-report-${sessionReport.sessionId}.csv`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    style={{
                                        padding: "12px 20px",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                    }}
                                >
                                    📊 Download CSV Report
                                </button>
                                <button
                                    onClick={() => {
                                        const blob = new Blob([sessionReport.exportData.json], {
                                            type: "application/json",
                                        });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `session-report-${sessionReport.sessionId}.json`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    style={{
                                        padding: "12px 20px",
                                        backgroundColor: "#2196F3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                    }}
                                >
                                    📄 Download JSON Report
                                </button>
                                <button
                                    onClick={() => {
                                        const blob = new Blob([sessionReport.exportData.summary], {
                                            type: "text/plain",
                                        });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `session-summary-${sessionReport.sessionId}.txt`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    style={{
                                        padding: "12px 20px",
                                        backgroundColor: "#FF9800",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                    }}
                                >
                                    📝 Download Summary Report
                                </button>
                            </div>
                        </div>

                        {sessionReport.qualityAssessment.recommendations.length > 0 && (
                            <div style={{ marginBottom: "20px" }}>
                                <h3 style={{ color: "#F44336", marginBottom: "10px" }}>Recommendations</h3>
                                <div style={{ backgroundColor: "#333", padding: "15px", borderRadius: "6px" }}>
                                    {sessionReport.qualityAssessment.recommendations.map((rec, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                color: "#ffffff",
                                                marginBottom: "8px",
                                                padding: "8px",
                                                backgroundColor: "#444",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            {index + 1}. {rec}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VitalSignsMonitorDemo;
