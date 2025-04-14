import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    EPolarLabelMode,
    XyyDataSeries,
    PolarLegendModifier,
    SweepAnimation,
    PolarLineRenderableSeries,
    BezierRenderDataTransform,
    XyDataSeries,
    SplineRenderDataTransform,
    WaveAnimation,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        useNativeText: true,
        drawMinorGridLines: false,
        zoomExtentsToInitialRange: true,
        labelPrecision: 0,
        innerRadius: 0.1, // donut hole
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,

        polarLabelMode: EPolarLabelMode.Parallel,

        autoTicks: false,
        majorDelta: 1,

        useNativeText: true,
        flippedCoordinates: true, // go clockwise
        totalAngle: Math.PI,
        labelPrecision: 0,
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const ANIMATION_DURATION = 500;
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yValues = [3, 4, 2, 4, 5, 3, 5, 3, 4];

    // 1. regular polar line
    const regularPolarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Original Data",
        }),
        stroke: "white",
        strokeThickness: 3,
    });

    // 2. cubic polar line
    const cubicPolarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Cubic",
        }),
        stroke: appTheme.VividOrange,
        strokeThickness: 5,
        animation: new WaveAnimation({ duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }),
    });
    // Add cubic bezier transform
    const cubicTransform = new SplineRenderDataTransform(
        cubicPolarLine, 
        wasmContext, 
        [cubicPolarLine.drawingProviders[0]]
    );
    cubicTransform.interpolationPoints = 30;
    cubicPolarLine.renderDataTransform = cubicTransform;

    // 3. bezier polar line
    const bezierPolarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Bezier",
        }),
        stroke: appTheme.VividPurple,
        strokeThickness: 5,
        animation: new WaveAnimation({ duration: ANIMATION_DURATION, delay: 2 * ANIMATION_DURATION })
    });
    // Add cubic bezier transform
    const bezierTransform = new BezierRenderDataTransform(
        bezierPolarLine, 
        wasmContext, 
        [bezierPolarLine.drawingProviders[0]]
    );
    bezierTransform.curvature = 0.5;
    bezierTransform.interpolationPoints = 30;
    bezierPolarLine.renderDataTransform = bezierTransform;
    
    sciChartSurface.renderableSeries.add(regularPolarLine, cubicPolarLine, bezierPolarLine);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
        new PolarLegendModifier({
            showCheckboxes: true,
        })
    );

    return { sciChartSurface, wasmContext };
};