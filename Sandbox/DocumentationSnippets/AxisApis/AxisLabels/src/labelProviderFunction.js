import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";

export async function labelProviderFunction(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    const minDate = 1609459200; // Unix datestamp for 1st Jan 2021
    const maxDate = 1612137600; // Unid datestamp for 1st Feb 2021

    // Create an XAxis
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(minDate, maxDate)
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create a YAxis
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.yAxes.add(yAxis);

    // Override X Axis label formatting to format as date strings
    xAxis.labelProvider.formatLabel = (dataValue, format) => {
        const unixDateStamp = dataValue;
        return new Date(unixDateStamp * 1000).toLocaleDateString("en-GB", {
            month: "numeric",
            year: "numeric",
            day: "numeric"
        });
    };

    // Override Y Axis label formatting to format as 4-decimal places
    yAxis.labelProvider.formatLabel = (dataValue, format) => {
        return dataValue.toFixed(4);
    };


}
