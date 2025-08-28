import {
    CategoryAxis,
    EllipsePointMarker,
    EventHandler,
    FastLineRenderableSeries,
    NumberRange,
    NumericAxis,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
    SciChartSurface,
    XyDataSeries,
    EAutoRange,
} from "scichart";
import { vitalSignsEcgData } from "./data/vitalSignsEcgData";
import { appTheme } from "../../../theme";
import { RespirationSignalProcessor, ESP32WebSocketHandler, RespirationMetrics } from "./signalProcessor";
import { ECGSignalProcessor, ECGMetrics } from "./ecgProcessor";
import { GSRTrendAnalyzer } from "./gsrTrendAnalyzer";
import { debug, info, warn, error, startTimer, endTimer } from "./debugLogger";

const STEP = 5; // Reduced step size for smoother waveform
const TIMER_TIMEOUT_MS = 50; // Increased timeout for better visibility
const STROKE_THICKNESS = 3; // Reduced for cleaner medical look
const POINTS_LOOP = 5200;
const GAP_POINTS = 50;
const DATA_LENGTH = vitalSignsEcgData.xValues.length;

// Professional medical ECG styling
const MEDICAL_ECG_STYLE = {
    backgroundColor: "#0a0a0a", // Dark medical background
    gridColor: "#1a1a1a", // Subtle grid
    axisColor: "#4a4a4a", // Medical gray
    ecgColor: "#00ff88", // Medical green ECG trace
    baselineColor: "#2a2a2a", // Baseline reference
    annotationColor: "#ffffff", // White text
    gridOpacity: 0.3,
    axisThickness: 1,
    majorGridThickness: 1,
    minorGridThickness: 0.5,
};

// Generate realistic medical ECG waveform with QRS complexes
function generateMedicalECG(length: number): number[] {
    const data: number[] = [];
    let phase = 0;
    let qrsPhase = 0;

    for (let i = 0; i < length; i++) {
        let value: number;

        // Create realistic ECG waveform with QRS complexes
        if (qrsPhase > 0) {
            // QRS complex - sharp spike
            if (qrsPhase === 1) {
                value = 3500; // Peak of QRS (high amplitude)
            } else if (qrsPhase === 2) {
                value = 2800; // Sharp descent
            } else if (qrsPhase === 3) {
                value = 800; // Bottom of QRS (low amplitude)
            } else {
                value = 1500; // Recovery
            }
            qrsPhase++;
            if (qrsPhase >= 8) qrsPhase = 0;
        } else {
            // Normal ECG baseline with P and T waves
            if (phase < 30) {
                // P wave - small positive deflection
                value = 1200 + Math.sin(phase * 0.2) * 400;
            } else if (phase < 60) {
                // Baseline before QRS
                value = 1000 + Math.sin(phase * 0.05) * 150;
            } else if (phase < 90) {
                // T wave - broader positive deflection
                value = 1800 + Math.sin((phase - 60) * 0.15) * 600;
            } else {
                // Baseline
                value = 800 + Math.sin(phase * 0.03) * 200;
            }

            // Randomly trigger QRS complex
            if (Math.random() < 0.02) {
                // ~2% chance per sample
                qrsPhase = 1;
            }
        }

        // Add some noise for realism
        value += (Math.random() - 0.5) * 50;

        // Generate raw ADC values for fallback - already in realistic AD8232 range
        data.push(value);

        phase++;
        if (phase >= 150) phase = 0; // Reset cycle
    }

    return data;
}

// Generate fallback demo data for GSR and respiratory if not present
function generateDemoArray(length: number, min: number, max: number) {
    return Array.from({ length }, () => min + Math.random() * (max - min));
}
let ecgHeartRateValues = vitalSignsEcgData.ecgHeartRateValues;
let gsrValues =
    vitalSignsEcgData.gsrValues && vitalSignsEcgData.gsrValues.length === DATA_LENGTH
        ? vitalSignsEcgData.gsrValues
        : generateDemoArray(DATA_LENGTH, 0.3, 0.7);
let respiratoryValues =
    vitalSignsEcgData.respiratoryValues && vitalSignsEcgData.respiratoryValues.length === DATA_LENGTH
        ? vitalSignsEcgData.respiratoryValues
        : generateDemoArray(DATA_LENGTH, 0.4, 0.8);

// Use static data arrays for consistent, realistic waveforms
if (!Array.isArray(ecgHeartRateValues) || ecgHeartRateValues.length === 0) {
    ecgHeartRateValues = generateMedicalECG(DATA_LENGTH);
    console.log("🔍 Generated ECG data range:", {
        min: Math.min(...ecgHeartRateValues),
        max: Math.min(...ecgHeartRateValues),
        length: ecgHeartRateValues.length,
    });
}
if (!Array.isArray(gsrValues) || gsrValues.length === 0) {
    gsrValues = generateDemoArray(DATA_LENGTH, 20, 80); // Realistic GSR range in μS
}
if (!Array.isArray(respiratoryValues) || respiratoryValues.length === 0) {
    respiratoryValues = generateDemoArray(DATA_LENGTH, 0.4, 0.8);
}

// HELPER FUNCTIONS - Simple approach with limited X-axis range
const getValuesFromData = (xIndex: number) => {
    const xArr: number[] = [];
    const ecgArr: number[] = [];
    const gsrArr: number[] = [];
    const respArr: number[] = [];

    for (let i = 0; i < STEP; i++) {
        // Simple X-axis: limit to 1000 points to prevent extreme zoom-out
        const x = (xIndex + i) % 1000;
        xArr.push(x);

        // Use static data arrays
        const dataIndex = (xIndex + i) % DATA_LENGTH;
        ecgArr.push(ecgHeartRateValues[dataIndex]);
        gsrArr.push(gsrValues ? gsrValues[dataIndex] : 0);
        respArr.push(respiratoryValues ? respiratoryValues[dataIndex] : 0);
    }

    return {
        xArr,
        ecgArr,
        gsrArr,
        respArr,
    };
};

export type TDataUpdateInfo = {
    type?: string; // Add type field for data routing
    ecg?: number;
    hrv?: number;
    bpm?: number; // Heart rate (BPM)
    ibi?: number; // Inter-beat interval (ms)
    gsr?: number;
    respiratory?: number;
    hrvStats?: {
        sdnn?: number;
        rmssd?: number;
    };
    hrvFreq?: {
        lf?: number;
        hf?: number;
        lfhf?: number;
    };
    respirationMetrics?: RespirationMetrics;
    breathingState?: {
        state: string;
        cycle?: any;
    };
    ecgMetrics?: ECGMetrics; // ECG signal quality and HRV metrics
    gsrTrend?: any; // GSR trend analysis
};

// Add connection status event handler
export type TConnectionStatus = "connected" | "disconnected" | "error";
export const connectionStatusEventHandler = new EventHandler<TConnectionStatus>();

// SCICHART

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    console.log("🎯 SciChart surface created:", {
        surfaceId: sciChartSurface.id,
        wasmContext: !!wasmContext,
        rootElement: rootElement,
    });

    // Initialize signal processor for respiration analysis
    // Configure to match ESP32 sampling rates:
    // - ECG: 250Hz (4ms interval)
    // - GSR: 10Hz (100ms interval)
    // - Respiratory: 100Hz (10ms interval)
    const respirationProcessor = new RespirationSignalProcessor({
        samplingRate: 100, // 100 Hz for respiratory (matches ESP32 RESP_INTERVAL)
        smoothingWindow: 5, // 5 samples for moving average
        baselineWindow: 100, // 100 samples for baseline
        thresholdMultiplier: 1.5, // 1.5x baseline for detection
        minPeakDistance: 500, // 500ms minimum between events
        minBreathDuration: 2000, // 2 seconds minimum breath cycle
        maxBreathDuration: 10000, // 10 seconds maximum breath cycle
        dataWindowSize: 10000, // 10 seconds of data
    });

    // Initialize ECG signal processor
    const ecgProcessor = new ECGSignalProcessor({
        samplingRate: 250, // 250 Hz to match ESP32
        baselineWindow: 1000, // 4 seconds at 250Hz
        noiseThreshold: 0.1,
        artifactThreshold: 0.3,
        minValidIBI: 300, // 300ms minimum (200 BPM max)
        maxValidIBI: 2000, // 2000ms maximum (30 BPM min)
        hrvWindowSize: 60000, // 60 seconds for HRV analysis
    });

    // Initialize GSR trend analyzer for 10Hz data
    const gsrTrendAnalyzer = new GSRTrendAnalyzer({
        windowSize: 10, // 10 points for 10Hz data (1 second)
        trendThreshold: 0.03,
        stressThresholds: {
            low: 0.3,
            moderate: 0.6,
            high: 0.8,
        },
        smoothingWindow: 3,
    });

    // Professional medical ECG X axis - Limited range to prevent extreme zoom-out
    const xAxis = new CategoryAxis(wasmContext, {
        autoRange: EAutoRange.Never, // Disable auto-scaling to prevent constant movement
        visibleRange: new NumberRange(0, 1000), // Limited to 1000 points to maintain reasonable zoom
        isVisible: true,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Professional medical ECG Y axis (Amplitude axis) - Fixed range optimized for fallback data
    const yAxisEcg = new NumericAxis(wasmContext, {
        id: "yEcg",
        autoRange: EAutoRange.Never, // Disable auto-scaling to prevent constant movement
        visibleRange: new NumberRange(0, 15000), // Range optimized for fallback ECG data (0-4095 * 3.5)
        isVisible: true,
    });
    sciChartSurface.yAxes.add(yAxisEcg);

    // Data series - Optimized for medical ECG display
    const dataSeriesEcg = new XyDataSeries(wasmContext, {
        fifoCapacity: 2000, // Sufficient capacity for smooth display
        fifoSweeping: true,
        fifoSweepingGap: 50,
    });
    const dataSeriesGsr = new XyDataSeries(wasmContext, {
        fifoCapacity: 2000,
        fifoSweeping: true,
        fifoSweepingGap: 50,
    });
    const dataSeriesResp = new XyDataSeries(wasmContext, {
        fifoCapacity: 2000,
        fifoSweeping: true,
        fifoSweepingGap: 50,
    });

    // Professional medical point marker
    const pointMarkerOptions = {
        width: 5,
        height: 5,
        strokeThickness: 1,
        fill: MEDICAL_ECG_STYLE.ecgColor,
        stroke: MEDICAL_ECG_STYLE.ecgColor,
        lastPointOnly: true,
    };

    // Professional medical ECG renderable series with enhanced styling
    const ecgSeries = new FastLineRenderableSeries(wasmContext, {
        yAxisId: yAxisEcg.id,
        strokeThickness: 2, // Thinner line for medical precision
        stroke: "#00FF00", // Medical green for ECG
        dataSeries: dataSeriesEcg,
        pointMarker: new EllipsePointMarker(wasmContext, {
            ...pointMarkerOptions,
            width: 3,
            height: 3,
            fill: "#00FF00",
            stroke: "#00FF00",
        }),
        isVisible: true,
    });
    sciChartSurface.renderableSeries.add(ecgSeries);

    console.log("📊 ECG series added to chart:", {
        seriesId: ecgSeries.id,
        dataSeriesId: dataSeriesEcg.id,
        renderableSeriesCount: sciChartSurface.renderableSeries.size(),
    });

    // Event handler for info panel
    const dataUpdateEventHandler = new EventHandler<TDataUpdateInfo>();

    let timerId: NodeJS.Timeout | undefined;
    let currentPoint = 0;
    let lastXValue = 0;
    const MAX_POINTS = 2000; // Sufficient points for smooth display
    const pointsPerSecond = 250; // Matches ESP32 ECG sampling rate

    // Buffer for smooth plotting - separate timestamps for each data type
    const dataBuffer = {
        ecg: [] as number[],
        gsr: [] as number[],
        resp: [] as number[],
        ecgTimestamps: [] as number[],
        gsrTimestamps: [] as number[],
        respTimestamps: [] as number[],
    };

    // Helper function to append data to chart with limited range
    const appendDataToChart = (series: XyDataSeries, values: number[], timestamps: number[]) => {
        try {
            if (values.length === 0) return;

            // Safety check: ensure arrays have the same length
            if (values.length !== timestamps.length) {
                console.error("Array length mismatch:", {
                    valuesLength: values.length,
                    timestampsLength: timestamps.length,
                    seriesId: series.id,
                });
                return;
            }

            series.appendRange(timestamps, values);
            if (series.count() > MAX_POINTS) {
                series.removeRange(0, series.count() - MAX_POINTS);
            }
        } catch (error) {
            console.error("Error appending data to chart:", error);
        }
    };

    // Fallback data update loop (when ESP32 is disconnected)
    const runUpdateDataOnTimeout = () => {
        const { xArr, ecgArr, gsrArr, respArr } = getValuesFromData(currentPoint);

        // Debug: Log fallback data generation (only every 1000 points to avoid spam)
        if (currentPoint % 1000 === 0) {
            console.log("📊 Fallback data generated:", {
                currentPoint,
                xArr: xArr.length,
                ecgArr: ecgArr.length,
                gsrArr: gsrArr.length,
                respArr: respArr.length,
                sampleEcg: ecgArr[0],
                sampleGsr: gsrArr[0],
                sampleResp: respArr[0],
                ecgRange: `${Math.min(...ecgArr)} to ${Math.max(...ecgArr)}`,
                gsrRange: `${Math.min(...gsrArr)} to ${Math.max(...gsrArr)}`,
                xRange: `${Math.min(...xArr)} to ${Math.max(...xArr)} (limited range)`,
            });
        }

        try {
            // Simple data append - let FIFO handle the rest
            dataSeriesEcg.appendRange(xArr, ecgArr);
            dataSeriesGsr.appendRange(xArr, gsrArr);
            dataSeriesResp.appendRange(xArr, respArr);

            // Debug: Check if data is actually being added to the series
            if (currentPoint % 1000 === 0) {
                console.log("📈 Chart data status:", {
                    ecgSeriesCount: dataSeriesEcg.count(),
                    gsrSeriesCount: dataSeriesGsr.count(),
                    respSeriesCount: dataSeriesResp.count(),
                    lastEcgValue: ecgArr[ecgArr.length - 1],
                    lastGsrValue: gsrArr[gsrArr.length - 1],
                });
            }

            // Ensure data is visible
            if (sciChartSurface) {
                sciChartSurface.zoomExtents();
            }
        } catch (e) {
            console.error("Error appending fallback data:", e);
        }
        currentPoint += STEP;
        // Send fallback data to UI cards more frequently (every 50 points instead of 1000)
        if (currentPoint % 50 === 0) {
            const fallbackData = {
                type: "fallback",
                ecg: ecgArr[STEP - 1],
                gsr: gsrArr[STEP - 1],
                respiratory: respArr[STEP - 1],
            };

            // Debug: Log fallback data being sent to UI
            if (currentPoint % 200 === 0) {
                // Log every 1000 points to avoid spam
                console.log("📊 Sending fallback data to UI:", fallbackData);
            }

            dataUpdateEventHandler.raiseEvent(fallbackData);
        }
        timerId = setTimeout(runUpdateDataOnTimeout, TIMER_TIMEOUT_MS);
    };

    // Enhanced WebSocket handler with signal processing
    let wsHandler: ESP32WebSocketHandler | null = null;

    // Start fallback data after a small delay to ensure chart is ready
    if (!timerId) {
        console.log("🚀 Starting fallback data generation after chart initialization...");

        // Small delay to ensure chart is fully ready
        setTimeout(() => {
            console.log("⏰ Chart ready, starting fallback data...");

            // Add initial data to start the rolling window
            const initialData = getValuesFromData(0);
            try {
                dataSeriesEcg.appendRange(initialData.xArr, initialData.ecgArr);
                dataSeriesGsr.appendRange(initialData.xArr, initialData.gsrArr);
                dataSeriesResp.appendRange(initialData.xArr, initialData.respArr);
                console.log("📊 Initial fallback data added:", {
                    ecgPoints: initialData.ecgArr.length,
                    gsrPoints: initialData.gsrArr.length,
                    respPoints: initialData.respArr.length,
                    ecgRange: `${Math.min(...initialData.ecgArr)} to ${Math.max(...initialData.ecgArr)}`,
                    xRange: `${Math.min(...initialData.xArr)} to ${Math.max(...initialData.xArr)} (limited range)`,
                });

                // Send initial fallback data to UI immediately
                const initialFallbackData = {
                    type: "fallback",
                    ecg: initialData.ecgArr[initialData.ecgArr.length - 1],
                    gsr: initialData.gsrArr[initialData.gsrArr.length - 1],
                    respiratory: initialData.respArr[initialData.respArr.length - 1],
                };
                console.log("🚀 Sending initial fallback data to UI:", initialFallbackData);
                dataUpdateEventHandler.raiseEvent(initialFallbackData);
            } catch (error) {
                console.error("Error adding initial fallback data:", error);
            }

            runUpdateDataOnTimeout();
        }, 1000); // 1 second delay
    }

    function startWebSocket() {
        startTimer("websocket_init");
        info("WEBSOCKET", "Starting ESP32 WebSocket connection with dynamic IP detection...");

        wsHandler = new ESP32WebSocketHandler(respirationProcessor, ecgProcessor, (data: any) => {
            debug("WEBSOCKET", "ESP32 data received", { type: data.type, timestamp: data.timestamp || Date.now() });

            switch (data.type) {
                case "connection":
                    if (data.status === "connected") {
                        endTimer("websocket_init", "WEBSOCKET");
                        info("WEBSOCKET", "ESP32 WebSocket connected successfully!");
                        if (timerId) {
                            clearTimeout(timerId);
                            timerId = undefined;
                        }
                        connectionStatusEventHandler.raiseEvent("connected");
                    } else if (data.status === "disconnected" || data.status === "error") {
                        warn("WEBSOCKET", `ESP32 WebSocket ${data.status}`, data);
                        if (!timerId) runUpdateDataOnTimeout();
                        connectionStatusEventHandler.raiseEvent("disconnected");
                    }
                    break;

                case "respiratory":
                    // Process respiratory data through signal processor
                    lastXValue++;

                    // Debug: Log raw respiratory data before processing
                    console.log("🔍 Respiratory Raw Data Debug:", {
                        rawValue: data.value,
                        dataType: typeof data.value,
                        timestamp: Date.now(),
                        source: "drawExample.ts",
                    });

                    dataBuffer.resp.push(data.value);
                    dataBuffer.respTimestamps.push(lastXValue);

                    // Update chart with processed data
                    if (dataBuffer.resp.length > 0) {
                        try {
                            appendDataToChart(dataSeriesResp, dataBuffer.resp, dataBuffer.respTimestamps);
                            dataBuffer.resp = [];
                            dataBuffer.respTimestamps = [];
                        } catch (error) {
                            console.error("Error processing respiratory data:", error);
                        }
                    }

                    // Emit processed respiration metrics
                    dataUpdateEventHandler.raiseEvent({
                        type: "respiratory",
                        respiratory: data.value,
                        respirationMetrics: data.metrics,
                        breathingState: data.state,
                    });
                    break;

                case "ecg":
                    startTimer("ecg_processing");
                    lastXValue++;
                    dataBuffer.ecg.push(data.value);
                    dataBuffer.ecgTimestamps.push(lastXValue);

                    if (dataBuffer.ecg.length > 0) {
                        try {
                            appendDataToChart(dataSeriesEcg, dataBuffer.ecg, dataBuffer.ecgTimestamps);
                            dataBuffer.ecg = [];
                            dataBuffer.ecgTimestamps = [];
                        } catch (error) {
                            console.error("Error processing ECG data:", error);
                        }
                    }

                    // Use ECG metrics from signal processor (includes heart rate)
                    const ecgMetrics = data.ecgMetrics || ecgProcessor.getMetrics();
                    const signalQuality = ecgProcessor.getSignalQuality();

                    endTimer("ecg_processing", "ECG");
                    debug("ECG", "ECG data processed", {
                        value: data.value,
                        quality: signalQuality.quality,
                        metrics: ecgMetrics,
                    });

                    dataUpdateEventHandler.raiseEvent({
                        type: "ecg",
                        ecg: data.value,
                        ecgMetrics: ecgMetrics,
                        bpm: ecgMetrics.validBeats > 0 ? Math.round(60000 / ecgMetrics.meanIBI) : 0,
                        hrv: ecgMetrics.sdnn,
                    });

                    // Debug: Log ECG metrics for HRV debugging
                    console.log("🫀 ECG Metrics Debug:", {
                        sdnn: ecgMetrics.sdnn,
                        validBeats: ecgMetrics.validBeats,
                        meanIBI: ecgMetrics.meanIBI,
                        calculatedBPM: ecgMetrics.validBeats > 0 ? Math.round(60000 / ecgMetrics.meanIBI) : 0,
                    });
                    break;

                case "gsr":
                    startTimer("gsr_processing");
                    lastXValue++;

                    // Debug: Log raw GSR data before processing
                    console.log("🔍 GSR Raw Data Debug:", {
                        rawValue: data.value,
                        dataType: typeof data.value,
                        timestamp: Date.now(),
                        source: "drawExample.ts",
                    });

                    dataBuffer.gsr.push(data.value);
                    dataBuffer.gsrTimestamps.push(lastXValue);

                    // Process GSR through trend analyzer
                    let gsrTrend = null;
                    let gsrStats = null;
                    try {
                        gsrTrendAnalyzer.addDataPoint(data.value, Date.now());
                        gsrTrend = gsrTrendAnalyzer.getTrend();
                        gsrStats = gsrTrendAnalyzer.getStatistics();
                    } catch (error) {
                        console.error("Error processing GSR data:", error);
                    }

                    endTimer("gsr_processing", "GSR");
                    debug("GSR", "GSR real sensor data processed", {
                        value: data.value,
                        trend: gsrTrend,
                        stats: gsrStats,
                    });

                    dataUpdateEventHandler.raiseEvent({
                        type: "gsr",
                        gsr: data.value,
                        gsrTrend: gsrTrend,
                    });
                    break;

                case "ibi":
                    startTimer("ibi_processing");
                    // Add IBI to ECG processor for HRV analysis
                    ecgProcessor.addIBI(data.value, Date.now());

                    // Get updated ECG metrics including HRV
                    const updatedEcgMetrics = ecgProcessor.getMetrics();

                    endTimer("ibi_processing", "IBI");
                    info("IBI", "IBI/HRV real sensor data processed", {
                        ibi: data.value,
                        bpm: data.hr,
                        metrics: updatedEcgMetrics,
                    });

                    dataUpdateEventHandler.raiseEvent({
                        type: "ibi",
                        hrv: data.value,
                        bpm: data.hr,
                        ecgMetrics: updatedEcgMetrics,
                    });

                    // Debug: Log IBI data for HRV debugging
                    console.log("💚 IBI Data Debug:", {
                        ibiValue: data.value,
                        heartRate: data.hr,
                        updatedSDNN: updatedEcgMetrics.sdnn,
                        updatedValidBeats: updatedEcgMetrics.validBeats,
                    });
                    break;

                case "heartrate":
                    startTimer("heartrate_processing");

                    // Process heart rate data
                    const heartRateMetrics = {
                        bpm: data.bpm,
                        ibi: data.ibi,
                    };

                    endTimer("heartrate_processing", "HEARTRATE");
                    info("HEARTRATE", "Heart rate real sensor data processed", {
                        bpm: data.bpm,
                        ibi: data.ibi,
                    });

                    dataUpdateEventHandler.raiseEvent({
                        type: "heartrate",
                        bpm: data.bpm,
                        ibi: data.ibi,
                    });
                    break;

                default:
                    console.warn("Unknown ESP32 message type:", data.type);
            }
        });

        wsHandler.connect();
    }

    const subscribeToDataUpdates = (handler: (info?: TDataUpdateInfo) => void) => {
        dataUpdateEventHandler.subscribe(handler);
        const unsubscribe = () => dataUpdateEventHandler.unsubscribe(handler);
        sciChartSurface.addDeletable({ delete: unsubscribe });
        return unsubscribe;
    };

    const stopUpdate = () => {
        clearTimeout(timerId);
        timerId = undefined;
        if (wsHandler) {
            wsHandler.disconnect();
            wsHandler = null;
        }
    };

    const startUpdate = () => {
        if (timerId) stopUpdate();
        runUpdateDataOnTimeout();
        try {
            startWebSocket();
        } catch {
            // If WebSocket fails to construct, fallback loop keeps running
        }
    };

    return { sciChartSurface, subscribeToDataUpdates, controls: { startUpdate, stopUpdate } };
};
