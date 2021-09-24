import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyRatioFilter } from 'scichart/Charting/Model/Filters/XyRatioFilter';
import { LegendModifier } from 'scichart/Charting/ChartModifiers/LegendModifier';

export async function initSciChart5() {

    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-5');

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Original Data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [4, 3, 2, 4, 6],
        dataSeriesName: "Original"
    });
    const originalLine = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: "#3333ff", strokeThickness: 3 });
    
    // Divisor Data
    const divisorSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5],
        yValues: [1, 2, 0.5, 3, 5],
        dataSeriesName: "Divisor"
    });
    const divisorLine = new FastLineRenderableSeries(wasmContext, { dataSeries: divisorSeries, stroke: "#339933", strokeThickness: 3 });

    // Create the filter, passing in the original series and divisorSeries
    const ratioFilter = new XyRatioFilter(dataSeries, { divisorSeries, dataSeriesName: "Ratio" });
    const ratioLine = new FastLineRenderableSeries(wasmContext, { dataSeries: ratioFilter, stroke: "#cc6600", strokeThickness: 3 });

    // Add all three to the chart
    sciChartSurface.renderableSeries.add(originalLine, divisorLine, ratioLine);

    // Add a legend to help show which is which
    sciChartSurface.chartModifiers.add(new LegendModifier());
}