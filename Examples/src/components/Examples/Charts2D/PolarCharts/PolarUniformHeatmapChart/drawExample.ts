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
import { generateHeatmapData } from "./generateHeatmapData";

const HEATMAP_WIDTH = 300;
const HEATMAP_HEIGHT = 500;

// Define color map globally to be used in both the chart and the legend
const COLOR_MAP = new HeatmapColorMap({
    minimum: 0,
    maximum: 1,
    gradientStops: [
        { offset: 0, color: appTheme.VividPink },
        { offset: 0.1, color: appTheme.VividOrange },
        { offset: 0.2, color: appTheme.MutedRed },
        { offset: 0.5, color: appTheme.VividGreen },
        { offset: 0.8, color: appTheme.VividSkyBlue },
        { offset: 0.9, color: appTheme.Indigo },
        { offset: 1, color: appTheme.DarkIndigo },
    ],
});

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        padding: new Thickness(0, 60, 0, 0),
    });

    const radialAxisY = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRangeLimit: new NumberRange(0, HEATMAP_HEIGHT),
        useNativeText: true,
        drawMinorGridLines: false,

        drawMajorTickLines: false,
        drawMinorTickLines: false,
        labelPrecision: 0,
        innerRadius: 0.2,
    });
    sciChartSurface.yAxes.add(radialAxisY);

    const angularAxisX = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        flippedCoordinates: true,
        useNativeText: true,

        drawMajorTickLines: false,
        drawMinorTickLines: false,
        polarLabelMode: EPolarLabelMode.Parallel,
        labelPrecision: 0,
        totalAngle: Math.PI / 2,
    });
    sciChartSurface.xAxes.add(angularAxisX);

    const heatmapSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: new UniformHeatmapDataSeries(wasmContext, {
            zValues: generateHeatmapData(HEATMAP_WIDTH, HEATMAP_HEIGHT, 1999),
            xStart: 0,
            xStep: 1,
            yStart: 0,
            yStep: 1,
        }),
        colorMap: COLOR_MAP,
        stroke: "white",
        strokeThickness: 5,
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
        colorMap: COLOR_MAP,
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};
