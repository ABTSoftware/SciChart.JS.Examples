import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";

export async function listenToVisibleRange() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-4")

    // Create a chart with X, Y axis
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.yAxes.add(yAxis);

    // Listen to visibleRangeChanged callbacks
    xAxis.visibleRangeChanged.subscribe((args) => {
        console.log(`VisibleRange is ${args.visibleRange.min}, ${args.visibleRange.max}`);
    });

    // Add a ZoomPan modifier to trigger visiblerange changes by dragging the chart
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
}
