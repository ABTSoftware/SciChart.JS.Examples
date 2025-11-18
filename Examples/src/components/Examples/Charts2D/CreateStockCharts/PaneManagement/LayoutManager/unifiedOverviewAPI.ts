import {
    SciChartSurface,
    SciChartSubSurface,
    ISciChartSubSurface,
    NumberRange,
    AxisBase2D,
    NumericAxis,
    CategoryAxis,
    IRenderableSeries,
    OverviewRangeSelectionModifier,
    EAutoRange,
    EAxisAlignment,
    TSciChart,
    buildSeries,
    EventHandler,
    VisibleRangeChangedArgs,
} from "scichart";

/**
 * Enumeration for chart types supported by the unified API
 */
export enum EUnifiedChartType {
    SubChart = "subchart",
    MultiChart = "multichart"
}

/**
 * Interface representing a chart reference in the unified system
 */
export interface IChartReference {
    id: string;
    surface: SciChartSurface | SciChartSubSurface;
    type: EUnifiedChartType;
    xAxis: AxisBase2D;
    series: IRenderableSeries[];
    isActive: boolean;
}

/**
 * Configuration options for the unified overview
 */
export interface IUnifiedOverviewConfig {
    theme?: any;
    initialVisibleRange?: NumberRange;
    enableRangeSelection?: boolean;
    showAxisLabels?: boolean;
    autoRange?: EAutoRange;
    growBy?: NumberRange;
}

/**
 * Event data for chart synchronization
 */
export interface IChartSyncEventData {
    sourceChartId: string;
    visibleRange: NumberRange;
    timestamp: number;
}

/**
 * Unified chart synchronizer that works with both SubCharts and MultiCharts
 */
export class UnifiedChartSynchronizer {
    private charts = new Map<string, IChartReference>();
    private visibleRange: NumberRange | null = null;
    private isUpdating = false;
    
    public visibleRangeChanged = new EventHandler<IChartSyncEventData>();

    constructor(initialRange?: NumberRange) {
        this.visibleRange = initialRange || null;
        this.publishChange = this.publishChange.bind(this);
    }

    /**
     * Add a chart to the synchronization group
     */
    addChart(chart: IChartReference): void {
        if (this.charts.has(chart.id)) {
            console.warn(`Chart with id ${chart.id} is already in synchronization group`);
            return;
        }

        this.charts.set(chart.id, chart);
        
        // Subscribe to axis changes
        if (chart.xAxis && chart.isActive) {
            chart.xAxis.visibleRangeChanged.subscribe(this.createAxisChangeHandler(chart.id));
            
            // Set initial range if we have one
            if (this.visibleRange && !chart.xAxis.visibleRange.equals(this.visibleRange)) {
                chart.xAxis.visibleRange = this.visibleRange;
            }
        }
    }

    /**
     * Remove a chart from the synchronization group
     */
    removeChart(chartId: string): void {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        // Unsubscribe from axis changes
        if (chart.xAxis) {
            chart.xAxis.visibleRangeChanged.unsubscribe(this.createAxisChangeHandler(chartId));
        }

        this.charts.delete(chartId);
    }

    /**
     * Create axis change handler for a specific chart
     */
    private createAxisChangeHandler(chartId: string) {
        return (args: VisibleRangeChangedArgs) => {
            if (!this.isUpdating) {
                this.publishChange({
                    sourceChartId: chartId,
                    visibleRange: args.visibleRange,
                    timestamp: Date.now()
                });
            }
        };
    }

    /**
     * Publish range changes to all synchronized charts
     */
    publishChange(data: IChartSyncEventData): void {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        this.visibleRange = data.visibleRange;

        // Update all charts except the source
        this.charts.forEach((chart, chartId) => {
            if (chartId !== data.sourceChartId && chart.isActive && chart.xAxis) {
                if (!chart.xAxis.visibleRange.equals(data.visibleRange)) {
                    chart.xAxis.visibleRange = data.visibleRange;
                }
            }
        });

        // Raise event for external listeners (like overview)
        this.visibleRangeChanged.raiseEvent(data);
        
        this.isUpdating = false;
    }

    /**
     * Set the visible range for all charts
     */
    setVisibleRange(range: NumberRange): void {
        this.publishChange({
            sourceChartId: "external",
            visibleRange: range,
            timestamp: Date.now()
        });
    }

    /**
     * Get current visible range
     */
    getVisibleRange(): NumberRange | null {
        return this.visibleRange;
    }

    /**
     * Activate/deactivate a chart in the synchronization group
     */
    setChartActive(chartId: string, active: boolean): void {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        chart.isActive = active;
        
        if (active && this.visibleRange && chart.xAxis) {
            chart.xAxis.visibleRange = this.visibleRange;
        }
    }

    /**
     * Get all chart references
     */
    getCharts(): Map<string, IChartReference> {
        return new Map(this.charts);
    }

    /**
     * Clean up resources
     */
    cleanup(): void {
        this.charts.forEach((chart, chartId) => {
            if (chart.xAxis) {
                chart.xAxis.visibleRangeChanged.unsubscribe(this.createAxisChangeHandler(chartId));
            }
        });
        this.charts.clear();
        // Clear all event handlers
        this.visibleRangeChanged = new EventHandler<IChartSyncEventData>();
    }
}

/**
 * Manages overview series creation and synchronization
 */
export class OverviewSeriesManager {
    private overviewSurface: SciChartSurface;
    private seriesMap = new Map<string, IRenderableSeries>();
    private wasmContext: TSciChart;

    constructor(overviewSurface: SciChartSurface) {
        this.overviewSurface = overviewSurface;
        this.wasmContext = overviewSurface.webAssemblyContext2D;
    }

    /**
     * Add a series from a chart to the overview
     */
    addSeries(chartId: string, originalSeries: IRenderableSeries): IRenderableSeries | null {
        try {
            // Clone the series configuration but share the data
            const cloneSeries = buildSeries(this.wasmContext, originalSeries.toJSON(true))[0];
            
            // Share data reference for efficiency
            cloneSeries.dataSeries = originalSeries.dataSeries;
            
            // Clear axis IDs to use default overview axes
            cloneSeries.xAxisId = undefined;
            cloneSeries.yAxisId = undefined;
            
            // Add unique identifier for tracking
            const overviewSeriesId = `${chartId}_${originalSeries.id}`;
            
            this.overviewSurface.renderableSeries.add(cloneSeries);
            this.seriesMap.set(overviewSeriesId, cloneSeries);
            
            return cloneSeries;
        } catch (error) {
            console.error(`Failed to add series ${originalSeries.id} from chart ${chartId} to overview:`, error);
            return null;
        }
    }

    /**
     * Remove a series from the overview
     */
    removeSeries(chartId: string, originalSeriesId: string): void {
        const overviewSeriesId = `${chartId}_${originalSeriesId}`;
        const overviewSeries = this.seriesMap.get(overviewSeriesId);
        
        if (overviewSeries) {
            // Remove from surface without deleting shared data
            this.overviewSurface.renderableSeries.remove(overviewSeries, false);
            this.seriesMap.delete(overviewSeriesId);
        }
    }

    /**
     * Remove all series from a specific chart
     */
    removeAllSeriesFromChart(chartId: string): void {
        const seriesToRemove: string[] = [];
        
        this.seriesMap.forEach((series, seriesId) => {
            if (seriesId.startsWith(`${chartId}_`)) {
                seriesToRemove.push(seriesId);
            }
        });
        
        seriesToRemove.forEach(seriesId => {
            const series = this.seriesMap.get(seriesId);
            if (series) {
                this.overviewSurface.renderableSeries.remove(series, false);
                this.seriesMap.delete(seriesId);
            }
        });
    }

    /**
     * Get overview series for a specific chart
     */
    getSeriesForChart(chartId: string): IRenderableSeries[] {
        const chartSeries: IRenderableSeries[] = [];
        
        this.seriesMap.forEach((series, seriesId) => {
            if (seriesId.startsWith(`${chartId}_`)) {
                chartSeries.push(series);
            }
        });
        
        return chartSeries;
    }

    /**
     * Clear all series from overview
     */
    clearAll(): void {
        this.seriesMap.forEach(series => {
            this.overviewSurface.renderableSeries.remove(series, false);
        });
        this.seriesMap.clear();
    }

    /**
     * Get total number of series in overview
     */
    getSeriesCount(): number {
        return this.seriesMap.size;
    }
}

/**
 * Main unified overview manager that coordinates everything
 */
export class UnifiedOverviewManager {
    private overviewSurface: SciChartSurface | null = null;
    private synchronizer: UnifiedChartSynchronizer;
    private seriesManager: OverviewSeriesManager | null = null;
    private overviewModifier: OverviewRangeSelectionModifier | null = null;
    private config: IUnifiedOverviewConfig;

    constructor(config?: IUnifiedOverviewConfig) {
        this.config = {
            enableRangeSelection: true,
            showAxisLabels: true,
            autoRange: EAutoRange.Never,
            growBy: new NumberRange(0.1, 0.1),
            ...config
        };
        
        this.synchronizer = new UnifiedChartSynchronizer(config?.initialVisibleRange);
        this.setupSynchronizerEvents();
    }

    /**
     * Create the overview surface
     */
    async createOverview(divId: string): Promise<SciChartSurface> {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId, {
            theme: this.config.theme,
        });

        this.overviewSurface = sciChartSurface;
        this.seriesManager = new OverviewSeriesManager(sciChartSurface);

        // Create axes
        const xAxis = new NumericAxis(wasmContext, {
            visibleRange: this.config.initialVisibleRange || new NumberRange(0, 1000),
            autoRange: this.config.autoRange,
            drawLabels: this.config.showAxisLabels,
            drawMajorTickLines: this.config.showAxisLabels,
            drawMinorTickLines: false,
        });
        
        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: this.config.growBy,
            axisAlignment: EAxisAlignment.Left,
            drawLabels: this.config.showAxisLabels,
        });

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        // Setup range selection modifier if enabled
        if (this.config.enableRangeSelection) {
            this.setupRangeSelectionModifier();
        }

        return sciChartSurface;
    }

    /**
     * Setup range selection modifier for overview
     */
    private setupRangeSelectionModifier(): void {
        if (!this.overviewSurface) return;

        this.overviewModifier = new OverviewRangeSelectionModifier();
        
        // When range selection changes, update synchronized charts
        this.overviewModifier.onSelectedAreaChanged = (selectedRange: NumberRange) => {
            const currentRange = this.synchronizer.getVisibleRange();
            if (!currentRange || !selectedRange.equals(currentRange)) {
                this.synchronizer.setVisibleRange(selectedRange);
            }
        };

        // Set initial selected area
        const initialRange = this.synchronizer.getVisibleRange();
        if (initialRange) {
            this.overviewModifier.selectedArea = initialRange;
        }

        this.overviewSurface.chartModifiers.add(this.overviewModifier);
    }

    /**
     * Setup synchronizer event handlers
     */
    private setupSynchronizerEvents(): void {
        this.synchronizer.visibleRangeChanged.subscribe((data: IChartSyncEventData) => {
            // Update overview range selection if it exists
            if (this.overviewModifier && this.overviewSurface) {
                const xAxis = this.overviewSurface.xAxes.get(0);
                const clippedRange = data.visibleRange.clip(xAxis.visibleRange);
                
                if (!clippedRange.equals(this.overviewModifier.selectedArea)) {
                    this.overviewModifier.selectedArea = clippedRange;
                }
            }
        });
    }

    /**
     * Add a SubChart to the unified system
     */
    addSubChart(chartId: string, subChart: SciChartSubSurface): void {
        const chartRef: IChartReference = {
            id: chartId,
            surface: subChart,
            type: EUnifiedChartType.SubChart,
            xAxis: subChart.xAxes.get(0),
            series: subChart.renderableSeries.asArray(),
            isActive: true
        };

        this.synchronizer.addChart(chartRef);
        this.addSeriesToOverview(chartRef);
    }

    /**
     * Add a MultiChart (independent SciChartSurface) to the unified system
     */
    addMultiChart(chartId: string, surface: SciChartSurface): void {
        const chartRef: IChartReference = {
            id: chartId,
            surface: surface,
            type: EUnifiedChartType.MultiChart,
            xAxis: surface.xAxes.get(0),
            series: surface.renderableSeries.asArray(),
            isActive: true
        };

        this.synchronizer.addChart(chartRef);
        this.addSeriesToOverview(chartRef);
    }

    /**
     * Remove a chart from the unified system
     */
    removeChart(chartId: string): void {
        // Remove from synchronizer
        this.synchronizer.removeChart(chartId);
        
        // Remove series from overview
        if (this.seriesManager) {
            this.seriesManager.removeAllSeriesFromChart(chartId);
        }
    }

    /**
     * Add all series from a chart to the overview
     */
    private addSeriesToOverview(chartRef: IChartReference): void {
        if (!this.seriesManager) return;

        chartRef.series.forEach(series => {
            this.seriesManager!.addSeries(chartRef.id, series);
        });
    }

    /**
     * Set the visible range for all synchronized charts
     */
    setVisibleRange(range: NumberRange): void {
        this.synchronizer.setVisibleRange(range);
    }

    /**
     * Get the current visible range
     */
    getVisibleRange(): NumberRange | null {
        return this.synchronizer.getVisibleRange();
    }

    /**
     * Enable/disable synchronization for a specific chart
     */
    setChartSyncEnabled(chartId: string, enabled: boolean): void {
        this.synchronizer.setChartActive(chartId, enabled);
    }

    /**
     * Get all managed charts
     */
    getCharts(): Map<string, IChartReference> {
        return this.synchronizer.getCharts();
    }

    /**
     * Get the overview surface
     */
    getOverviewSurface(): SciChartSurface | null {
        return this.overviewSurface;
    }

    /**
     * Get the synchronizer instance
     */
    getSynchronizer(): UnifiedChartSynchronizer {
        return this.synchronizer;
    }

    /**
     * Clean up all resources
     */
    cleanup(): void {
        this.synchronizer.cleanup();
        
        if (this.seriesManager) {
            this.seriesManager.clearAll();
        }
        
        if (this.overviewSurface) {
            this.overviewSurface.delete();
            this.overviewSurface = null;
        }
        
        this.seriesManager = null;
        this.overviewModifier = null;
    }
}

/**
 * Factory function to create a unified overview manager with common configurations
 */
export function createUnifiedOverview(config?: IUnifiedOverviewConfig): UnifiedOverviewManager {
    return new UnifiedOverviewManager(config);
}

/**
 * Helper function to extract chart reference from SubChart
 */
export function createSubChartReference(chartId: string, subChart: SciChartSubSurface): IChartReference {
    return {
        id: chartId,
        surface: subChart,
        type: EUnifiedChartType.SubChart,
        xAxis: subChart.xAxes.get(0),
        series: subChart.renderableSeries.asArray(),
        isActive: true
    };
}

/**
 * Helper function to extract chart reference from MultiChart
 */
export function createMultiChartReference(chartId: string, surface: SciChartSurface): IChartReference {
    return {
        id: chartId,
        surface: surface,
        type: EUnifiedChartType.MultiChart,
        xAxis: surface.xAxes.get(0),
        series: surface.renderableSeries.asArray(),
        isActive: true
    };
}