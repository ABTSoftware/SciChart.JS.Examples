import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { ThresholdLinePaletteProvider } from "./CustomPaletteProviderJs";

export const drawDigitalLineSeriesPaletteProvider = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    for(let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "White",
        strokeThickness: 5,
        dataSeries: xyDataSeries,
        isDigitalLine: true,
        paletteProvider: new ThresholdLinePaletteProvider(
            "Red",
            (yValue) => yValue >= 0.0),
    });

    sciChartSurface.renderableSeries.add(lineSeries);
};
