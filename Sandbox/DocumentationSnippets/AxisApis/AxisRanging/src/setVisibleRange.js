import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";

export async function setVisibleRange() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-2");

    // Create an XAxis and set visibleRange
    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(5, 10);
    sciChartSurface.xAxes.add(xAxis);

    // Create a YAxis and set visibleRange via constructor options
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(20, 30),
    }));

    // Get the xAxis visibleRange
    const range = xAxis.visibleRange;
    console.log(`Axis VisibleRange is ${range.min}, ${range.max}`);

    // Note: Treat NumberRange as immutable.
    // Set a new NumberRange on visibleRange property to update the chart
}
