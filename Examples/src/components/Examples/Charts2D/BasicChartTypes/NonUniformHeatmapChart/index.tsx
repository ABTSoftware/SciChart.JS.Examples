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
import {appTheme} from "../../../theme";

const divElementId = "chart";

const drawExample = async () => {

    // Create a SciChartSurface with Theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create an X, Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));

    // Create some data for the heatmap as a 2d array
    const heatmapWidth = 7;
    const heatmapHeight = 4;
    const zValues = Array.from(Array(heatmapHeight));
    zValues.forEach((row, index, collection) => {
        collection[index] = Array.from(Array(heatmapWidth));
    });
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


    // Create the NonUniform Heatmap Series
    const heatmapSeries = new NonUniformHeatmapRenderableSeries(wasmContext, {
        // DataSeries defines data. This contains zValues 2D array plus the x and y cell offsets
        dataSeries: new NonUniformHeatmapDataSeries(wasmContext, { zValues, xCellOffsets, yCellOffsets }),
        // Color map defines how heatmap cells map to colours between minimum & maximum
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 60,
            gradientStops: [
                { offset: 0, color: appTheme.DarkIndigo },
                { offset: 0.2, color: appTheme.Indigo },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 1, color: appTheme.VividPink },
            ]
        }),
        // optional settings
        opacity: 0.77,
        // values outside of the colorMap.min/max will be filled with the colours at edge of the colormap
        fillValuesOutOfRange: true,
        // add datalabels to the cells of the heatmap
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 16,
            },
            color: appTheme.ForegroundColor
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
