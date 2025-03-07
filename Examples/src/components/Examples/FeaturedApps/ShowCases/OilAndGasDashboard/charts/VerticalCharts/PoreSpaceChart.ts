import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getDataRows } from "../vChartUtils";
import { appTheme } from "../../theme";

export const drawPoreSpaceChart = async (rootELement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(rootELement, {
        ...getCommonChartConfigs("Pore Space"),
        modifiers: getCommonChartModifiersConfig(),
        surface: {
            theme: appTheme.SciChartJsTheme,
            padding: Thickness.fromNumber(0),
            id: "poreSpaceChart",
        },
    });

    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(-0.2, 1.6);

    const dataSeries1 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
    const dataSeries2 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });
    const dataSeries3 = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });

    const rows = await getDataRows("PoreSpace.csv");
    rows.forEach((row) => {
        const data = row.replace(",", ".").split(";");

        const x = Number.parseFloat(data[0]);

        if (!isNaN(x)) {
            dataSeries1.append(x, Number.parseFloat(data[1]));
            dataSeries2.append(x, Number.parseFloat(data[2]));

            if (data[3] !== "-") {
                dataSeries3.append(x, Number.parseFloat(data[3]));
            }
        }
    });

    const renderableSeries = chartBuilder.buildSeries(wasmContext, [
        {
            type: ESeriesType.StackedMountainSeries,
            options: {
                dataSeries: dataSeries1,
                strokeThickness: 2,
                stroke: appTheme.PoreSpaceStroke1,
                fill: appTheme.PoreSpacePhieFill,
            },
        },
        {
            type: ESeriesType.StackedMountainSeries,
            options: {
                dataSeries: dataSeries2,
                strokeThickness: 2,
                stroke: appTheme.PoreSpaceStroke2,
                fill: appTheme.PoreSpacePhitFill,
            },
        },
        {
            type: ESeriesType.ScatterSeries,
            options: {
                dataSeries: dataSeries3,
                pointMarker: new EllipsePointMarker(wasmContext, {
                    strokeThickness: 1,
                    stroke: appTheme.PoreSpaceScatterStroke,
                    fill: appTheme.PoreSpaceScatterFill,
                    width: 8,
                    height: 8,
                }),
            },
        },
    ]);

    sciChartSurface.renderableSeries.add(...renderableSeries);

    renderableSeries.forEach((rs) => {
        rs.rolloverModifierProps.tooltipColor = appTheme.RolloverTooltipFill;
        rs.rolloverModifierProps.tooltipTextColor = appTheme.RolloverTooltipText;
        rs.rolloverModifierProps.markerColor = appTheme.RolloverTooltipFill;
    });

    const legendModifier = new LegendModifier({ placementDivId: `pore-space-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generatePoreLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return { sciChartSurface };
};

const generatePoreLegend = (
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
    <div class="chart-legend" style="color: ${appTheme.LegendTextColor};">
        <div style="height: 18px; flex: auto; background-color: ${
            appTheme.PoreSpacePhieFill
        }; border-bottom: 2px solid ${appTheme.PoreSpaceStroke1};"></div>
        <div class="legend-text-item">
            <span>${-0.2}</span>
            <span>${"PHIE"}</span>
            <span>${1.6}</span>
        </div>
        <div style="height: 18px; flex: auto; background-color: ${
            appTheme.PoreSpacePhitFill
        }; border-bottom: 2px solid ${appTheme.PoreSpaceStroke2};"></div>
        <div class="legend-text-item">
            <span>${-0.2}</span>
            <span>${"PHIT"}</span>
            <span>${1.6}</span>
        </div>
        <div style="height: 18px; flex: auto; background-color: ${
            appTheme.PoreSpaceScatterFill
        }; border-bottom: 2px solid ${appTheme.PoreSpaceScatterStroke};"></div>
        <div class="legend-text-item">
            <span>${-0.2}</span>
            <span>${"CORE"}</span>
            <span>${1.6}</span>
        </div>
    </div>
    `;
};
