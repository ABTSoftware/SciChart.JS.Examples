import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {TrianglePointMarker} from "scichart/Charting/Visuals/PointMarkers/TrianglePointMarker";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import {SweepAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import {appTheme} from "../../../theme";

// tslint:disable:no-empty

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsThemeMid });

    // Create X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Create some xValues, yValues arrays
    const xValues = Array.from({length: 250}, (x,i) => i);
    const yValues = xValues.map(x => 3 * x + x * Math.random());
    const y2Values = xValues.map(x => x + (x * Math.random()));

    // Create a Scatter Series with EllipsePointMarker
    // Multiple point-marker types are available including Square, Triangle, Cross and Sprite (custom)
    sciChartSurface.renderableSeries.add(new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 14,
            height: 14,
            strokeThickness: 0,
            fill: appTheme.VividSkyBlue,
        }),
        opacity: 0.67,
        animation: new SweepAnimation({ duration: 600, fadeEffect: true })
    }));

    // Add a second scatter chart with a different pointmarker
    sciChartSurface.renderableSeries.add(new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values }),
        pointMarker: new TrianglePointMarker(wasmContext, {
            width: 15,
            height: 15,
            strokeThickness: 0,
            fill: appTheme.VividOrange,
        }),
        opacity: 0.77,
        animation: new SweepAnimation({ duration: 600, fadeEffect: true, delay: 200 })
    }));

    // Optional: Add Interactivity Modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ScatterChart() {
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
