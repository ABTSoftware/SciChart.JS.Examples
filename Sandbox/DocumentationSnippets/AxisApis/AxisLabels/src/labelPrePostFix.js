import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {ENumericFormat} from "scichart/types/NumericFormat";

export async function setLabelPrePostFix(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    // Create an XAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));

    // Set Label Post/Prefix properties in the axis constructor
    // or on LabelProvider property
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        labelPrefix: "$",
        labelPostfix: " USD"
    }));
}
