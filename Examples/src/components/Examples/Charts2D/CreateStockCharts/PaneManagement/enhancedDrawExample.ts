import { SciChartSurface, SciChartJsNavyTheme } from "scichart";
import { EnhancedPaneManager, IEnhancedPaneManagementConfig } from "./LayoutManager/enhancedPaneManager";
import {
    IChartDataConfig,
    IChartPositionConfig,
    EChartType,
    IPanelCallbacks
} from "./LayoutManager/chartManager";

// Re-export types for backward compatibility
export { EChartType, IChartDataConfig, IChartPositionConfig, IEnhancedPaneManagementConfig };

// Global reference to the enhanced pane manager for button handlers
let globalEnhancedPaneManager: EnhancedPaneManager | null = null;

/**
 * Enhanced drawExample function using the new EnhancedPaneManager with unified overview support
 */
export async function drawEnhancedExample(
    divElementId: string | HTMLDivElement, 
    config?: IEnhancedPaneManagementConfig
) {
    // Get container element
    const containerElement = typeof divElementId === "string" 
        ? document.getElementById(divElementId) 
        : divElementId;

    if (!containerElement) {
        throw new Error("Container element not found");
    }

    // Create the main SciChart surface
    const surfaceTheme = config?.theme ?? new SciChartJsNavyTheme();
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: surfaceTheme,
    });

    // Wait for surface to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create and initialize the enhanced pane manager
    const enhancedPaneManager = new EnhancedPaneManager(containerElement, sciChartSurface, wasmContext);
    await enhancedPaneManager.initialize(config);

    // Store global reference for button handlers
    globalEnhancedPaneManager = enhancedPaneManager;

    // Wire up button handlers with error handling
    setupEnhancedButtonHandlers(enhancedPaneManager);

    // Add cleanup function to the surface for proper resource management
    const originalDelete = sciChartSurface.delete.bind(sciChartSurface);
    sciChartSurface.delete = () => {
        // Clean up enhanced pane manager resources
        enhancedPaneManager.cleanup();
        globalEnhancedPaneManager = null;

        // Call original delete
        originalDelete();
    };

    // Return the enhanced API for external use
    return {
        sciChartSurface,
        enhancedPaneManager,
        
        // Chart management
        addChart: (chartConfig?: IChartDataConfig, positionConfig?: IChartPositionConfig) =>
            enhancedPaneManager.addChart(chartConfig, positionConfig),
        removeChart: (index: number) => enhancedPaneManager.removeChart(index),
        
        // Additional utility functions for configuration-based usage
        addChartWithData: (
            xValues: number[],
            yValues: number[],
            options?: Partial<IChartDataConfig & IChartPositionConfig>
        ) => enhancedPaneManager.addChartWithData(xValues, yValues, options),
        
        // Save/load configuration functionality
        saveConfiguration: () => enhancedPaneManager.saveConfiguration(),
        getConfiguration: () => enhancedPaneManager.getConfiguration(),
        loadConfiguration: (config: IEnhancedPaneManagementConfig) => enhancedPaneManager.loadConfiguration(config),
        loadConfigurationFromFile: (file: File) => enhancedPaneManager.loadConfigurationFromFile(file),
        
        // Callback management
        setCallbacks: (callbacks: IPanelCallbacks) => enhancedPaneManager.setCallbacks(callbacks),
        getCallbacks: () => enhancedPaneManager.getCallbacks(),
        
        // Individual callback setters for convenience
        onPanelResize: (callback: IPanelCallbacks['onPanelResize']) =>
            enhancedPaneManager.setCallbacks({ ...enhancedPaneManager.getCallbacks(), onPanelResize: callback }),
        onPanelMove: (callback: IPanelCallbacks['onPanelMove']) =>
            enhancedPaneManager.setCallbacks({ ...enhancedPaneManager.getCallbacks(), onPanelMove: callback }),
        onPanelMaximize: (callback: IPanelCallbacks['onPanelMaximize']) =>
            enhancedPaneManager.setCallbacks({ ...enhancedPaneManager.getCallbacks(), onPanelMaximize: callback }),
        onPanelRemoval: (callback: IPanelCallbacks['onPanelRemoval']) =>
            enhancedPaneManager.setCallbacks({ ...enhancedPaneManager.getCallbacks(), onPanelRemoval: callback }),
        
        // Overview-specific functionality
        getOverviewManager: () => enhancedPaneManager.getOverviewManager(),
        isOverviewEnabled: () => enhancedPaneManager.isOverviewEnabled(),
        setVisibleRange: (range: any) => enhancedPaneManager.setVisibleRange(range),
        getVisibleRange: () => enhancedPaneManager.getVisibleRange(),
    };
}

/**
 * Set up enhanced button event handlers
 */
function setupEnhancedButtonHandlers(enhancedPaneManager: EnhancedPaneManager): void {
    const addChartBtn = document.getElementById("addChartBtn");
    const removeChartBtn = document.getElementById("removeChartBtn");
    const addTradingChartBtn = document.getElementById("addTradingChartBtn");
    const toggleOverviewBtn = document.getElementById("toggleOverviewBtn");
    const zoomToRangeBtn = document.getElementById("zoomToRangeBtn");

    if (addChartBtn) {
        addChartBtn.onclick = async () => {
            if (globalEnhancedPaneManager) {
                await globalEnhancedPaneManager.addChart();
            }
        };
    }

    if (removeChartBtn) {
        removeChartBtn.onclick = () => {
            if (globalEnhancedPaneManager) {
                // Remove the last chart (for backward compatibility)
                const config = globalEnhancedPaneManager.getConfiguration();
                const lastIndex = (config.charts?.length ?? 1) - 1;
                if (lastIndex >= 0) {
                    globalEnhancedPaneManager.removeChart(lastIndex);
                }
            }
        };
    }

    // Add trading chart button
    if (addTradingChartBtn) {
        addTradingChartBtn.onclick = async () => {
            if (globalEnhancedPaneManager) {
                const tradingChartConfigs = [
                    { chartType: EChartType.PriceChart, title: "Price Chart" },
                    { chartType: EChartType.MacdChart, title: "MACD Indicator" },
                    { chartType: EChartType.RsiChart, title: "RSI Indicator" },
                ];
                
                const randomConfig = tradingChartConfigs[Math.floor(Math.random() * tradingChartConfigs.length)];
                await globalEnhancedPaneManager.addChart(randomConfig);
            }
        };
    }

    // Toggle overview visibility (if overview is enabled)
    if (toggleOverviewBtn) {
        toggleOverviewBtn.onclick = () => {
            if (globalEnhancedPaneManager && globalEnhancedPaneManager.isOverviewEnabled()) {
                const overviewManager = globalEnhancedPaneManager.getOverviewManager();
                const overviewSurface = overviewManager?.getOverviewSurface();
                
                if (overviewSurface) {
                    // Toggle visibility of overview surface
                    const currentVisibility = overviewSurface.domCanvas2D.style.display !== 'none';
                    overviewSurface.domCanvas2D.style.display = currentVisibility ? 'none' : 'block';
                    
                    const btn = toggleOverviewBtn as HTMLButtonElement;
                    btn.textContent = currentVisibility ? 'Show Overview' : 'Hide Overview';
                }
            }
        };
    }

    // Zoom to specific range
    if (zoomToRangeBtn) {
        zoomToRangeBtn.onclick = () => {
            if (globalEnhancedPaneManager && globalEnhancedPaneManager.isOverviewEnabled()) {
                // Import NumberRange dynamically to avoid circular dependencies
                import("scichart").then(({ NumberRange }) => {
                    const ranges = [
                        new NumberRange(0, 500),
                        new NumberRange(500, 1000),
                        new NumberRange(200, 800),
                        new NumberRange(0, 1000),
                    ];
                    
                    const randomRange = ranges[Math.floor(Math.random() * ranges.length)];
                    globalEnhancedPaneManager!.setVisibleRange(randomRange);
                    
                    console.log(`Zoomed to range: ${randomRange.min} - ${randomRange.max}`);
                });
            }
        };
    }
}

// Legacy function exports for backward compatibility
export function generateRandomData(count = 100): { xValues: number[]; yValues: number[] } {
    const xValues = [];
    const yValues = [];
    let currentValue = 50;

    for (let i = 0; i < count; i++) {
        xValues.push(i);
        currentValue += (Math.random() - 0.5) * 10;
        currentValue = Math.max(10, Math.min(90, currentValue));
        yValues.push(currentValue);
    }
    return { xValues, yValues };
}

// Helper functions for validation (re-exported from ChartManager for backward compatibility)
export function validateChartDataConfig(config: IChartDataConfig): boolean {
    if (!config.xValues || !config.yValues) return false;
    if (!Array.isArray(config.xValues) || !Array.isArray(config.yValues)) return false;
    if (config.xValues.length !== config.yValues.length) return false;
    if (config.xValues.length === 0) return false;
    return true;
}

export function validatePositionConfig(config: IChartPositionConfig): boolean {
    if (typeof config.height !== "number") return false;
    if (config.height <= 0 || config.height > 1) return false;
    return true;
}

export function validateEnhancedPaneManagementConfig(config: IEnhancedPaneManagementConfig): boolean {
    if (config.charts) {
        if (!Array.isArray(config.charts)) return false;
        for (const chartConfig of config.charts) {
            if (!validateChartDataConfig(chartConfig)) return false;
        }
    }

    if (config.positions) {
        if (!Array.isArray(config.positions)) return false;
        for (const posConfig of config.positions) {
            if (!validatePositionConfig(posConfig)) return false;
        }

        // Check if total height doesn't exceed 1
        const totalHeight = config.positions.reduce((sum, pos) => sum + pos.height, 0);
        if (totalHeight > 1) return false;
    }

    if (config.initialChartCount !== undefined) {
        if (typeof config.initialChartCount !== "number" || config.initialChartCount < 1) return false;
    }

    // Validate overview configuration
    if (config.overview) {
        if (config.overview.enabled && !config.overview.divId) {
            console.warn("Overview enabled but no divId provided");
            return false;
        }
    }

    return true;
}

export function normalizePositionHeights(positions: IChartPositionConfig[]): IChartPositionConfig[] {
    const totalHeight = positions.reduce((sum, pos) => sum + pos.height, 0);
    if (totalHeight <= 1) return positions;

    // Normalize heights to fit within 1
    return positions.map((pos) => ({
        ...pos,
        height: pos.height / totalHeight,
    }));
}

/**
 * Create a sample configuration with overview enabled
 */
export function createSampleConfigWithOverview(overviewDivId: string): IEnhancedPaneManagementConfig {
    return {
        initialChartCount: 3,
        overview: {
            enabled: true,
            divId: overviewDivId,
            config: {
                enableRangeSelection: true,
                showAxisLabels: true,
            }
        },
        charts: [
            { chartType: EChartType.PriceChart, title: "EUR/USD Price" },
            { chartType: EChartType.MacdChart, title: "MACD Indicator" },
            { chartType: EChartType.RsiChart, title: "RSI Indicator" },
        ],
        positions: [
            { height: 0.5 },
            { height: 0.3 },
            { height: 0.2 },
        ],
        callbacks: {
            onPanelResize: (data) => {
                console.log(`Panel ${data.visualIndex} resized from ${data.oldSize.toFixed(2)} to ${data.newSize.toFixed(2)}`);
            },
            onPanelMove: (data) => {
                console.log(`Panel moved from ${data.fromIndex} to ${data.toIndex} (${data.direction})`);
            },
            onPanelMaximize: (data) => {
                console.log(`Panel ${data.visualIndex} ${data.isMaximized ? 'maximized' : 'restored'}`);
            },
            onPanelRemoval: (data) => {
                console.log(`Panel ${data.visualIndex} removed`);
            },
        }
    };
}

/**
 * Create a sample configuration for MultiChart comparison
 */
export function createMultiChartComparisonConfig(): IEnhancedPaneManagementConfig {
    return {
        charts: [
            { 
                chartType: EChartType.Line, 
                title: "Line Chart",
                xValues: Array.from({length: 100}, (_, i) => i),
                yValues: Array.from({length: 100}, () => Math.random() * 100),
                color: "#FF6B6B"
            },
            { 
                chartType: EChartType.Scatter, 
                title: "Scatter Chart",
                xValues: Array.from({length: 50}, (_, i) => i * 2),
                yValues: Array.from({length: 50}, () => Math.random() * 100),
                color: "#4ECDC4",
                pointMarkerSize: 8
            },
            { 
                chartType: EChartType.PriceChart, 
                title: "Trading Chart",
                useTradingData: true
            },
        ],
        positions: [
            { height: 0.4 },
            { height: 0.3 },
            { height: 0.3 },
        ],
        overview: {
            enabled: true,
            divId: "comparison-overview",
        }
    };
}