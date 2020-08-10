import {SciChartSurface} from "scichart/charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/charting/Visuals/Axis/NumericAxis";

async function initSciChart() {
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
}

initSciChart();
