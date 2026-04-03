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
    uintArgbColorLerp,
    ManualLegend,
    ELegendOrientation,
} from "scichart";
import { appTheme } from "../../../theme";

import { WaferData } from "./store";
import { Dispatch } from "react";
import { DefectCode } from "./waferData";

const defectColorMap: Record<DefectCode, { name: string; htmlColor: string; paletteColor: number }> = {
    OK: { name: "OK", htmlColor: appTheme.PaleTeal, paletteColor: parseColorToUIntArgb(appTheme.PaleTeal) },
    D1: {
        name: "High MR & MR2",
        htmlColor: appTheme.VividSkyBlue,
        paletteColor: parseColorToUIntArgb(appTheme.VividSkyBlue),
    },
    D2: { name: "Low HR", htmlColor: appTheme.VividBlue, paletteColor: parseColorToUIntArgb(appTheme.VividBlue) },
    D3: { name: "Low HDI", htmlColor: appTheme.VividPurple, paletteColor: parseColorToUIntArgb(appTheme.VividPurple) },
    D4: { name: "High HR", htmlColor: appTheme.VividOrange, paletteColor: parseColorToUIntArgb(appTheme.VividOrange) },
    D5: { name: "Low MR & MR2", htmlColor: appTheme.VividRed, paletteColor: parseColorToUIntArgb(appTheme.VividRed) },
};

class RectanglePaletteProvider implements IFillPaletteProvider {
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    public selectedVariable: string;
    public variableRange: [number, number] | undefined;
    private red = parseColorToUIntArgb(appTheme.VividRed);
    private blue = parseColorToUIntArgb(appTheme.VividBlue);

    constructor(selectedVariable: string = "DEFECT", variableRange?: [number, number]) {
        this.selectedVariable = selectedVariable;
        this.variableRange = variableRange;
    }

    public onAttached(): void {}
    public onDetached(): void {}

    // Method to update the variable and range
    public updateVariable(selectedVariable: string, variableRange?: [number, number]): void {
        this.selectedVariable = selectedVariable;
        this.variableRange = variableRange;
    }

    // Called for each rectangle for fill color
    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        if (!metadata) return undefined;

        const metadataAny = metadata as any;

        // Handle DEFECT variable (original behavior)
        if (this.selectedVariable === "DEFECT") {
            if (metadataAny.DEFECT) {
                return defectColorMap[metadataAny.DEFECT as DefectCode].paletteColor;
            }
            return undefined;
        }

        // Handle other variables with color interpolation
        if (this.variableRange && metadataAny[this.selectedVariable] !== undefined) {
            const value = metadataAny[this.selectedVariable];
            const [minVal, maxVal] = this.variableRange;

            // Avoid division by zero
            if (maxVal === minVal) {
                return this.blue;
            }

            // Calculate ratio (0 to 1) for color interpolation
            const ratio = (value - minVal) / (maxVal - minVal);
            const clampedRatio = Math.max(0, Math.min(1, ratio));

            // Interpolate between blue (low values) and red (high values)
            return uintArgbColorLerp(this.blue, this.red, clampedRatio);
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

// Create init function that works with SciChartReact
export const createInitWaferChart =
    (
        setRowFilter: Dispatch<[number, number]>,
        setColFilter: Dispatch<[number, number]>,
        selectedVariable: string = "DEFECT",
        variableRange?: [number, number]
    ) =>
    async (rootElement: string | HTMLDivElement) => {
        // Create a SciChartSurface
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        // Add X-axis
        const xAxis = new NumericAxis(wasmContext, {
            labelPrecision: 0,
            labelStyle: { fontSize: 12 },
        });
        sciChartSurface.xAxes.add(xAxis);

        // Add Y-axis
        const yAxis = new NumericAxis(wasmContext, {
            labelPrecision: 0,
            labelStyle: { fontSize: 12 },
        });
        sciChartSurface.yAxes.add(yAxis);

        // Create empty data series
        const dataSeries = new XyzDataSeries(wasmContext, { containsNaN: false });

        // Create rectangle series with palette provider
        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries,
            columnXMode: EColumnMode.Start,
            columnYMode: EColumnYMode.TopHeight,
            paletteProvider: new RectanglePaletteProvider(selectedVariable, variableRange),
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

        // Create a manual legend to show Defect types
        const defectEntries = Object.values(defectColorMap);
        const legendItems = defectEntries.map((defect, i) => ({
            name: defect.name,
            color: defect.htmlColor,
            id: defect.name,
            checked: false,
        }));
        const legend = new ManualLegend(
            {
                textColor: "var(--text)",
                backgroundColor: appTheme.SciChartJsTheme.loadingAnimationBackground + "CC",
                items: legendItems,
                orientation: ELegendOrientation.Horizontal,
                placementDivId: "wafer-legend",
                margin: 0,
            },
            sciChartSurface
        );

        // Update function that clears and repopulates data
        const updateWaferData = (dataJSON: WaferData[]) => {
            const data = dataJSON.reduce(
                (acc, curr) => {
                    acc.xValues.push(+curr["MAP_COL"]);
                    acc.yValues.push(+curr["MAP_ROW"]);
                    acc.zValues.push(+curr["MR"]);
                    // Add all values to metaData so we can use them in paletteProvider
                    acc.metadata.push({ ...curr, isSelected: false });
                    return acc;
                },
                { xValues: [] as number[], yValues: [] as number[], zValues: [] as number[], metadata: [] as any[] }
            );

            // Clear existing data and append new data
            dataSeries.clear();
            dataSeries.appendRange(data.xValues, data.yValues, data.zValues, data.metadata);
        };

        // Function to update palette provider with new variable selection
        const updatePaletteProvider = (newVariable: string, newRange?: [number, number]) => {
            const paletteProvider = rectangleSeries.paletteProvider as RectanglePaletteProvider;
            paletteProvider.updateVariable(newVariable, newRange);
            // Force a redraw
            sciChartSurface.invalidateElement();
        };

        return { sciChartSurface, wasmContext, dataSeries, updateWaferData, updatePaletteProvider };
    };
