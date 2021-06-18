import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';

type DataResult = {
    xValues: number[];
    yValues: number[];
};
type DataCallback = (result: DataResult) => void;

const getRandomData = (dataLength: number, timeout: number, callback: DataCallback) => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    // Populate with some data
    for (let i = 0; i < dataLength; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.01));
    }
    setTimeout(() => callback({ xValues, yValues }), timeout);
};

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
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    getRandomData(100, 1000, data => {
        const { xValues, yValues } = data;
        const xyDataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries,
            stroke: 'green',
            strokeThickness: 10
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    });
}

initSciChart();
