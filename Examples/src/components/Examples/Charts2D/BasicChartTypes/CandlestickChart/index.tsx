import * as React from "react";
import {SciChartSurface} from "scichart";
import {CategoryAxis} from "scichart/Charting/Visuals/Axis/CategoryAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {OhlcDataSeries} from "scichart/Charting/Model/OhlcDataSeries";
import {FastCandlestickRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {closeValues, dateValues as xValues, highValues, lowValues, openValues} from "./data/data";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {WaveAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {SmartDateLabelProvider} from "scichart/Charting/Visuals/Axis/LabelProvider/SmartDateLabelProvider";

import classes from "../../../../Examples/Examples.module.scss";
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

    // Create and add the Candlestick series
    // The Candlestick Series requires a special dataseries type called OhlcDataSeries with o,h,l,c and date values
    sciChartSurface.renderableSeries.add(new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
        strokeThickness: 1,
        dataPointWidth: 0.5,
        brushUp: "#50ff50B2",
        brushDown: "#ff5050B2",
        strokeUp: "#50ff50",
        strokeDown: "#ff5050",
        animation: new WaveAnimation({ fadeEffect: true, duration: 800 })
    }));

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function CandlestickChart() {
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
