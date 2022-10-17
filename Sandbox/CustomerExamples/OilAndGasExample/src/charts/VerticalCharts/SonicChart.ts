import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { UniformHeatmapDataSeries } from "scichart/Charting/Model/UniformHeatmapDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getDataRows } from "./utils";
import { theme } from "../../theme";

export const drawSonicChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("sonic-chart", {
        ...getCommonChartConfigs("Sonic"),
        modifiers: getCommonChartModifiersConfig(),
        surface: {
            theme: { type: theme.SciChartJsTheme.type },
        }
    });

    let heatmapZValues: number[][] = [];
    let i = 0;

    const rows = await getDataRows("Sonic.csv");
    rows.forEach((row) => {
        const data = row.replace(',', '.').split(';');
        heatmapZValues.push([]);
        for (let j = 0; j < 1000; ++j) {
            heatmapZValues[i].push(Number.parseFloat(data[j]) * 100.0);
        }

        ++i;
    })

    const gradientStops = [
        { offset: 0, color: theme.SonicGradient1 },
        { offset: 0.2, color: theme.SonicGradient2 },
        { offset: 0.4, color: theme.SonicGradient3 },
        { offset: 0.6, color: theme.SonicGradient4 },
        { offset: 0.8, color: theme.SonicGradient5 },
        { offset: 1, color: theme.SonicGradient6 }
    ];

    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 100,
        gradientStops
    });


    const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: heatmapZValues,
    });
    dataSeries.hasNaNs = true;

    const renderableSeries = chartBuilder.buildSeries(wasmContext, {
        type: ESeriesType.UniformHeatmapSeries,
        options: {
            dataSeries,
            colorMap,
            useLinearTextureFiltering: true,
        }
    });

    renderableSeries[0].rolloverModifierProps.tooltipColor = "LimeGreen";
    renderableSeries[0].rolloverModifierProps.tooltipTextColor = "Black";
    
    sciChartSurface.renderableSeries.add(...renderableSeries);

    const legendModifier = new LegendModifier({ placementDivId: `sonic-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generateSonicLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return sciChartSurface;
};


const generateSonicLegend = (
    placement: ELegendPlacement,
    textColor: string,
    backgroundColor: string,
    margin: Thickness,
    orientation: ELegendOrientation,
    showCheckboxes: boolean,
    showSeriesMarkers: boolean,
    items: TLegendItem[]
): string => {
    return `
    <div class="chart-legend full-size-legend">
        <div class="legend-color-item" style="background-image: linear-gradient(to right, ${theme.SonicGradient1}, ${theme.SonicGradient2}, ${theme.SonicGradient3}, ${theme.SonicGradient4}, ${theme.SonicGradient5}, ${theme.SonicGradient6});">
        </div>
        <div class="legend-text-item" style="color: ${theme.LegendTextColor}">
            <span>${0}</span>
            <span>${20}</span>
            <span>${40}</span>
            <span>${60}</span>
            <span>${80}</span>
            <span>${100}</span>
        </div>
        <div class="legend-color-item">
            <div class="color-label" style="background-color: ${theme.SonicGradient1};"></div>
            <div class="color-label" style="background-color: ${theme.SonicGradient2};"></div>
            <div class="color-label" style="background-color: ${theme.SonicGradient3};"></div>
            <div class="color-label" style="background-color: ${theme.SonicGradient4};"></div>
            <div class="color-label" style="background-color: ${theme.SonicGradient5};"></div>
            <div class="color-label" style="background-color: ${theme.SonicGradient6};"></div>
        </div>
        <div class="legend-text-item" style="color: ${theme.LegendTextColor}">
            <span>${"SONIC"}</span>
        </div>
    </div>
    `;
};
