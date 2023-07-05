import * as React from "react";
import {
    FastMountainRenderableSeries,
    GradientParams,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    Point,
    RubberBandXyZoomModifier,
    SciChartSurface,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier
} from "scichart";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            axisTitle: "Y Axis"
        })
    );

    const POINTS = 200;

    // Create arrays of x, y values
    const xValues = Array.from(Array(POINTS).keys());
    const yValues = new RandomWalkGenerator().Seed(0).getRandomWalkSeries(POINTS).yValues;

    // Create a Mountain Series and add to the chart
    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        zeroLineY: 0.0,
        fill: appTheme.VividOrange, // when a solid color is required, use fill
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.MutedOrange, offset: 0 },
            { color: "Transparent", offset: 1 }
        ]),
        isDigitalLine: true,
        animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 0 })
    });
    sciChartSurface.renderableSeries.add(mountainSeries);

    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function DigitalMountainChart() {
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
