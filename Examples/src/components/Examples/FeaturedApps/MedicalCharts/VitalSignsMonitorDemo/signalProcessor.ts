// Signal Processing Module for Real-time Respiration Analysis
// Handles ESP32 WebSocket data and integrates with existing HRV calculations
import { debug, info, warn, error as logError, startTimer, endTimer } from "./debugLogger";
import { ECGSignalProcessor, ECGMetrics } from "./ecgProcessor";

export interface RespirationEvent {
    type: "inhale_start" | "inhale_peak" | "inhale_end" | "exhale_start" | "exhale_end";
    timestamp: number;
    amplitude: number;
    duration?: number;
}

export interface BreathCycle {
    startTime: number;
    endTime: number;
    inhaleStart: number;
    inhaleEnd: number;
    exhaleStart: number;
    exhaleEnd: number;
    inhaleDuration: number;
    exhaleDuration: number;
    totalDuration: number;
    inhalePercent: number;
    exhalePercent: number;
    peakAmplitude: number;
}

export interface RespirationMetrics {
    rate: number; // breaths per minute
    inhalePercent: number; // average inhale percentage
    exhalePercent: number; // average exhale percentage
    currentCycle?: BreathCycle;
    lastBreathTime: number;
    breathCount: number;
    averageCycleDuration: number;

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
}

export interface SignalProcessingConfig {
    samplingRate: number; // Hz
    smoothingWindow: number; // samples for moving average
    baselineWindow: number; // samples for baseline calculation
    thresholdMultiplier: number; // multiplier above baseline for event detection
    minPeakDistance: number; // minimum ms between breath events
    minBreathDuration: number; // minimum ms for a valid breath cycle
    maxBreathDuration: number; // maximum ms for a valid breath cycle
    dataWindowSize: number; // ms to keep in memory
}

export class RespirationSignalProcessor {
    private config: SignalProcessingConfig;
    private sensorData: Array<{ value: number; timestamp: number }> = [];
    private smoothedData: number[] = [];
    private baseline: number = 0;
    private lastEventTime: number = 0;
    private currentState: "idle" | "inhaling" | "exhaling" = "idle";
    private breathCycles: BreathCycle[] = [];
    private currentCycle?: Partial<BreathCycle>;
    private metrics: RespirationMetrics = {
        rate: 0,
        inhalePercent: 0,
        exhalePercent: 0,
        lastBreathTime: 0,
        breathCount: 0,
        averageCycleDuration: 0,

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
    };

    constructor(config: Partial<SignalProcessingConfig> = {}) {
        this.config = {
            samplingRate: 100, // 100 Hz for respiratory (matches ESP32 RESP_INTERVAL)
            smoothingWindow: 5, // 5 samples for moving average
            baselineWindow: 100, // 100 samples for baseline (1 second at 100Hz)
            thresholdMultiplier: 1.5, // 1.5x baseline for detection
            minPeakDistance: 500, // 500ms minimum between events
            minBreathDuration: 2000, // 2 seconds minimum breath cycle
            maxBreathDuration: 10000, // 10 seconds maximum breath cycle
            dataWindowSize: 10000, // 10 seconds of data
            ...config,
        };
        // Reduced logging to prevent console flooding
        // info('RESPIRATION', 'RespirationSignalProcessor initialized', this.config);
    }

    // Add new sensor data point
    public addDataPoint(value: number, timestamp: number): void {
        startTimer("respiration_add_point");
        this.sensorData.push({ value, timestamp });

        // Remove old data outside the window
        const cutoffTime = timestamp - this.config.dataWindowSize;
        this.sensorData = this.sensorData.filter((d) => d.timestamp >= cutoffTime);

        // Process the data
        this.processData();
        // Reduced logging to prevent console flooding
        // endTimer('respiration_add_point', 'RESPIRATION');
        // debug('RESPIRATION', 'Data point added', { value, timestamp, bufferSize: this.sensorData.length });
    }

    // Main signal processing pipeline
    private processData(): void {
        if (this.sensorData.length < this.config.smoothingWindow) return;

        startTimer("respiration_process_pipeline");

        // 1. Smoothing (Moving Average)
        this.applySmoothing();

        // 2. Baseline estimation
        this.updateBaseline();

        // 3. Event detection
        this.detectBreathingEvents();

        // 4. Calculate metrics
        this.updateMetrics();

        endTimer("respiration_process_pipeline", "RESPIRATION");
        debug("RESPIRATION", "Processing pipeline completed", {
            dataPoints: this.sensorData.length,
            currentState: this.currentState,
            breathCount: this.metrics.breathCount,
        });
    }

    // Apply moving average smoothing
    private applySmoothing(): void {
        this.smoothedData = [];

        for (let i = 0; i < this.sensorData.length; i++) {
            if (i < this.config.smoothingWindow - 1) {
                // For the first few points, use available data
                const availableData = this.sensorData.slice(0, i + 1);
                const sum = availableData.reduce((acc, d) => acc + d.value, 0);
                this.smoothedData.push(sum / availableData.length);
            } else {
                // Moving average with bounds checking
                const startIndex = Math.max(0, i - this.config.smoothingWindow + 1);
                const window = this.sensorData.slice(startIndex, i + 1);
                const sum = window.reduce((acc, d) => acc + d.value, 0);
                this.smoothedData.push(sum / window.length);
            }
        }
    }

    // Update dynamic baseline
    private updateBaseline(): void {
        if (this.smoothedData.length < this.config.baselineWindow) {
            // Use all available data if not enough for baseline window
            this.baseline = this.smoothedData.reduce((sum, val) => sum + val, 0) / this.smoothedData.length;
        } else {
            // Use the lowest values in the baseline window (quiet periods)
            const recentData = this.smoothedData.slice(-this.config.baselineWindow);
            const sortedData = [...recentData].sort((a, b) => a - b);
            // Use the lower quartile as baseline
            const quartileIndex = Math.floor(sortedData.length * 0.25);
            this.baseline = sortedData[quartileIndex];
        }
    }

    // Detect breathing events using state machine
    private detectBreathingEvents(): void {
        if (this.smoothedData.length < 2) return;

        const currentValue = this.smoothedData[this.smoothedData.length - 1];
        const previousValue = this.smoothedData[this.smoothedData.length - 2];
        const currentTime = this.sensorData[this.sensorData.length - 1].timestamp;
        const threshold = this.baseline + this.baseline * this.config.thresholdMultiplier;

        // State machine for breath detection
        switch (this.currentState) {
            case "idle":
                if (currentValue > threshold && previousValue <= threshold) {
                    // Signal crossed threshold upwards - potential inhale start
                    if (currentTime - this.lastEventTime > this.config.minPeakDistance) {
                        this.currentState = "inhaling";
                        this.currentCycle = {
                            startTime: currentTime,
                            inhaleStart: currentTime,
                            peakAmplitude: currentValue,
                        };
                        this.lastEventTime = currentTime;
                    }
                }
                break;

            case "inhaling":
                // Track peak amplitude during inhale
                if (currentValue > this.currentCycle!.peakAmplitude!) {
                    this.currentCycle!.peakAmplitude = currentValue;
                }

                if (currentValue <= threshold && previousValue > threshold) {
                    // Signal crossed threshold downwards - inhale end
                    this.currentCycle!.inhaleEnd = currentTime;
                    this.currentCycle!.inhaleDuration = currentTime - this.currentCycle!.inhaleStart!;
                    this.currentState = "exhaling";
                    this.currentCycle!.exhaleStart = currentTime;
                }
                break;

            case "exhaling":
                if (currentValue <= this.baseline * 0.8) {
                    // Signal dropped significantly - exhale end
                    this.currentCycle!.exhaleEnd = currentTime;
                    this.currentCycle!.exhaleDuration = currentTime - this.currentCycle!.exhaleStart!;
                    this.currentCycle!.endTime = currentTime;
                    this.currentCycle!.totalDuration = currentTime - this.currentCycle!.startTime!;

                    // Calculate percentages
                    this.currentCycle!.inhalePercent =
                        (this.currentCycle!.inhaleDuration! / this.currentCycle!.totalDuration!) * 100;
                    this.currentCycle!.exhalePercent =
                        (this.currentCycle!.exhaleDuration! / this.currentCycle!.totalDuration!) * 100;

                    // Validate breath cycle
                    if (this.isValidBreathCycle(this.currentCycle as BreathCycle)) {
                        this.breathCycles.push(this.currentCycle as BreathCycle);
                        this.metrics.breathCount++;
                        this.metrics.lastBreathTime = currentTime;
                    }

                    this.currentState = "idle";
                    this.currentCycle = undefined;
                }
                break;
        }
    }

    // Validate if a breath cycle is reasonable
    private isValidBreathCycle(cycle: BreathCycle): boolean {
        return (
            cycle.totalDuration >= this.config.minBreathDuration &&
            cycle.totalDuration <= this.config.maxBreathDuration &&
            cycle.inhalePercent >= 20 &&
            cycle.inhalePercent <= 60 &&
            cycle.exhalePercent >= 40 &&
            cycle.exhalePercent <= 80
        );
    }

    // Update respiration metrics
    private updateMetrics(): void {
        const currentTime = Date.now();

        // Remove old breath cycles (older than 60 seconds)
        const cutoffTime = currentTime - 60000;
        this.breathCycles = this.breathCycles.filter((cycle) => cycle.endTime >= cutoffTime);

        // Calculate respiration rate (breaths per minute)
        this.metrics.rate = this.breathCycles.length;

        // Calculate average inhale/exhale percentages with division by zero protection
        if (this.breathCycles.length > 0) {
            const totalInhalePercent = this.breathCycles.reduce((sum, cycle) => sum + cycle.inhalePercent, 0);
            const totalExhalePercent = this.breathCycles.reduce((sum, cycle) => sum + cycle.exhalePercent, 0);

            this.metrics.inhalePercent = totalInhalePercent / this.breathCycles.length;
            this.metrics.exhalePercent = totalExhalePercent / this.breathCycles.length;

            // Calculate average cycle duration with division by zero protection
            const totalDuration = this.breathCycles.reduce((sum, cycle) => sum + cycle.totalDuration, 0);
            this.metrics.averageCycleDuration = totalDuration / this.breathCycles.length;

            // Enhanced HW484 respiration sensor metrics
            this.calculateAdvancedRespiratoryMetrics();
        } else {
            // Reset metrics when no breath cycles
            this.metrics.inhalePercent = 0;
            this.metrics.exhalePercent = 0;
            this.metrics.averageCycleDuration = 0;
            this.resetAdvancedMetrics();
        }

        // Set current cycle for real-time display
        this.metrics.currentCycle = this.currentCycle as BreathCycle;
    }

    // Calculate advanced respiratory metrics for HW484 sensor
    private calculateAdvancedRespiratoryMetrics(): void {
        if (this.breathCycles.length === 0) return;

        const recentCycles = this.breathCycles.slice(-5); // Use last 5 cycles for stability

        // Basic timing metrics
        const avgInspiratoryTime =
            recentCycles.reduce((sum, cycle) => sum + cycle.inhaleDuration, 0) / recentCycles.length;
        const avgExpiratoryTime =
            recentCycles.reduce((sum, cycle) => sum + cycle.exhaleDuration, 0) / recentCycles.length;

        this.metrics.inspiratoryTime = avgInspiratoryTime / 1000; // Convert to seconds
        this.metrics.expiratoryTime = avgExpiratoryTime / 1000; // Convert to seconds
        this.metrics.totalBreathTime = (avgInspiratoryTime + avgExpiratoryTime) / 1000; // Convert to seconds

        // I:E ratio (normal range: 1:2 to 1:3)
        this.metrics.inspiratoryExpiratoryRatio = avgInspiratoryTime / avgExpiratoryTime;

        // Tidal volume estimation (based on amplitude and duration)
        const avgPeakAmplitude =
            recentCycles.reduce((sum, cycle) => sum + cycle.peakAmplitude, 0) / recentCycles.length;
        this.metrics.tidalVolume = Math.round(((avgPeakAmplitude * 0.5 * avgInspiratoryTime) / 1000) * 1000); // Rough estimation in ml

        // Minute volume (tidal volume * respiratory rate)
        this.metrics.minuteVolume = (this.metrics.tidalVolume / 1000) * this.metrics.rate; // L/min

        // Peak flow rates (estimated from amplitude and timing)
        this.metrics.peakInspiratoryFlow = Math.round(
            this.metrics.tidalVolume / 1000 / (this.metrics.inspiratoryTime / 60)
        ); // L/min
        this.metrics.peakExpiratoryFlow = Math.round(
            this.metrics.tidalVolume / 1000 / (this.metrics.expiratoryTime / 60)
        ); // L/min

        // Respiratory effort index (0-100, based on amplitude and rate)
        const effortScore = Math.min(100, avgPeakAmplitude / 100 + this.metrics.rate / 2);
        this.metrics.respiratoryEffort = Math.round(effortScore);

        // Breathing regularity (coefficient of variation of breath intervals)
        const intervals = recentCycles
            .map((cycle, i) => {
                if (i === 0) return 0;
                return cycle.startTime - recentCycles[i - 1].startTime;
            })
            .slice(1);

        if (intervals.length > 1) {
            const meanInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
            const variance =
                intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length;
            this.metrics.breathingRegularity = Math.round((Math.sqrt(variance) / meanInterval) * 100);
        } else {
            this.metrics.breathingRegularity = 0;
        }

        // Apnea-Hypopnea Index (AHI) estimation
        const longBreaths = recentCycles.filter((cycle) => cycle.totalDuration > 8000).length; // >8 seconds
        this.metrics.apneaHypopneaIndex = Math.round((longBreaths / recentCycles.length) * 100);

        // Respiratory Sinus Arrhythmia (RSA) - placeholder for heart rate integration
        this.metrics.respiratorySinusArrhythmia = 0; // Will be calculated when ECG data is available

        // Advanced analysis metrics
        this.metrics.respiratoryPhaseCoherence = Math.round(Math.min(100, 100 - this.metrics.breathingRegularity));
        this.metrics.respiratoryRateVariability = this.metrics.breathingRegularity;
        this.metrics.breathDepthConsistency = Math.round(100 - this.metrics.breathingRegularity / 2);
        this.metrics.respiratoryEfficiency = Math.round(
            Math.max(0, 100 - this.metrics.respiratoryEffort - this.metrics.breathingRegularity)
        );

        // Medical assessment scores
        this.metrics.respiratoryDistressScore = this.calculateRespiratoryDistressScore();
        this.metrics.breathingPatternQuality = this.calculateBreathingPatternQuality();
        this.metrics.respiratoryFatigueIndex = this.calculateRespiratoryFatigueIndex();
    }

    // Calculate respiratory distress score (0-100, higher = more distress)
    private calculateRespiratoryDistressScore(): number {
        let score = 0;

        // Rate-based scoring
        if (this.metrics.rate > 25) score += 20; // Tachypnea
        else if (this.metrics.rate < 12) score += 15; // Bradypnea

        // Effort-based scoring
        if (this.metrics.respiratoryEffort > 70) score += 25; // High effort

        // Regularity-based scoring
        if (this.metrics.breathingRegularity > 30) score += 20; // Irregular breathing

        // I:E ratio scoring
        if (this.metrics.inspiratoryExpiratoryRatio > 0.6) score += 15; // Abnormal I:E ratio

        return Math.min(100, score);
    }

    // Calculate breathing pattern quality (0-100, higher = better quality)
    private calculateBreathingPatternQuality(): number {
        let score = 100;

        // Deduct points for poor metrics
        score -= this.metrics.respiratoryDistressScore;
        score -= this.metrics.breathingRegularity / 2;
        score -= Math.abs(this.metrics.inspiratoryExpiratoryRatio - 0.4) * 50; // Penalize deviation from normal 1:2.5 ratio

        return Math.max(0, Math.round(score));
    }

    // Calculate respiratory fatigue index (0-100, higher = more fatigue)
    private calculateRespiratoryFatigueIndex(): number {
        let score = 0;

        // Effort-based fatigue
        if (this.metrics.respiratoryEffort > 60) score += 30;

        // Rate-based fatigue
        if (this.metrics.rate > 20) score += 25; // Sustained high rate

        // Irregularity-based fatigue
        if (this.metrics.breathingRegularity > 25) score += 25;

        // Depth-based fatigue
        if (this.metrics.tidalVolume < 300) score += 20; // Shallow breathing

        return Math.min(100, score);
    }

    // Reset advanced metrics
    private resetAdvancedMetrics(): void {
        this.metrics.tidalVolume = 0;
        this.metrics.minuteVolume = 0;
        this.metrics.inspiratoryTime = 0;
        this.metrics.expiratoryTime = 0;
        this.metrics.totalBreathTime = 0;
        this.metrics.inspiratoryExpiratoryRatio = 0;
        this.metrics.peakInspiratoryFlow = 0;
        this.metrics.peakExpiratoryFlow = 0;
        this.metrics.respiratoryEffort = 0;
        this.metrics.breathingRegularity = 0;
        this.metrics.apneaHypopneaIndex = 0;
        this.metrics.respiratorySinusArrhythmia = 0;
        this.metrics.respiratoryPhaseCoherence = 0;
        this.metrics.respiratoryRateVariability = 0;
        this.metrics.breathDepthConsistency = 0;
        this.metrics.respiratoryEfficiency = 0;
        this.metrics.respiratoryDistressScore = 0;
        this.metrics.breathingPatternQuality = 0;
        this.metrics.respiratoryFatigueIndex = 0;
    }

    // Get current metrics
    public getMetrics(): RespirationMetrics {
        return { ...this.metrics };
    }

    // Get current breathing state
    public getCurrentState(): { state: string; cycle?: Partial<BreathCycle> } {
        return {
            state: this.currentState,
            cycle: this.currentCycle,
        };
    }

    // Get recent breath cycles
    public getRecentCycles(count: number = 10): BreathCycle[] {
        return this.breathCycles.slice(-count);
    }

    // Reset processor state
    public reset(): void {
        this.sensorData = [];
        this.smoothedData = [];
        this.baseline = 0;
        this.lastEventTime = 0;
        this.currentState = "idle";
        this.breathCycles = [];
        this.currentCycle = undefined;
        this.metrics = {
            rate: 0,
            inhalePercent: 0,
            exhalePercent: 0,
            lastBreathTime: 0,
            breathCount: 0,
            averageCycleDuration: 0,

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
        };
    }

    // Update configuration
    public updateConfig(newConfig: Partial<SignalProcessingConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

// WebSocket handler for ESP32 data with dynamic IP detection
export class ESP32WebSocketHandler {
    private ws: WebSocket | null = null;
    private respProcessor: RespirationSignalProcessor;
    private ecgProcessor: ECGSignalProcessor;
    private onDataUpdate: (data: any) => void;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 20; // Increased for more persistent connection attempts
    private reconnectDelay = 2000;
    private wsUrl: string;
    private ipDiscoveryAttempts = 0;
    private maxIpDiscoveryAttempts = 10;
    private reconnectTimer: NodeJS.Timeout | null = null;

    constructor(
        respProcessor: RespirationSignalProcessor,
        ecgProcessor: ECGSignalProcessor,
        onDataUpdate: (data: any) => void,
        wsUrl?: string
    ) {
        this.respProcessor = respProcessor;
        this.ecgProcessor = ecgProcessor;
        this.onDataUpdate = onDataUpdate;
        this.wsUrl = wsUrl || this.detectESP32IP();
        info("WEBSOCKET", "ESP32WebSocketHandler initialized", { wsUrl: this.wsUrl });
    }

    // Hardcoded ESP32 IP address
    private detectESP32IP(): string {
        // Hardcoded to your specific ESP32 IP
        return "ws://192.168.1.12:81";
    }

    // Try different IP addresses if connection fails
    private tryNextIP(): void {
        // Only try the hardcoded IP
        const hardcodedIP = "192.168.1.12:81";

        if (this.ipDiscoveryAttempts < this.maxIpDiscoveryAttempts) {
            this.ipDiscoveryAttempts++;
            this.wsUrl = `ws://${hardcodedIP}`;
            console.log(`🔌 Trying ESP32 IP: ${hardcodedIP} (attempt ${this.ipDiscoveryAttempts})`);
            this.connect();
        } else {
            console.error("❌ Failed to connect to ESP32 at", hardcodedIP);
            this.onDataUpdate({ type: "connection", status: "failed" });
        }
    }

    public connect(): void {
        try {
            // Force close any existing connection
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }

            startTimer("websocket_connect");
            info("WEBSOCKET", "Connecting to ESP32 WebSocket", { url: this.wsUrl });

            // Create new WebSocket connection
            this.ws = new WebSocket(this.wsUrl);

            // Set connection timeout
            const connectionTimeout = setTimeout(() => {
                if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
                    console.error("⏰ WebSocket connection timeout");
                    this.ws.close();
                    this.onDataUpdate({ type: "connection", status: "timeout" });
                    this.attemptReconnect();
                }
            }, 10000); // 10 second timeout

            this.ws.onopen = () => {
                clearTimeout(connectionTimeout);
                endTimer("websocket_connect", "WEBSOCKET");
                info("WEBSOCKET", "ESP32 WebSocket connected successfully!");
                console.log("✅ WebSocket connection established!");
                this.reconnectAttempts = 0;
                this.ipDiscoveryAttempts = 0; // Reset IP discovery on successful connection
                this.onDataUpdate({ type: "connection", status: "connected" });
            };

            this.ws.onmessage = (event) => {
                // Log all messages for debugging

                this.handleMessage(event);
            };

            this.ws.onerror = (error) => {
                clearTimeout(connectionTimeout);
                logError("WEBSOCKET", "ESP32 WebSocket error", error);
                console.error("❌ WebSocket error:", error);
                this.onDataUpdate({ type: "connection", status: "error" });
                // Don't call attemptReconnect here, let onclose handle it
            };

            this.ws.onclose = (event) => {
                clearTimeout(connectionTimeout);
                warn("WEBSOCKET", "ESP32 WebSocket closed");
                console.log("🔌 WebSocket closed. Code:", event.code, "Reason:", event.reason);
                this.onDataUpdate({ type: "connection", status: "disconnected" });

                // Always attempt reconnect unless we've exceeded max attempts
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.attemptReconnect();
                } else {
                    console.error("❌ Max reconnection attempts reached");
                    this.onDataUpdate({ type: "connection", status: "failed" });
                }
            };
        } catch (error) {
            console.error("Failed to create WebSocket connection:", error);
            this.onDataUpdate({ type: "connection", status: "error" });
            this.attemptReconnect();
        }
    }

    private handleMessage(event: MessageEvent): void {
        try {
            startTimer("message_processing");

            // Validate message data
            if (!event.data || typeof event.data !== "string") {
                logError("WEBSOCKET", "Invalid message data received", { data: event.data });
                return;
            }

            const data = JSON.parse(event.data);
            // Convert ESP32 timestamp (millis) to JavaScript timestamp
            const esp32Timestamp = data.timestamp || 0;
            // ESP32 millis() is relative to boot time, convert to absolute JavaScript timestamp
            // Since we can't know the exact boot time, use current time as reference
            const jsTimestamp = Date.now();

            debug("WEBSOCKET", "Message received", { type: data.type, esp32Timestamp, jsTimestamp });

            // Handle individual sensor data messages from ESP32
            switch (data.type) {
                case "respiratory":
                    // ESP32 is now sending calculated respiratory rate in breaths/min
                    // Use the ESP32-calculated rate directly (more accurate for HW-484 sensor)

                    // Add to respiratory processor for trend analysis
                    this.respProcessor.addDataPoint(data.respiratory, jsTimestamp);
                    const metrics = this.respProcessor.getMetrics();
                    const state = this.respProcessor.getCurrentState();

                    this.onDataUpdate({
                        type: "respiratory",
                        respiratory: data.respiratory, // Use ESP32-calculated rate directly
                        value: data.respiratory, // Keep for backward compatibility
                        raw: data.respiratory,
                        metrics: metrics,
                        state: state,
                        sensorConnected: data.sensorConnected || false,
                        timestamp: jsTimestamp,
                    });
                    break;

                case "ecg":
                    // ESP32 is sending raw ADC values in the 'ecg' field
                    // Keep raw values for plotting, convert only for processing
                    const ecgInMillivolts = ((data.ecg - 2048) / 2048) * 2.5; // Convert to ±2.5mV range

                    // Add to ECG processor for heartbeat detection (use converted value)
                    this.ecgProcessor.addECGPoint(ecgInMillivolts, jsTimestamp);

                    // Get ECG metrics including heart rate
                    const ecgMetrics = this.ecgProcessor.getMetrics();

                    this.onDataUpdate({
                        type: "ecg",
                        ecg: data.ecg, // Send raw ADC value for plotting (800-3500)
                        value: data.ecg, // Keep raw value for display consistency
                        raw: data.ecg,
                        sensorConnected: data.sensorConnected || false,
                        timestamp: jsTimestamp,
                        ecgMetrics: ecgMetrics, // Include ECG metrics for heart rate
                    });
                    break;

                case "gsr":
                    // ESP32 is sending GSR values in the 'gsr' field, not 'value'
                    // Use the correct field name from ESP32 message

                    this.onDataUpdate({
                        type: "gsr",
                        gsr: data.gsr, // Use data.gsr field from ESP32 message
                        value: data.gsr, // Keep for backward compatibility
                        raw: data.gsr,
                        sensorConnected: data.sensorConnected || false,
                        timestamp: jsTimestamp,
                    });
                    break;

                case "ibi":
                    this.onDataUpdate({
                        type: "ibi",
                        value: data.value, // IBI in milliseconds
                        hrv: data.value, // FIXED: add 'hrv' field that main component expects
                        hr: data.hr, // Heart rate in BPM
                        sensorConnected: data.sensorConnected || false,
                        timestamp: jsTimestamp,
                    });
                    break;

                case "heartrate":
                    this.onDataUpdate({
                        type: "heartrate",
                        bpm: data.bpm, // Heart rate in BPM
                        ibi: data.ibi, // IBI in milliseconds
                        sensorConnected: data.sensorConnected || false,
                        timestamp: jsTimestamp,
                    });
                    break;

                default:
                    console.warn("Unknown ESP32 message type:", data.type);
            }
        } catch (error) {
            endTimer("message_processing", "WEBSOCKET");
            logError("WEBSOCKET", "Failed to parse ESP32 message", { data: event.data, error });
        }
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

            // Clear any existing reconnect timer
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
            }

            // More aggressive reconnection - try immediately, then with short delays
            const delay = this.reconnectAttempts === 1 ? 0 : Math.min(1000 * this.reconnectAttempts, 5000);

            this.reconnectTimer = setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            console.error("❌ Max reconnection attempts reached");
            this.onDataUpdate({ type: "connection", status: "failed" });
        }
    }

    public disconnect(): void {
        // Clear reconnect timer
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            // Remove all event listeners to prevent memory leaks
            this.ws.onopen = null;
            this.ws.onmessage = null;
            this.ws.onerror = null;
            this.ws.onclose = null;

            this.ws.close();
            this.ws = null;
        }
    }

    public isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    // Update WebSocket URL (useful for manual IP configuration)
    public updateUrl(newUrl: string): void {
        this.wsUrl = newUrl;
        if (this.isConnected()) {
            this.disconnect();
            this.connect();
        }
    }

    // Simple breath rate estimation for testing
    private estimateBreathRate(rawValue: number, timestamp: number): number {
        // For now, return a simple varying breath rate
        // This will be replaced with proper calculation later
        return 16 + Math.sin(timestamp / 10000) * 2; // 14-18 breaths/min
    }

    // Force connection attempt (useful for manual reconnection)
    public forceConnect(): void {
        console.log("🔌 Force connecting to ESP32...");
        this.reconnectAttempts = 0;
        this.ipDiscoveryAttempts = 0;
        this.connect();
    }
}

// Utility functions for signal processing
export const signalProcessingUtils = {
    // Calculate moving average
    movingAverage: (data: number[], windowSize: number): number[] => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const start = Math.max(0, i - windowSize + 1);
            const window = data.slice(start, i + 1);
            const average = window.reduce((sum, val) => sum + val, 0) / window.length;
            result.push(average);
        }
        return result;
    },

    // Calculate standard deviation
    standardDeviation: (data: number[]): number => {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const squaredDiffs = data.map((val) => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
        return Math.sqrt(variance);
    },

    // Detect peaks in signal
    detectPeaks: (data: number[], threshold: number, minDistance: number): number[] => {
        const peaks = [];
        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > threshold && data[i] > data[i - 1] && data[i] > data[i + 1]) {
                // Check minimum distance from last peak
                if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
                    peaks.push(i);
                }
            }
        }
        return peaks;
    },

    // Normalize signal to 0-1 range
    normalize: (data: number[]): number[] => {
        if (data.length === 0) return [];

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;

        // Avoid division by zero
        if (range === 0) return data.map(() => 0.5);

        return data.map((val) => (val - min) / range);
    },
};
