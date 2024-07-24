import { appTheme } from "../../../theme";
import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    ZoomPanModifier,
    BoxAnnotation,
    TextAnnotation,
    ECoordinateMode,
    EAnnotationLayer,
    NativeTextAnnotation,
    MouseWheelZoomModifier,
    PinchZoomModifier,
    Thickness,
    XyDataSeries,
    ZoomExtentsModifier,
    FastLineRenderableSeries,
    EllipsePointMarker,
} from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    xAxis.majorGridLineStyle.strokeThickness = 3;
    xAxis.drawMinorGridLines = false;
    xAxis.growBy = new NumberRange(0.2, 0.2);
    yAxis.majorGridLineStyle.strokeThickness = 3;
    yAxis.drawMinorGridLines = false;
    yAxis.growBy = new NumberRange(0.4, 0.4);

    const dataSeries = new XyDataSeries(wasmContext, { xValues: [1, 4, 5, 7], yValues: [2, 6, 9, 3] });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#4682b4",
        strokeThickness: 7,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 10, height: 10, fill: appTheme.VividOrange }),
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 20,
            },

            color: appTheme.VividOrange,
        },
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    const backgroundBoxAnnotation = new BoxAnnotation({
        annotationLayer: EAnnotationLayer.Background,
        stroke: appTheme.VividTeal,
        strokeThickness: 1,
        fill: appTheme.MutedTeal,
        x1: 400,
        x2: 550,
        y1: 80,
        y2: 230,
        isEditable: true,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    const boxAnnotationBelowSeries = new BoxAnnotation({
        annotationLayer: EAnnotationLayer.BelowChart,
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        fill: appTheme.MutedOrange,
        x1: 350,
        x2: 500,
        y1: 170,
        y2: 320,
        isEditable: true,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    const boxAnnotationAboveSeries = new BoxAnnotation({
        annotationLayer: EAnnotationLayer.AboveChart, // default
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        fill: appTheme.MutedSkyBlue,
        x1: 300,
        x2: 450,
        y1: 280,
        y2: 430,
        isEditable: true,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    const backgroundTextAnnotation = new TextAnnotation({
        annotationLayer: EAnnotationLayer.Background,
        id: "textAnnotationBackground",
        x1: 50,
        y1: 50,
        textColor: "#F1B24A",
        fontSize: 32,
        text: "Background SVG Annotation",
        background: appTheme.VividPurple,
        padding: Thickness.fromString("1 5 5 5"),
        isEditable: true,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    const foregroundTextAnnotation = new TextAnnotation({
        annotationLayer: EAnnotationLayer.AboveChart,
        id: "foregroundTextAnnotation",
        x1: 50,
        y1: 350,
        textColor: "#F1B24A",
        fontSize: 32,
        fontFamily: "Times New Roman",
        text: "Foreground SVG Annotation",
        background: appTheme.VividRed,
        padding: Thickness.fromString("1 5 5 5"),
        isEditable: true,
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    const backgroundNativeTextAnnotation = new NativeTextAnnotation({
        annotationLayer: EAnnotationLayer.Background,
        x1: backgroundBoxAnnotation.x1,
        y1: backgroundBoxAnnotation.y1,
        textColor: appTheme.DarkIndigo,
        fontSize: 20,
        fontFamily: "Arial",
        text: "Background",
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });
    const nativeTextAnnotationBelowSeries = new NativeTextAnnotation({
        annotationLayer: EAnnotationLayer.BelowChart,
        x1: boxAnnotationBelowSeries.x1,
        y1: boxAnnotationBelowSeries.y1,
        textColor: appTheme.DarkIndigo,
        fontSize: 20,
        fontFamily: "Arial",
        text: "Below Chart",
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    const foregroundNativeTextAnnotation = new NativeTextAnnotation({
        annotationLayer: EAnnotationLayer.AboveChart,
        x1: boxAnnotationAboveSeries.x1,
        y1: boxAnnotationAboveSeries.y1,
        textColor: appTheme.DarkIndigo,
        fontSize: 20,
        fontFamily: "Arial",
        text: "Above Chart",
        xCoordinateMode: ECoordinateMode.Pixel,
        yCoordinateMode: ECoordinateMode.Pixel,
    });

    sciChartSurface.preRender.subscribe(() => {
        backgroundNativeTextAnnotation.x1 = backgroundBoxAnnotation.x1;
        backgroundNativeTextAnnotation.y1 = backgroundBoxAnnotation.y1;
        nativeTextAnnotationBelowSeries.x1 = boxAnnotationBelowSeries.x1;
        nativeTextAnnotationBelowSeries.y1 = boxAnnotationBelowSeries.y1;
        foregroundNativeTextAnnotation.x1 = boxAnnotationAboveSeries.x1;
        foregroundNativeTextAnnotation.y1 = boxAnnotationAboveSeries.y1;
    });

    sciChartSurface.annotations.add(
        boxAnnotationAboveSeries,
        boxAnnotationBelowSeries,
        backgroundBoxAnnotation,
        backgroundTextAnnotation,
        foregroundTextAnnotation,
        foregroundNativeTextAnnotation,
        nativeTextAnnotationBelowSeries,
        backgroundNativeTextAnnotation
    );

    return { sciChartSurface };
};
