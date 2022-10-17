import { chartBuilder } from "scichart/Builder/chartBuilder";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { XyMovingAverageFilter } from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendPlacement, ELegendOrientation, TLegendItem } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { ESeriesType } from "scichart/types/SeriesType";
import { getCommonChartConfigs, getCommonChartModifiersConfig, getParsedData } from "./utils";
import { theme} from "../../theme";

export 
const drawResistivityChart = async () => {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("resistivity-chart", {
        ...getCommonChartConfigs("Resistivity"),
        modifiers: getCommonChartModifiersConfig(),
        surface: {
            theme: { type: theme.SciChartJsTheme.type },
        }
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
                stroke: theme.ResistivityLineStroke,
            }
        },
        {
            type: ESeriesType.LineSeries,
            options: {
                dataSeries: movingAverage20DataSeries,
                strokeDashArray: [5, 5],
                stroke: theme.ResistivityLineStroke2,
            }
        },
    ]);

    sciChartSurface.renderableSeries.add(...renderableSeries)

    const legendModifier = new LegendModifier({ placementDivId: `resistivity-legend` });
    legendModifier.sciChartLegend.getLegendHTML = generateResistivityLegend;
    sciChartSurface.chartModifiers.add(legendModifier);

    return sciChartSurface;
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
    <div class="chart-legend" style="color: ${theme.LegendTextColor};">
    <span class="scichart__legend-line" style="border-top: 2px dashed ${theme.ResistivityLineStroke2}"></span>
        <div class="legend-text-item">
            <span>${0}</span>
            <span>${"AVRG 40"}</span>
            <span>${1}</span>
        </div>
        <span class="scichart__legend-line" style="border-top: 2px solid ${theme.ResistivityLineStroke}"></span>
        <div class="legend-text-item">
            <span>${0}</span>
            <span>${"RESISTIVITY"}</span>
            <span>${1}</span>
        </div>
    </div>
    `;
};

