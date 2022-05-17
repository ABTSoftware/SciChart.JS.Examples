import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {DateTimeNumericAxis} from "scichart/Charting/Visuals/Axis/DateTimeNumericAxis";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {NumberRange} from "scichart/core/NumberRange";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";

export async function initDateTimeNumericAxis() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-5");

    const endDate = new Date(2022, 6, 1).getTime() / 1000;
    const startDate = endDate - 50 * 24 * 60 * 60;
    // Create an XAxis on the bottom
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        axisTitle: "DateTimeNumeric X Axis",
        axisAlignment: EAxisAlignment.Bottom,
        visibleRange: new NumberRange(startDate, endDate)
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(xAxis);

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Numeric Y Axis",
        axisAlignment: EAxisAlignment.Left,
    }));

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
}
