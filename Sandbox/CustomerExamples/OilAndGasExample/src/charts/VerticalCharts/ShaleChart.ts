import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";
import { PaletteRange, RangeFillPaletteProvider } from "./RangeFillPaletteProvider";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "./utils";
import { EColor } from "scichart/types/Color";
import { StackedMountainCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainCollection";
import {
    LegendTextColor,
    ShaleBackgroundColor,
    ShaleLegendColor1,
    ShaleLegendColor2,
    ShaleSeriesStroke, ShaleWaterSeries,
    theme
} from "../../theme";

export const drawShaleChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("shale-chart", {
        ...getCommonChartConfigs("Shale"),
        surface: {
            padding: Thickness.fromNumber(0),
            theme: { type: EThemeProviderType.SC2022, sciChartBackground: "Transparent" },
        },
        modifiers: getCommonChartModifiersConfig(),
    });

    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(0, 100);
    sciChartSurface.yAxes.get(0).drawMajorGridLines = false;
    sciChartSurface.xAxes.get(0).drawMajorGridLines = false;

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
                    fill: "transparent",
                    stroke: ShaleSeriesStroke,
                    dataSeries: dataSeries1
                }
            },
            {
                type: ESeriesType.StackedMountainSeries,
                options: {
                    fill: ShaleWaterSeries,
                    stroke: ShaleSeriesStroke,
                    dataSeries: dataSeries2,
                    // TODO: Uncomment after chart.js v2.2 release
                    // paletteProvider: new RangeFillPaletteProvider([
                    //     new PaletteRange(0, 100, EColor.Orange),
                    //     new PaletteRange(150, 200, EColor.Orange),
                    //     new PaletteRange(220, 260, EColor.Blue),
                    //     new PaletteRange(260, 280, EColor.Red),
                    //     new PaletteRange(280, 350, EColor.Orange),
                    //     new PaletteRange(400, 420, EColor.LimeGreen),
                    //     new PaletteRange(480, 580, EColor.Blue),
                    //     new PaletteRange(600, 620, EColor.Aqua),
                    //     new PaletteRange(750, 800, EColor.Orange),
                    //     new PaletteRange(820, 840, EColor.LimeGreen),
                    //     new PaletteRange(900, 950, EColor.Aqua)
                    // ])
                }
            },
            {
                type: ESeriesType.StackedMountainSeries,
                options: {
                    fill: ShaleLegendColor1,
                    stroke: ShaleSeriesStroke,
                    dataSeries: dataSeries3
                }
            },
        ],
        options: {
            isOneHundredPercent: true
        },
    });

    const stackedMountainCollection = renderableSeries[0] as StackedMountainCollection
    stackedMountainCollection.get(2).rolloverModifierProps.showRollover = false;

    sciChartSurface.renderableSeries.add(...renderableSeries)

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
            <div class="color-label" style="background-color: ${ShaleLegendColor1}; color: ${LegendTextColor};"></div>
            <div class="color-label" style="background-color: ${ShaleLegendColor2}; color: ${LegendTextColor};"></div>
        </div>
        <div class="legend-text-item" style="color: ${LegendTextColor}">
            <span>${"100"}</span>
            <span>${"OIL"}</span>
            <span>${"WATER"}</span>
            <span>${"0"}</span>
        </div>
        <div class="legend-color-item" style="background-color: ${ShaleBackgroundColor};">
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
        <div class="legend-text-item" style="color: ${LegendTextColor};">
            <span>${"0"}</span>
            <span>${"SHALE"}</span>
            <span>${"100"}</span>
        </div>
    </div>
    `;
};
