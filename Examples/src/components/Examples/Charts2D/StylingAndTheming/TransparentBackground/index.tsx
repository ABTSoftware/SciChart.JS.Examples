import * as React from "react";
import {classes} from "scichart-example-dependencies";
import {appTheme} from "scichart-example-dependencies";
import BackgroundImage from "./BackgroundGradient.jpg";

import {
    SciChartSurface,
    NumericAxis,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    SciChartJSLightTheme,
    FastBubbleRenderableSeries,
    XyzDataSeries,
    EllipsePointMarker,
    NumberRange,
    SplineLineRenderableSeries,
    SweepAnimation,
    FastColumnRenderableSeries,
    XyDataSeries,
    WaveAnimation,
    ELabelProviderType
} from "scichart";

const divElementId = "chart";

const drawExample = async () => {
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme(),
    });

    // Set the background to Transparent to show the underlying DOM through
    sciChartSurface.background = "Transparent";

    const axisOptionsCommon = {
        axisBandsFill: "#33333311",
        majorGridLineStyle: {color: "#FFFFFF55"},
        minorGridLineStyle: {color: "#FFFFFF22"},
        labelStyle: {color: "#EEE"},
        axisTitleStyle: {color: "#EEE"},
    };

    // Add X,Y axis. Note that Axis.axisBandsFill must be modified to show the background through.
    // This is done in the axisOptions above
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        axisBorder: {borderTop: 1, color: "#ccc"},
        growBy: new NumberRange(0.1, 0.1),
        axisTitle: "Quarter (Year)",
        labelProvider: {
            type: ELabelProviderType.Text,
            options: {
                labels: [
                    "Q1 (2020)", "Q1 (2021)", "Q1 (2022)", "Q1 (2023)",
                ]
            }
        }
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        axisBorder: {borderLeft: 1, color: "#ccc"},
        growBy: new NumberRange(0.0, 0.1),
        axisTitle: "Sales $(Billions)"
    }));

    // Add some series
    //

    // Line series with spline interpolation
    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3],
            yValues: [2, 3.5, 3.0, 5]
        }),
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        animation: new SweepAnimation({duration: 500})
    }));

    // Bubble series
    sciChartSurface.renderableSeries.add(new FastBubbleRenderableSeries(wasmContext, {
        dataSeries: new XyzDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3],
            yValues: [2, 3.5, 3.0, 5],
            zValues: [30, 90, 40, 60]
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            strokeThickness: 2,
            stroke: appTheme.PaleSkyBlue,
            fill: appTheme.VividSkyBlue + "33",
        }),
        animation: new SweepAnimation({delay: 200, duration: 500, fadeEffect: true}),
    }));

    // Column series
    sciChartSurface.renderableSeries.add(new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3],
            yValues: [0.8, 1, 1, 1.1, 1.2, 5.2, 2.8, 2.7, 2.6, 2.6, 2.5, 2.5, 2.5, 2.6, 3.2, 4],
        }),
        stroke: appTheme.MutedSkyBlue,
        fill: appTheme.VividSkyBlue + "33",
        strokeThickness: 2,
        dataPointWidth: 0.57,
        cornerRadius: 10,
        animation: new WaveAnimation({delay: 400, duration: 600, fadeEffect: true})
    }));

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();

    return {sciChartSurface, wasmContext};
};

export default function TransparentBackground() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (<div className={classes.ChartWrapper}
                 style={{backgroundImage: `url(${BackgroundImage})`, backgroundSize: "100% 100%"}}>
        <div id={divElementId}/>
    </div>);
}
