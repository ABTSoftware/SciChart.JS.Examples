import {
    SciChartSurface,
    SciChartSubSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    NumberRange,
    EAutoRange,
    EAxisAlignment,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    RolloverModifier,
    RubberBandXyZoomModifier,
    EExecuteOn,
    Rect,
    Thickness,
} from "scichart";

import { 
    UnifiedOverviewManager, 
    createUnifiedOverview,
    IUnifiedOverviewConfig,
    EUnifiedChartType 
} from "./unifiedOverviewAPI";

import { RandomWalkGenerator } from "../../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../../theme";

/**
 * Demo configuration interface
 */
export interface IUnifiedOverviewDemoConfig {
    overviewDivId: string;
    subChartContainerDivId: string;
    multiChart1DivId: string;
    multiChart2DivId: string;
    multiChart3DivId: string;
}

/**
 * Demonstration class showing unified overview with both SubCharts and MultiCharts
 */
export class UnifiedOverviewDemo {
    private overviewManager: UnifiedOverviewManager;
    private mainSurface: SciChartSurface | null = null;
    private multiCharts: SciChartSurface[] = [];
    private config: IUnifiedOverviewDemoConfig;

    constructor(config: IUnifiedOverviewDemoConfig) {
        this.config = config;
        
        // Create overview manager with configuration
        const overviewConfig: IUnifiedOverviewConfig = {
            theme: appTheme.SciChartJsTheme,
            initialVisibleRange: new NumberRange(200, 800),
            enableRangeSelection: true,
            showAxisLabels: true,
            autoRange: EAutoRange.Never,
            growBy: new NumberRange(0.1, 0.1),
        };
        
        this.overviewManager = createUnifiedOverview(overviewConfig);
    }

    /**
     * Initialize the complete demo
     */
    async initialize(): Promise<void> {
        try {
            // 1. Create the overview
            await this.createOverview();
            
            // 2. Create SubCharts (using main surface with sub-surfaces)
            await this.createSubCharts();
            
            // 3. Create MultiCharts (independent surfaces)
            await this.createMultiCharts();
            
            // 4. Set up demo controls
            this.setupDemoControls();
            
            console.log("Unified Overview Demo initialized successfully");
        } catch (error) {
            console.error("Failed to initialize Unified Overview Demo:", error);
            throw error;
        }
    }

    /**
     * Create the overview surface
     */
    private async createOverview(): Promise<void> {
        await this.overviewManager.createOverview(this.config.overviewDivId);
        console.log("Overview created");
    }

    /**
     * Create SubCharts using the SubChart API
     */
    private async createSubCharts(): Promise<void> {
        // Create main surface for SubCharts
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(
            this.config.subChartContainerDivId,
            {
                theme: appTheme.SciChartJsTheme,
            }
        );

        this.mainSurface = sciChartSurface;

        // Create invisible main axes (SubCharts will have their own)
        const mainXAxis = new NumericAxis(wasmContext, { isVisible: false });
        const mainYAxis = new NumericAxis(wasmContext, { isVisible: false });
        sciChartSurface.xAxes.add(mainXAxis);
        sciChartSurface.yAxes.add(mainYAxis);

        // Create SubCharts
        const subChartConfigs = [
            { position: { x: 0, y: 0, width: 1, height: 0.5 }, title: "SubChart 1", color: appTheme.VividBlue },
            { position: { x: 0, y: 0.5, width: 1, height: 0.5 }, title: "SubChart 2", color: appTheme.VividGreen },
        ];

        for (let i = 0; i < subChartConfigs.length; i++) {
            const config = subChartConfigs[i];
            
            // Create SubChart
            const subChart = await this.createSubChart(
                sciChartSurface,
                wasmContext,
                config.position,
                config.title,
                config.color,
                i
            );

            // Add to unified overview
            const chartId = `subchart_${i}`;
            this.overviewManager.addSubChart(chartId, subChart);
        }

        console.log("SubCharts created and added to overview");
    }

    /**
     * Create a single SubChart
     */
    private async createSubChart(
        parentSurface: SciChartSurface,
        wasmContext: any,
        position: { x: number; y: number; width: number; height: number },
        title: string,
        color: string,
        dataIndex: number
    ): Promise<any> {
        const subChart = SciChartSubSurface.createSubSurface(parentSurface, {
            position: new Rect(position.x, position.y, position.width, position.height),
            theme: appTheme.SciChartJsTheme,
            title: title,
            padding: Thickness.fromNumber(5),
        });

        // Add axes
        const xAxis = new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 1000),
            autoRange: EAutoRange.Never,
        });
        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment: EAxisAlignment.Left,
        });

        subChart.xAxes.add(xAxis);
        subChart.yAxes.add(yAxis);

        // Add data series
        const data = new RandomWalkGenerator().Seed((dataIndex + 1) * 10).getRandomWalkSeries(1000);
        const dataSeries = new XyDataSeries(wasmContext, {
            xValues: data.xValues,
            yValues: data.yValues,
        });

        const renderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: color,
            strokeThickness: 2,
        });

        subChart.renderableSeries.add(renderableSeries);

        // Add modifiers
        subChart.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier(),
            new ZoomExtentsModifier(),
            new RolloverModifier({ modifierGroup: "unified_demo" })
        );

        return subChart;
    }

    /**
     * Create MultiCharts (independent surfaces)
     */
    private async createMultiCharts(): Promise<void> {
        const multiChartConfigs = [
            { divId: this.config.multiChart1DivId, title: "MultiChart 1", color: appTheme.VividOrange },
            { divId: this.config.multiChart2DivId, title: "MultiChart 2", color: appTheme.VividPink },
            { divId: this.config.multiChart3DivId, title: "MultiChart 3", color: appTheme.VividPurple },
        ];

        for (let i = 0; i < multiChartConfigs.length; i++) {
            const config = multiChartConfigs[i];
            
            // Create MultiChart
            const surface = await this.createMultiChart(
                config.divId,
                config.title,
                config.color,
                i + 10 // Different seed for variety
            );

            this.multiCharts.push(surface);

            // Add to unified overview
            const chartId = `multichart_${i}`;
            this.overviewManager.addMultiChart(chartId, surface);
        }

        console.log("MultiCharts created and added to overview");
    }

    /**
     * Create a single MultiChart
     */
    private async createMultiChart(
        divId: string,
        title: string,
        color: string,
        dataIndex: number
    ): Promise<SciChartSurface> {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId, {
            theme: appTheme.SciChartJsTheme,
            title: title,
        });

        // Add axes
        const xAxis = new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 1000),
            autoRange: EAutoRange.Never,
        });
        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment: EAxisAlignment.Left,
        });

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        // Add data series
        const data = new RandomWalkGenerator().Seed(dataIndex * 10).getRandomWalkSeries(1000);
        const dataSeries = new XyDataSeries(wasmContext, {
            xValues: data.xValues,
            yValues: data.yValues,
        });

        const renderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: color,
            strokeThickness: 2,
        });

        sciChartSurface.renderableSeries.add(renderableSeries);

        // Add modifiers
        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier(),
            new ZoomExtentsModifier(),
            new RolloverModifier({ modifierGroup: "unified_demo" }),
            new RubberBandXyZoomModifier({
                executeCondition: { button: EExecuteOn.MouseRightButton },
                modifierGroup: "unified_demo",
            })
        );

        return sciChartSurface;
    }

    /**
     * Set up demo controls and interactions
     */
    private setupDemoControls(): void {
        // Create control buttons if they don't exist
        this.createControlButton("zoom-in-btn", "Zoom In", () => {
            const currentRange = this.overviewManager.getVisibleRange();
            if (currentRange) {
                const center = (currentRange.min + currentRange.max) / 2;
                const newDiff = (currentRange.max - currentRange.min) * 0.8;
                const newRange = new NumberRange(center - newDiff / 2, center + newDiff / 2);
                this.overviewManager.setVisibleRange(newRange);
            }
        });

        this.createControlButton("zoom-out-btn", "Zoom Out", () => {
            const currentRange = this.overviewManager.getVisibleRange();
            if (currentRange) {
                const center = (currentRange.min + currentRange.max) / 2;
                const newDiff = (currentRange.max - currentRange.min) * 1.2;
                const newRange = new NumberRange(center - newDiff / 2, center + newDiff / 2);
                this.overviewManager.setVisibleRange(newRange);
            }
        });

        this.createControlButton("reset-zoom-btn", "Reset Zoom", () => {
            this.overviewManager.setVisibleRange(new NumberRange(0, 1000));
        });

        this.createControlButton("toggle-sync-btn", "Toggle Sync", () => {
            // Toggle sync for first MultiChart as example
            const charts = this.overviewManager.getCharts();
            const firstMultiChart = Array.from(charts.values()).find(
                chart => chart.type === EUnifiedChartType.MultiChart
            );
            
            if (firstMultiChart) {
                const currentlyActive = firstMultiChart.isActive;
                this.overviewManager.setChartSyncEnabled(firstMultiChart.id, !currentlyActive);
                console.log(`Chart ${firstMultiChart.id} sync ${!currentlyActive ? 'enabled' : 'disabled'}`);
            }
        });

        console.log("Demo controls set up");
    }

    /**
     * Create a control button
     */
    private createControlButton(id: string, text: string, onClick: () => void): void {
        let button = document.getElementById(id) as HTMLButtonElement;
        
        if (!button) {
            button = document.createElement("button");
            button.id = id;
            button.textContent = text;
            button.style.margin = "5px";
            button.style.padding = "8px 16px";
            button.style.backgroundColor = appTheme.VividBlue;
            button.style.color = "white";
            button.style.border = "none";
            button.style.borderRadius = "4px";
            button.style.cursor = "pointer";
            
            // Add to a controls container or body
            const controlsContainer = document.getElementById("demo-controls") || document.body;
            controlsContainer.appendChild(button);
        }
        
        button.onclick = onClick;
    }

    /**
     * Get overview manager for external access
     */
    getOverviewManager(): UnifiedOverviewManager {
        return this.overviewManager;
    }

    /**
     * Get all chart information
     */
    getChartInfo(): { subCharts: number; multiCharts: number; totalSeries: number } {
        const charts = this.overviewManager.getCharts();
        let subCharts = 0;
        let multiCharts = 0;
        let totalSeries = 0;

        charts.forEach(chart => {
            if (chart.type === EUnifiedChartType.SubChart) {
                subCharts++;
            } else if (chart.type === EUnifiedChartType.MultiChart) {
                multiCharts++;
            }
            totalSeries += chart.series.length;
        });

        return { subCharts, multiCharts, totalSeries };
    }

    /**
     * Demonstrate programmatic range changes
     */
    demonstrateRangeChanges(): void {
        const ranges = [
            new NumberRange(0, 300),
            new NumberRange(200, 500),
            new NumberRange(400, 700),
            new NumberRange(600, 1000),
            new NumberRange(0, 1000),
        ];

        let currentIndex = 0;
        const interval = setInterval(() => {
            this.overviewManager.setVisibleRange(ranges[currentIndex]);
            console.log(`Set range to: ${ranges[currentIndex].min} - ${ranges[currentIndex].max}`);
            
            currentIndex++;
            if (currentIndex >= ranges.length) {
                clearInterval(interval);
                console.log("Range demonstration complete");
            }
        }, 2000);
    }

    /**
     * Clean up all resources
     */
    cleanup(): void {
        // Clean up overview
        this.overviewManager.cleanup();

        // Clean up MultiCharts
        this.multiCharts.forEach(surface => {
            surface.delete();
        });
        this.multiCharts = [];

        // Clean up main surface (this will also clean up SubCharts)
        if (this.mainSurface) {
            this.mainSurface.delete();
            this.mainSurface = null;
        }

        // Remove control buttons
        const buttonIds = ["zoom-in-btn", "zoom-out-btn", "reset-zoom-btn", "toggle-sync-btn"];
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.remove();
            }
        });

        console.log("Unified Overview Demo cleaned up");
    }
}

/**
 * Factory function to create and initialize the demo
 */
export async function createUnifiedOverviewDemo(config: IUnifiedOverviewDemoConfig): Promise<UnifiedOverviewDemo> {
    const demo = new UnifiedOverviewDemo(config);
    await demo.initialize();
    return demo;
}

/**
 * Example usage function
 */
export async function runUnifiedOverviewDemo(): Promise<UnifiedOverviewDemo> {
    const config: IUnifiedOverviewDemoConfig = {
        overviewDivId: "unified-overview",
        subChartContainerDivId: "subchart-container",
        multiChart1DivId: "multichart-1",
        multiChart2DivId: "multichart-2",
        multiChart3DivId: "multichart-3",
    };

    try {
        const demo = await createUnifiedOverviewDemo(config);
        
        // Log demo information
        const info = demo.getChartInfo();
        console.log(`Demo created with ${info.subCharts} SubCharts, ${info.multiCharts} MultiCharts, and ${info.totalSeries} total series`);
        
        // Optionally start the range demonstration
        setTimeout(() => {
            demo.demonstrateRangeChanges();
        }, 3000);
        
        return demo;
    } catch (error) {
        console.error("Failed to run Unified Overview Demo:", error);
        throw error;
    }
}