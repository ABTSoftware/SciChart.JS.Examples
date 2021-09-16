import * as React from "react";
import { SciChartSurface } from "scichart";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { closeValues, dateValues as xValues, highValues, lowValues, openValues } from "./data/data";
import { FastOhlcRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastOhlcRenderableSeries";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { SweepAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import classes from "../../../../Examples/Examples.module.scss";
import { SmartDateLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/SmartDateLabelProvider";
import {ENumericFormat} from "scichart/types/NumericFormat";

const divElementId = "chart";

// SCICHART EXAMPLE
const drawExample = async () => {

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add an XAxis of type CategoryAxis - which collapses gaps in stock market data
    // SmartLabelProvider returns useful labels for stock market data
    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, {
        labelProvider: new SmartDateLabelProvider(),
        growBy: new NumberRange(0.05, 0.05)
    }));

    // Create a NumericAxis on the YAxis with 4 Decimal Places
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(1.1, 1.2),
        growBy: new NumberRange(0.1, 0.1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 4,
    }));

    // Create the Ohlc series and add to the chart
    sciChartSurface.renderableSeries.add(new FastOhlcRenderableSeries(wasmContext, {
        dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
        strokeThickness: 1,
        dataPointWidth: 0.7,
        strokeUp: "#50ff50",
        strokeDown: "#ff5050",
        animation: new SweepAnimation({ duration: 800, fadeEffect: true })
    }));

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function OhlcChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
