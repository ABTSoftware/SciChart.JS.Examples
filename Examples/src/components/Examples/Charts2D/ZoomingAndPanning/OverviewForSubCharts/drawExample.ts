import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    FastLineRenderableSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ESubSurfacePositionCoordinateMode,
    Rect,
    EPerformanceMarkType,
    SciChartSubSurface,
    I2DSubSurfaceOptions,
    EAutoRange,
    RolloverModifier,
    EXyDirection,
} from "scichart";

import { appTheme } from "../../../theme";
import { SubChartsOverviewModifier } from "./SubChartsOverviewModifier";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";

const colorsArr = [
    appTheme.MutedBlue,
    appTheme.MutedOrange,
    appTheme.MutedPink,
    appTheme.MutedPurple,
    appTheme.MutedRed,
    appTheme.MutedSkyBlue,
    appTheme.MutedTeal,
];

export type TMarkType = EPerformanceMarkType | string;

export interface SubChartConfig {
    id: string;
    phase: number;
    color: string;
    title: string;
}

export interface SubChartManager {
    updateSubCharts: (configs: SubChartConfig[]) => void;
    addSubChart: (config: SubChartConfig) => void;
    removeSubChart: (id: string) => void;
    updateLayout: () => void;
}

// Helper to create some sample data
const createLineData = (phase: number) => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i < 500; i++) {
        const x = i;
        const y = Math.sin(i * 0.1 + phase);
        xValues.push(x);
        yValues.push(y);
    }
    return { xValues, yValues };
};

export const drawExample = async (
    rootElement: string | HTMLDivElement, 
    initialConfigs: SubChartConfig[]
): Promise<{ wasmContext: any; sciChartSurface: SciChartSurface; manager: SubChartManager }> => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    // Store references to subcharts for dynamic management
    const subChartMap = new Map<string, SciChartSubSurface>();
    const axisSynchroniser = new AxisSynchroniser(new NumberRange(0, 500));

    // Add main axes to the surface for the overview to reference
    const mainXAxis = new NumericAxis(wasmContext, {
        id: "mainXAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always,
    });
    const mainYAxis = new NumericAxis(wasmContext, {
        id: "mainYAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always,
    });

    sciChartSurface.xAxes.add(mainXAxis);
    sciChartSurface.yAxes.add(mainYAxis);

    // Create overview modifier
    const overviewModifier = new SubChartsOverviewModifier({
        overviewPosition: new Rect(0, 0.8, 1, 0.2),
        isTransparent: true,
        axisTitle: "Overview - All Charts",
        labelStyle: {
            color: "#ffffff80",
            fontSize: 10,
        },
        majorTickLineStyle: {
            color: "#ffffff80",
            tickSize: 6,
            strokeThickness: 1,
        },
        yAxisGrowBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.chartModifiers.add(overviewModifier);

    const updateLayout = () => {
        // Simple layout update without recreating subcharts
        // This is called after add/remove operations to ensure proper spacing
        // The actual repositioning will be handled by the individual add/remove functions
    };

    const addSubChart = (config: SubChartConfig, index?: number) => {
        // Don't add if already exists
        if (subChartMap.has(config.id)) {
            return;
        }

        // For now, just add at the bottom to avoid repositioning existing charts
        const currentCount = subChartMap.size;
        const chartIndex = currentCount; // Always add at the end
        
        // Calculate position: this is a simple approach that may cause overlapping
        // but avoids the MouseManager issues
        const rect = new Rect(0, (chartIndex * 0.2), 1, 0.2);
        
        const subChartOptions: I2DSubSurfaceOptions = {
            id: config.id,
            position: rect,
            coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        };
        
        const subChart = SciChartSubSurface.createSubSurface(sciChartSurface, subChartOptions);
        
        // Create axes for the subchart
        const subXAxis = new NumericAxis(wasmContext);
        const subYAxis = new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            axisTitle: config.title,
            axisTitleStyle: { fontSize: 14 },
            drawMinorGridLines: false,
        });
        
        subChart.xAxes.add(subXAxis);
        subChart.yAxes.add(subYAxis);
        
        // Create data and series
        const data = createLineData(config.phase);
        const dataSeries = new XyDataSeries(wasmContext, {
            xValues: data.xValues,
            yValues: data.yValues,
        });
        
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 4,
            stroke: config.color,
            opacity: 0.6,
        });
        
        // Add to synchronizer and subchart
        axisSynchroniser.addAxis(subXAxis);
        subChart.renderableSeries.add(lineSeries);
        
        // Add modifiers
        subChart.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier(),
            new RolloverModifier({ modifierGroup: "one" })
        );
        
        // Store reference
        subChartMap.set(config.id, subChart);
        
        subChart.zoomExtents();
    };

    const removeSubChart = (id: string) => {
        const subChart = subChartMap.get(id);
        if (subChart) {
            // Remove from synchronizer
            const xAxis = subChart.xAxes.get(0);
            if (xAxis) {
                axisSynchroniser.removeAxis(xAxis);
            }
            
            // Delete the subchart (this will trigger the overview modifier's onDetachSubSurface)
            subChart.delete();
            subChartMap.delete(id);
        }
    };

    const updateSubChart = (id: string, config: SubChartConfig) => {
        const subChart = subChartMap.get(id);
        if (subChart) {
            // Update title
            const yAxis = subChart.yAxes.get(0);
            if (yAxis) {
                yAxis.axisTitle = config.title;
            }
            
            // Update color
            const series = subChart.renderableSeries.get(0) as FastLineRenderableSeries;
            if (series) {
                series.stroke = config.color;
            }
            
            // Update data if phase changed
            const data = createLineData(config.phase);
            if (series && series.dataSeries) {
                (series.dataSeries as XyDataSeries).clear();
                (series.dataSeries as XyDataSeries).appendRange(data.xValues, data.yValues);
            }
        }
    };

    const updateSubCharts = (configs: SubChartConfig[]) => {
        // Use the safer recreate approach to avoid MouseManager issues
        recreateSubChartsWithLayout(configs);
    };
    
    const recreateSubChartsWithLayout = (configs: SubChartConfig[]) => {
        // Clear existing subcharts - use the proper removeSubChart function to ensure cleanup
        const currentIds = Array.from(subChartMap.keys());
        currentIds.forEach(id => {
            removeSubChart(id);
        });
        
        // Recreate with proper layout
        const count = configs.length;
        if (count === 0) return;
        
        configs.forEach((config, index) => {
            // Calculate position: each subchart takes 1/count of the available 80% height
            // Y position starts at (index/count) * 0.8 and has height of (1/count) * 0.8
            const yStart = (index / count) * 0.8;
            const height = (1 / count) * 0.8;
            const rect = new Rect(0, yStart, 1, height);
            
            const subChartOptions: I2DSubSurfaceOptions = {
                id: config.id,
                position: rect,
                coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
            };
            
            const subChart = SciChartSubSurface.createSubSurface(sciChartSurface, subChartOptions);
            
            // Create axes for the subchart
            const subXAxis = new NumericAxis(wasmContext);
            const subYAxis = new NumericAxis(wasmContext, {
                growBy: new NumberRange(0.1, 0.1),
                axisTitle: config.title,
                axisTitleStyle: { fontSize: 14 },
                drawMinorGridLines: false,
            });
            
            subChart.xAxes.add(subXAxis);
            subChart.yAxes.add(subYAxis);
            
            // Create data and series
            const data = createLineData(config.phase);
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: data.xValues,
                yValues: data.yValues,
            });
            
            const lineSeries = new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                strokeThickness: 4,
                stroke: config.color,
                opacity: 0.6,
            });
            
            // Add to synchronizer and subchart
            axisSynchroniser.addAxis(subXAxis);
            subChart.renderableSeries.add(lineSeries);
            
            // Add modifiers
            subChart.chartModifiers.add(
                new ZoomPanModifier(),
                new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
                new ZoomExtentsModifier(),
                new RolloverModifier({ modifierGroup: "one" })
            );
            
            // Store reference
            subChartMap.set(config.id, subChart);
            
            subChart.zoomExtents();
        });
    };

    // Initialize with provided configs
    initialConfigs.forEach(config => addSubChart(config));

    sciChartSurface.zoomExtents();

    const manager: SubChartManager = {
        updateSubCharts,
        addSubChart,
        removeSubChart,
        updateLayout
    };

    return { wasmContext, sciChartSurface, manager };
};
