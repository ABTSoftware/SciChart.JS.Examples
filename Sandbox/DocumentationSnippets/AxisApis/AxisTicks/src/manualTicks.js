import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";

export async function manualTicks(divId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId);

    const xAxis = new NumericAxis(wasmContext, { axisTitle: "majorDelta 2, minorDelta 1"});

    // When autoTicks is false, you must specify majorDelta and minorDelta
    xAxis.autoTicks = false;

    // Have a major gridline every 2 units on the axis
    xAxis.majorDelta = 2;

    // Have a minor gridline every 1 unit on the axis
    xAxis.minorDelta = 1;


    // Properties may also be set as constructor options
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "majorDelta 1, minorDelta 0.2",
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 0.2,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
}
