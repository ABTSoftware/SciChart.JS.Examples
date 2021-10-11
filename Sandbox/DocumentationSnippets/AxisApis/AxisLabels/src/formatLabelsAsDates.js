import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {CursorModifier} from "scichart/Charting/ChartModifiers/CursorModifier";

export async function formatLabelsAsDates(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    const minDate = 1609459200; // Unix datestamp for 1st Jan 2021
    const maxDate = 1612137600; // Unid datestamp for 1st Feb 2021

    // Create an XAxis with Date label format
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_DDMMYY,
        cursorLabelFormat: ENumericFormat.Date_DDMMYYYY,
        visibleRange: new NumberRange(minDate, maxDate)
    }));

    // Create a YAxis
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a cursor so you can see the cursor label formatting
    sciChartSurface.chartModifiers.add(new CursorModifier());
}
