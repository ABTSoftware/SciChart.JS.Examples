import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { RangeFillPaletteProvider, PaletteRange } from "./RangeFillPaletteProvider";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "../vChartUtils";
import { appTheme } from "../../theme";
import { EAxisAlignment, EAxisType } from "scichart";

export const drawTextureChart = async (rootELement: string | HTMLDivElement) => {
    const yAxisId = "y-axis-id";
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(rootELement, {
        ...getCommonChartConfigs("Texture"),
        surface: {
            theme: appTheme.SciChartJsTheme,
            padding: Thickness.fromNumber(0),
            id: "textureChart",
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                id: yAxisId,
                axisAlignment: EAxisAlignment.Bottom,
            },
        },
        modifiers: getCommonChartModifiersConfig(yAxisId),
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
        new PaletteRange(8, 8, appTheme.TextureSandFill),
        new PaletteRange(18, 22, appTheme.TextureGrainFill),
        new PaletteRange(22, 25, appTheme.TextureSandFill),
        new PaletteRange(25, 26, appTheme.TextureGrainFill),
        new PaletteRange(29, 29, appTheme.TextureGrainFill),
        new PaletteRange(40, 40, appTheme.TextureGravelFill),
        new PaletteRange(50, 55, appTheme.TextureGravelFill),
        new PaletteRange(55, 58, appTheme.TextureGrainFill),
        new PaletteRange(70, 75, appTheme.TextureSandFill),
        new PaletteRange(75, 76, appTheme.TextureGravelFill),
        new PaletteRange(85, 97, appTheme.TextureGrainFill),
    ]);

    const renderableSeries = chartBuilder.buildSeries(wasmContext, [
        {
            type: ESeriesType.MountainSeries,
            options: {
                dataSeries: dataSeries1,
                paletteProvider: rangePaletteProvider,
                isDigitalLine: true,
                strokeThickness: 0,
                fill: appTheme.TextureFill,
            },
        },
        {
            type: ESeriesType.LineSeries,
            options: {
                dataSeries: dataSeries2,
                strokeThickness: 4,
                stroke: appTheme.TextureLine,
            },
        },
    ]);

    renderableSeries[0].rolloverModifierProps.showRollover = false;
    renderableSeries[1].rolloverModifierProps.showRollover = false;

    sciChartSurface.renderableSeries.add(...renderableSeries);

    const legendModifier = new LegendModifier({ placementDivId: `texture-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generateTextureLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return { sciChartSurface };
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
    <div class="chart-legend full-size-legend" style="color: ${appTheme.LegendTextColor};">
        <div class="legend-color-item">
            <div class="color-label" style="background-color: ${appTheme.TextureLine};"></div>
            <div class="color-label" style="background-color: ${appTheme.TextureGrainFill};"></div>
        </div>
        <div class="legend-text-item">
            <span>${"MUD"}</span>
            <span>${"GRAIN"}</span>
        </div>
        <div class="legend-color-item">
            <div class="color-label" style="background-color: ${appTheme.TextureSandFill};"></div>
            <div class="color-label" style="background-color: ${appTheme.TextureGravelFill};"></div>
        </div>
        <div class="legend-text-item">
            <span>${"SAND"}</span>
            <span>${"GRAVEL"}</span>
        </div>
    </div>
    `;
};
