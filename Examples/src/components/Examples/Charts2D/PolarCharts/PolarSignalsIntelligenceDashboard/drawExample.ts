import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    GradientParams, 
    Point, 
    EPolarLabelMode,
    WaveAnimation,
    EDataPointWidthMode,
    Thickness,
    ELabelAlignment,
    ENumericFormat,
    PolarArcAnnotation,
    ECoordinateMode,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const rightRadialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 100),
        zoomExtentsToInitialRange: true,

        autoTicks: false,
        majorDelta: 10,
        labelPrecision: 0,
        labelStyle: {
            fontSize: 9,
            color: "white",
        },
        
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
        startAngle: 0,
    });
    const leftRadialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 100),
        zoomExtentsToInitialRange: true,

        autoTicks: false,
        majorDelta: 10,
        labelPrecision: 0,
        labelStyle: {
            fontSize: 9,
            color: "white",
        },
        isInnerAxis: true,
        
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
        startAngle: Math.PI,

        labelFormat: ENumericFormat.Engineering,
    });
    sciChartSurface.yAxes.add(leftRadialYAxis, rightRadialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 360),

        autoTicks: false,
        majorDelta: 15,
        labelPostfix: "°",

        zoomExtentsToInitialRange: true,
        startAngle: Math.PI / 2, // start at 12 o'clock
        totalAngle: Math.PI * 2, // full circle
        flippedCoordinates: true, // go clockwise

        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,

        useNativeText: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
            padding: new Thickness(5, 0, 10, 0)
        },
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const shiftingColumn = new PolarColumnRenderableSeries(wasmContext, {
        yAxisId: rightRadialYAxis.id,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0],
            yValues: [100]
        }),
        stroke: "transparent",
        fillLinearGradient: new GradientParams(
            new Point(0, 0), 
            new Point(1, 0),
            [
                { color: appTheme.VividSkyBlue, offset: 0 },
                { color: appTheme.VividSkyBlue + "44", offset: 0.2 },
                { color: appTheme.VividSkyBlue + "00", offset: 1 }, // make it transparent
            ]
        ),
        dataPointWidthMode: EDataPointWidthMode.Absolute,
        dataPointWidth: 1,
    });
    sciChartSurface.renderableSeries.add(shiftingColumn);

    setInterval(() => {
        
    }, 60);

    const highlightArc = new PolarArcAnnotation({
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        isEditable: true,
        isSelected: true,
        centerX: 0,
        centerY: 0, // origin at the center -> (0,0)
        x1: 100,
        x2: 150,
        y1: 100,
        y2: 0,
        strokeThickness: 0,
        fill: appTheme.VividOrange,
        opacity: 1
    });
    sciChartSurface.annotations.add(highlightArc);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};