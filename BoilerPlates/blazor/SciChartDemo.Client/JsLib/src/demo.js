import {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    FastLineRenderableSeries
} from "scichart";

let chartInstances = {};

export async function initSciChart(element, dotnetHelper) {

    let {sciChartSurface, wasmContext} = chartInstances.hasOwnProperty(element.id) && chartInstances[element.id];

    if (sciChartSurface === undefined) {
        const newContext = await SciChartSurface.create(element.id);
        sciChartSurface = newContext.sciChartSurface;
        wasmContext = newContext.wasmContext;
        chartInstances[element.id] = {sciChartSurface, wasmContext};
    }
}

export async function unregisterChart(element) {
    delete chartInstances[element.id];
}

export async function appendRenderableSeries(element, series) {

    let {sciChartSurface, wasmContext} = chartInstances.hasOwnProperty(element.id) && chartInstances[element.id];

    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Create an XyDataSeries as data source
    const xyDataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        xyDataSeries.append(i, Math.sin(i * 0.1));
    }

    // Create and add a line series to the chart
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#ff6600",
        strokeThickness: 5,
        dataSeries: xyDataSeries,
    });
    sciChartSurface.renderableSeries.add(lineSeries);
    sciChartSurface.zoomExtents();

}
