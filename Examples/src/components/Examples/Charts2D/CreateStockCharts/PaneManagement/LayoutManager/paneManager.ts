import {
    SciChartSurface,
    SciChartJsNavyTheme,
    TSciChart,
    Rect,
    SciChartVerticalGroup,
    SmartDateLabelProvider,
} from "scichart";

import {
    ChartManager,
    AxisSynchroniser,
    IChartDataConfig,
    IChartPositionConfig,
    IPaneManagementConfig,
    IPanelCallbacks,
    IPanelEventData,
    IPanelResizeEventData,
    IPanelMoveEventData,
    IPanelMaximizeEventData,
    IPanelRemovalEventData,
} from "./chartManager";

import { LayoutManager } from "./layoutManager";
import { ControlsManager } from "./controlsManager";

/**
 * PaneManager orchestrates chart creation, layout management, and UI controls
 */
export class PaneManager {
    private chartManager: ChartManager;
    private layoutManager: LayoutManager;
    private controlsManager: ControlsManager;
    private axisSynchronizer: AxisSynchroniser;
    private parentSurface: SciChartSurface;
    private callbacks: IPanelCallbacks = {};
    private verticalGroup: SciChartVerticalGroup;

    constructor(private containerElement: HTMLElement, parentSurface: SciChartSurface, wasmContext: TSciChart) {
        this.parentSurface = parentSurface;
        this.chartManager = new ChartManager(wasmContext);
        this.layoutManager = new LayoutManager(containerElement);
        this.controlsManager = new ControlsManager(containerElement);
        this.axisSynchronizer = new AxisSynchroniser();
        this.verticalGroup = new SciChartVerticalGroup();

        // Set up layout change callback
        this.layoutManager.setLayoutChangeCallback(() => {
            this.updateLayout();
        });

        // Set up panel resize callback
        this.layoutManager.setPanelResizeCallback((visualIndex, oldSize, newSize, splitterIndex) => {
            this.triggerResizeCallback(visualIndex, oldSize, newSize, splitterIndex);
        });
    }

    /**
     * Initialize the pane manager with configuration
     */
    async initialize(config?: IPaneManagementConfig): Promise<void> {
        // Store callbacks if provided
        if (config?.callbacks) {
            this.callbacks = { ...config.callbacks };
        }

        // Validate configuration if provided
        if (config && !ChartManager.validatePaneManagementConfig(config)) {
            console.warn("Invalid configuration provided, using defaults");
            config = undefined;
        }

        // Create initial charts based on configuration or defaults
        if (config?.charts && config?.positions) {
            // Use provided configuration
            const normalizedPositions = ChartManager.normalizePositionHeights(config.positions);
            const chartCount = Math.min(config.charts.length, normalizedPositions.length);

            this.layoutManager.initializePanelSizes(chartCount, normalizedPositions);

            for (let i = 0; i < chartCount; i++) {
                await this.addChartInternal(config.charts[i], normalizedPositions[i]);
            }
        } else if (config?.charts) {
            // Use provided chart data with equal height distribution
            this.layoutManager.initializePanelSizes(config.charts.length);

            for (const chartConfig of config.charts) {
                await this.addChartInternal(chartConfig);
            }
        } else if (config?.positions) {
            // Use provided positions with random data
            const normalizedPositions = ChartManager.normalizePositionHeights(config.positions);
            this.layoutManager.initializePanelSizes(normalizedPositions.length, normalizedPositions);

            for (const positionConfig of normalizedPositions) {
                await this.addChartInternal(undefined, positionConfig);
            }
        } else {
            // Default behavior: create initial charts
            const initialCount = config?.initialChartCount ?? 2;
            this.layoutManager.initializePanelSizes(initialCount);

            for (let i = 0; i < initialCount; i++) {
                await this.addChartInternal();
            }
        }

        this.updateLayout();
    }

    /**
     * Add a new chart
     */
    async addChart(chartConfig?: IChartDataConfig, positionConfig?: IChartPositionConfig): Promise<void> {
        this.layoutManager.addPanel(positionConfig?.height);
        await this.addChartInternal(chartConfig, positionConfig);
        this.updateLayout();
    }

    /**
     * Internal method to add a chart without updating layout
     */
    private async addChartInternal(
        chartConfig?: IChartDataConfig,
        positionConfig?: IChartPositionConfig
    ): Promise<void> {
        const panelSizes = this.layoutManager.getPanelSizes();
        const chartIndex = panelSizes.length - 1;

        // Calculate position for the new chart
        const yPos = panelSizes.slice(0, chartIndex).reduce((a, b) => a + b, 0);
        const height = panelSizes[chartIndex];
        const position = new Rect(0, yPos, 1, height);

        // Create the chart without x-axis labels initially (they will be set correctly in updateLayout)
        const chart = await this.chartManager.createChart(this.parentSurface, chartConfig, position, false);

        // Wait for chart to be fully initialized before adding to groups
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Add chart to vertical group for synchronization
        this.verticalGroup.addSurfaceToGroup(chart);

        // Add X-axis to synchronizer if sync is enabled (with delay to ensure axes are ready)
        setTimeout(() => {
            const xAxis = this.chartManager.getXAxis(chart);
            if (xAxis) {
                this.axisSynchronizer.addAxis(xAxis);
            }
        }, 100);
    }

    /**
     * Remove a chart at the specified visual index
     */
    removeChart(visualIndex: number): void {
        const chartOrder = this.layoutManager.getChartOrder();

        if (visualIndex < 0 || visualIndex >= chartOrder.length) return;
        if (chartOrder.length <= 1) return; // Keep at least one chart

        // Get the actual chart index from the visual position
        const actualChartIndex = chartOrder[visualIndex];
        const chartToRemove = this.parentSurface.subCharts[actualChartIndex];

        // Extract chart configuration before removal for callback
        let removedChartConfig: IChartDataConfig | undefined;
        try {
            removedChartConfig = this.chartManager.extractChartConfiguration(chartToRemove, visualIndex);
        } catch (error) {
            console.warn("Could not extract chart configuration for removal callback:", error);
        }

        // Remove axis from synchronizer before removing chart
        const xAxis = this.chartManager.getXAxis(chartToRemove);
        if (xAxis) {
            this.axisSynchronizer.removeAxis(xAxis);
        }

        // Remove chart from parent surface
        this.parentSurface.removeSubChart(chartToRemove);

        // Update layout manager
        this.layoutManager.removePanel(visualIndex);

        // Trigger removal callback
        this.triggerRemovalCallback(visualIndex, actualChartIndex, removedChartConfig);

        this.updateLayout();
    }

    /**
     * Move a chart up in the visual order
     */
    moveChartUp(visualIndex: number): void {
        if (this.layoutManager.moveChartUp(visualIndex)) {
            // Trigger move callback
            this.triggerMoveCallback(visualIndex, visualIndex - 1, "up");
            this.updateLayout();
        }
    }

    /**
     * Move a chart down in the visual order
     */
    moveChartDown(visualIndex: number): void {
        if (this.layoutManager.moveChartDown(visualIndex)) {
            // Trigger move callback
            this.triggerMoveCallback(visualIndex, visualIndex + 1, "down");
            this.updateLayout();
        }
    }

    /**
     * Toggle full-screen mode for a chart
     */
    toggleFullScreen(visualIndex: number): void {
        const wasMaximized =
            this.layoutManager.isInFullScreen() && this.layoutManager.getFullScreenChartIndex() === visualIndex;

        this.layoutManager.toggleFullScreen(visualIndex);

        const isMaximized =
            this.layoutManager.isInFullScreen() && this.layoutManager.getFullScreenChartIndex() === visualIndex;

        // Trigger maximize callback
        this.triggerMaximizeCallback(visualIndex, isMaximized, wasMaximized);

        this.updateLayout();
    }

    /**
     * Update the entire layout (positions, grid, splitters, controls)
     */
    private updateLayout(): void {
        // Update chart positions
        this.layoutManager.updateChartPositions(this.parentSurface);

        // Update grid template
        this.layoutManager.updateGridTemplate();

        // Rebuild splitters
        this.layoutManager.rebuildSplitters(this.parentSurface, this.axisSynchronizer);

        // Update control buttons
        this.updateControlButtons();

        // Update chart visibility for full-screen mode
        this.updateChartVisibility();

        // Update x-axis labels to ensure only bottom chart shows them
        this.updateXAxisLabels();
    }

    /**
     * Update control buttons
     */
    private updateControlButtons(): void {
        const chartOrder = this.layoutManager.getChartOrder();
        const panelSizes = this.layoutManager.getPanelSizes();
        const isFullScreen = this.layoutManager.isInFullScreen();
        const fullScreenChartIndex = this.layoutManager.getFullScreenChartIndex();

        this.controlsManager.updateAllButtons(
            this.parentSurface,
            chartOrder,
            panelSizes,
            isFullScreen,
            fullScreenChartIndex,
            (visualIndex) => this.removeChart(visualIndex),
            (visualIndex) => this.moveChartUp(visualIndex),
            (visualIndex) => this.moveChartDown(visualIndex),
            (visualIndex) => this.toggleFullScreen(visualIndex)
        );
    }

    /**
     * Update chart visibility based on full-screen state
     */
    private updateChartVisibility(): void {
        const isFullScreen = this.layoutManager.isInFullScreen();
        const fullScreenChartIndex = this.layoutManager.getFullScreenChartIndex();
        const chartOrder = this.layoutManager.getChartOrder();

        if (isFullScreen) {
            // Hide all charts except the full-screen one
            for (let i = 0; i < chartOrder.length; i++) {
                const actualChartIndex = chartOrder[i];
                const chart = this.parentSurface.subCharts[actualChartIndex];
                chart.isVisible = i === fullScreenChartIndex;
            }
        } else {
            // Show all charts
            for (const chart of this.parentSurface.subCharts) {
                chart.isVisible = true;
            }
        }
    }

    /**
     * Update x-axis labels to ensure only the bottom chart shows them
     */
    private updateXAxisLabels(): void {
        const chartOrder = this.layoutManager.getChartOrder();
        const isFullScreen = this.layoutManager.isInFullScreen();

        if (isFullScreen) {
            // In full-screen mode, show labels on the maximized chart
            const fullScreenChartIndex = this.layoutManager.getFullScreenChartIndex();
            for (let i = 0; i < chartOrder.length; i++) {
                const actualChartIndex = chartOrder[i];
                const chart = this.parentSurface.subCharts[actualChartIndex];
                const shouldShowLabels = i === fullScreenChartIndex;
                this.updateChartXAxisLabels(chart, shouldShowLabels);
            }
        } else {
            // In normal mode, show labels only on the bottom chart
            for (let i = 0; i < chartOrder.length; i++) {
                const actualChartIndex = chartOrder[i];
                const chart = this.parentSurface.subCharts[actualChartIndex];
                const isBottomChart = i === chartOrder.length - 1;
                this.updateChartXAxisLabels(chart, isBottomChart);
            }
        }
    }

    /**
     * Update x-axis labels for a specific chart
     */
    private updateChartXAxisLabels(chart: any, showLabels: boolean): void {
        if (chart && chart.xAxes && chart.xAxes.size() > 0) {
            const xAxis = chart.xAxes.get(0);
            if (xAxis) {
                xAxis.drawLabels = showLabels;
                xAxis.drawMajorTickLines = showLabels;
                xAxis.drawMinorTickLines = showLabels;

                // Add SmartDateLabelProvider for trading charts when showing labels
                if (showLabels && !xAxis.labelProvider) {
                    try {
                        xAxis.labelProvider = new SmartDateLabelProvider();
                    } catch (error) {
                        console.warn("Could not set SmartDateLabelProvider:", error);
                    }
                }
                // Note: We don't set labelProvider to undefined when hiding labels
                // as this can cause issues with the axis configuration
            }
        }
    }

    /**
     * Add a chart with custom data using a simplified API
     */
    async addChartWithData(
        xValues: number[],
        yValues: number[],
        options?: Partial<IChartDataConfig & IChartPositionConfig>
    ): Promise<void> {
        const chartConfig: IChartDataConfig = {
            xValues,
            yValues,
            title: options?.title,
            color: options?.color,
            strokeThickness: options?.strokeThickness,
            xAxisTitle: options?.xAxisTitle,
            yAxisTitle: options?.yAxisTitle,
            chartType: options?.chartType,
            pointMarkerSize: options?.pointMarkerSize,
            pointMarkerFill: options?.pointMarkerFill,
            pointMarkerStroke: options?.pointMarkerStroke,
        };

        const positionConfig: IChartPositionConfig | undefined = options?.height
            ? { height: options.height }
            : undefined;

        await this.addChart(chartConfig, positionConfig);
    }

    /**
     * Extract current configuration for saving
     */
    getConfiguration(): IPaneManagementConfig {
        const charts: IChartDataConfig[] = [];
        const positions: IChartPositionConfig[] = [];
        const chartOrder = this.layoutManager.getChartOrder();
        const panelSizes = this.layoutManager.getPanelSizes();

        // Extract configuration for each chart in visual order
        for (let visualIndex = 0; visualIndex < chartOrder.length; visualIndex++) {
            const actualChartIndex = chartOrder[visualIndex];
            const chart = this.parentSurface.subCharts[actualChartIndex];

            if (!chart || !chart.renderableSeries || chart.renderableSeries.size() === 0) {
                continue;
            }

            try {
                const chartConfig = this.chartManager.extractChartConfiguration(chart, visualIndex);
                charts.push(chartConfig);

                // Extract position configuration
                const rawHeight = panelSizes[visualIndex];
                const defaultHeight = 1 / chartOrder.length;
                const heightNumber =
                    typeof rawHeight === "number" && !isNaN(rawHeight)
                        ? Math.floor(rawHeight * 100) / 100
                        : Math.floor(defaultHeight * 100) / 100;
                positions.push({
                    height: heightNumber,
                });
            } catch (error) {
                console.warn(`Failed to extract configuration for chart ${visualIndex}:`, error);
            }
        }

        return {
            charts,
            positions,
            syncXAxes: true, // Assuming X-axes are synchronized
        };
    }

    /**
     * Save configuration as JSON file
     */
    saveConfiguration(): void {
        try {
            const config = this.getConfiguration();

            // Create JSON string with proper formatting
            const jsonString = JSON.stringify(config, null, 2);

            // Create blob and download link
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            // Create temporary download link
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `chart-configuration-${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/:/g, "-")}.json`;

            // Trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up URL object
            URL.revokeObjectURL(url);

            console.log("Chart configuration saved successfully");
        } catch (error) {
            console.error("Error saving chart configuration:", error);
            alert("Failed to save chart configuration. Please check the console for details.");
        }
    }

    /**
     * Load configuration from object
     */
    loadConfiguration(config: IPaneManagementConfig): boolean {
        try {
            // Validate the loaded configuration
            if (!ChartManager.validatePaneManagementConfig(config)) {
                throw new Error("Invalid configuration format");
            }

            // Clear existing charts
            const existingCharts = [...this.parentSurface.subCharts];
            for (const chart of existingCharts) {
                // Remove axis from synchronizer
                const xAxis = this.chartManager.getXAxis(chart);
                if (xAxis) {
                    this.axisSynchronizer.removeAxis(xAxis);
                }
                this.parentSurface.removeSubChart(chart);
            }

            // Reinitialize with new configuration
            this.initialize(config);

            console.log("Chart configuration loaded successfully");
            return true;
        } catch (error) {
            console.error("Error loading chart configuration:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            alert(`Failed to load chart configuration: ${errorMessage}`);
            return false;
        }
    }

    /**
     * Load configuration from file
     */
    loadConfigurationFromFile(file: File): void {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const jsonString = event.target?.result as string;
                const config: IPaneManagementConfig = JSON.parse(jsonString);
                this.loadConfiguration(config);
            } catch (error) {
                console.error("Error parsing JSON file:", error);
                alert("Failed to parse JSON file. Please ensure it contains valid chart configuration data.");
            }
        };

        reader.onerror = () => {
            console.error("Error reading file");
            alert("Failed to read the selected file.");
        };

        reader.readAsText(file);
    }

    /**
     * Helper method to create base event data
     */
    private createBaseEventData(visualIndex: number): IPanelEventData {
        const chartOrder = this.layoutManager.getChartOrder();
        const panelSizes = this.layoutManager.getPanelSizes();
        const actualChartIndex = chartOrder[visualIndex] ?? visualIndex;

        return {
            visualIndex,
            actualChartIndex,
            panelSizes: [...panelSizes],
            chartOrder: [...chartOrder],
        };
    }

    /**
     * Trigger removal callback
     */
    private triggerRemovalCallback(
        visualIndex: number,
        actualChartIndex: number,
        removedChartConfig?: IChartDataConfig
    ): void {
        if (this.callbacks.onPanelRemoval) {
            const eventData: IPanelRemovalEventData = {
                ...this.createBaseEventData(visualIndex),
                removedChartConfig,
            };
            this.callbacks.onPanelRemoval(eventData);
        }
    }

    /**
     * Trigger move callback
     */
    private triggerMoveCallback(fromIndex: number, toIndex: number, direction: "up" | "down"): void {
        if (this.callbacks.onPanelMove) {
            const eventData: IPanelMoveEventData = {
                ...this.createBaseEventData(fromIndex),
                fromIndex,
                toIndex,
                direction,
            };
            this.callbacks.onPanelMove(eventData);
        }
    }

    /**
     * Trigger maximize callback
     */
    private triggerMaximizeCallback(visualIndex: number, isMaximized: boolean, wasMaximized: boolean): void {
        if (this.callbacks.onPanelMaximize) {
            const eventData: IPanelMaximizeEventData = {
                ...this.createBaseEventData(visualIndex),
                isMaximized,
                wasMaximized,
            };
            this.callbacks.onPanelMaximize(eventData);
        }
    }

    /**
     * Trigger resize callback
     */
    private triggerResizeCallback(visualIndex: number, oldSize: number, newSize: number, splitterIndex: number): void {
        if (this.callbacks.onPanelResize) {
            const eventData: IPanelResizeEventData = {
                ...this.createBaseEventData(visualIndex),
                oldSize,
                newSize,
                splitterIndex,
            };
            this.callbacks.onPanelResize(eventData);
        }
    }

    /**
     * Set or update callbacks
     */
    setCallbacks(callbacks: IPanelCallbacks): void {
        this.callbacks = { ...callbacks };
    }

    /**
     * Get current callbacks
     */
    getCallbacks(): IPanelCallbacks {
        return { ...this.callbacks };
    }

    /**
     * Clean up resources
     */
    cleanup(): void {
        this.layoutManager.cleanup();
        this.controlsManager.removeAllButtons();

        // Note: SciChartVerticalGroup automatically handles cleanup when surfaces are deleted
    }
}
