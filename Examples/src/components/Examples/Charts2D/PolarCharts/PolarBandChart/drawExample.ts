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
    PolarBandRenderableSeries,
    XyyDataSeries,
    PolarLegendModifier,
    SweepAnimation,
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
        startAngle: Math.PI / 2,
        zoomExtentsToInitialRange: true,
        labelPrecision: 0,
        innerRadius: 0.1, // donut hole
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,

        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 12),

        autoTicks: false,
        majorDelta: 1,

        useNativeText: true,
        flippedCoordinates: true, // go clockwise
        startAngle: Math.PI / 2, // start at 12 o'clock
        zoomExtentsToInitialRange: true,
        labelPrecision: 0,
    });
    sciChartSurface.xAxes.add(polarXAxis);

    // regular (non-interpolated) band
    const polarBand1 = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5],
            yValues: [1, 2, 3, 4, 5, 6],
            y1Values: [6, 5, 1, 5, 4, 2],
            dataSeriesName: "Regular Band",
        }),
        stroke: appTheme.VividOrange,
        strokeY1: appTheme.VividSkyBlue,
        fill: appTheme.VividOrange + "88",
        fillY1: appTheme.VividSkyBlue + "88",
        strokeThickness: 3,
        interpolateLine: false, // not interpolated
        animation: new SweepAnimation({ duration: 400, delay: 400 }),
    });
    sciChartSurface.renderableSeries.add(polarBand1);

    // interpolated band
    const polarBand2 = new PolarBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues: [6, 7, 8, 9, 10, 11],
            yValues: [1, 2, 3, 4, 5, 6],
            y1Values: [6, 5, 1, 5, 4, 2],
            dataSeriesName: "Interpolated Band",
        }),
        stroke: appTheme.VividPink,
        strokeY1: appTheme.VividGreen,
        fill: appTheme.VividPink + "88",
        fillY1: appTheme.VividGreen + "88",
        strokeThickness: 3,
        interpolateLine: true,
        animation: new SweepAnimation({ duration: 400 }),
    });
    sciChartSurface.renderableSeries.add(polarBand2);

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
