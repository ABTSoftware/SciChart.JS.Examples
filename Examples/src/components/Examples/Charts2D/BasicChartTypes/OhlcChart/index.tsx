import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { closeValues, dateValues as xValues, highValues, lowValues, openValues } from "./data/data";
import {
    CategoryAxis,
    ENumericFormat,
    FastOhlcRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    OhlcDataSeries,
    SciChartSurface,
    SmartDateLabelProvider,
    SweepAnimation,
    ZoomExtentsModifier,
    ZoomPanModifier, SciChartJsNavyTheme
} from "scichart";

const divElementId = "chart";

// SCICHART EXAMPLE
const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Add an XAxis of type CategoryAxis - which collapses gaps in stock market data
    // SmartLabelProvider returns useful labels for stock market data
    sciChartSurface.xAxes.add(
        new CategoryAxis(wasmContext, {
            labelProvider: new SmartDateLabelProvider(),
            growBy: new NumberRange(0.05, 0.05)
        })
    );

    // Create a NumericAxis on the YAxis with 4 Decimal Places
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(1.1, 1.2),
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4
        })
    );

    // Create the Ohlc series and add to the chart
    sciChartSurface.renderableSeries.add(
        new FastOhlcRenderableSeries(wasmContext, {
            dataSeries: new OhlcDataSeries(wasmContext, { xValues, openValues, highValues, lowValues, closeValues }),
            strokeThickness: 1,
            dataPointWidth: 0.7,
            strokeUp: "#50ff50",
            strokeDown: "#ff5050",
            animation: new SweepAnimation({ duration: 800, fadeEffect: true })
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
            });
        };
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
