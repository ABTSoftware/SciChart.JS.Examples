import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import { NonUniformHeatmapDataSeries } from "scichart/Charting/Model/NonUniformHeatmapDataSeries";
import { NonUniformHeatmapRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/NonUniformHeatmapRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisType } from "scichart/types/AxisType";
import { ESeriesType } from "scichart/types/SeriesType";
import { chartBuilder } from "scichart/Builder/chartBuilder";

const divElementId1 = "scichart-div-1";
const divElementId2 = "scichart-div-2";
const divElementId3 = "scichart-div-3";
const divElementId4 = "scichart-div-4";
const divElementId5 = "scichart-div-5";
const divElementId6 = "scichart-div-6";
const divElementId7 = "scichart-div-7";
const divElementId8 = "scichart-div-8";


export const basicNonUniformHeatmapChart = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));


    const gradientStops = [
        { offset: 0, color: "yellow" },
        { offset: 0.5, color: "blue" },
        { offset: 1, color: "red" }
    ];

    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 4,
        gradientStops
    });

    const zValues = [
        [0, 2, 3.4],
        [5, 3, 4],
        [3, 1.5, -1],
    ];

    const dataSeries = new NonUniformHeatmapDataSeries(wasmContext, {
        zValues,
        xCellOffsets: [0, 10, 25, 40],
        yCellOffsets: [100, 200, 300, 400]
    });

    const heatmapSeries = new NonUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries,
        colorMap,
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
};

export const heatmapEdgeValues = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));


    const gradientStops = [
        { offset: 0, color: "yellow" },
        { offset: 0.5, color: "blue" },
        { offset: 1, color: "red" }
    ];

    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 4,
        gradientStops
    });

    const zValues = [
        [0, 2, 3.4],
        [5, 3, 4],
        [3, 1.5, -1],
    ];

    const dataSeries = new NonUniformHeatmapDataSeries(wasmContext, {
        zValues,
        xCellOffsets: [0, 10, 25, 40],
        yCellOffsets: [100, 200, 300, 400]
    });

    const heatmapSeries = new NonUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries,
        colorMap,
        fillValuesOutOfRange: false,
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
};

export const nonUniformHeatmapOffsetsMapping = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const gradientStops = [
        { offset: 0, color: "blue" },
        { offset: 0.3, color: "white" },
        { offset: 0.5, color: "green" },
        { offset: 0.7, color: "yellow" },
        { offset: 1, color: "red" }
    ];
    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 100,
        gradientStops
    });

    // Define heatmap cell values:
    // - create an empty 2D array;
    const heatmapWidth = 7;
    const heatmapHeight = 4;
    const zValues = Array.from(Array(heatmapHeight));
    zValues.forEach((row, index, collection) => {
        collection[index] = Array.from(Array(heatmapWidth));
    });

    // - fill 2D array with some data.
    let maxValue = Number.MIN_VALUE;
    for (let x = 0; x < heatmapWidth; x++) {
        for (let y = 0; y < heatmapHeight; y++) {
            zValues[y][x] = 3.5 * ((heatmapHeight - y) * (heatmapWidth - x));
            maxValue = Math.max(maxValue, zValues[y][x]);
        }
    }

    // arrays with cell offsets
    const xRangeOffsetsSource = [0, 10, 20, 26, 36, 60, 72, 84];
    const yRangeOffsetsSource = [100, 250, 390, 410, 600];

    const dataSeries = new NonUniformHeatmapDataSeries(wasmContext, {
        zValues,
        xCellOffsets: i => xRangeOffsetsSource[i],
        yCellOffsets: i => yRangeOffsetsSource[i]
    });

    const heatmapSeries = new NonUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries,
        colorMap,
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
};

export const nonUniformHeatmapWithBuilderAPI = async (divElementId: string) => {
    const gradientStops = [
        { offset: 0, color: "yellow" },
        { offset: 0.5, color: "blue" },
        { offset: 1, color: "red" }
    ];

    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 4,
        gradientStops
    });

    const zValues = [
        [0, 2, 3.4],
        [5, 3, 4],
        [3, 1.5, -1],
    ];

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) } },
        yAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) } },
        series: {
            type: ESeriesType.NonUniformHeatmapSeries,
            options: { colorMap },
            heatmapData: {
                zValues,
                xCellOffsets: [0, 10, 25, 40],
                yCellOffsets: [100, 200, 300, 400]
            }
        }
    });
}

basicNonUniformHeatmapChart(divElementId1);
heatmapEdgeValues(divElementId2);
nonUniformHeatmapOffsetsMapping(divElementId3);
nonUniformHeatmapWithBuilderAPI(divElementId4);

