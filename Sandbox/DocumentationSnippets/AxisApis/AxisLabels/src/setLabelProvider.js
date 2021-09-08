import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {NumericLabelProvider} from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import {ENumericFormat} from "scichart/types/NumericFormat";

export async function setLabelProvider(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    // Create an XAxis with 2 Decimal Places
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 1)
    });
    xAxis.labelProvider = new NumericLabelProvider({
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        cursorLabelFormat: ENumericFormat.Decimal,
        cursorLabelPrecision: 2,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create a YAxis with 4 Decimal Places
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 4,
        cursorLabelFormat: ENumericFormat.Decimal,
        cursorLabelPrecision: 4,
    }));
}
