import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAxisAlignment} from "scichart/types/AxisAlignment";

export async function stylingAxisBorderAndBackground(divId) {

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    const yAxis = new NumericAxis(wasmContext, {
        axisTitleStyle: { color: "#368BC1" },
        id: "RightAxis",
        axisTitle: "Right Axis",
        axisBorder: {
            borderLeft: 1,
            color: "#368BC1" // Blue color
        },
        backgroundColor: "#368BC111"
    });

    const leftYAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        axisTitleStyle: { color: "#228B22" },
        axisTitle: "Left Axis",
        axisBorder: {
            borderRight: 1,
            color: "#228B22" // Green color
        },
        backgroundColor: "#228B2222"
    });

    const xAxis = new NumericAxis(wasmContext, {
        axisTitleStyle: { color: "#EEEEEE" },
        axisTitle: "X Axis",
        axisBorder: {
            borderTop: 1,
            color: "#EEEEEE" // Green color
        },
        backgroundColor: "#EEEEEE11"
    });

    sciChartSurface.yAxes.add(yAxis, leftYAxis);
    sciChartSurface.xAxes.add(xAxis);
}
