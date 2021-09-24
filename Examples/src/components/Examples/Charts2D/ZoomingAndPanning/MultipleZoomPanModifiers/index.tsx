import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { SweepAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import { EExecuteOn } from "scichart/types/ExecuteOn";
import { easing } from "scichart/Core/Animations/EasingFunctions";

import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-8000, 8000),
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-8000, 8000),
    }));

    const dataSeries = new XyyDataSeries(wasmContext);

    const centerX = 0;
    const centerY = 0;
    const a = 1
    const b = 1.5;
    for (let i = 0; i < 1000; ++i) {
        const angle = 0.1 * i;
        const x = centerX + (a + b * angle) * Math.cos(angle) * i;
        const y1 = centerY + (a + b * angle) * Math.sin(angle) * i;
        const y2 = centerY + (a + b * angle + 3) * Math.sin(angle) * i;
        dataSeries.append(x, y1, y2)
    }

    // Create the band series and add to the chart
    const rendSeries = new FastBandRenderableSeries(wasmContext, { dataSeries, strokeThickness: 2 });
    rendSeries.fill = "rgba(53, 73, 170, 0.47)";
    rendSeries.fillY1 = "rgba(202, 73, 94, 0.6)";
    rendSeries.stroke = "#FF1919FF";
    rendSeries.strokeY1 = "#279B27FF";
    rendSeries.animation = new SweepAnimation({ duration: 1500 });
    sciChartSurface.renderableSeries.add(rendSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        // use RubberBandXyZoomModifier with Right Mouse Button
        // use easingFunction to animate zoom
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton, easingFunction: easing.elastic }),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        // use PinchZoomModifier to allow zooming with pinch gesture on touch devices 
        new PinchZoomModifier(),
    );

    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

export default function ZoomPanUsage() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    /*
     * In order to prevent conflicts of touch actions on the chart with the default browser gestures behavior, 
     * touch-actions css property can be used. https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
     * 
     * Suggestions:
     * - if a chart uses some Zoom/Pan modifiers or draggable elements:
     *   touch-actions property should be set to 'none' to prevent default browser touch behavior
     *   (or the value can be set to allow only specific type of default touch actions);
     * 
     * - if a chart doesn't allow zooming/panning:
     *   prefer leaving the default 'touch-actions: auto' to allow default browser gestures upon the chart element.
     */

    // make sure default browser touch behavior doesn't conflict with the chart modifiers functionality
    return <div id={divElementId} style={{ touchAction: "none" }} className={classes.ChartWrapper} />;
}
