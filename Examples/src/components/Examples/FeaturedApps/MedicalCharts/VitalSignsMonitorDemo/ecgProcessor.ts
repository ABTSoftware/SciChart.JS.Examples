// ECG Signal Processing Module for Quality Assessment and HRV Analysis
// Complements ESP32's Pan-Tompkins algorithm with frontend validation and analysis
import { debug, info, warn, error as logError, startTimer, endTimer } from "./debugLogger";

export interface ECGMetrics {
    signalQuality: number; // 0-100, signal quality score
    noiseLevel: number; // 0-100, noise assessment
    artifactCount: number; // Number of detected artifacts
    validBeats: number; // Number of valid QRS detections
    meanIBI: number; // Average inter-beat interval
    sdnn: number; // Standard deviation of NN intervals
    rmssd: number; // Root mean square of successive differences
    pnn50: number; // Percentage of NN50
    lfPower: number; // Low frequency power (0.04-0.15 Hz)
    hfPower: number; // High frequency power (0.15-0.4 Hz)
    lfHfRatio: number; // LF/HF ratio
    coherence: number; // Heart rate coherence score

    // Additional HRV metrics for medical analysis
    nn50: number; // Number of successive RR intervals that differ by more than 50ms
    triangularIndex: number; // Triangular index of HRV
    stressIndex: number; // Stress index based on HRV
    vagalTone: number; // Vagal tone estimation
}

export interface ECGQualityConfig {
    samplingRate: number; // Hz
    baselineWindow: number; // samples for baseline calculation
    noiseThreshold: number; // threshold for noise detection
    artifactThreshold: number; // threshold for artifact detection
    minValidIBI: number; // minimum valid IBI in ms
    maxValidIBI: number; // maximum valid IBI in ms
    hrvWindowSize: number; // ms for HRV calculation window
}

export class ECGSignalProcessor {
    private config: ECGQualityConfig;
    private ecgBuffer: Array<{ value: number; timestamp: number }> = [];
    private ibiBuffer: Array<{ value: number; timestamp: number }> = [];
    private metrics: ECGMetrics = {
        signalQuality: 0,
        noiseLevel: 0,
        artifactCount: 0,
        validBeats: 0,
        meanIBI: 0,
        sdnn: 0,
        rmssd: 0,
        pnn50: 0,
        lfPower: 0,
        hfPower: 0,
        lfHfRatio: 0,
        coherence: 0,

        // Additional HRV metrics for medical analysis
        nn50: 0,
        triangularIndex: 0,
        stressIndex: 0,
        vagalTone: 0,
    };

    constructor(config: Partial<ECGQualityConfig> = {}) {
        this.config = {
            samplingRate: 250, // 250 Hz to match ESP32
            baselineWindow: 1000, // 4 seconds at 250Hz
            noiseThreshold: 0.1, // 10% of signal range
            artifactThreshold: 0.3, // 30% of signal range
            minValidIBI: 300, // 300ms minimum (200 BPM max)
            maxValidIBI: 2000, // 2000ms maximum (30 BPM min)
            hrvWindowSize: 60000, // 60 seconds for HRV analysis
            ...config,
        };
        info("ECG", "ECGSignalProcessor initialized", this.config);
    }

    // Add new ECG data point
    public addECGPoint(value: number, timestamp: number): void {
        this.ecgBuffer.push({ value, timestamp });

        // Remove old data outside the window
        const cutoffTime = timestamp - this.config.hrvWindowSize;
        this.ecgBuffer = this.ecgBuffer.filter((d) => d.timestamp >= cutoffTime);

        // Assess signal quality
        this.assessSignalQuality();
    }

    // Add IBI data from Pan-Tompkins
    public addIBI(ibi: number, timestamp: number): void {
        // Validate IBI range
        if (ibi >= this.config.minValidIBI && ibi <= this.config.maxValidIBI) {
            this.ibiBuffer.push({ value: ibi, timestamp });

            // Remove old IBI data
            const cutoffTime = timestamp - this.config.hrvWindowSize;
            this.ibiBuffer = this.ibiBuffer.filter((d) => d.timestamp >= cutoffTime);

            // Update HRV metrics
            this.calculateHRVMetrics();
        } else {
            this.metrics.artifactCount++;
        }
    }

    // Assess ECG signal quality
    private assessSignalQuality(): void {
        if (this.ecgBuffer.length < this.config.baselineWindow) return;

        const recentData = this.ecgBuffer.slice(-this.config.baselineWindow);
        const values = recentData.map((d) => d.value);

        // Calculate baseline drift
        const baseline = this.calculateBaseline(values);
        const baselineDrift = Math.abs(values[values.length - 1] - values[0]);

        // Calculate noise level (high-frequency components)
        const noiseLevel = this.calculateNoiseLevel(values);

        // Calculate signal amplitude
        const signalRange = values.length > 0 ? Math.max(...values) - Math.min(...values) : 0;

        // Assess artifacts (sudden large changes)
        const artifactCount = this.detectArtifacts(values);

        // Calculate quality score
        let qualityScore = 100;

        // Penalize for noise
        qualityScore -= noiseLevel * 50;

        // Penalize for baseline drift
        if (baselineDrift > this.config.noiseThreshold) {
            qualityScore -= (baselineDrift / this.config.noiseThreshold) * 20;
        }

        // Penalize for artifacts
        qualityScore -= artifactCount * 10;

        // Penalize for low signal amplitude
        if (signalRange < 0.1) {
            qualityScore -= 30;
        }

        this.metrics.signalQuality = Math.max(0, Math.min(100, qualityScore));
        this.metrics.noiseLevel = noiseLevel;
        this.metrics.artifactCount = artifactCount;
        this.metrics.validBeats = this.ibiBuffer.length;
    }

    // Calculate baseline using median filter
    private calculateBaseline(values: number[]): number {
        if (values.length === 0) return 0;

        const sorted = [...values].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length / 2)];
    }

    // Calculate noise level using high-pass filtering
    private calculateNoiseLevel(values: number[]): number {
        if (values.length < 10) return 0;

        let noiseSum = 0;
        for (let i = 1; i < values.length; i++) {
            const diff = Math.abs(values[i] - values[i - 1]);
            noiseSum += diff;
        }

        return noiseSum / (values.length - 1);
    }

    // Detect artifacts (sudden large changes)
    private detectArtifacts(values: number[]): number {
        let artifactCount = 0;
        const threshold = this.config.artifactThreshold;

        for (let i = 1; i < values.length; i++) {
            const diff = Math.abs(values[i] - values[i - 1]);
            if (diff > threshold) {
                artifactCount++;
            }
        }

        return artifactCount;
    }

    // Calculate HRV metrics
    private calculateHRVMetrics(): void {
        if (this.ibiBuffer.length < 10) return; // Need at least 10 beats

        const ibiValues = this.ibiBuffer.map((d) => d.value);

        // Basic statistics
        this.metrics.meanIBI = ibiValues.reduce((sum, val) => sum + val, 0) / ibiValues.length;

        // SDNN (Standard Deviation of NN intervals)
        const mean = this.metrics.meanIBI;
        const variance = ibiValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / ibiValues.length;
        this.metrics.sdnn = Math.sqrt(variance);

        // RMSSD (Root Mean Square of Successive Differences)
        let rmssdSum = 0;
        for (let i = 1; i < ibiValues.length; i++) {
            const diff = ibiValues[i] - ibiValues[i - 1];
            rmssdSum += diff * diff;
        }
        // Division by zero protection
        this.metrics.rmssd = ibiValues.length > 1 ? Math.sqrt(rmssdSum / (ibiValues.length - 1)) : 0;

        // pNN50 (Percentage of NN50)
        let nn50Count = 0;
        for (let i = 1; i < ibiValues.length; i++) {
            const diff = Math.abs(ibiValues[i] - ibiValues[i - 1]);
            if (diff > 50) nn50Count++;
        }
        // Division by zero protection
        this.metrics.pnn50 = ibiValues.length > 1 ? (nn50Count / (ibiValues.length - 1)) * 100 : 0;

        // NN50 count (absolute number)
        this.metrics.nn50 = nn50Count;

        // Calculate additional advanced HRV metrics
        this.calculateAdvancedHRVMetrics(ibiValues);

        // Frequency domain analysis (simplified)
        this.calculateFrequencyMetrics(ibiValues);

        // Calculate coherence
        this.calculateCoherence();
    }

    // Calculate additional advanced HRV metrics
    private calculateAdvancedHRVMetrics(ibiValues: number[]): void {
        if (ibiValues.length < 10) return;

        // Triangular Index (TINN) - Triangular interpolation of NN interval histogram
        const minIBI = Math.min(...ibiValues);
        const maxIBI = Math.max(...ibiValues);
        const ibiRange = maxIBI - minIBI;

        if (ibiRange > 0) {
            // Create histogram bins
            const binCount = Math.min(20, Math.floor(ibiValues.length / 2));
            const binSize = ibiRange / binCount;
            const histogram = new Array(binCount).fill(0);

            for (const ibi of ibiValues) {
                const binIndex = Math.min(Math.floor((ibi - minIBI) / binSize), binCount - 1);
                histogram[binIndex]++;
            }

            // Find the bin with maximum count (mode)
            const maxCount = Math.max(...histogram);
            const totalCount = ibiValues.length;

            // Triangular index = total count / maximum count
            this.metrics.triangularIndex = totalCount / maxCount;
        } else {
            this.metrics.triangularIndex = 0;
        }

        // Stress Index - Based on HRV and heart rate
        const meanIBI = this.metrics.meanIBI;
        const heartRate = 60000 / meanIBI; // Convert to BPM

        // Stress index formula: (amplitude * 1000) / (2 * mode * range)
        const amplitude = this.metrics.sdnn;
        const mode = this.metrics.triangularIndex > 0 ? this.metrics.triangularIndex : 1;
        const stressRange = Math.max(1, maxIBI - minIBI);

        this.metrics.stressIndex = (amplitude * 1000) / (2 * mode * stressRange);

        // Vagal Tone - Estimation based on RMSSD and HF power
        // Higher RMSSD and HF power indicate higher vagal tone
        const rmssdScore = Math.min(100, (this.metrics.rmssd / 100) * 100);
        const hfScore = Math.min(100, (this.metrics.hfPower / 100) * 100);

        this.metrics.vagalTone = Math.round((rmssdScore + hfScore) / 2);
    }

    // Calculate frequency domain metrics (simplified FFT)
    private calculateFrequencyMetrics(ibiValues: number[]): void {
        // Simplified frequency analysis using power spectral density
        // In a real implementation, you'd use FFT or Lomb-Scargle periodogram

        // For now, use time-domain approximations
        const meanIBI = this.metrics.meanIBI;
        const ibiVariability = this.metrics.sdnn;

        // Approximate LF and HF power based on IBI variability
        this.metrics.lfPower = ibiVariability * 0.6; // ~60% of variability in LF band
        this.metrics.hfPower = ibiVariability * 0.4; // ~40% of variability in HF band

        this.metrics.lfHfRatio = this.metrics.hfPower > 0 ? this.metrics.lfPower / this.metrics.hfPower : 1;
    }

    // Calculate heart rate coherence
    private calculateCoherence(): void {
        // Coherence is a measure of heart rate variability pattern
        // Higher HRV with regular patterns indicates better coherence

        const hrvScore = Math.min(100, (this.metrics.sdnn / 100) * 100);
        const regularityScore = Math.max(0, 100 - this.metrics.artifactCount * 5);
        const balanceScore = this.metrics.lfHfRatio > 0.5 && this.metrics.lfHfRatio < 2.0 ? 100 : 50;

        this.metrics.coherence = Math.round((hrvScore + regularityScore + balanceScore) / 3);
    }

    // Get current metrics
    public getMetrics(): ECGMetrics {
        return { ...this.metrics };
    }

    // Get signal quality assessment
    public getSignalQuality(): { quality: string; description: string } {
        const quality = this.metrics.signalQuality;

        if (quality >= 80) {
            return { quality: "Excellent", description: "High-quality ECG signal with minimal noise" };
        } else if (quality >= 60) {
            return { quality: "Good", description: "Good signal quality with some noise" };
        } else if (quality >= 40) {
            return { quality: "Fair", description: "Moderate signal quality, artifacts detected" };
        } else {
            return { quality: "Poor", description: "Low signal quality, significant artifacts" };
        }
    }

    // Reset processor state
    public reset(): void {
        this.ecgBuffer = [];
        this.ibiBuffer = [];
        this.metrics = {
            signalQuality: 0,
            noiseLevel: 0,
            artifactCount: 0,
            validBeats: 0,
            meanIBI: 0,
            sdnn: 0,
            rmssd: 0,
            pnn50: 0,
            lfPower: 0,
            hfPower: 0,
            lfHfRatio: 0,
            coherence: 0,

            // Additional HRV metrics for medical analysis
            nn50: 0,
            triangularIndex: 0,
            stressIndex: 0,
            vagalTone: 0,
        };
    }

    // Update configuration
    public updateConfig(newConfig: Partial<ECGQualityConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

// Utility functions for ECG analysis
export const ecgUtils = {
    // Calculate moving average for smoothing
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

    // Detect R-peaks using simple threshold method (backup to Pan-Tompkins)
    detectRPeaks: (data: number[], threshold: number): number[] => {
        const peaks = [];
        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > threshold && data[i] > data[i - 1] && data[i] > data[i + 1]) {
                peaks.push(i);
            }
        }
        return peaks;
    },

    // Calculate IBI from R-peak indices
    calculateIBI: (peakIndices: number[], samplingRate: number): number[] => {
        const ibi = [];
        for (let i = 1; i < peakIndices.length; i++) {
            const interval = ((peakIndices[i] - peakIndices[i - 1]) / samplingRate) * 1000; // Convert to ms
            ibi.push(interval);
        }
        return ibi;
    },
};
