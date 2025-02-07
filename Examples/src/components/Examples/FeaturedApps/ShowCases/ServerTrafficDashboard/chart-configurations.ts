import { EBaseType, TRolloverTooltipDataTemplate, XySeriesInfo, chartBuilder } from "scichart";

export type TChartViewOptions = { isMobileView: boolean; isLargeView: boolean };

const tooltipDataTemplate: TRolloverTooltipDataTemplate = (seriesInfo: XySeriesInfo): string[] => {
    const valuesWithLabels: string[] = [];
    // Line Series
    const xySeriesInfo = seriesInfo as XySeriesInfo;
    valuesWithLabels.push(`${xySeriesInfo.seriesName}: ${xySeriesInfo.formattedYValue}`);
    return valuesWithLabels;
};

export const tooltipDataTemplateKey = "CommonTooltipDataTemplate";

chartBuilder.registerFunction(EBaseType.OptionFunction, tooltipDataTemplateKey, tooltipDataTemplate);
