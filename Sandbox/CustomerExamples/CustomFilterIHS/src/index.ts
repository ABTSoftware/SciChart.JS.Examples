import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { XyCustomFilter } from 'scichart/Charting/Model/Filters/XyCustomFilter';
import { RolloverModifier } from 'scichart/Charting/ChartModifiers/RolloverModifier';
import { CursorModifier } from 'scichart/Charting/ChartModifiers/CursorModifier';

async function initSciChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');
    // Create an X,Y Axis and add to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0,100), labelPrecision: 0, axisTitle: "Percentile" }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1), labelPrecision: 0, axisTitle:"Wealth" }));

    const dataSeries = new XyDataSeries(wasmContext);
    // Generate data that approximates real world wealth distribution
    let y = -1000;
    for (let x = 1; x <= 100; x++) {
        if (x < 10) {
            y = y / 2;
        } else if (x < 80) {
            y = y + 1;
        } else {
            y = y*1.4;
        }
        dataSeries.append(x,y);
    }
    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries
    });
    sciChartSurface.renderableSeries.add(lineSeries1);
    sciChartSurface.chartModifiers.add(new CursorModifier());

    // Create Transformed chart
    const { sciChartSurface: sciChartSurface2, wasmContext: wasmContext2 } = await SciChartSurface.create('scichart-root2');
    sciChartSurface2.xAxes.add(new NumericAxis(wasmContext2, { visibleRange: new NumberRange(0,100), labelPrecision: 0, axisTitle: "Percentile" }));
    sciChartSurface2.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1), axisTitle:"Transformed Wealth" }));

    // Inverse hyperbolic sine filter
    const ihsFilter = new XyCustomFilter(dataSeries, { filterFunction: ((i, y) => Math.log(y + Math.sqrt(1 + y*y))) });

    const lineSeriesTransformed = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries: ihsFilter
    });
    sciChartSurface2.renderableSeries.add(lineSeriesTransformed);
    sciChartSurface2.chartModifiers.add(new CursorModifier());
}

initSciChart();
