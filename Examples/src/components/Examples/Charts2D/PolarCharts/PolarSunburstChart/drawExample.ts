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
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        zoomExtentsToInitialRange: true,
        
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
        startAngle: Math.PI / 2,
        drawLabels: false, // no radial labels

        innerRadius: 0.1, // donut hole
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 9),
        startAngle: Math.PI / 2, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise
        zoomExtentsToInitialRange: true,

        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,

        useNativeText: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            yValues: [2.6, 5.3, 3.5, 2.7, 4.8, 3.8, 5, 4.5, 3.5]
        }),
        fillLinearGradient: new GradientParams(
            new Point(0, 0), 
            new Point(1, 0), // `new Point(0, 1)` for vertical gradient
            [
                { color: appTheme.DarkIndigo, offset: 0 },
                { color: appTheme.Indigo, offset: 0.2 },
                { color: appTheme.Indigo, offset: 0.8 },
                { color: appTheme.MutedBlue, offset: 1 }
            ]
        ),
        stroke: "white",
        strokeThickness: 1.5,
        dataPointWidth: 0.8,
        dataLabels: {
            color: "white",
            style: {
                fontSize: 14,
                fontFamily: "Default",
            },
            polarLabelMode: EPolarLabelMode.Parallel,
        },
        animation: new WaveAnimation({ duration: 800, fadeEffect: true }),
    });
    sciChartSurface.renderableSeries.add(polarColumn);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};