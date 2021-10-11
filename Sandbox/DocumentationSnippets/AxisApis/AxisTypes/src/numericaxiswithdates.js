import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAutoRange} from "scichart/types/AutoRange";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {NumericLabelProvider} from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import {ENumericFormat} from "scichart/types/NumericFormat";

export async function initNumericAxisWithDates() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-2");

    // Create an XAxis on the bottom
    const xAxis = new NumericAxis(wasmContext, {
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        axisTitle: "X Axis",
        axisAlignment: EAxisAlignment.Bottom,
        autoRange: EAutoRange.Once,
    });

    // Alternative Api. Set a LabelProvider with date formatting
    xAxis.labelProvider = new NumericLabelProvider({
        labelFormat: ENumericFormat.Date_DDMMYY,
        cursorLabelFormat: ENumericFormat.Date_DDMMYYYY,
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(xAxis);

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Y Axis",
        axisAlignment: EAxisAlignment.Left,
    }));
}
