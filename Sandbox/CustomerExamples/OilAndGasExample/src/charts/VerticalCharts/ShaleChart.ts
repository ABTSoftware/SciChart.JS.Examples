import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "./utils";

export const drawShaleChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("shale-chart", {
        surface: {
            padding: Thickness.fromNumber(0),
            theme: { type: EThemeProviderType.DarkV2 },
        },

        ...getCommonChartConfigs("Shale"),
        modifiers: getCommonChartModifiersConfig(),
    });

    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(0, 100);

    const dataSeries1 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
    const dataSeries2 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
    const dataSeries3 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });

    const data = await getParsedData("Shale.csv");
    data.forEach((dataRow) => {
        const x = dataRow[0];
        dataSeries1.append(x, dataRow[1]);
        dataSeries2.append(x, dataRow[2]);
        dataSeries3.append(x, dataRow[3]);
    });

    const renderableSeries = chartBuilder.buildSeries(wasmContext, {
        type: ESeriesType.StackedMountainCollection,
        series: [
            {
                type: ESeriesType.StackedMountainSeries,
                options: {
                    fill: "LightGreen",
                    stroke: "#474747",
                    dataSeries: dataSeries1
                }
            },
            {
                type: ESeriesType.StackedMountainSeries,
                options: {
                    fill: "#E4E840",
                    stroke: "#474747",
                    dataSeries: dataSeries2
                }
            },
            {
                type: ESeriesType.StackedMountainSeries,
                options: {
                    fill: "Firebrick",
                    stroke: "#474747",
                    dataSeries: dataSeries3
                }
            },
        ],
        options: {
            isOneHundredPercent: true
        },
    });

    sciChartSurface.renderableSeries.add(...renderableSeries)

    // TODO
    // renderableSeries2.paletteProvider = new RangeFillPaletteProvider([
    //     new PaletteRange(0, 100, EColor.Orange),
    //     new PaletteRange(150, 200, EColor.Orange),
    //     new PaletteRange(220, 260, EColor.Blue),
    //     new PaletteRange(260, 280, EColor.Red),
    //     new PaletteRange(280, 350, EColor.Orange),
    //     new PaletteRange(400, 420, EColor.LimeGreen),
    //     new PaletteRange(480, 580, EColor.Blue),
    //     new PaletteRange(600, 620, EColor.LightSteelBlue),
    //     new PaletteRange(750, 800, EColor.Orange),
    //     new PaletteRange(820, 840, EColor.LimeGreen),
    //     new PaletteRange(900, 950, EColor.LightSteelBlue)
    // ])

    const legendModifier = new LegendModifier({ placementDivId: `shale-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generateShaleLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return sciChartSurface;
};

const generateShaleLegend = (
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
            <div class="color-label" style="background-color: ${"Firebrick"};"></div>
            <div class="color-label" style="background-color: ${"Blue"};"></div>
        </div>
        <div class="legend-text-item">
            <span>${"100"}</span>
            <span>${"OIL"}</span>
            <span>${"WATER"}</span>
            <span>${"0"}</span>
        </div>
        <div class="legend-color-item" style="background-color: ${"LightGreen"};">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <style type="text/css">
                    line { stroke: #474747;  }
                </style>
                <defs>
                    <pattern id="grid1" patternUnits="userSpaceOnUse" width="10" height="10">
                        <line x1="0" y1="0" x2="10" y2="10" />
                    </pattern>
                    <pattern id="grid2" patternUnits="userSpaceOnUse" width="10" height="10">
                        <line x1="0" y1="10" x2="10" y2="0" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid1)" />
                <rect width="100%" height="100%" fill="url(#grid2)" />
            </svg>
        </div>
        <div class="legend-text-item">
            <span>${"0"}</span>
            <span>${"SHALE"}</span>
            <span>${"100"}</span>
        </div>
    </div>
    `;
};
