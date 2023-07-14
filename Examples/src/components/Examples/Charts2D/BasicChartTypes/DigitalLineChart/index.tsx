import * as React from "react";
import {
    EllipsePointMarker,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    ScaleAnimation,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create the X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Create some xValues, yValues arrays
    const { xValues, yValues } = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(25);

    // Create and add a line series to the chart
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke: appTheme.VividPink,
            strokeThickness: 3,
            // Flag isDigitalLine turns a normal line series into a digital line series
            isDigitalLine: true,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 11,
                height: 11,
                fill: appTheme.VividPink,
                stroke: appTheme.PaleSkyBlue,
                strokeThickness: 2
            }),
            animation: new ScaleAnimation({ zeroLine: -1, duration: 500, fadeEffect: true })
        })
    );

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
