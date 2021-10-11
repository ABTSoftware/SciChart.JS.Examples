import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";

export async function setGrowBy() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-3");

    // set the growBy factor. This adds a fractional padding when zooming to fit
    // e.g. this will add 10% padding to visibleRange.min and 5% padding to visibleRange.max
    const xAxis = new NumericAxis(wasmContext);
    xAxis.growBy = new NumberRange(0.1, 0.04);
    sciChartSurface.xAxes.add(xAxis);

    // Growby may also be set in constructor options
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
    }));
}
