import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import classes from "../../../../Examples/Examples.module.scss";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {appTheme} from "../../../theme";
import {RandomWalkGenerator} from "../../../ExampleData/RandomWalkGenerator";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            axisTitle: "Y Axis",
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
            {color: appTheme.MutedOrange, offset: 0},
            {color: "Transparent", offset: 1}
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
