// Comprehensive Session Recording System for 20-minute Vital Signs Monitoring
// Tracks data across three phases: Initial (25%), Main (50%), Final (25%)
// Provides statistical analysis with outlier filtering for accurate patient assessment

export interface VitalSignsData {
    timestamp: number;
    heartRate: number;
    respiratoryRate: number;
    gsrValue: number;
    ecgQuality: number;
    hrvMetrics: {
        sdnn: number;
        rmssd: number;
        pnn50: number;
        lfPower: number;
        hfPower: number;
        lfHfRatio: number;
        // Additional HRV metrics for medical analysis
        nn50: number;
        triangularIndex: number;
        stressIndex: number;
        vagalTone: number;
    };
    respiratoryMetrics: {
        breathCount: number;
        inhalePercent: number;
        exhalePercent: number;
        breathingState: string;
        averageCycleDuration: number;

        // Enhanced HW484 respiration sensor metrics
        tidalVolume: number;
        minuteVolume: number;
        inspiratoryTime: number;
        expiratoryTime: number;
        totalBreathTime: number;
        inspiratoryExpiratoryRatio: number;
        peakInspiratoryFlow: number;
        peakExpiratoryFlow: number;
        respiratoryEffort: number;
        breathingRegularity: number;
        apneaHypopneaIndex: number;
        respiratorySinusArrhythmia: number;

        // Advanced respiratory analysis
        respiratoryPhaseCoherence: number;
        respiratoryRateVariability: number;
        breathDepthConsistency: number;
        respiratoryEfficiency: number;

        // Medical assessment scores
        respiratoryDistressScore: number;
        breathingPatternQuality: number;
        respiratoryFatigueIndex: number;
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

export interface PhaseStatistics {
    phase: "initial" | "main" | "final";
    startTime: number;
    endTime: number;
    duration: number;
    dataPoints: number;

    // Heart Rate Statistics
    heartRate: {
        min: number;
        max: number;
        avg: number;
        stdDev: number;
        validReadings: number;
    };

    // Respiratory Rate Statistics
    respiratoryRate: {
        min: number;
        max: number;
        avg: number;
        stdDev: number;
        validReadings: number;
    };

    // GSR Statistics
    gsr: {
        min: number;
        max: number;
        avg: number;
        stdDev: number;
        validReadings: number;
    };

    // HRV Statistics
    hrv: {
        sdnn: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
        rmssd: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
        pnn50: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
        lfPower: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
        hfPower: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
        lfHfRatio: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
    };

    // Respiratory Pattern Statistics
    respiratoryPattern: {
        inhalePercent: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
        exhalePercent: { min: number; max: number; avg: number; stdDev: number; validReadings: number };
        breathCount: number;
        averageCycleDuration: number;
    };

    // Quality Metrics
    quality: {
        ecgQuality: { min: number; max: number; avg: number; validReadings: number };
        connectionStability: number; // Percentage of time ESP32 was connected
        sensorStability: {
            ecg: number;
            gsr: number;
            respiratory: number;
        };
    };
}

export interface SessionReport {
    sessionId: string;
    startTime: number;
    endTime: number;
    totalDuration: number;
    totalDataPoints: number;

    // Phase Information
    phases: {
        initial: PhaseStatistics;
        main: PhaseStatistics;
        final: PhaseStatistics;
    };

    // Overall Session Statistics
    overall: {
        heartRate: { min: number; max: number; avg: number; stdDev: number };
        respiratoryRate: { min: number; max: number; avg: number; stdDev: number };
        gsr: { min: number; max: number; avg: number; stdDev: number };
        hrv: { avgSdnn: number; avgRmssd: number; avgPnn50: number };
        respiratoryPattern: { avgInhalePercent: number; avgExhalePercent: number; totalBreaths: number };
    };

    // Quality Assessment
    qualityAssessment: {
        overallQuality: "excellent" | "good" | "fair" | "poor";
        dataCompleteness: number; // Percentage of expected data points
        connectionReliability: number; // Percentage of stable connection
        sensorReliability: {
            ecg: number;
            gsr: number;
            respiratory: number;
        };
        recommendations: string[];
    };

    // Export Data
    exportData: {
        csv: string;
        json: string;
        summary: string;
    };
}

export class SessionRecorder {
    private static instance: SessionRecorder;
    private isRecording: boolean = false;
    private sessionStartTime: number = 0;
    private sessionId: string = "";
    private sessionData: VitalSignsData[] = [];
    private phaseData: {
        initial: VitalSignsData[];
        main: VitalSignsData[];
        final: VitalSignsData[];
    } = { initial: [], main: [], final: [] };

    // Configuration
    private readonly SESSION_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds
    private readonly PHASE_BREAKDOWN = {
        initial: 0.25, // First 25%
        main: 0.5, // Middle 50%
        final: 0.25, // Final 25%
    };

    // Outlier filtering thresholds (for removing glitchy values)
    private readonly OUTLIER_THRESHOLDS = {
        heartRate: { min: 40, max: 200 }, // BPM range
        respiratoryRate: { min: 8, max: 40 }, // breaths/min range
        gsr: { min: 0.1, max: 100 }, // μS range
        hrv: { min: 10, max: 200 }, // ms range
        respiratoryPercent: { min: 10, max: 90 }, // percentage range
    };

    // Quality thresholds
    private readonly QUALITY_THRESHOLDS = {
        excellent: 0.9, // 90%+ data quality
        good: 0.75, // 75%+ data quality
        fair: 0.5, // 50%+ data quality
        poor: 0.0, // Below 50%
    };

    private constructor() {}

    public static getInstance(): SessionRecorder {
        if (!SessionRecorder.instance) {
            SessionRecorder.instance = new SessionRecorder();
        }
        return SessionRecorder.instance;
    }

    /**
     * Start a new 20-minute recording session
     */
    public startSession(): string {
        if (this.isRecording) {
            throw new Error("Session already in progress");
        }

        this.isRecording = true;
        this.sessionStartTime = Date.now();
        this.sessionId = this.generateSessionId();
        this.sessionData = [];
        this.phaseData = { initial: [], main: [], final: [] };

        console.log(`🔴 Session ${this.sessionId} started at ${new Date(this.sessionStartTime).toISOString()}`);
        return this.sessionId;
    }

    /**
     * Stop the current session and generate comprehensive report
     */
    public stopSession(): SessionReport {
        if (!this.isRecording) {
            throw new Error("No session in progress");
        }

        this.isRecording = false;
        const sessionEndTime = Date.now();
        const totalDuration = sessionEndTime - this.sessionStartTime;

        console.log(
            `⏹️ Session ${this.sessionId} stopped. Duration: ${(totalDuration / 1000 / 60).toFixed(1)} minutes`
        );

        // Organize data into phases
        this.organizeDataIntoPhases();

        // Generate comprehensive report
        const report = this.generateSessionReport(sessionEndTime, totalDuration);

        // Export data
        report.exportData = this.exportSessionData(report);

        return report;
    }

    /**
     * Add vital signs data point to the current session
     */
    public addDataPoint(data: VitalSignsData): void {
        if (!this.isRecording) return;

        // Filter out glitchy/outlier values
        const filteredData = this.filterOutliers(data);

        if (filteredData) {
            this.sessionData.push(filteredData);

            // Check if session duration exceeded
            const currentDuration = Date.now() - this.sessionStartTime;
            if (currentDuration >= this.SESSION_DURATION) {
                console.log("⏰ Session duration reached 20 minutes. Auto-stopping session...");
                this.stopSession();
            }
        }
    }

    /**
     * Get current session status
     */
    public getSessionStatus(): {
        isRecording: boolean;
        sessionId: string;
        elapsedTime: number;
        remainingTime: number;
        dataPoints: number;
        currentPhase: "initial" | "main" | "final";
        phaseProgress: number;
    } {
        if (!this.isRecording) {
            return {
                isRecording: false,
                sessionId: "",
                elapsedTime: 0,
                remainingTime: 0,
                dataPoints: 0,
                currentPhase: "initial",
                phaseProgress: 0,
            };
        }

        const elapsedTime = Date.now() - this.sessionStartTime;
        const remainingTime = Math.max(0, this.SESSION_DURATION - elapsedTime);
        const progress = elapsedTime / this.SESSION_DURATION;

        let currentPhase: "initial" | "main" | "final" = "initial";
        let phaseProgress = 0;

        if (progress <= this.PHASE_BREAKDOWN.initial) {
            currentPhase = "initial";
            phaseProgress = progress / this.PHASE_BREAKDOWN.initial;
        } else if (progress <= this.PHASE_BREAKDOWN.initial + this.PHASE_BREAKDOWN.main) {
            currentPhase = "main";
            phaseProgress = (progress - this.PHASE_BREAKDOWN.initial) / this.PHASE_BREAKDOWN.main;
        } else {
            currentPhase = "final";
            phaseProgress =
                (progress - this.PHASE_BREAKDOWN.initial - this.PHASE_BREAKDOWN.main) / this.PHASE_BREAKDOWN.final;
        }

        return {
            isRecording: true,
            sessionId: this.sessionId,
            elapsedTime,
            remainingTime,
            dataPoints: this.sessionData.length,
            currentPhase,
            phaseProgress,
        };
    }

    /**
     * Filter out glitchy/outlier values based on physiological ranges
     */
    private filterOutliers(data: VitalSignsData): VitalSignsData | null {
        // Heart rate validation
        if (
            data.heartRate < this.OUTLIER_THRESHOLDS.heartRate.min ||
            data.heartRate > this.OUTLIER_THRESHOLDS.heartRate.max
        ) {
            return null; // Invalid heart rate
        }

        // Respiratory rate validation
        if (
            data.respiratoryRate < this.OUTLIER_THRESHOLDS.respiratoryRate.min ||
            data.respiratoryRate > this.OUTLIER_THRESHOLDS.respiratoryRate.max
        ) {
            return null; // Invalid respiratory rate
        }

        // GSR validation
        if (data.gsrValue < this.OUTLIER_THRESHOLDS.gsr.min || data.gsrValue > this.OUTLIER_THRESHOLDS.gsr.max) {
            return null; // Invalid GSR
        }

        // HRV validation
        if (
            data.hrvMetrics.sdnn < this.OUTLIER_THRESHOLDS.hrv.min ||
            data.hrvMetrics.sdnn > this.OUTLIER_THRESHOLDS.hrv.max
        ) {
            return null; // Invalid HRV
        }

        // Respiratory pattern validation
        if (
            data.respiratoryMetrics.inhalePercent < this.OUTLIER_THRESHOLDS.respiratoryPercent.min ||
            data.respiratoryMetrics.inhalePercent > this.OUTLIER_THRESHOLDS.respiratoryPercent.max
        ) {
            return null; // Invalid inhale percentage
        }

        return data;
    }

    /**
     * Organize collected data into three phases
     */
    private organizeDataIntoPhases(): void {
        const totalDuration = this.SESSION_DURATION;
        const initialEndTime = this.sessionStartTime + totalDuration * this.PHASE_BREAKDOWN.initial;
        const mainEndTime =
            this.sessionStartTime + totalDuration * (this.PHASE_BREAKDOWN.initial + this.PHASE_BREAKDOWN.main);

        this.phaseData = {
            initial: this.sessionData.filter(
                (d) => d.timestamp >= this.sessionStartTime && d.timestamp < initialEndTime
            ),
            main: this.sessionData.filter((d) => d.timestamp >= initialEndTime && d.timestamp < mainEndTime),
            final: this.sessionData.filter(
                (d) => d.timestamp >= mainEndTime && d.timestamp <= this.sessionStartTime + totalDuration
            ),
        };

        console.log(
            `📊 Data organized into phases: Initial(${this.phaseData.initial.length}), Main(${this.phaseData.main.length}), Final(${this.phaseData.final.length})`
        );
    }

    /**
     * Calculate comprehensive statistics for a phase
     */
    private calculatePhaseStatistics(
        phaseData: VitalSignsData[],
        phase: "initial" | "main" | "final"
    ): PhaseStatistics {
        if (phaseData.length === 0) {
            return this.createEmptyPhaseStatistics(phase);
        }

        const startTime = Math.min(...phaseData.map((d) => d.timestamp));
        const endTime = Math.max(...phaseData.map((d) => d.timestamp));
        const duration = endTime - startTime;

        // Extract arrays for statistical calculations
        const heartRates = phaseData.map((d) => d.heartRate).filter((r) => r > 0);
        const respiratoryRates = phaseData.map((d) => d.respiratoryRate).filter((r) => r > 0);
        const gsrValues = phaseData.map((d) => d.gsrValue).filter((g) => g > 0);
        const ecgQualities = phaseData.map((d) => d.ecgQuality).filter((q) => q > 0);

        // HRV metrics
        const sdnnValues = phaseData.map((d) => d.hrvMetrics.sdnn).filter((s) => s > 0);
        const rmssdValues = phaseData.map((d) => d.hrvMetrics.rmssd).filter((r) => r > 0);
        const pnn50Values = phaseData.map((d) => d.hrvMetrics.pnn50).filter((p) => p > 0);
        const lfPowerValues = phaseData.map((d) => d.hrvMetrics.lfPower).filter((l) => l > 0);
        const hfPowerValues = phaseData.map((d) => d.hrvMetrics.hfPower).filter((h) => h > 0);
        const lfHfRatioValues = phaseData.map((d) => d.hrvMetrics.lfHfRatio).filter((r) => r > 0);

        // Respiratory pattern metrics
        const inhalePercents = phaseData.map((d) => d.respiratoryMetrics.inhalePercent).filter((i) => i > 0);
        const exhalePercents = phaseData.map((d) => d.respiratoryMetrics.exhalePercent).filter((e) => e > 0);

        // Connection and sensor stability
        const esp32ConnectedCount = phaseData.filter((d) => d.connectionStatus.esp32Connected).length;
        const ecgConnectedCount = phaseData.filter((d) => d.connectionStatus.sensorsConnected.ecg).length;
        const gsrConnectedCount = phaseData.map((d) => d.connectionStatus.sensorsConnected.gsr).filter(Boolean).length;
        const respiratoryConnectedCount = phaseData
            .map((d) => d.connectionStatus.sensorsConnected.respiratory)
            .filter(Boolean).length;

        return {
            phase,
            startTime,
            endTime,
            duration,
            dataPoints: phaseData.length,

            heartRate: this.calculateStatistics(heartRates),
            respiratoryRate: this.calculateStatistics(respiratoryRates),
            gsr: this.calculateStatistics(gsrValues),

            hrv: {
                sdnn: this.calculateStatistics(sdnnValues),
                rmssd: this.calculateStatistics(rmssdValues),
                pnn50: this.calculateStatistics(pnn50Values),
                lfPower: this.calculateStatistics(lfPowerValues),
                hfPower: this.calculateStatistics(hfPowerValues),
                lfHfRatio: this.calculateStatistics(lfHfRatioValues),
            },

            respiratoryPattern: {
                inhalePercent: this.calculateStatistics(inhalePercents),
                exhalePercent: this.calculateStatistics(exhalePercents),
                breathCount: phaseData.reduce((sum, d) => sum + d.respiratoryMetrics.breathCount, 0),
                averageCycleDuration:
                    phaseData.reduce((sum, d) => sum + (d.respiratoryMetrics.averageCycleDuration || 0), 0) /
                    phaseData.length,
            },

            quality: {
                ecgQuality: this.calculateStatistics(ecgQualities),
                connectionStability: (esp32ConnectedCount / phaseData.length) * 100,
                sensorStability: {
                    ecg: (ecgConnectedCount / phaseData.length) * 100,
                    gsr: (gsrConnectedCount / phaseData.length) * 100,
                    respiratory: (respiratoryConnectedCount / phaseData.length) * 100,
                },
            },
        };
    }

    /**
     * Calculate basic statistics (min, max, avg, stdDev) for an array of values
     */
    private calculateStatistics(values: number[]): {
        min: number;
        max: number;
        avg: number;
        stdDev: number;
        validReadings: number;
    } {
        if (values.length === 0) {
            return { min: 0, max: 0, avg: 0, stdDev: 0, validReadings: 0 };
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

        // Calculate standard deviation
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        return { min, max, avg, stdDev, validReadings: values.length };
    }

    /**
     * Create empty phase statistics when no data is available
     */
    private createEmptyPhaseStatistics(phase: "initial" | "main" | "final"): PhaseStatistics {
        const emptyStats = { min: 0, max: 0, avg: 0, stdDev: 0, validReadings: 0 };
        const emptyHrvStats = { min: 0, max: 0, avg: 0, stdDev: 0, validReadings: 0 };

        return {
            phase,
            startTime: 0,
            endTime: 0,
            duration: 0,
            dataPoints: 0,
            heartRate: emptyStats,
            respiratoryRate: emptyStats,
            gsr: emptyStats,
            hrv: {
                sdnn: emptyHrvStats,
                rmssd: emptyHrvStats,
                pnn50: emptyHrvStats,
                lfPower: emptyHrvStats,
                hfPower: emptyHrvStats,
                lfHfRatio: emptyHrvStats,
            },
            respiratoryPattern: {
                inhalePercent: emptyStats,
                exhalePercent: emptyStats,
                breathCount: 0,
                averageCycleDuration: 0,
            },
            quality: {
                ecgQuality: emptyStats,
                connectionStability: 0,
                sensorStability: { ecg: 0, gsr: 0, respiratory: 0 },
            },
        };
    }

    /**
     * Generate comprehensive session report
     */
    private generateSessionReport(sessionEndTime: number, totalDuration: number): SessionReport {
        // Calculate phase statistics
        const initialStats = this.calculatePhaseStatistics(this.phaseData.initial, "initial");
        const mainStats = this.calculatePhaseStatistics(this.phaseData.main, "main");
        const finalStats = this.calculatePhaseStatistics(this.phaseData.final, "final");

        // Calculate overall statistics
        const allHeartRates = this.sessionData.map((d) => d.heartRate).filter((r) => r > 0);
        const allRespiratoryRates = this.sessionData.map((d) => d.respiratoryRate).filter((r) => r > 0);
        const allGsrValues = this.sessionData.map((d) => d.gsrValue).filter((g) => g > 0);

        const overall = {
            heartRate: this.calculateOverallStatistics(allHeartRates),
            respiratoryRate: this.calculateOverallStatistics(allRespiratoryRates),
            gsr: this.calculateOverallStatistics(allGsrValues),
            hrv: {
                avgSdnn: this.calculateAverage(this.sessionData.map((d) => d.hrvMetrics.sdnn).filter((s) => s > 0)),
                avgRmssd: this.calculateAverage(this.sessionData.map((d) => d.hrvMetrics.rmssd).filter((r) => r > 0)),
                avgPnn50: this.calculateAverage(this.sessionData.map((d) => d.hrvMetrics.pnn50).filter((p) => p > 0)),
            },
            respiratoryPattern: {
                avgInhalePercent: this.calculateAverage(
                    this.sessionData.map((d) => d.respiratoryMetrics.inhalePercent).filter((i) => i > 0)
                ),
                avgExhalePercent: this.calculateAverage(
                    this.sessionData.map((d) => d.respiratoryMetrics.exhalePercent).filter((e) => e > 0)
                ),
                totalBreaths: this.sessionData.reduce((sum, d) => sum + d.respiratoryMetrics.breathCount, 0),
            },
        };

        // Quality assessment
        const qualityAssessment = this.assessSessionQuality(initialStats, mainStats, finalStats);

        return {
            sessionId: this.sessionId,
            startTime: this.sessionStartTime,
            endTime: sessionEndTime,
            totalDuration,
            totalDataPoints: this.sessionData.length,
            phases: { initial: initialStats, main: mainStats, final: finalStats },
            overall,
            qualityAssessment,
            exportData: { csv: "", json: "", summary: "" }, // Will be populated later
        };
    }

    /**
     * Calculate overall statistics (min, max, avg, stdDev)
     */
    private calculateOverallStatistics(values: number[]): { min: number; max: number; avg: number; stdDev: number } {
        if (values.length === 0) return { min: 0, max: 0, avg: 0, stdDev: 0 };

        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        return { min, max, avg, stdDev };
    }

    /**
     * Calculate simple average
     */
    private calculateAverage(values: number[]): number {
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    /**
     * Assess overall session quality
     */
    private assessSessionQuality(
        initial: PhaseStatistics,
        main: PhaseStatistics,
        final: PhaseStatistics
    ): SessionReport["qualityAssessment"] {
        // Calculate data completeness
        const expectedDataPoints = (this.SESSION_DURATION / 1000) * 10; // Assuming 10 data points per second
        const dataCompleteness = (this.sessionData.length / expectedDataPoints) * 100;

        // Calculate connection reliability
        const connectionReliability =
            (initial.quality.connectionStability +
                main.quality.connectionStability +
                final.quality.connectionStability) /
            3;

        // Calculate sensor reliability
        const sensorReliability = {
            ecg:
                (initial.quality.sensorStability.ecg +
                    main.quality.sensorStability.ecg +
                    final.quality.sensorStability.ecg) /
                3,
            gsr:
                (initial.quality.sensorStability.gsr +
                    main.quality.sensorStability.gsr +
                    final.quality.sensorStability.gsr) /
                3,
            respiratory:
                (initial.quality.sensorStability.respiratory +
                    main.quality.sensorStability.respiratory +
                    final.quality.sensorStability.respiratory) /
                3,
        };

        // Determine overall quality
        let overallQuality: "excellent" | "good" | "fair" | "poor" = "poor";
        if (dataCompleteness >= this.QUALITY_THRESHOLDS.excellent && connectionReliability >= 90) {
            overallQuality = "excellent";
        } else if (dataCompleteness >= this.QUALITY_THRESHOLDS.good && connectionReliability >= 75) {
            overallQuality = "good";
        } else if (dataCompleteness >= this.QUALITY_THRESHOLDS.fair && connectionReliability >= 50) {
            overallQuality = "fair";
        }

        // Generate recommendations
        const recommendations: string[] = [];
        if (dataCompleteness < 80) recommendations.push("Increase data collection frequency for better analysis");
        if (connectionReliability < 90) recommendations.push("Improve ESP32 connection stability");
        if (sensorReliability.ecg < 80) recommendations.push("Check ECG electrode placement and connection");
        if (sensorReliability.gsr < 80) recommendations.push("Verify GSR sensor contact and positioning");
        if (sensorReliability.respiratory < 80) recommendations.push("Ensure respiratory sensor is properly secured");

        return {
            overallQuality,
            dataCompleteness,
            connectionReliability,
            sensorReliability,
            recommendations,
        };
    }

    /**
     * Export session data in multiple formats
     */
    private exportSessionData(report: SessionReport): { csv: string; json: string; summary: string } {
        // CSV Export
        const csv = this.exportToCSV(report);

        // JSON Export
        const json = JSON.stringify(report, null, 2);

        // Summary Export (human-readable)
        const summary = this.generateSummary(report);

        return { csv, json, summary };
    }

    /**
     * Export session data to CSV format
     */
    private exportToCSV(report: SessionReport): string {
        const headers = [
            "Phase",
            "Start Time",
            "End Time",
            "Duration (ms)",
            "Data Points",
            "HR Min",
            "HR Max",
            "HR Avg",
            "HR StdDev",
            "HR Valid Readings",
            "RR Min",
            "RR Max",
            "RR Avg",
            "RR StdDev",
            "RR Valid Readings",
            "GSR Min",
            "GSR Max",
            "GSR Avg",
            "GSR StdDev",
            "GSR Valid Readings",
            "HRV SDNN Min",
            "HRV SDNN Max",
            "HRV SDNN Avg",
            "HRV SDNN StdDev",
            "HRV RMSSD Min",
            "HRV RMSSD Max",
            "HRV RMSSD Avg",
            "HRV RMSSD StdDev",
            "HRV pNN50 Min",
            "HRV pNN50 Max",
            "HRV pNN50 Avg",
            "HRV pNN50 StdDev",
            "Inhale % Min",
            "Inhale % Max",
            "Inhale % Avg",
            "Inhale % StdDev",
            "Exhale % Min",
            "Exhale % Max",
            "Exhale % Avg",
            "Exhale % StdDev",
            "Breath Count",
            "Avg Cycle Duration",
            "ECG Quality Min",
            "ECG Quality Max",
            "ECG Quality Avg",
            "Connection Stability %",
            "ECG Sensor Stability %",
            "GSR Sensor Stability %",
            "Respiratory Sensor Stability %",
        ];

        let csvContent = headers.join(",") + "\n";

        // Add data for each phase
        [report.phases.initial, report.phases.main, report.phases.final].forEach((phase) => {
            const row = [
                phase.phase,
                new Date(phase.startTime).toISOString(),
                new Date(phase.endTime).toISOString(),
                phase.duration,
                phase.dataPoints,
                phase.heartRate.min,
                phase.heartRate.max,
                phase.heartRate.avg.toFixed(2),
                phase.heartRate.stdDev.toFixed(2),
                phase.heartRate.validReadings,
                phase.respiratoryRate.min,
                phase.respiratoryRate.max,
                phase.respiratoryRate.avg.toFixed(2),
                phase.respiratoryRate.stdDev.toFixed(2),
                phase.respiratoryRate.validReadings,
                phase.gsr.min,
                phase.gsr.max,
                phase.gsr.avg.toFixed(3),
                phase.gsr.stdDev.toFixed(3),
                phase.gsr.validReadings,
                phase.hrv.sdnn.min,
                phase.hrv.sdnn.max,
                phase.hrv.sdnn.avg.toFixed(2),
                phase.hrv.sdnn.stdDev.toFixed(2),
                phase.hrv.rmssd.min,
                phase.hrv.rmssd.max,
                phase.hrv.rmssd.avg.toFixed(2),
                phase.hrv.rmssd.stdDev.toFixed(2),
                phase.hrv.pnn50.min,
                phase.hrv.pnn50.max,
                phase.hrv.pnn50.avg.toFixed(2),
                phase.hrv.pnn50.stdDev.toFixed(2),
                phase.respiratoryPattern.inhalePercent.min,
                phase.respiratoryPattern.inhalePercent.max,
                phase.respiratoryPattern.inhalePercent.avg.toFixed(1),
                phase.respiratoryPattern.inhalePercent.stdDev.toFixed(1),
                phase.respiratoryPattern.exhalePercent.min,
                phase.respiratoryPattern.exhalePercent.max,
                phase.respiratoryPattern.exhalePercent.avg.toFixed(1),
                phase.respiratoryPattern.exhalePercent.stdDev.toFixed(1),
                phase.respiratoryPattern.breathCount,
                phase.respiratoryPattern.averageCycleDuration.toFixed(0),
                phase.quality.ecgQuality.min,
                phase.quality.ecgQuality.max,
                phase.quality.ecgQuality.avg.toFixed(2),
                phase.quality.connectionStability.toFixed(1),
                phase.quality.sensorStability.ecg.toFixed(1),
                phase.quality.sensorStability.gsr.toFixed(1),
                phase.quality.sensorStability.respiratory.toFixed(1),
            ];

            csvContent += row.join(",") + "\n";
        });

        return csvContent;
    }

    /**
     * Generate human-readable summary
     */
    private generateSummary(report: SessionReport): string {
        const durationMinutes = (report.totalDuration / 1000 / 60).toFixed(1);
        const startTime = new Date(report.startTime).toLocaleString();
        const endTime = new Date(report.endTime).toLocaleString();

        let summary = `=== VITAL SIGNS MONITORING SESSION REPORT ===\n\n`;
        summary += `Session ID: ${report.sessionId}\n`;
        summary += `Duration: ${durationMinutes} minutes\n`;
        summary += `Start Time: ${startTime}\n`;
        summary += `End Time: ${endTime}\n`;
        summary += `Total Data Points: ${report.totalDataPoints}\n`;
        summary += `Overall Quality: ${report.qualityAssessment.overallQuality.toUpperCase()}\n\n`;

        // Phase summaries
        summary += `=== PHASE ANALYSIS ===\n\n`;

        ["initial", "main", "final"].forEach((phaseName) => {
            const phase = report.phases[phaseName as keyof typeof report.phases];
            const phaseDuration = (phase.duration / 1000 / 60).toFixed(1);

            summary += `--- ${phaseName.toUpperCase()} PHASE (${phaseDuration} min) ---\n`;
            summary += `Data Points: ${phase.dataPoints}\n`;
            summary += `Heart Rate: ${phase.heartRate.avg.toFixed(1)} BPM (${phase.heartRate.min}-${
                phase.heartRate.max
            })\n`;
            summary += `Respiratory Rate: ${phase.respiratoryRate.avg.toFixed(1)} breaths/min (${
                phase.respiratoryRate.min
            }-${phase.respiratoryRate.max})\n`;
            summary += `GSR: ${phase.gsr.avg.toFixed(2)} μS (${phase.gsr.min.toFixed(2)}-${phase.gsr.max.toFixed(
                2
            )})\n`;
            summary += `HRV SDNN: ${phase.hrv.sdnn.avg.toFixed(1)} ms\n`;
            summary += `Breathing Pattern: ${phase.respiratoryPattern.inhalePercent.avg.toFixed(
                1
            )}% inhale, ${phase.respiratoryPattern.exhalePercent.avg.toFixed(1)}% exhale\n`;
            summary += `Connection Stability: ${phase.quality.connectionStability.toFixed(1)}%\n\n`;
        });

        // Overall summary
        summary += `=== OVERALL SESSION SUMMARY ===\n\n`;
        summary += `Average Heart Rate: ${report.overall.heartRate.avg.toFixed(1)} BPM\n`;
        summary += `Average Respiratory Rate: ${report.overall.respiratoryRate.avg.toFixed(1)} breaths/min\n`;
        summary += `Average GSR: ${report.overall.gsr.avg.toFixed(2)} μS\n`;
        summary += `Total Breaths: ${report.overall.respiratoryPattern.totalBreaths}\n`;
        summary += `Data Completeness: ${report.qualityAssessment.dataCompleteness.toFixed(1)}%\n`;
        summary += `Connection Reliability: ${report.qualityAssessment.connectionReliability.toFixed(1)}%\n\n`;

        // Quality assessment
        summary += `=== QUALITY ASSESSMENT ===\n\n`;
        summary += `Overall Quality: ${report.qualityAssessment.overallQuality.toUpperCase()}\n`;
        summary += `Sensor Reliability:\n`;
        summary += `  ECG: ${report.qualityAssessment.sensorReliability.ecg.toFixed(1)}%\n`;
        summary += `  GSR: ${report.qualityAssessment.sensorReliability.gsr.toFixed(1)}%\n`;
        summary += `  Respiratory: ${report.qualityAssessment.sensorReliability.respiratory.toFixed(1)}%\n\n`;

        if (report.qualityAssessment.recommendations.length > 0) {
            summary += `=== RECOMMENDATIONS ===\n\n`;
            report.qualityAssessment.recommendations.forEach((rec, index) => {
                summary += `${index + 1}. ${rec}\n`;
            });
        }

        return summary;
    }

    /**
     * Generate unique session ID
     */
    private generateSessionId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `session_${timestamp}_${random}`;
    }

    /**
     * Get current recording status
     */
    public isSessionActive(): boolean {
        return this.isRecording;
    }

    /**
     * Get session progress as percentage
     */
    public getSessionProgress(): number {
        if (!this.isRecording) return 0;
        const elapsed = Date.now() - this.sessionStartTime;
        return Math.min(100, (elapsed / this.SESSION_DURATION) * 100);
    }

    /**
     * Emergency stop session (useful for error handling)
     */
    public emergencyStop(): void {
        if (this.isRecording) {
            console.warn("⚠️ Emergency stopping session...");
            this.stopSession();
        }
    }
}
