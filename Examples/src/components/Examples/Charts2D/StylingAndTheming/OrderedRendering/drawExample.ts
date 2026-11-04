import {
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
    DoubleAnimator,
    BoxAnnotation,
    ECoordinateMode,
    EMultiLineAlignment,
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
        xValues.push(i / 100);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }

    // Create the band series and add to the chart
    // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values

    const band1Color = "#F07C64";
    const band2Color = "#42B9CF";
    const band3Color = "#9C7BE8";

    const band1 = new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
        strokeThickness: 3,
        fill: band1Color + "DD",
        fillY1: band1Color + "66",
        stroke: band1Color,
        strokeY1: band1Color,
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
        fill: band2Color + "DD",
        fillY1: band2Color + "66",
        stroke: band2Color,
        strokeY1: band2Color,
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
        fill: band3Color + "DD",
        fillY1: band3Color + "66",
        stroke: band3Color,
        strokeY1: band3Color,
        animation: new SweepAnimation({ duration: 800 }),
        renderLayer: EDefaultRenderLayer.SeriesLayer, // default layer for series, not actually needed here
    });

    const label1 = new NativeTextAnnotation({
        renderNextTo: { renderable: band1, offset: 0 },
        text: "1.",
        fontSize: 20,
        x1: 0.05,
        xCoordinateMode: ECoordinateMode.Relative,
        y1: 0.65,
        textColor: appTheme.VividBlue,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const label2 = new NativeTextAnnotation({
        renderNextTo: { renderable: band2, offset: 0 },
        text: "2.",
        fontSize: 20,
        x1: 0.05,
        xCoordinateMode: ECoordinateMode.Relative,
        y1: 0.14,
        textColor: appTheme.VividBlue,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const label3 = new NativeTextAnnotation({
        renderNextTo: { renderable: band3, offset: 0 },
        text: "3.",
        fontSize: 20,
        x1: 0.05,
        xCoordinateMode: ECoordinateMode.Relative,
        y1: -0.37,
        textColor: appTheme.VividBlue,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const nativeText = new NativeTextAnnotation({
        text: "Render order: 0.5\n\nAnnotations can render between\nseries, not just above them.",
        fontSize: 16,
        lineSpacing: 10,
        multiLineAlignment: EMultiLineAlignment.Left,
        x1: 4.05,
        x2: 7.15,
        y1: 0.15,
        textColor: appTheme.ForegroundColor,
        wrapTo: EWrapTo.Annotation,
        renderLayer: EDefaultRenderLayer.SeriesLayer,
        // drawImmediate: true,
        renderOrder: 0,
    });

    const box = new BoxAnnotation({
        x1: 3.9,
        x2: 7.3,
        y1: 0.25,
        y2: -0.55,
        stroke: appTheme.isDark ? "#52525B" : "#D4D4D8",
        strokeThickness: 1,
        fill: appTheme.isDark ? "#18181B" : "#FAFAFA",
        renderNextTo: { renderable: nativeText, offset: -0.1 },
    });

    let annotationOrder = 0.5;
    let animationTarget = 4;
    let annotationAnimation: GenericAnimation<number>;

    const updateAnnotation = (renderOrder: number) => {
        annotationOrder = renderOrder;
        nativeText.text = `Render order: ${renderOrder.toFixed(
            1
        )}\n\nAnnotations can render between\nseries, not just above them.`;
        nativeText.setRenderOrder(renderOrder);
    };

    const startAnimation = () => {
        annotationAnimation = new GenericAnimation<number>({
            from: annotationOrder,
            to: animationTarget,
            duration: (4000 * Math.abs(animationTarget - annotationOrder)) / 3.5,
            onAnimate: (from, to, progress) => updateAnnotation(DoubleAnimator.interpolate(from, to, progress)),
            onCompleted: () => {
                annotationAnimation.from = animationTarget;
                animationTarget = animationTarget === 4 ? 0.5 : 4;
                annotationAnimation.to = animationTarget;
                annotationAnimation.duration = 4000;
                annotationAnimation.reset();
            },
        });
        sciChartSurface.addAnimation(annotationAnimation);
    };

    const setAnimationPaused = (paused: boolean) => {
        if (paused) {
            annotationAnimation.cancel();
        } else {
            startAnimation();
        }
    };

    startAnimation();

    sciChartSurface.annotations.add(nativeText, box, label1, label2, label3);
    sciChartSurface.renderableSeries.add(band1, band2, band3);

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

    const resetDemo = () => {
        changeOrder(true);
        annotationAnimation.cancel();
        animationTarget = 4;
        updateAnnotation(0.5);
        startAnimation();
        sciChartSurface.zoomExtents();
    };

    changeOrder(true);
    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface, changeOrder, setAnimationPaused, resetDemo };
};
