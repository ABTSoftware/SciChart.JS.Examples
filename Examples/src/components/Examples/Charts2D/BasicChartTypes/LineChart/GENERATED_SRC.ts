export const code = `import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { Point } from "scichart/Core/Point";
import { EAnimationType } from "scichart/types/AnimationType";
import { ShadowEffect } from "scichart/Charting/Visuals/RenderableSeries/ShadowEffect";
import classes from "../../../../Examples/Examples.module.scss";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { SciChartJSDarkTheme } from "scichart/Charting/Themes/SciChartJSDarkTheme";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create the X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Create some xValues, yValues arrays
    const xValues = Array.from({length: 100}, (x,i) => i);
    const yValues = xValues.map(x => Math.sin(x * 0.1));

    // Create and add a line series to the chart
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: "#ff6600",
        strokeThickness: 5,
        animation: { type: EAnimationType.Wave, options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 1000 } },
        effect: new ShadowEffect(wasmContext, { brightness: 1, offset: new Point(5,-10), range: 0.7})
    }));

    // // OPTIONAL: PaletteProvider APIs allow you to add per-point colouring based on a rule, or a gradient
    // lineSeries.paletteProvider = PaletteFactory.createGradient(
    //     wasmContext,
    //     new GradientParams(new Point(0, 0), new Point(1, 1), [
    //         { color: "red", offset: 0 },
    //         { color: "pink", offset: 0.2 },
    //         { color: "yellow", offset: 0.5 },
    //         { color: "purple", offset: 0.7 },
    //         { color: "green", offset: 1 }
    //     ])
    // );

    // OPTIONAL: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LineChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;