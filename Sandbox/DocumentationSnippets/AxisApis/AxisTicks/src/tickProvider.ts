import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumericTickProvider} from "scichart/Charting/Numerics/TickProviders/NumericTickProvider";
import {NumberRange} from "scichart/Core/NumberRange";
import {TSciChart} from "scichart/types/TSciChart";

// A custom TickProvider can be used to have full control over axis tick (gridline and label) interval spacing
// use this API if you want to create complex rules on gridline/intervals, or dynamically changing rules
class CustomTickProvider extends NumericTickProvider {
    constructor(wasmContext: TSciChart) {
        super(wasmContext);
    }
    getMinorTicks(minorDelta: number, majorDelta: number, visibleRange: NumberRange): number[] {
        // Todo here: calculate your tick spacing based on axis minorDelta, majorDelta and visibleRange
        // Note we do not return major ticks here, so minor ticks exclude the majors
        return [0.2, 0.4, 0.6, 0.8,
            1.2, 1.4, 1.6, 1.8,
            2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8,
            4.2, 4.4, 4.6, 4.8, 5.0, 5.2, 5.4, 5.6, 5.8, 6.2, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8];
    }

    getMajorTicks(minorDelta: number, majorDelta: number, visibleRange: NumberRange): number[] {
        // Todo here: calculate your tick spacing based on axis minorDelta, majorDelta and visibleRange
        // Note we return the major tick intervals and label intervals here
        return [0,1,2,4,8];
    }
}

export async function tickProvider(divId: string) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId);

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Custom TickProvider",
        visibleRange: new NumberRange(0, 8)
    });
    xAxis.tickProvider = new CustomTickProvider(wasmContext);

    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Custom TickProvider",
        visibleRange: new NumberRange(0, 8)
    });
    yAxis.tickProvider = new CustomTickProvider(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
}
