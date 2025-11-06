import { SciChartSurface, SciChartJsNavyTheme } from "scichart";
import { PaneManager } from "./LayoutManager/paneManager";
import {
    IChartDataConfig,
    IChartPositionConfig,
    IPaneManagementConfig,
    EChartType,
    IPanelCallbacks
} from "./LayoutManager/chartManager";

// Re-export types for backward compatibility
export { EChartType, IChartDataConfig, IChartPositionConfig, IPaneManagementConfig };

// Global reference to the pane manager for button handlers
let globalPaneManager: PaneManager | null = null;

/**
 * Simplified drawExample function using the new PaneManager architecture
 */
export async function drawExample(
    divElementId: string | HTMLDivElement, 
    config?: IPaneManagementConfig
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

    // Create and initialize the pane manager
    const paneManager = new PaneManager(containerElement, sciChartSurface, wasmContext);
    await paneManager.initialize(config);

    // Store global reference for button handlers
    globalPaneManager = paneManager;

    // Wire up button handlers with error handling
    setupButtonHandlers(paneManager);

    // Add cleanup function to the surface for proper resource management
    const originalDelete = sciChartSurface.delete.bind(sciChartSurface);
    sciChartSurface.delete = () => {
        // Clean up pane manager resources
        paneManager.cleanup();
        globalPaneManager = null;

        // Call original delete
        originalDelete();
    };

    // Return the API for external use
    return {
        sciChartSurface,
        addChart: (chartConfig?: IChartDataConfig, positionConfig?: IChartPositionConfig) =>
            paneManager.addChart(chartConfig, positionConfig),
        removeChart: (index: number) => paneManager.removeChart(index),
        
        // Additional utility functions for configuration-based usage
        addChartWithData: (
            xValues: number[],
            yValues: number[],
            options?: Partial<IChartDataConfig & IChartPositionConfig>
        ) => paneManager.addChartWithData(xValues, yValues, options),
        
        // Save/load configuration functionality
        saveConfiguration: () => paneManager.saveConfiguration(),
        getConfiguration: () => paneManager.getConfiguration(),
        loadConfiguration: (config: IPaneManagementConfig) => paneManager.loadConfiguration(config),
        loadConfigurationFromFile: (file: File) => paneManager.loadConfigurationFromFile(file),
        
        // Callback management
        setCallbacks: (callbacks: IPanelCallbacks) => paneManager.setCallbacks(callbacks),
        getCallbacks: () => paneManager.getCallbacks(),
        
        // Individual callback setters for convenience
        onPanelResize: (callback: IPanelCallbacks['onPanelResize']) =>
            paneManager.setCallbacks({ ...paneManager.getCallbacks(), onPanelResize: callback }),
        onPanelMove: (callback: IPanelCallbacks['onPanelMove']) =>
            paneManager.setCallbacks({ ...paneManager.getCallbacks(), onPanelMove: callback }),
        onPanelMaximize: (callback: IPanelCallbacks['onPanelMaximize']) =>
            paneManager.setCallbacks({ ...paneManager.getCallbacks(), onPanelMaximize: callback }),
        onPanelRemoval: (callback: IPanelCallbacks['onPanelRemoval']) =>
            paneManager.setCallbacks({ ...paneManager.getCallbacks(), onPanelRemoval: callback }),
    };
}

/**
 * Set up button event handlers
 */
function setupButtonHandlers(paneManager: PaneManager): void {
    const addChartBtn = document.getElementById("addChartBtn");
    const removeChartBtn = document.getElementById("removeChartBtn");

    if (addChartBtn) {
        addChartBtn.onclick = async () => {
            if (globalPaneManager) {
                await globalPaneManager.addChart();
            }
        };
    }
    // Removed warning for addChartBtn as it's not used in this example

    if (removeChartBtn) {
        removeChartBtn.onclick = () => {
            if (globalPaneManager) {
                // Remove the last chart (for backward compatibility)
                const config = globalPaneManager.getConfiguration();
                const lastIndex = (config.charts?.length ?? 1) - 1;
                if (lastIndex >= 0) {
                    globalPaneManager.removeChart(lastIndex);
                }
            }
        };
    }
    // Removed warning for removeChartBtn as it's handled by the UI controls
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

export function validatePaneManagementConfig(config: IPaneManagementConfig): boolean {
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
