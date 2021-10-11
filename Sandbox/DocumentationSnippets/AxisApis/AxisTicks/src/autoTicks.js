import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";

export async function autoTicks(divId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId);

    const xAxis = new NumericAxis(wasmContext, { axisTitle: "maxAutoTicks 10, minorsPerMajor 2"});

    // Default true, automatically calculate axis.MajorDelta, axis.MinorDelta
    xAxis.autoTicks = true;

    // This is a hint which defines the max number of major gridlines/labels visible at any one time.
    // The actual number of gridlines may be lower than this depending on zoom level
    xAxis.maxAutoTicks = 10;

    // For every major gridline, this defines how many minor gridlines there are. Default is 5.
    xAxis.minorsPerMajor = 2;

    // Properties may also be set as constructor options
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "maxAutoTicks 5, minorsPerMajor 4",
        autoTicks: true,
        maxAutoTicks: 5,
        minorsPerMajor: 4
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
}
