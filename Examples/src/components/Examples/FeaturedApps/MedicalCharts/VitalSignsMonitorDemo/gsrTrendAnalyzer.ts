// GSR Trend Analyzer for Stress Level Detection
// Analyzes recent GSR values to determine if stress is increasing or decreasing

export interface GSRTrend {
    direction: "increasing" | "decreasing" | "stable";
    magnitude: number; // 0-1, how strong the trend is
    confidence: number; // 0-1, confidence in the trend
    stressLevel: "low" | "moderate" | "high";
    recommendation: string;
}

export interface GSRDataPoint {
    value: number;
    timestamp: number;
}

export interface GSRConfig {
    windowSize: number; // Number of recent points to analyze
    trendThreshold: number; // Minimum change to consider a trend
    stressThresholds: {
        low: number;
        moderate: number;
        high: number;
    };
    smoothingWindow: number; // Moving average window for noise reduction
}

export class GSRTrendAnalyzer {
    private config: GSRConfig;
    private dataBuffer: GSRDataPoint[] = [];
    private smoothedBuffer: number[] = [];
    private lastTrend: GSRTrend | null = null;

    constructor(config: Partial<GSRConfig> = {}) {
        this.config = {
            windowSize: 10, // Analyze last 10 points for 10Hz GSR data (1 second)
            trendThreshold: 0.03, // 3% change threshold for more sensitivity
            stressThresholds: {
                low: 0.3,
                moderate: 0.6,
                high: 0.8,
            },
            smoothingWindow: 3, // 3-point moving average for more responsiveness
            ...config,
        };
    }

    // Add new GSR data point
    public addDataPoint(value: number, timestamp: number): void {
        this.dataBuffer.push({ value, timestamp });

        // Keep only recent data
        if (this.dataBuffer.length > this.config.windowSize) {
            this.dataBuffer.shift();
        }

        // Update smoothed buffer
        this.updateSmoothedBuffer();

        // Analyze trend if we have enough data
        if (this.dataBuffer.length >= this.config.smoothingWindow) {
            this.analyzeTrend();
        }
    }

    // Update smoothed buffer using moving average
    private updateSmoothedBuffer(): void {
        this.smoothedBuffer = [];

        for (let i = 0; i < this.dataBuffer.length; i++) {
            if (i < this.config.smoothingWindow - 1) {
                // For the first few points, use available data
                const availableData = this.dataBuffer.slice(0, i + 1);
                const sum = availableData.reduce((acc, d) => acc + d.value, 0);
                this.smoothedBuffer.push(sum / availableData.length);
            } else {
                // Moving average
                const window = this.dataBuffer.slice(i - this.config.smoothingWindow + 1, i + 1);
                const sum = window.reduce((acc, d) => acc + d.value, 0);
                this.smoothedBuffer.push(sum / this.config.smoothingWindow);
            }
        }
    }

    // Analyze trend in recent GSR data
    private analyzeTrend(): void {
        if (this.smoothedBuffer.length < 8) return; // Need at least 8 points

        const recentValues = this.smoothedBuffer.slice(-8); // Last 8 smoothed values for more responsive detection
        const currentValue = recentValues[recentValues.length - 1];
        const previousValue = recentValues[0];

        // Calculate trend direction and magnitude
        const change = currentValue - previousValue;
        // Division by zero protection
        const changePercent = previousValue !== 0 ? Math.abs(change) / previousValue : 0;

        let direction: "increasing" | "decreasing" | "stable";
        let magnitude: number;
        let confidence: number;

        if (changePercent < this.config.trendThreshold) {
            direction = "stable";
            magnitude = changePercent / this.config.trendThreshold;
            confidence = 0.3; // Low confidence for stable trend
        } else {
            direction = change > 0 ? "increasing" : "decreasing";
            magnitude = Math.min(1.0, changePercent / this.config.trendThreshold);
            confidence = Math.min(1.0, magnitude * 2); // Higher confidence for stronger trends
        }

        // Determine stress level based on current value
        const stressLevel = this.determineStressLevel(currentValue);

        // Generate recommendation
        const recommendation = this.generateRecommendation(direction, stressLevel, magnitude);

        this.lastTrend = {
            direction,
            magnitude,
            confidence,
            stressLevel,
            recommendation,
        };
    }

    // Determine stress level based on GSR value
    private determineStressLevel(value: number): "low" | "moderate" | "high" {
        if (value <= this.config.stressThresholds.low) {
            return "low";
        } else if (value <= this.config.stressThresholds.moderate) {
            return "moderate";
        } else {
            return "high";
        }
    }

    // Generate recommendation based on trend and stress level
    private generateRecommendation(
        direction: "increasing" | "decreasing" | "stable",
        stressLevel: "low" | "moderate" | "high",
        magnitude: number
    ): string {
        if (direction === "decreasing") {
            if (stressLevel === "high") {
                return "Stress decreasing - good progress!";
            } else if (stressLevel === "moderate") {
                return "Stress decreasing - continue relaxation techniques";
            } else {
                return "Stress decreasing - maintaining low stress level";
            }
        } else if (direction === "increasing") {
            if (stressLevel === "high") {
                return "Stress increasing - consider immediate intervention";
            } else if (stressLevel === "moderate") {
                return "Stress increasing - try deep breathing exercises";
            } else {
                return "Stress increasing - monitor closely";
            }
        } else {
            if (stressLevel === "high") {
                return "Stress stable but high - intervention recommended";
            } else if (stressLevel === "moderate") {
                return "Stress stable - continue current approach";
            } else {
                return "Stress stable and low - excellent!";
            }
        }
    }

    // Get current trend analysis
    public getTrend(): GSRTrend | null {
        return this.lastTrend;
    }

    // Get trend indicator for UI (green/red arrow)
    public getTrendIndicator(): {
        color: string;
        symbol: string;
        tooltip: string;
    } {
        if (!this.lastTrend) {
            return {
                color: "#666",
                symbol: "●",
                tooltip: "Insufficient data for trend analysis",
            };
        }

        const { direction, magnitude, confidence, stressLevel } = this.lastTrend;

        if (direction === "decreasing") {
            return {
                color: "#4CAF50", // Green
                symbol: "↓",
                tooltip: `Stress decreasing (${(magnitude * 100).toFixed(0)}% confidence)`,
            };
        } else if (direction === "increasing") {
            return {
                color: "#F44336", // Red
                symbol: "↑",
                tooltip: `Stress increasing (${(magnitude * 100).toFixed(0)}% confidence)`,
            };
        } else {
            return {
                color: "#FF9800", // Orange
                symbol: "→",
                tooltip: `Stress stable (${(magnitude * 100).toFixed(0)}% confidence)`,
            };
        }
    }

    // Get stress level indicator
    public getStressIndicator(): {
        color: string;
        level: string;
        description: string;
    } {
        if (!this.lastTrend) {
            return {
                color: "#666",
                level: "Unknown",
                description: "Insufficient data",
            };
        }

        const { stressLevel } = this.lastTrend;

        switch (stressLevel) {
            case "low":
                return {
                    color: "#4CAF50",
                    level: "Low",
                    description: "Normal stress level",
                };
            case "moderate":
                return {
                    color: "#FF9800",
                    level: "Moderate",
                    description: "Elevated stress level",
                };
            case "high":
                return {
                    color: "#F44336",
                    level: "High",
                    description: "High stress level - intervention recommended",
                };
            default:
                return {
                    color: "#666",
                    level: "Unknown",
                    description: "Unable to determine",
                };
        }
    }

    // Get recent GSR statistics
    public getStatistics(): {
        currentValue: number;
        averageValue: number;
        minValue: number;
        maxValue: number;
        variability: number;
    } {
        if (this.dataBuffer.length === 0) {
            return {
                currentValue: 0,
                averageValue: 0,
                minValue: 0,
                maxValue: 0,
                variability: 0,
            };
        }

        const values = this.dataBuffer.map((d) => d.value);
        if (values.length === 0) {
            return {
                currentValue: 0,
                averageValue: 0,
                minValue: 0,
                maxValue: 0,
                variability: 0,
            };
        }

        const currentValue = values[values.length - 1];
        const averageValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const variability = maxValue - minValue;

        return {
            currentValue,
            averageValue,
            minValue,
            maxValue,
            variability,
        };
    }

    // Reset analyzer
    public reset(): void {
        this.dataBuffer = [];
        this.smoothedBuffer = [];
        this.lastTrend = null;
    }

    // Update configuration
    public updateConfig(newConfig: Partial<GSRConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}
