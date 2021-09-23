import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { CentralAxesLayoutManager } from "scichart/Charting/LayoutManager/CentralAxesLayoutManager";

export async function innerAxisParamUsage(divElementId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { isInnerAxis: true });
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

}

export async function innerAxisPropertyUsage(divElementId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    xAxis.isInnerAxis = true;
    
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

}

export async function centralAxes(divElementId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.layoutManager = new CentralAxesLayoutManager();
}
