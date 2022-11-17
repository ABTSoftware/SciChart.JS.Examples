import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart";
import { NumberRange } from "scichart/Core/NumberRange";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { NonUniformHeatmapDataSeries } from "scichart/Charting/Model/NonUniformHeatmapDataSeries";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import { NonUniformHeatmapRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/NonUniformHeatmapRenderableSeries";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";

import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));

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

    // mapping functions that will calculate cell offsets based on heatmap width and height (zValues dimension sizes)
    const xCellOffsets = (i: number) => xRangeOffsetsSource[i];
    const yCellOffsets = (i: number) => yRangeOffsetsSource[i];

    const dataSeries = new NonUniformHeatmapDataSeries(wasmContext, { zValues, xCellOffsets, yCellOffsets });

    const heatmapSeries = new NonUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries,
        colorMap,
        // optional settings:
        fillValuesOutOfRange: true,
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 16,
            },
            color: "black"
        }
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);

    // add some interactivity
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new PinchZoomModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());

    return { sciChartSurface };
};

// React component needed as our examples app is react.
export default function NonUniformHeatmapChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div id={divElementId} className={classes.ChartWrapper} />
    );
}
