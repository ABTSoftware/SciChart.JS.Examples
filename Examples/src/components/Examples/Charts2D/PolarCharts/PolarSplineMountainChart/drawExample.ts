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
    PolarMountainRenderableSeries,
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
        labelPrecision: 0
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

    // 1. regular polar mountain
    const regularPolarMountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Original Data",
        }),
        stroke: "#FFFFFF",
        fill: "#FFFFFF33",
        strokeThickness: 3,
    });

    // 2. cubic polar mountain
    const cubicPolarMountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Cubic",
        }),
        stroke: appTheme.VividOrange,
        strokeThickness: 5,
        fill: appTheme.VividOrange + "33",
        animation: new WaveAnimation({ duration: ANIMATION_DURATION, delay: ANIMATION_DURATION }),
    });
    // Add cubic bezier transform
    const cubicTransform = new SplineRenderDataTransform(
        cubicPolarMountain, 
        wasmContext, 
        [cubicPolarMountain.drawingProviders[0]]
    );
    cubicTransform.interpolationPoints = 30;
    cubicPolarMountain.renderDataTransform = cubicTransform;

    // 3. bezier polar mountain
    const bezierPolarMountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataSeriesName: "Bezier",
        }),
        stroke: appTheme.VividPurple,
        strokeThickness: 5,
        fill: appTheme.VividPurple + "33",
        animation: new WaveAnimation({ duration: ANIMATION_DURATION, delay: 2 * ANIMATION_DURATION })
    });
    // Add cubic bezier transform
    const bezierTransform = new BezierRenderDataTransform(
        bezierPolarMountain, 
        wasmContext, 
        [bezierPolarMountain.drawingProviders[0]]
    );
    bezierTransform.curvature = 0.5;
    bezierTransform.interpolationPoints = 30;
    bezierPolarMountain.renderDataTransform = bezierTransform;
    
    sciChartSurface.renderableSeries.add(regularPolarMountain, cubicPolarMountain, bezierPolarMountain);

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