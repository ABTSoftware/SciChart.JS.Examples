import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "./utils";
import { appTheme } from "../../theme";

export 
const drawDensityChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("density-chart", {
        ...getCommonChartConfigs("Density"),
        modifiers: getCommonChartModifiersConfig(),
        surface: {
            theme: { type: appTheme.SciChartJsTheme.type },
        }
    });

    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(-0.2, 0.2);

    const dataSeries = new XyyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });

    const data = await getParsedData("Density.csv");
    data.forEach((dataRow) => {
        const x = dataRow[0];
        dataSeries.append(x, dataRow[1], dataRow[2]);
    });

    const renderableSeries = chartBuilder.buildSeries(wasmContext, {
        type: ESeriesType.BandSeries,
        options: {
            dataSeries,
            strokeThickness: 2,
            stroke: appTheme.DensityStrokeY,
            strokeY1: appTheme.DensityStrokeY1,
            fill: appTheme.DensityFillY,
            fillY1: appTheme.DensityFillY1,
        }
    });

    sciChartSurface.renderableSeries.add(...renderableSeries)

    const legendModifier = new LegendModifier({ placementDivId: `density-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generateDensityLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return sciChartSurface;
};

const generateDensityLegend = (
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
    <div class="chart-legend">
        <div class="legend-color-item" style="height: 30px; color: ${appTheme.LegendTextColor}">
            <div class="color-label" style="background-color: ${appTheme.DensityBackgroundOne};"></div>
            <div class="color-label" style="background-color: ${appTheme.DensityBackgroundTwo};"></div>
        </div>
        <span class="scichart__legend-line" style="border-top: 2px solid ${appTheme.DensityLegendSeparator}"></span>
        <div class="legend-text-item" style="color: $theme.LegendTextColor}">
            <span>${-0.2}</span>
            <span>${"DENSITY"}</span>
            <span>${0.2}</span>
        </div>
    </div>
    `;
};
