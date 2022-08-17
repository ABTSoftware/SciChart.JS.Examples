import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { LogarithmicAxis } from 'scichart/Charting/Visuals/Axis/LogarithmicAxis';
import { ZoomPanModifier } from 'scichart/Charting/ChartModifiers/ZoomPanModifier';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import {ENumericFormat} from "scichart/types/NumericFormat";

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });

    // Specify a logarithmic Y-Axis with:
    // Logarithmic base = 10
    // Scientific label format e.g. 1x10^4
    // autoTicks=false meaning we specify major/minor delta
    // majorDelta = 1 meaning a label every 1x10^1
    // minorDelta = 0.1 meaning a minor gridline every 10th between major gridlines
    const yAxis = new LogarithmicAxis(wasmContext, {
        logBase: 10,
        labelFormat: ENumericFormat.Scientific,
        majorDelta: 1,
        minorDelta: 0.1,
        autoTicks: false,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 1; i < 300; i++) {
        const y = Math.pow(i / 10, Math.E);
        dataSeries.append(i, y);
    }

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries
    });

    sciChartSurface.renderableSeries.add(lineSeries1);
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier(), new ZoomExtentsModifier());
}

initSciChart();
