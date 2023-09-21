import { EBaseType, SciChartSurface, TRolloverTooltipDataTemplate, XySeriesInfo, chartBuilder } from 'scichart';

/** Synchronizes first X axes of the surfaces */
export const synchronizeXVisibleRanges = (surfaces: SciChartSurface[], shouldSync: () => boolean) => {
    const [firstSurface, ...otherSurfaces] = surfaces;
    const currentXAxis = firstSurface.xAxes.get(0);
    otherSurfaces.forEach((otherSurface) => {
        const otherXAxis = otherSurface.xAxes.get(0);
        // subscribe secondary axis  main axis
        currentXAxis.visibleRangeChanged.subscribe((data1) => {
            if (shouldSync()) {
                otherXAxis.visibleRange = data1.visibleRange;
            }
        });
        // subscribe main axis to secondary axis
        otherXAxis.visibleRangeChanged.subscribe((data1) => {
            if (shouldSync()) {
                currentXAxis.visibleRange = otherXAxis.visibleRange;
            }
        });
    });
};

const tooltipDataTemplate: TRolloverTooltipDataTemplate = (seriesInfo: XySeriesInfo): string[] => {
    const valuesWithLabels: string[] = [];
    // Line Series
    const xySeriesInfo = seriesInfo as XySeriesInfo;
    valuesWithLabels.push(`X: ${xySeriesInfo.formattedXValue} Y: ${xySeriesInfo.formattedYValue}`);
    return valuesWithLabels;
};

export const tooltipDataTemplateKey = 'CommonTooltipDataTemplate';

chartBuilder.registerFunction(EBaseType.OptionFunction, tooltipDataTemplateKey, tooltipDataTemplate);
