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
    HeatmapColorMap,
    UniformHeatmapDataSeries,
    PolarUniformHeatmapRenderableSeries,
    HeatmapLegend,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";
import { generateKineticTomographyData } from "./generateHeatmapData";

const HEATMAP_WIDTH = 72;
const HEATMAP_HEIGHT = 25;

// Define color map globally to be used in both the chart and the legend
const COLOR_MAP = new HeatmapColorMap({
    minimum: -1,
    maximum: 1,
    gradientStops: [
        { offset: 0.4, color: appTheme.VividOrange },
        { offset: 0.5, color: "white" },
        { offset: 0.6, color: appTheme.VividTeal },
    ]
})

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        padding: new Thickness(0, 60, 0, 0),
    });

    const radialAxisY = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        useNativeText: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white"
        },

        autoTicks: false,
        majorDelta: 5,

        drawMinorGridLines: false,
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
        innerRadius: 0.1,
    });
    sciChartSurface.yAxes.add(radialAxisY);

    const angularAxisX = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, HEATMAP_WIDTH),
        zoomExtentsToInitialRange: true,

        useNativeText: true,
        totalAngleDegrees: 360,
        
        autoTicks: false,
        majorDelta: 45,
        labelPostfix: "°",
        labelPrecision: 0,
        labelStyle: {
            color: "white"
        },
        polarLabelMode: EPolarLabelMode.Parallel,

        drawMinorGridLines: false,
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
    });
    sciChartSurface.xAxes.add(angularAxisX);

    const heatmapSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: new UniformHeatmapDataSeries(wasmContext, {
            zValues: generateKineticTomographyData(HEATMAP_HEIGHT, HEATMAP_WIDTH),
            xStart: 0,
            xStep: 1,
            yStart: 0,
            yStep: 1,
            containsNaN: true
        }),
        colorMap: COLOR_MAP,
        stroke: "white",
        strokeThickness: 5,
        opacity: 0.8
    });
    sciChartSurface.renderableSeries.add(heatmapSeries);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};

// Draws a Heatmap legend over the <div id={divHeatmapLegend}></div>
export const drawHeatmapLegend = async (rootElement: string | HTMLDivElement) => {
    const { heatmapLegend } = await HeatmapLegend.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB",
        },
        yAxisOptions: {
            isInnerAxis: true,
            labelStyle: {
                fontSize: 14,
                color: appTheme.ForegroundColor,
            },
            axisBorder: {
                borderRight: 2,
                color: appTheme.ForegroundColor,
            },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 8,
                strokeThickness: 2,
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 4,
                strokeThickness: 1,
            },
        },
        colorMap: COLOR_MAP
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};