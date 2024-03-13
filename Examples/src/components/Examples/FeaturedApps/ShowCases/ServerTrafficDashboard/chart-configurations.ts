import {
    EBaseType,
    ISciChartSurfaceBase,
    SciChartSurface,
    TRolloverTooltipDataTemplate,
    XySeriesInfo,
    chartBuilder,
} from "scichart";
import { TDataEntry } from "./data-generation";
import { IInitResult, TInitFunction } from "scichart-react";

export type TUpdateDataFunc = (newData: TDataEntry[]) => void;

export interface TChartConfigResult<TSurface extends ISciChartSurfaceBase> extends IInitResult<TSurface> {
    updateData: TUpdateDataFunc;
}

export type TChartConfigFunc<TSurface extends ISciChartSurfaceBase = SciChartSurface> = TInitFunction<
    ISciChartSurfaceBase,
    TChartConfigResult<TSurface>
>;

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
    valuesWithLabels.push(`${xySeriesInfo.seriesName}: ${xySeriesInfo.formattedYValue}`);
    return valuesWithLabels;
};

export const tooltipDataTemplateKey = "CommonTooltipDataTemplate";

chartBuilder.registerFunction(EBaseType.OptionFunction, tooltipDataTemplateKey, tooltipDataTemplate);
