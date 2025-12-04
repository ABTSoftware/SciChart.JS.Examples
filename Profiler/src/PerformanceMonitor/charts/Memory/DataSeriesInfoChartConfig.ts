import {
    AUTO_COLOR,
    CursorModifier,
    EAutoRange,
    EExecuteOn,
    EllipsePointMarker,
    NumberRange,
    NumericAxis,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
    RolloverModifier,
    SciChartSurface,
    TSciChart
} from "scichart";
import { XyyDataSeries } from "scichart";
import { FastBandRenderableSeries } from "scichart";
import { CustomObjectRegistry, TDataSeriesInfo } from "./CustomObjectRegistry";
import { XyScatterRenderableSeries } from "scichart";
import { XyDataSeries } from "scichart";
import { ZoomExtentsModifier } from "scichart";
import { ZoomPanModifier } from "scichart";
import { MouseWheelZoomModifier } from "scichart";
import { FastLineRenderableSeries } from "scichart";
import { RubberBandXyZoomModifier } from "scichart";

export const getDataSeriesMetrics = () => {
    return Array.from(CustomObjectRegistry.dataSeriesMap.values()).map(({ dataSeries, metrics }: TDataSeriesInfo) => {
        const xValues = Array.from(metrics.keys());
        const yValues = Array.from(metrics.values(), ({ count }) => count);
        const y1Values = Array.from(metrics.values(), ({ capacity }) => capacity);
        return {
            dataSeriesName: dataSeries.id,
            xValues,
            yValues,
            y1Values
        };
    });
};

const dataSeriesInfoColors = [
    "red",
    "green",
    "blue",
    "yellow",
    "white",
    "black",
    "aquamarine",
    "purple",
    "violet",
    "skyblue"
];

const getMetricsRenderableSeries = (wasmContext: TSciChart, metricsData: ReturnType<typeof getDataSeriesMetrics>) => {
    return metricsData.map((dataEntry, index) => {
        const { dataSeriesName, xValues, yValues, y1Values } = dataEntry;
        const dataSeries = new XyyDataSeries(wasmContext, {
            dataSeriesName,
            xValues,
            yValues,
            y1Values
        });
        // const dataSeries = new XyDataSeries(wasmContext, {
        //     dataSeriesName,
        //     xValues,
        //     yValues
        // });
        return new FastBandRenderableSeries(wasmContext, {
            dataSeries,
            yAxisId: `yAxis-${index}`,
            stroke: dataSeriesInfoColors[index],
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                strokeThickness: 1,
                stroke: dataSeriesInfoColors[index],
                fill: dataSeriesInfoColors[index],
                opacity: 0.5
            }),
            fill: "transparent",
            strokeY1: dataSeriesInfoColors[index],
            strokeY1DashArray: [4, 4]
        });
    });
};

const configureDataSeriesMetricsChart = (
    sciChartSurface: SciChartSurface,
    metricsData: ReturnType<typeof getDataSeriesMetrics>
) => {
    const wasmContext = sciChartSurface.webAssemblyContext2D;

    // sciChartSurface.title = 'Data Series Size Info';
    const xAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        visibleRangeLimit: new NumberRange(0, Infinity),
        growBy: new NumberRange(0.2, 0.2),
        // visibleRangeSizeLimit: new NumberRange(0, 20),
        axisTitle: "Time from page load (ms)"
    });

    const yAxes = metricsData.map((dataEntry, index) => {
        return new NumericAxis(wasmContext, {
            id: `yAxis-${index}`,
            labelStyle: {
                fontSize: 10
            },
            // axisTitle: "Size",
            // visibleRange: new NumberRange(3, 7),
            // visibleRangeSizeLimit: new NumberRange(10, 20),
            // visibleRangeLimit: new NumberRange(-1, 20),
            growBy: new NumberRange(0.2, 0.2),
            autoRange: EAutoRange.Always,
            isVisible: true
        });
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(...yAxes);

    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

    const metricsRenderableSeries = getMetricsRenderableSeries(wasmContext, metricsData);
    sciChartSurface.renderableSeries.add(...metricsRenderableSeries);

    sciChartSurface.chartModifiers.add(
        // new RolloverModifier({ snapToDataPoint: false }),
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new RubberBandXyZoomModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } })
    );
    return { sciChartSurface };
};

export const getDataSeriesMetricsChartInitFunction = (otherData: ReturnType<typeof getDataSeriesMetrics> = []) => {
    // const currentMetrics = getDataSeriesMetrics();
    const metrics = otherData;
    console.log("ds metrics", metrics);
    return async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface } = await SciChartSurface.create(rootElement);
        return configureDataSeriesMetricsChart(sciChartSurface, metrics);
    };
};
