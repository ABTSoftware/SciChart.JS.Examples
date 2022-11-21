export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";

import classes from "../../../../Examples/Examples.module.scss";
import {WaveAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {RandomWalkGenerator} from "../../../ExampleData/RandomWalkGenerator";
import {appTheme} from "../../../theme";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
        })
    );

    const POINTS = 1000;

    // Create arrays of x, y values (just arrays of numbers)
    const { xValues, yValues } = new RandomWalkGenerator().Seed(0).getRandomWalkSeries(POINTS);

    // Create a Mountain Series and add to the chart
    sciChartSurface.renderableSeries.add(new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        zeroLineY: 0.0,
        fill: appTheme.VividSkyBlue, // when a solid color is required, use fill
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.MutedSkyBlue, offset: 0 },
            { color: "Transparent", offset: 1 }
        ]),
        animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 0 })
    }));

    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(),
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface };
}

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function MountainChart() {
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
`;