import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAutoRange} from "scichart/types/AutoRange";
import {EAxisAlignment} from "scichart/types/AxisAlignment";

export async function initNumericAxis() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-1");

    // Creating a NumericAxis as an XAxis on the bottom
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        axisTitle: "X Axis",
        axisAlignment: EAxisAlignment.Bottom,
        autoRange: EAutoRange.Once,
    }));

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        axisTitle: "Y Axis",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Once,
    }));
}
