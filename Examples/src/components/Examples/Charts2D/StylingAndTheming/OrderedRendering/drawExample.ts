import {
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyyDataSeries,
    NumericAxis,
    FastBandRenderableSeries,
    SciChartSurface,
    NumberRange,
    SweepAnimation,
    NativeTextAnnotation,
    EWrapTo,
    GenericAnimation,
    EDefaultRenderLayer,
    EAnnotationLayer,
    GradientParams,
    Point,
} from "scichart";

import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create some data for the example. We need X, Y and Y1 values
    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }

    // Create the band series and add to the chart
    // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values

    const band1 = new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
        strokeThickness: 3,
        fill: appTheme.MutedOrange + "E6",
        fillY1: appTheme.MutedBlue + "E6",
        stroke: appTheme.MutedOrange,
        strokeY1: appTheme.MutedBlue,
        animation: new SweepAnimation({ duration: 800 }),
        renderLayer: EDefaultRenderLayer.SeriesLayer, // default layer for series, not actually needed here
    });

    const band2 = new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues,
            yValues: yValues.map((y) => y - 0.5),
            y1Values: y1Values.map((y) => y - 0.5),
        }),
        strokeThickness: 3,
        fill: appTheme.MutedSkyBlue + "E6",
        fillY1: appTheme.MutedPink + "E6",
        stroke: appTheme.MutedSkyBlue,
        strokeY1: appTheme.MutedPink,
        animation: new SweepAnimation({ duration: 800 }),
        renderLayer: EDefaultRenderLayer.SeriesLayer, // default layer for series, not actually needed here
    });

    const band3 = new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues,
            yValues: yValues.map((y) => y - 1),
            y1Values: y1Values.map((y) => y - 1),
        }),
        strokeThickness: 3,
        fill: appTheme.MutedTeal + "E6",
        fillY1: appTheme.MutedPurple + "E6",
        stroke: appTheme.MutedTeal,
        strokeY1: appTheme.MutedPurple,
        animation: new SweepAnimation({ duration: 800 }),
        renderLayer: EDefaultRenderLayer.SeriesLayer, // default layer for series, not actually needed here
    });

    const label1 = new NativeTextAnnotation({
        renderNextTo: { renderable: band1, offset: 0 },
        text: "1.",
        fontSize: 20,
        x1: 50,
        x2: 70,
        y1: 0.65,
        textColor: appTheme.MutedBlue,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const label2 = new NativeTextAnnotation({
        renderNextTo: { renderable: band2, offset: 0 },
        text: "2.",
        fontSize: 20,
        x1: 50,
        x2: 70,
        y1: 0.14,
        textColor: appTheme.MutedBlue,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const label3 = new NativeTextAnnotation({
        renderNextTo: { renderable: band3, offset: 0 },
        text: "3.",
        fontSize: 20,
        x1: 50,
        x2: 70,
        y1: -0.37,
        textColor: appTheme.MutedBlue,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const nativeText = new NativeTextAnnotation({
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        fontSize: 18,
        x1: 100,
        x2: 300,
        y1: 0.3,
        textColor: appTheme.ForegroundColor,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const interpolateNumber = (from: number, to: number, progress: number) => {
        if (progress < 0) return from;
        if (progress > 1) return to;
        return from + (to - from) * progress;
    };

    let annotationRO = 0.5;

    const annotationAnimation = new GenericAnimation<number>({
        from: 1,
        to: 800,
        onAnimate: (from: number, to: number, progress: number) => {
            nativeText.x1 = interpolateNumber(from, to, progress);
            nativeText.x2 = interpolateNumber(from, to, progress) + 200;
        },
        duration: 4000,
        delay: 0,
        onCompleted: () => {
            if (annotationRO === 3.5) {
                annotationRO = 0.5;
                nativeText.setRenderOrder(annotationRO);
            } else {
                annotationRO += 1;
                nativeText.setRenderOrder(annotationRO);
            }

            let temp = annotationAnimation.from;
            annotationAnimation.from = annotationAnimation.to;
            annotationAnimation.to = temp;
            annotationAnimation.reset();
        },
    });

    sciChartSurface.addAnimation(annotationAnimation);

    sciChartSurface.annotations.add(nativeText, label1, label2, label3);

    sciChartSurface.renderableSeries.add(band1, band2, band3);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

    const changeOrder = (order: boolean) => {
        if (order) {
            // band1.setRenderLayer(EDefaultRenderLayer.AnnotationsBelowSeriesLayer);
            // band2.setRenderLayer(EDefaultRenderLayer.Foreground);
            band1.setRenderOrder(1);
            band2.setRenderOrder(2);
            band3.setRenderOrder(3);
            label1.text = "1.";
            label2.text = "2.";
            label3.text = "3.";
        } else {
            band1.setRenderOrder(3);
            band2.setRenderOrder(2);
            band3.setRenderOrder(1);
            label1.text = "3.";
            label2.text = "2.";
            label3.text = "1.";
        }
    };

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface, changeOrder };
};
