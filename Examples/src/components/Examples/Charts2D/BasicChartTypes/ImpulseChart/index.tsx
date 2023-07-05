import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { appTheme } from "scichart-example-dependencies";
import {
    NumericAxis,
    XyDataSeries,
    SciChartSurface,
    FastImpulseRenderableSeries,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    EAnimationType,
    EllipsePointMarker,
    NumberRange
} from "scichart";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis", growBy: new NumberRange(0.1, 0.1) }));

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 70; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.2) * -Math.log(i / 100));
    }

    const impulseSeries = new FastImpulseRenderableSeries(wasmContext, {
        fill: appTheme.VividPink,
        strokeThickness: 2,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 1, height: 1 }),
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        animation: { type: EAnimationType.Wave, options: { duration: 500, delay: 200, fadeEffect: true } }
    });
    sciChartSurface.renderableSeries.add(impulseSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface };
};

// React component needed as our examples app is react.
export default function ImpulseChart() {
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
