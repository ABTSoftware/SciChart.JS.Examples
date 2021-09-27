import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { XyScaleOffsetFilter } from 'scichart/Charting/Model/Filters/XyScaleOffsetFilter';

export async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id');

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Original Data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4],
        yValues: [1, 2, 3, 4],
    });
    const originalLine = new FastLineRenderableSeries(wasmContext, { dataSeries, stroke: '#5555ff' });

    // Create the filter, passing in the original series
    const scaleOffsetFilter = new XyScaleOffsetFilter(dataSeries, { scale: 2, offset: -3 });
    const filteredLine = new FastLineRenderableSeries(wasmContext, {
        dataSeries: scaleOffsetFilter,
        stroke: '#cc6600',
    });

    sciChartSurface.renderableSeries.add(originalLine, filteredLine);
}
