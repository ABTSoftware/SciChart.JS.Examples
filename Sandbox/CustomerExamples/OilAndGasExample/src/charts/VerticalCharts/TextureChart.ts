import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { RangeFillPaletteProvider, PaletteRange } from "./RangeFillPaletteProvider";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "./utils";

export const drawTextureChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("texture-chart", {
        ...getCommonChartConfigs("Texture"),
        modifiers: getCommonChartModifiersConfig(),
    });

    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(-5, 30);

    const dataSeries1 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
    const dataSeries2 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });

    const data = await getParsedData("Texture.csv");
    data.forEach((dataRow) => {
        const x = dataRow[0];
        dataSeries1.append(x, dataRow[1]);
        dataSeries2.append(x, 0);
    });

    const rangePaletteProvider = new RangeFillPaletteProvider([
        new PaletteRange(8, 8, "Goldenrod"),
        new PaletteRange(18, 22, "DarkCyan"),
        new PaletteRange(22, 25, "Goldenrod"),
        new PaletteRange(25, 26, "DarkCyan"),
        new PaletteRange(29, 29, "DarkCyan"),
        new PaletteRange(40, 40, "Green"),
        new PaletteRange(50, 55, "Green"),
        new PaletteRange(55, 58, "DarkCyan"),
        new PaletteRange(70, 75, "Goldenrod"),
        new PaletteRange(75, 76, "Green"),
        new PaletteRange(85, 97, "DarkCyan")
    ]);

    const renderableSeries = chartBuilder.buildSeries(wasmContext, [
        {
            type: ESeriesType.MountainSeries,
            options: {
                dataSeries: dataSeries1,
                paletteProvider: rangePaletteProvider,
                isDigitalLine: true,
                strokeThickness: 0,
                fill: "#90808080",
            }
        },
        {
            type: ESeriesType.LineSeries,
            options: {
                dataSeries: dataSeries2,
                strokeThickness: 4,
                stroke: "#808080",
            }
        },
    ]);

    renderableSeries[0].rolloverModifierProps.showRollover = false;
    renderableSeries[1].rolloverModifierProps.showRollover = false;

    sciChartSurface.renderableSeries.add(...renderableSeries);

    const legendModifier = new LegendModifier({ placementDivId: `texture-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generateTextureLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return sciChartSurface;
};

const generateTextureLegend = (
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
        <div class="legend-color-item">
            <div class="color-label" style="background-color: ${"#808080"};"></div>
            <div class="color-label" style="background-color: ${"DarkCyan"};"></div>
        </div>
        <div class="legend-text-item">
            <span>${"MUD"}</span>
            <span>${"GRAIN"}</span>
        </div>
        <div class="legend-color-item">
            <div class="color-label" style="background-color: ${"Goldenrod"};"></div>
            <div class="color-label" style="background-color: ${"Green"};"></div>
        </div>
        <div class="legend-text-item">
            <span>${"SAND"}</span>
            <span>${"GRAVEL"}</span>
        </div>
    </div>
    `;
};