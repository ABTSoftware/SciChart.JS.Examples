import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EColor, 
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    Thickness, 
    GradientParams, 
    Point, 
    EPolarLabelMode,
    WaveAnimation,
    ScaleAnimation,
    PolarMountainRenderableSeries,
    PolarLegendModifier
} from "scichart";
import { appTheme } from "../../../theme";

const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const MountainsDatasets = [
    {
        yValues: [2.6, 5.6, 3, 5, 4.8, 1.8, 5, 4.5, 3.5],
        fillColor: appTheme.VividOrange,
        interpolateLine: true,
    },
    {
        yValues: [4.2, 2.5, 3.9, 2.5, 4, 5.5, 2.5, 4, 3],
        fillColor: appTheme.VividTeal,
        interpolateLine: false,
    },
    {
        yValues: [1.3, 3.3, 2.5, 4.5, 5.5, 3, 4.5, 4.9, 2.4],
        fillColor: appTheme.VividPink,
        interpolateLine: false,
    },
]

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
        labelStyle: {
            color: "white",
        },
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 9),
        flippedCoordinates: true, // go clockwise
        useNativeText: true,
        startAngle: Math.PI / 2, // start at 12 o'clock
        zoomExtentsToInitialRange: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
    });
    sciChartSurface.xAxes.add(polarXAxis);

    MountainsDatasets.forEach(({yValues, fillColor, interpolateLine}) => {
        const polarMountain = new PolarMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [...xValues, xValues[xValues.length - 1] + 1], // add 1 more xValue to close the loop
                yValues: [...yValues, yValues[0]], // close the loop by drawing to the first yValue
                dataSeriesName: interpolateLine ? "Interpolated" : "Straight",
            }),
            fillLinearGradient: new GradientParams(
                new Point(0, 0), 
                new Point(0, 1), 
                [
                    { color: fillColor + "AA", offset: 0 },
                    { color: fillColor + "33", offset: 0.3 },
                ]
            ),
            interpolateLine: interpolateLine,
            stroke: fillColor, // this also gives off the color for the legend marker
            strokeThickness: 2,
            animation: new WaveAnimation({ duration: 800, zeroLine: 0 }),
        });
        sciChartSurface.renderableSeries.add(polarMountain);
    })

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