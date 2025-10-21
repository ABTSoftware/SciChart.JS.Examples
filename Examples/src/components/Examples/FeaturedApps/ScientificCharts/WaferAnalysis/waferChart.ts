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
    DataPointSelectionModifier,
    Rect,
    ESelectionMode,
    BaseDataSeries,
    EExecuteOn,
    ModifierMouseArgs,
    Point,
} from "scichart";
import { appTheme } from "../../../theme";

import { WaferData } from "./store";
import { Dispatch } from "react";

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

class WaferRangeSelectionModifier extends DataPointSelectionModifier {
    public setRowFilter: Dispatch<[number, number]>;
    public setColFilter: Dispatch<[number, number]>;
    private isFiltered: boolean = false;

    protected selectManyPoints(rect: Rect, selectionMode: ESelectionMode) {
        if (this.parentSurface && this.setRowFilter && this.setColFilter) {
            const rs = this.getIncludedRenderableSeries()[0];

            const xCalc = rs.xAxis.getCurrentCoordinateCalculator();
            const yCalc = rs.yAxis.getCurrentCoordinateCalculator();

            // Find the bounds of the data inside the rectangle
            let leftXData, rightXData;
            if (xCalc.getDataValue(rect.left) <= xCalc.getDataValue(rect.right)) {
                leftXData = xCalc.getDataValue(rect.left);
                rightXData = xCalc.getDataValue(rect.right);
            } else {
                leftXData = xCalc.getDataValue(rect.right);
                rightXData = xCalc.getDataValue(rect.left);
            }
            let bottomYData, topYData;
            if (yCalc.getDataValue(rect.top) <= yCalc.getDataValue(rect.bottom)) {
                bottomYData = yCalc.getDataValue(rect.top);
                topYData = yCalc.getDataValue(rect.bottom);
            } else {
                bottomYData = yCalc.getDataValue(rect.bottom);
                topYData = yCalc.getDataValue(rect.top);
            }
            this.setRowFilter([topYData, bottomYData]);
            this.setColFilter([leftXData, rightXData]);
            this.isFiltered = true;
        }
    }

    protected selectSinglePoint(point: Point, selectionMode: ESelectionMode): void {
        this.setRowFilter(undefined);
        this.setColFilter(undefined);
        this.isFiltered = false;
    }

    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);
        this.selectionRect.isHidden = !this.isFiltered;
    }
}

export const initializeWafer = async (
    setRowFilter: Dispatch<[number, number]>,
    setColFilter: Dispatch<[number, number]>
) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(waferId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add X-axis
    const xAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Add Y-axis
    const yAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(yAxis);

    // Create empty data series
    const dataSeries = new XyzDataSeries(wasmContext);

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

    const dataPointSelection = new WaferRangeSelectionModifier({
        allowDragSelect: true,
        allowClickSelect: true,
    });
    dataPointSelection.setRowFilter = setRowFilter;
    dataPointSelection.setColFilter = setColFilter;

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        dataPointSelection
    );

    // Update function that clears and repopulates data
    const updateWaferData = (dataJSON: WaferData[]) => {
        console.log("wafer update", dataJSON.length);
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
