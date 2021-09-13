import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAutoRange} from "scichart/types/AutoRange";

export async function initAutoRange() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div");

    // Creating a NumericAxis and set AutoRange property
    const xAxis = new NumericAxis(wasmContext);
    xAxis.autoRange = EAutoRange.Always;
    sciChartSurface.xAxes.add(xAxis);

    // Creating a NumericAxis and set AutoRange in constructor
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
    }));
}
