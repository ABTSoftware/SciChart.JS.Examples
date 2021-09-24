import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { OhlcDataSeries } from 'scichart/Charting/Model/OhlcDataSeries';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { FastCandlestickRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyLinearTrendFilter } from 'scichart/Charting/Model/Filters/XyLinearTrendFilter';
import { EDataSeriesField } from "scichart/Charting/Model/Filters/XyFilterBase";

export async function initSciChart3() {

    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-3');

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Original Data
    const dataSeries = new OhlcDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        openValues: [1, 3, 2, 4, 6],
        highValues: [5, 4, 7, 6.5, 8],
        lowValues: [0.5, 2, 1.5, 2.5, 4],
        closeValues: [3, 2.5, 5, 3, 5],
    });
    const rsCandles = new FastCandlestickRenderableSeries(wasmContext, { dataSeries });

    // Create the filters, passing in the original series and specifying the input field
    const linearTrendHigh = new XyLinearTrendFilter(dataSeries, { field: EDataSeriesField.High });
    const linearTrendLow = new XyLinearTrendFilter(dataSeries, { field: EDataSeriesField.Low });
    const rsHigh = new FastLineRenderableSeries(wasmContext, { dataSeries: linearTrendHigh, stroke: "#ddff33", strokeThickness: 3 });
    const rsLow = new FastLineRenderableSeries(wasmContext, { dataSeries: linearTrendLow, stroke: "#ff5599", strokeThickness: 3 });

    sciChartSurface.renderableSeries.add(rsCandles, rsHigh, rsLow);
}

