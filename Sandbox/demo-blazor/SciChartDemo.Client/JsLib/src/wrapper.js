import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";

let chartInstances = {};

function resolveContext(element) {
    return chartInstances.hasOwnProperty(element.id) && chartInstances[element.id];
}

export async function init(element) {
    let {sciChartSurface, wasmContext} = resolveContext(element);

    if (sciChartSurface === undefined) {
        const newContext = await SciChartSurface.create(element.id);
        sciChartSurface = newContext.sciChartSurface;
        wasmContext = newContext.wasmContext;
        chartInstances[element.id] = {sciChartSurface, wasmContext};
    }
}

export async function appendFastLineRenderableSeries(element, series) {

    const {sciChartSurface, wasmContext} = resolveContext(element);

    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const xyDataSeries = new XyDataSeries(wasmContext);
    series.dataSeries.map(({x, y}) => xyDataSeries.append(x, y));

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: series.stroke || "#ff6600",
        strokeThickness: series.strokeThickness || 2,
        dataSeries: xyDataSeries,
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.zoomExtents();
}

export async function unregister(element) {
    delete chartInstances[element.id];
}