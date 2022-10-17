import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { UniformHeatmapDataSeries } from "scichart/Charting/Model/UniformHeatmapDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getDataRows } from "./utils";
import {
    LegendTextColor,
    SonicGradient1,
    SonicGradient2,
    SonicGradient3,
    SonicGradient4,
    SonicGradient5,
    SonicGradient6,
    theme
} from "../../theme";

export const drawSonicChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("sonic-chart", {
        ...getCommonChartConfigs("Sonic"),
        modifiers: getCommonChartModifiersConfig(),
        surface: {
            theme: { type: theme.type },
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
        { offset: 0, color: SonicGradient1 },
        { offset: 0.2, color: SonicGradient2 },
        { offset: 0.4, color: SonicGradient3 },
        { offset: 0.6, color: SonicGradient4 },
        { offset: 0.8, color: SonicGradient5 },
        { offset: 1, color: SonicGradient6 }
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
        <div class="legend-color-item" style="background-image: linear-gradient(to right, ${SonicGradient1}, ${SonicGradient2}, ${SonicGradient3}, ${SonicGradient4}, ${SonicGradient5}, ${SonicGradient6});">
        </div>
        <div class="legend-text-item" style="color: ${LegendTextColor}">
            <span>${0}</span>
            <span>${20}</span>
            <span>${40}</span>
            <span>${60}</span>
            <span>${80}</span>
            <span>${100}</span>
        </div>
        <div class="legend-color-item">
            <div class="color-label" style="background-color: ${SonicGradient1};"></div>
            <div class="color-label" style="background-color: ${SonicGradient2};"></div>
            <div class="color-label" style="background-color: ${SonicGradient3};"></div>
            <div class="color-label" style="background-color: ${SonicGradient4};"></div>
            <div class="color-label" style="background-color: ${SonicGradient5};"></div>
            <div class="color-label" style="background-color: ${SonicGradient6};"></div>
        </div>
        <div class="legend-text-item" style="color: ${LegendTextColor}">
            <span>${"SONIC"}</span>
        </div>
    </div>
    `;
};
