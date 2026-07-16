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
    EXyDirection,
    ENumericFormat,
} from "scichart";
import { SubChartsOverviewModifier } from "./SubChartsOverviewModifier";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";

const STREAM_INTERVAL_MS = 1000;
const POINTS_ON_CHART = 180;
const OVERVIEW_HEIGHT = 0.2;
const SUBCHARTS_HEIGHT = 1 - OVERVIEW_HEIGHT;

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

interface SubChartRuntime {
    subChart: SciChartSubSurface;
    dataSeries: XyDataSeries;
    phase: number;
    color: string;
    title: string;
}

const getYValue = (x: number, phase: number): number =>
    Math.sin(x * 0.08 + phase) * 0.75 + Math.cos(x * 0.015 + phase * 0.5) * 0.25;

const createLineData = (phase: number, startX: number, count: number) => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i < count; i++) {
        const x = startX + i;
        xValues.push(x);
        yValues.push(getYValue(x, phase));
    }
    return { xValues, yValues };
};

export const drawExample = async (
    rootElement: string | HTMLDivElement,
    initialConfigs: SubChartConfig[]
): Promise<{ wasmContext: any; sciChartSurface: SciChartSurface; manager: SubChartManager }> => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    const subChartMap = new Map<string, SciChartSubSurface>();
    const subChartRuntimeMap = new Map<string, SubChartRuntime>();

    let nextStreamX = Math.floor(Date.now() / 1000) + 1;
    const initialVisibleRange = new NumberRange(nextStreamX - POINTS_ON_CHART, nextStreamX - 1);
    const axisSynchroniser = new AxisSynchroniser(initialVisibleRange);

    const mainXAxis = new NumericAxis(wasmContext, {
        id: "mainXAxis",
        isVisible: false,
        autoRange: EAutoRange.Always,
    });
    const mainYAxis = new NumericAxis(wasmContext, {
        id: "mainYAxis",
        isVisible: false,
        autoRange: EAutoRange.Always,
    });

    sciChartSurface.xAxes.add(mainXAxis);
    sciChartSurface.yAxes.add(mainYAxis);

    const overviewModifier = new SubChartsOverviewModifier({
        overviewPosition: new Rect(0, SUBCHARTS_HEIGHT, 1, OVERVIEW_HEIGHT),
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
        xAxisLabelFormat: ENumericFormat.Date_HHMMSS,
    });

    sciChartSurface.chartModifiers.add(overviewModifier);

    const getCurrentConfigs = (): SubChartConfig[] =>
        Array.from(subChartRuntimeMap.entries()).map(([id, runtime]) => ({
            id,
            phase: runtime.phase,
            color: runtime.color,
            title: runtime.title,
        }));

    const createSubChart = (config: SubChartConfig, rect: Rect) => {
        const subChartOptions: I2DSubSurfaceOptions = {
            id: config.id,
            position: rect,
            coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        };

        const subChart = SciChartSubSurface.createSubSurface(sciChartSurface, subChartOptions);

        // X axis uses Never autorange so user pan/zoom is not overridden by streaming data.
        // The streaming loop advances visibleRange manually while the user is at the live edge.
        const subXAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            visibleRange: axisSynchroniser.visibleRange,
            labelFormat: ENumericFormat.Date_HHMMSS,
            cursorLabelFormat: ENumericFormat.Date_HHMMSS,
            drawMinorGridLines: false,
            maxAutoTicks: 6,
        });

        const subYAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisTitle: config.title,
            axisTitleStyle: { fontSize: 14 },
            drawMinorGridLines: false,
        });

        subChart.xAxes.add(subXAxis);
        subChart.yAxes.add(subYAxis);

        const data = createLineData(config.phase, nextStreamX - POINTS_ON_CHART, POINTS_ON_CHART);
        const dataSeries = new XyDataSeries(wasmContext, {
            xValues: data.xValues,
            yValues: data.yValues,
            dataSeriesName: config.title,
        });

        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 3,
            stroke: config.color,
            opacity: 0.7,
        });

        axisSynchroniser.addAxis(subXAxis);
        subChart.renderableSeries.add(lineSeries);

        subChart.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier()
        );

        subChartMap.set(config.id, subChart);
        subChartRuntimeMap.set(config.id, {
            subChart,
            dataSeries,
            phase: config.phase,
            color: config.color,
            title: config.title,
        });
    };

    const clearAllSubCharts = () => {
        const currentSubCharts = Array.from(subChartMap.values());
        currentSubCharts.forEach((subChart) => {
            const xAxis = subChart.xAxes.get(0);
            if (xAxis) {
                axisSynchroniser.removeAxis(xAxis);
            }
            // SciChartSurface.removeSubChart does not fire onDetachSubSurface on modifiers, so
            // proactively clear the renderable series first. That triggers collectionChanged on
            // the subchart's series collection, which the overview modifier listens to and uses
            // to disconnect its shared dataSeries before the subchart deletion deletes them.
            const seriesToRemove = subChart.renderableSeries.asArray().slice();
            seriesToRemove.forEach((series) => {
                subChart.renderableSeries.remove(series, false);
            });
            sciChartSurface.removeSubChart(subChart);
        });
        subChartMap.clear();
        subChartRuntimeMap.clear();
    };

    const recreateSubChartsWithLayout = (configs: SubChartConfig[]) => {
        sciChartSurface.suspendUpdates();
        try {
            clearAllSubCharts();

            if (configs.length === 0) {
                return;
            }

            configs.forEach((config, index) => {
                const yStart = (index / configs.length) * SUBCHARTS_HEIGHT;
                const height = (1 / configs.length) * SUBCHARTS_HEIGHT;
                createSubChart(config, new Rect(0, yStart, 1, height));
            });
        } finally {
            sciChartSurface.resumeUpdates();
        }
    };

    const updateSubCharts = (configs: SubChartConfig[]) => {
        recreateSubChartsWithLayout(configs);
    };

    const addSubChart = (config: SubChartConfig) => {
        if (subChartMap.has(config.id)) {
            return;
        }
        recreateSubChartsWithLayout([...getCurrentConfigs(), config]);
    };

    const removeSubChart = (id: string) => {
        if (!subChartMap.has(id)) {
            return;
        }
        recreateSubChartsWithLayout(getCurrentConfigs().filter((cfg) => cfg.id !== id));
    };

    const updateLayout = () => {
        recreateSubChartsWithLayout(getCurrentConfigs());
    };

    recreateSubChartsWithLayout(initialConfigs);
    sciChartSurface.zoomExtents();

    const streamInterval = window.setInterval(() => {
        // Snapshot whether the user was at the live edge before this tick — if so, we advance
        // the visible range together with the new data so the chart auto-scrolls. If the user
        // has zoomed/panned away from the live edge, we leave the visible range alone.
        const previousLastX = nextStreamX - 1;
        const currentRange = axisSynchroniser.visibleRange;
        const wasFollowingLive = currentRange != null && currentRange.max >= previousLastX - 0.5;

        subChartRuntimeMap.forEach((runtime) => {
            runtime.dataSeries.append(nextStreamX, getYValue(nextStreamX, runtime.phase));
            const excess = runtime.dataSeries.count() - POINTS_ON_CHART;
            if (excess > 0) {
                runtime.dataSeries.removeRange(0, excess);
            }
        });

        if (wasFollowingLive && currentRange != null) {
            const newRange = new NumberRange(currentRange.min + 1, currentRange.max + 1);
            if (subChartRuntimeMap.size > 0) {
                subChartRuntimeMap.forEach((runtime) => {
                    const xAxis = runtime.subChart.xAxes.get(0);
                    if (xAxis) {
                        xAxis.visibleRange = newRange;
                    }
                });
            } else {
                // No subcharts but keep the synchroniser following live so newly added charts
                // start at the current live edge.
                axisSynchroniser.visibleRange = newRange;
            }
        }

        nextStreamX += 1;
    }, STREAM_INTERVAL_MS);

    sciChartSurface.addDeletable({
        delete: () => window.clearInterval(streamInterval),
    });

    const manager: SubChartManager = {
        updateSubCharts,
        addSubChart,
        removeSubChart,
        updateLayout,
    };

    return { wasmContext, sciChartSurface, manager };
};
