import {
    HeatmapColorMap,
    HeatmapLegend,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    UniformContoursRenderableSeries,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    zeroArray2D,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an X & Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

    const heatmapWidth = 300;
    const heatmapHeight = 200;

    const colorPaletteMin = 0;
    const colorPaletteMax = 200;

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues = generateExampleData(3, heatmapWidth, heatmapHeight, colorPaletteMax);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues: initialZValues,
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
    });

    // Add the contours series and add to the chart
    sciChartSurface.renderableSeries.add(
        new UniformContoursRenderableSeries(wasmContext, {
            dataSeries: heatmapDataSeries,
            zMin: 20,
            zMax: colorPaletteMax,
            zStep: 20,
            zOffset: 1,
            strokeThickness: 1,
            stroke: appTheme.PaleSkyBlue,
        })
    );

    // Create a background heatmap series with the same data and add to the chart
    sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: heatmapDataSeries,
            useLinearTextureFiltering: false,
            opacity: 0.5,
            colorMap: new HeatmapColorMap({
                minimum: colorPaletteMin,
                maximum: colorPaletteMax,
                gradientStops: [
                    { offset: 1, color: appTheme.VividPink },
                    { offset: 0.9, color: appTheme.VividOrange },
                    { offset: 0.7, color: appTheme.MutedRed },
                    { offset: 0.5, color: appTheme.VividGreen },
                    { offset: 0.3, color: appTheme.VividSkyBlue },
                    { offset: 0.2, color: appTheme.Indigo },
                    { offset: 0, color: appTheme.DarkIndigo },
                ],
            }),
        })
    );

    // Add interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface };
};

export const drawHeatmapLegend = async (rootElement: string | HTMLDivElement) => {
    const { heatmapLegend, wasmContext } = await HeatmapLegend.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB",
        },
        yAxisOptions: {
            isInnerAxis: true,
            labelStyle: {
                fontSize: 12,
                color: appTheme.ForegroundColor,
            },
            axisBorder: {
                borderRight: 1,
                color: appTheme.ForegroundColor + "77",
            },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 6,
                strokeThickness: 1,
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 3,
                strokeThickness: 1,
            },
        },
        colorMap: {
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.2, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo },
            ],
        },
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};

// This function generates data for the heatmap with contours series example
function generateExampleData(index: number, heatmapWidth: number, heatmapHeight: number, colorPaletteMax: number) {
    const zValues = zeroArray2D([heatmapHeight, heatmapWidth]);

    const angle = (Math.PI * 2 * index) / 30;
    let smallValue = 0;
    for (let x = 0; x < heatmapWidth; x++) {
        for (let y = 0; y < heatmapHeight; y++) {
            const v =
                (1 + Math.sin(x * 0.04 + angle)) * 50 +
                (1 + Math.sin(y * 0.1 + angle)) * 50 * (1 + Math.sin(angle * 2));
            const cx = heatmapWidth / 2;
            const cy = heatmapHeight / 2;
            const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
            const exp = Math.max(0, 1 - r * 0.008);
            const zValue = v * exp;
            zValues[y][x] = zValue > colorPaletteMax ? colorPaletteMax : zValue;
            zValues[y][x] += smallValue;
        }

        smallValue += 0.001;
    }

    return zValues;
}
