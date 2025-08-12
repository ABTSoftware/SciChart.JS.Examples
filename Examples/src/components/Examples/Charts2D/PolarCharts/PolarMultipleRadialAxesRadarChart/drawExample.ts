import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EColor,
    EPolarAxisMode,
    EPolarGridlineMode,
    PolarCategoryAxis,
    ENumericFormat,
    EPolarLabelMode,
    PolarMountainRenderableSeries,
    FadeAnimation,
    PolarLegendModifier,
    EllipsePointMarker,
    PolarLineRenderableSeries,
} from "scichart";
import { appTheme } from "../../../theme";

const LABELS = ["Complexity", "Memory Usage", "Stability", "Adaptability", "Scalability", "Cache Efficiency"];

const DATA_SET = [
    {
        name: "Quick Sort",
        color: appTheme.VividSkyBlue,
        values: [7, 8, 2, 8, 9, 9],
    },
    {
        name: "Bubble Sort",
        color: appTheme.VividOrange,
        values: [2, 9, 10, 5, 1, 2],
    },
];

// this chart expresses the complexity, memory usage, stability, adaptability, scalability, and cache efficiency of two sorting algorithms
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        gridlineMode: EPolarGridlineMode.Polygons,
        useNativeText: true,
        labelPrecision: 0,
        zoomExtentsToInitialRange: true,

        majorGridLineStyle: {
            color: EColor.BackgroundColor,
            strokeThickness: 1,
            strokeDashArray: [5, 5],
        },
        labelStyle: {
            color: EColor.White,
            fontSize: 16,
        },
        drawLabels: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        startAngle: Math.PI / 2, // start at 12 o'clock
        innerRadius: 0,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        labels: LABELS,
        labelStyle: {
            fontSize: 16,
            color: EColor.White,
        },
        majorGridLineStyle: {
            color: EColor.BackgroundColor,
            strokeThickness: 1,
            strokeDashArray: [5, 5],
        },
        flippedCoordinates: true, // go clockwise
        drawMinorGridLines: false,
        useNativeText: true,
        labelFormat: ENumericFormat.NoFormat,
        startAngle: Math.PI / 2, // start at 12 o'clock
    });
    angularXAxis.polarLabelMode = EPolarLabelMode.Parallel;
    sciChartSurface.xAxes.add(angularXAxis);

    const xValues = Array.from({ length: LABELS.length + 1 }, (_, i) => i);
    // +1 to complete the radar chart without overlap of first and last labels

    const polarMountain = new PolarMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: xValues,
            yValues: [...DATA_SET[0].values, DATA_SET[0].values[0]], // +1 append first value to complete the radar chart
            dataSeriesName: DATA_SET[0].name,
        }),
        stroke: DATA_SET[0].color,
        fill: DATA_SET[0].color + "30",
        strokeThickness: 4,
        animation: new FadeAnimation({ duration: 1000 }),
    });
    sciChartSurface.renderableSeries.add(polarMountain);

    // You can just as well use a PolarLineRenderableSeries
    const polarLine = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: xValues,
            yValues: [...DATA_SET[1].values, DATA_SET[1].values[0]], // +1 append first value to complete the radar chart
            dataSeriesName: DATA_SET[1].name,
        }),
        stroke: DATA_SET[1].color,
        strokeThickness: 4,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            fill: DATA_SET[1].color,
            stroke: EColor.White,
        }),
        animation: new FadeAnimation({ duration: 1000 }),
    });
    sciChartSurface.renderableSeries.add(polarLine);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier({ growFactor: 0.0002 }),
        new PolarLegendModifier({ showSeriesMarkers: true, showCheckboxes: true })
    );

    return { sciChartSurface, wasmContext };
};
