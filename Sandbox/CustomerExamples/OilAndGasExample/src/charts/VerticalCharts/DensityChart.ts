import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "./utils";

export 
const drawDensityChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("density-chart", {
        ...getCommonChartConfigs("Density"),
        modifiers: getCommonChartModifiersConfig(),
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
            stroke: "#1C1C1E",
            strokeY1: "Red",
            fill: "ForestGreen",
            fillY1: "Orange",
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
        <div class="legend-color-item" style="height: 30px;">
            <div class="color-label" style="background-color: ${"ForestGreen"};"></div>
            <div class="color-label" style="background-color: ${"Orange"};"></div>
        </div>
        <span class="scichart__legend-line" style="border-top: 2px solid ${"Red"}"></span>
        <div class="legend-text-item">
            <span>${-0.2}</span>
            <span>${"DENSITY"}</span>
            <span>${0.2}</span>
        </div>
    </div>
    `;
};
