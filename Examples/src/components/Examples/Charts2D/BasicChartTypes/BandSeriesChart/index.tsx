import * as React from "react";
import {
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyyDataSeries,
    NumericAxis,
    FastBandRenderableSeries,
    SciChartSurface,
    NumberRange,
    SweepAnimation
} from "scichart";
import classes from "../../../styles/Examples.module.scss";
import { appTheme } from "scichart-example-dependencies";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.4, 0.4) }));

    // Create some data for the example. We need X, Y and Y1 values
    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }

    // Create the band series and add to the chart
    // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
            strokeThickness: 3,
            fill: appTheme.VividOrange + "33",
            fillY1: appTheme.VividSkyBlue + "33",
            stroke: appTheme.VividOrange,
            strokeY1: appTheme.VividSkyBlue,
            animation: new SweepAnimation({ duration: 800 })
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
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
