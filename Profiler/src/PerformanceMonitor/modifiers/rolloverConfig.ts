import { AxisBase2D, RolloverModifier, SeriesInfo, TRolloverTooltipDataTemplate } from "scichart";
import { SciChartSurface } from "scichart";
import { TCustomMetadata } from "../data/PerformanceStatsUtils";

const getTooltipDataTemplate: TRolloverTooltipDataTemplate = (
    seriesInfo: SeriesInfo,
    tooltipTitle: string,
    tooltipLabelX: string,
    tooltipLabelY: string
) => {
    // Lines here are returned to the tooltip and displayed as text-line per tooltip
    const lines: string[] = [];
    // lines.push(tooltipTitle);
    const metadataEntry = seriesInfo.pointMetadata as TCustomMetadata;
    // if (metadataEntry?.duration) {
    //     lines.push(`duration = ${metadataEntry.duration.toFixed(3)}ms`);
    // } else {
    // }
    // lines.push(`name = ${metadataEntry.name.split("_")[0]}`);
    const isOperationMarkType = seriesInfo.seriesName.split("-").shift().endsWith("End");
    if (isOperationMarkType) {
        // const dataSeries = seriesInfo.renderableSeries.dataSeries;
        // const nextYValue = dataSeries.getNativeValue(dataSeries.getNativeYValues(), seriesInfo.dataSeriesIndex + 1);
        const parsedSeriesName =
            seriesInfo.dataSeriesIndex % 2 ? seriesInfo.seriesName : seriesInfo.seriesName.replace("End", "Start");
        lines.push(parsedSeriesName);
        lines.push(`Duration: ${seriesInfo.point2xValue - seriesInfo.xValue}`);
    } else {
        lines.push(seriesInfo.seriesName);
    }

    lines.push(`T: ${seriesInfo.xValue}ms`);

    return lines;
};

export function addRollover(sciChartSurface: SciChartSurface, xAxis: AxisBase2D, yAxis: AxisBase2D) {
    const rolloverModifier = new RolloverModifier({
        hitTestRadius: 10,
        tooltipLegendOffsetY: 20,
        showTooltip: false,
        showRolloverLine: true,
        rolloverLineStrokeDashArray: [6, 20],
        showAxisLabel: true,
        xAxisId: xAxis.id,
        yAxisId: yAxis.id,
        // tooltipLegendTemplate: (seriesInfos: SeriesInfo[], svgAnnotation: RolloverLegendSvgAnnotation) => {
        //     let outputSvgString = '';
        //     seriesInfos.forEach((seriesInfo, index) => {
        //         const y = 40 + index * 20;
        //         outputSvgString += `<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="lightblue">${seriesInfo.xValue}</text>`;
        //     });

        //     return `<svg width="150" height="200">
        //         <rect width="100%" height="100%" fill="brown" stroke="#00000000" stroke-width="2" />
        //         <svg width="100%">
        //             ${outputSvgString}
        //         </svg>
        //     </svg>`;
        // },

        tooltipDataTemplate: getTooltipDataTemplate
    });

    sciChartSurface.chartModifiers.add(rolloverModifier);
}
