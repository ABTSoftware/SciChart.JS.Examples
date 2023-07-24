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
