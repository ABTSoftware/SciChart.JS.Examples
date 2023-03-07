import * as React from "react";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {classes} from "scichart-example-dependencies";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {WaveAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {FastBubbleRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import {SweepAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import {ScaleAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/ScaleAnimation";
import {FadeAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/FadeAnimation";
import {appTheme} from "scichart-example-dependencies";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {XyzDataSeries} from "scichart/Charting/Model/XyzDataSeries";
import {GenericAnimation} from "scichart/Core/Animations/GenericAnimation";
import {SplineLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import {SeriesAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/SeriesAnimation";

const divElementId = "chart";

// Four Series Animations are defined below. We apply these to the chart sequentially
const waveAnimation = new WaveAnimation({zeroLine: 0, pointDurationFraction: 0.5, duration: 1000, fadeEffect: true });
const sweepAnimation = new SweepAnimation({ duration: 1000 });
const scaleAnimation = new ScaleAnimation({ duration: 1000, zeroLine: 0 });
const fadeAnimation = new FadeAnimation({ duration: 1000 });

// generic animation to create typewritter effect on the watermark
const typeWriterAnimation = (textAnnotation: TextAnnotation, finalText: string) => new GenericAnimation<string>({
    from: "",
    to: finalText,
    onAnimate: (from: string, to: string, progress: number) => {
        const length = Math.floor(to.length * progress);
        textAnnotation.text = to.substring(0, length);
    },
    duration: 1000,
    setInitialValueImmediately: true,
});

// Setup the example & chart
const drawExample = async () => {

    // Create a SciChartSurface with theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });
    // Create X and Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create some data
    const xValues = [];
    const yValues = [];
    const zValues = [];
    let prevYValue = 0;
    for (let i = 0; i < 20; i++) {
        const curYValue = Math.sin(i) * 10 + 5;
        const size = Math.sin(i) * 60 + 3;

        xValues.push(i);
        yValues.push(prevYValue + curYValue);
        zValues.push(size);

        prevYValue += curYValue;
    }

    // Create a Bubble Series
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            fill: appTheme.VividSkyBlue + "77",
            strokeThickness: 0,
        }),
        dataSeries: new XyzDataSeries(wasmContext, { xValues, yValues, zValues })
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Create a Line Series
    const lineSeries = new SplineLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 2,
        opacity: 0.7,
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Add watermark annotation
    const watermark = new TextAnnotation({
        text: "",
        x1: 0.5,
        y1: 0.5,
        fontSize: 42,
        opacity: 0.5,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
    });
    sciChartSurface.annotations.add(watermark);

    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Series Startup Animations in SciChart.js",
            fontSize: 18,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
        })
    );

    // Loop forever and update animations
    let animationState = 0;
    const updateAnimation = () => {
        let currentAnimation: SeriesAnimation;
        switch(animationState){
            case 0:
                currentAnimation = waveAnimation;
                sciChartSurface.addAnimation(typeWriterAnimation(watermark, "Wave Animation"));
                animationState++;
                break;
            case 1:
                currentAnimation = sweepAnimation;
                sciChartSurface.addAnimation(typeWriterAnimation(watermark, "Sweep Animation"));
                animationState++;
                break;
            case 2:
                currentAnimation = scaleAnimation;
                sciChartSurface.addAnimation(typeWriterAnimation(watermark, "Scale Animation"));
                animationState++;
                break;
            case 3:
                currentAnimation = fadeAnimation;
                sciChartSurface.addAnimation(typeWriterAnimation(watermark, "Fade Animation"));
                animationState = 0;
                break;
        }
        lineSeries.enqueueAnimation(currentAnimation);
        bubbleSeries.enqueueAnimation(currentAnimation);
        // Loop forever while SciChartSurface is not deleted (see React Component unmount)
        if (!sciChartSurface.isDeleted)
            setTimeout(updateAnimation, 2000);
    }

    updateAnimation();

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StartupAnimation() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => { scs?.delete();}
    }, []);

    return (
        <div id={divElementId} className={classes.ChartWrapper} />
    );
}
