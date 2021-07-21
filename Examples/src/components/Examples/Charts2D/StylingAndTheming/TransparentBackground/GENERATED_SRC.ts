export const code = `import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import classes from "../../../../Examples/Examples.module.scss";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import BackgroundImage from "./BackgroundGradient.jpg";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";
import {FastBubbleRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import {XyzDataSeries} from "scichart/Charting/Model/XyzDataSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {NumberRange} from "scichart/Core/NumberRange";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {SplineLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import {SweepAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import {FadeAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/FadeAnimation";
import {duration} from "@material-ui/core";
import {FastColumnRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {WaveAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {ShadowEffect} from "scichart/Charting/Visuals/RenderableSeries/ShadowEffect";
import {Point} from "scichart/Core/Point";

const divElementId = "chart";

const drawExample = async () => {
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme(),
    });

    // Set the background to Transparent to show the underlying DOM through
    sciChartSurface.background = "Transparent";

    const axisOptionsCommon = {
        axisBandsFill: "#33333311",
        drawMinorGridLines: false,
        majorGridLineStyle: {color: "#FFF"},
        labelStyle: {color: "#EEE"}
    };

    // Add X,Y axis. Note that Axis.axisBandsFill must be modified to show the background through.
    // This is done in the axisOptions above
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        axisBorder: {borderTop: 1, color: "#ccc"},
        growBy: new NumberRange(0.1, 0.1),
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        axisBorder: {borderLeft: 1, color: "#ccc"},
        growBy: new NumberRange(0.0, 0.1),
    }));

    // Add some series
    //

    // Line series with spline interpolation
    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3],
            yValues: [2, 3.5, 3.0, 5]
        }),
        stroke: "#FFF",
        strokeThickness: 3,
        animation: new SweepAnimation({ duration: 500 })
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
            stroke: "#FFFFFF77",
            fill: "#ffffff33"
        }),
        animation: new SweepAnimation({ delay: 200, duration: 500, fadeEffect: true }),
    }));

    // Column series
    sciChartSurface.renderableSeries.add(new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3],
            yValues: [0.8, 1, 1, 1.1, 1.2, 5.2, 2.8, 2.7, 2.6, 2.6, 2.5, 2.5, 2.5, 2.6, 3.2, 4],
        }),
        fill: "#FFFFFF33",
        stroke: "#EEEEEE77",
        strokeThickness: 2,
        dataPointWidth: 0.57,
        animation: new WaveAnimation({ delay: 400, duration: 600, fadeEffect: true })
    }));

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier());

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

    return (<div style={{backgroundImage: \`url(\${BackgroundImage})\`}}>
        <div id={divElementId} className={classes.ChartWrapper}/>
    </div>);
}
`;
