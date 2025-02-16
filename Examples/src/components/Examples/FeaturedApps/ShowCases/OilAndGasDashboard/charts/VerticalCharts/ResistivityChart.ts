import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyMovingAverageFilter } from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "../vChartUtils";
import { appTheme } from "../../theme";
import { EAxisAlignment, EAxisType } from "scichart";

export const drawResistivityChart = async (rootELement: string | HTMLDivElement) => {
    const yAxisId = "y-axis-id";
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(rootELement, {
        ...getCommonChartConfigs("Resistivity"),
        surface: {
            theme: appTheme.SciChartJsTheme,
            padding: Thickness.fromNumber(0),
            id: "resistivityChart",
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

    sciChartSurface.yAxes.get(0).visibleRange = new NumberRange(0, 1);

    const dataSeries = new XyDataSeries(wasmContext, { dataIsSortedInX: true, containsNaN: false });

    const data = await getParsedData("Resistivity.csv");
    data.forEach((dataRow) => {
        dataSeries.append(dataRow[0], dataRow[1]);
    });

    const movingAverage20DataSeries = new XyMovingAverageFilter(dataSeries, { length: 20, dataIsSortedInX: true });

    const renderableSeries = chartBuilder.buildSeries(wasmContext, [
        {
            type: ESeriesType.LineSeries,
            options: {
                dataSeries,
                strokeThickness: 2,
                stroke: appTheme.ResistivityLineStroke,
            },
        },
        {
            type: ESeriesType.LineSeries,
            options: {
                dataSeries: movingAverage20DataSeries,
                strokeDashArray: [5, 5],
                stroke: appTheme.ResistivityLineStroke2,
            },
        },
    ]);

    sciChartSurface.renderableSeries.add(...renderableSeries);

    renderableSeries.forEach((rs) => {
        rs.rolloverModifierProps.tooltipColor = appTheme.RolloverTooltipFill;
        rs.rolloverModifierProps.tooltipTextColor = appTheme.RolloverTooltipText;
        rs.rolloverModifierProps.markerColor = appTheme.RolloverTooltipFill;
    });

    const legendModifier = new LegendModifier({ placementDivId: `resistivity-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generateResistivityLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return { sciChartSurface };
};

const generateResistivityLegend = (
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
    <span class="scichart__legend-line" style="border-top: 2px dashed ${appTheme.ResistivityLineStroke2}"></span>
        <div class="legend-text-item">
            <span>${0}</span>
            <span>${"AVRG 40"}</span>
            <span>${1}</span>
        </div>
        <span class="scichart__legend-line" style="border-top: 2px solid ${appTheme.ResistivityLineStroke}"></span>
        <div class="legend-text-item">
            <span>${0}</span>
            <span>${"RESISTIVITY"}</span>
            <span>${1}</span>
        </div>
    </div>
    `;
};
