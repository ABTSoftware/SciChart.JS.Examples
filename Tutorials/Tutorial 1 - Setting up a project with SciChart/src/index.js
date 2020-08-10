import {SciChartSurface} from "scichart/charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/charting/Visuals/Axis/NumericAxis";

async function initSciChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // That's it! You just created your first SciChartSurface!
}

initSciChart();
