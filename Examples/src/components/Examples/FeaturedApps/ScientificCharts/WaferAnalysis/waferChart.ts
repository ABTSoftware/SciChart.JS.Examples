import {
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    FastRectangleRenderableSeries,
    EColumnYMode,
    EColumnMode,
    IPointMetadata,
    parseColorToUIntArgb,
    TCursorTooltipDataTemplate,
    SeriesInfo,
    XyzDataSeries,
    IFillPaletteProvider,
    EFillPaletteMode,
} from "scichart";
import { appTheme } from "../../../theme";

import { WaferData } from "./store";

export const waferId = "waferId";

type DefectKey = "OK" | "D1" | "D2" | "D3" | "D4" | "D5";

interface RectangleMeta {
    DEFECT: string;
    MR: number;
    HR: number;
}

const color_OK = parseColorToUIntArgb(appTheme.PaleTeal);
const color_Blue = parseColorToUIntArgb(appTheme.VividBlue);
const color_Purple = parseColorToUIntArgb(appTheme.VividPurple);
const color_Orange = parseColorToUIntArgb(appTheme.VividOrange);
const color_Red = parseColorToUIntArgb(appTheme.VividRed);
const defectsObjectColors: Record<DefectKey, number> = {
    OK: color_OK,
    D1: color_Blue,
    D2: color_Blue,
    D3: color_Purple,
    D4: color_Orange,
    D5: color_Red,
};

class RectanglePaletteProvider implements IFillPaletteProvider {
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    public onAttached(): void {}
    public onDetached(): void {}

    // Called for each rectangle for fill color
    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        // Use the metadata parameter directly from the dataSeries
        if (metadata && (metadata as any).DEFECT) {
            return defectsObjectColors[(metadata as any).DEFECT as DefectKey];
        }
        return undefined;
    }
}

export const initializeWafer = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(waferId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add X-axis
    const xAxis = new NumericAxis(wasmContext, {
        // isVisible: false,
        //visibleRange: new NumberRange(0, 40)
    });
    sciChartSurface.xAxes.add(xAxis);

    // Add Y-axis
    const yAxis = new NumericAxis(wasmContext, {
        // isVisible: false,
        flippedCoordinates: true,
        //visibleRange: new NumberRange(0, 40)
    });
    sciChartSurface.yAxes.add(yAxis);

    // Create empty data series
    const dataSeries = new XyzDataSeries(wasmContext, {
        xValues: [],
        yValues: [],
        zValues: [],
        metadata: [],
    });

    // Create rectangle series with palette provider
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries,
        columnXMode: EColumnMode.Start,
        columnYMode: EColumnYMode.TopHeight,
        paletteProvider: new RectanglePaletteProvider(),
        dataPointWidth: 1,
        defaultY1: 1,
        strokeThickness: 0,
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);

    // Tooltip template
    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[]) => {
        const valuesWithLabels: string[] = [];

        seriesInfos.forEach((si, i) => {
            const xyzSI = si;
            if (xyzSI.isWithinDataBounds) {
                if (!isNaN(xyzSI.yValue) && xyzSI.isHit) {
                    const value = dataSeries.getNativeZValues().get(xyzSI.dataSeriesIndex);
                    valuesWithLabels.push(
                        `X: ${xyzSI.xValue}, Y: ${xyzSI.yValue}, DEFECT: ${
                            (xyzSI.pointMetadata as RectangleMeta | undefined)?.DEFECT ?? "null"
                        }`
                    );
                }
            }
        });
        return valuesWithLabels;
    };

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
        // new CursorModifier({
        //     showTooltip: true,
        //     tooltipDataTemplate,
        //     showXLine: false,
        //     showYLine: false,
        //     tooltipContainerBackground: appTheme.MutedSkyBlue + 55,
        // })
    );

    // Update function that clears and repopulates data
    const updateWaferData = (dataJSON: WaferData[]) => {
        const data = dataJSON.reduce(
            (acc, curr) => {
                acc.xValues.push(+curr["MAP_COL"]);
                acc.yValues.push(+curr["MAP_ROW"]);
                acc.zValues.push(+curr["MR"]);
                acc.metadata.push({ DEFECT: curr.DEFECT, MR: curr.MR, HR: curr.HR, isSelected: false });
                return acc;
            },
            { xValues: [] as number[], yValues: [] as number[], zValues: [] as number[], metadata: [] as any[] }
        );

        // Clear existing data and append new data
        dataSeries.clear();
        dataSeries.appendRange(data.xValues, data.yValues, data.zValues, data.metadata);
    };

    // Cleanup function
    const cleanup = () => {
        sciChartSurface?.delete();
    };

    return { sciChartSurface, wasmContext, updateWaferData, cleanup };
};
