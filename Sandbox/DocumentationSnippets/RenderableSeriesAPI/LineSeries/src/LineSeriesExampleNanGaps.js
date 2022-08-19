import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";

export const drawLineSeriesNanGaps = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, NaN, 4.0, 5.0, 5.5, NaN, 4.0, 3.0];

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 5,
        dataSeries: xyDataSeries,
        drawNaNAs: ELineDrawMode.DiscontinuousLine
    });

    sciChartSurface.renderableSeries.add(lineSeries);
};
