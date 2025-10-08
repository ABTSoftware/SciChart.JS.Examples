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
    CursorModifier,
    XyzDataSeries,
    IFillPaletteProvider,
    EFillPaletteMode,
    NumberRange,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";
import { generateGridOfPoints, WaferLotData } from "./waferData";

// We'll use a dynamic ID that will be passed from the component

// Define a type for defect codes
type DefectKey =
    | "OK"
    | "S02"
    | "S04"
    | "S12"
    | "S14"
    | "S16"
    | "S23"
    | "S26"
    | "S27"
    | "S28"
    | "S36"
    | "S42"
    | "S48"
    | "S49";

// Define colors for different defect types
const defectsObjectColors: Record<DefectKey, string> = {
    OK: appTheme.PaleTeal,
    S02: appTheme.VividBlue,
    S04: appTheme.VividBlue,
    S12: appTheme.VividBlue,
    S14: appTheme.VividBlue,
    S16: appTheme.VividBlue,
    S23: appTheme.VividBlue,
    S26: appTheme.VividBlue,
    S27: appTheme.VividBlue,
    S28: appTheme.VividBlue,
    S36: appTheme.VividOrange,
    S42: appTheme.VividBlue,
    S48: appTheme.VividRed,
    S49: appTheme.VividBlue,
};

// Interface for rectangle metadata
interface RectangleMeta {
    MAP_ROW: number;
    MAP_COL: number;
    FF_ROW: number;
    FF_COL: number;
    WIF_COL: number;
    WIF_ROW: number;
    DEFECT: string;
    MR: number;
    HR: number;
    HDI: number;
    MR2: number;
}

// Custom palette provider for the wafer chart
class RectanglePaletteProvider implements IFillPaletteProvider {
    private readonly metadata: RectangleMeta[];

    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    public onAttached(): void {}
    public onDetached(): void {}

    constructor(metadata: RectangleMeta[]) {
        this.metadata = metadata;
    }

    // Called for each rectangle for fill color
    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        // Use metadata array to select color
        const meta = this.metadata[index];
        if (meta && (meta as any).DEFECT) {
            return parseColorToUIntArgb(defectsObjectColors[meta.DEFECT as DefectKey]);
        }
        return undefined;
    }
}

// Function to find min and max values in an array
function findMinMax(arr: number[]) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return { min: undefined, max: undefined };
    }

    return {
        min: Math.min(...arr),
        max: Math.max(...arr),
    };
}

// Main function to draw the wafer chart
export const drawWaferChart = async (rootElement: string | HTMLDivElement, selectedPoint: WaferLotData) => {
    // Generate wafer data based on the selected point
    // For this example, we'll use a simple approach to generate wafer data
    // In a real application, you might want to fetch this data from an API or use a more sophisticated algorithm

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Wafer",
        titleStyle: {
            fontSize: 22,
            useNativeText: false,
            color: appTheme.PaleSkyBlue,
            padding: new Thickness(25, 30, 5, 5),
        },
    });

    const sizeIsSmall = sciChartSurface.domCanvas2D.width < 512 ? true : false;

    if (sizeIsSmall) {
        sciChartSurface.titleStyle = {
            fontSize: 16,
            useNativeText: false,
            color: appTheme.PaleSkyBlue,
            padding: new Thickness(15, 30, 0, 5),
        };
    } else {
        sciChartSurface.titleStyle = {
            fontSize: 26,
            useNativeText: false,
            color: appTheme.PaleSkyBlue,
            padding: new Thickness(25, 30, 0, 5),
        };
    }

    const growBy = new NumberRange(0.1, 0.1);

    // Add X-axis
    const xAxis = new NumericAxis(wasmContext, {
        // isVisible: false,
        growBy,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Add Y-axis
    const yAxis = new NumericAxis(wasmContext, {
        // isVisible: false,
        growBy,
        // flippedCoordinates: true,
    });
    sciChartSurface.yAxes.add(yAxis);

    let dataSeries = new XyzDataSeries(wasmContext, {});

    function numberToCoordinates(num: number): string {
        if (num < 0 || num > 19) {
            throw new Error("Number must be between 0 and 19");
        }

        // Calculate row and column
        const row = Math.floor(num / 5) + 1;
        const col = num % 5;
        const colLetter = String.fromCharCode("A".charCodeAt(0) + col);

        return `${colLetter}${row}`;
    }

    const setData = (selectedPoint: WaferLotData, index: number) => {
        let dataJSON = generateGridOfPoints(selectedPoint, index);

        sciChartSurface.renderableSeries.clear(true);

        sciChartSurface.title = `Plot: ${numberToCoordinates(index)}, Batch: ${selectedPoint.Batch}, Date: ${
            selectedPoint.Date
        } `;

        // Extract data for the chart
        const data = dataJSON.reduce(
            (acc, curr) => {
                acc.xValues.push(+curr["MAP_COL"]);
                acc.yValues.push(+curr["MAP_ROW"]);
                acc.zValues.push(+curr["MR"]);
                return acc;
            },
            { xValues: [], yValues: [], zValues: [] } as { xValues: number[]; yValues: number[]; zValues: number[] }
        );

        const { xValues, yValues, zValues } = data;
        const { min, max } = findMinMax(zValues);

        // Create data series
        dataSeries = new XyzDataSeries(wasmContext, {
            xValues,
            yValues,
            zValues,
            metadata: dataJSON.map((d) => ({ ...d, isSelected: false })),
        });

        // Create and add rectangle series
        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries,
            columnXMode: EColumnMode.Start,
            columnYMode: EColumnYMode.TopHeight,
            paletteProvider: new RectanglePaletteProvider(dataJSON),
            dataPointWidth: 1,
            defaultY1: 1,
            strokeThickness: 0,
        });

        sciChartSurface.renderableSeries.add(rectangleSeries);
    };

    setData(selectedPoint, 0);

    const setDataIndex = (selectedPoint: WaferLotData, index: number) => {
        setData(selectedPoint, index);
    };

    // Add tooltip template
    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[]) => {
        const valuesWithLabels: string[] = [];

        seriesInfos.forEach((si) => {
            const xyzSI = si;
            if (xyzSI.isWithinDataBounds) {
                if (!isNaN(xyzSI.yValue) && xyzSI.isHit) {
                    const value = dataSeries.getNativeZValues().get(xyzSI.dataSeriesIndex);

                    let metaValue = (xyzSI.pointMetadata as RectangleMeta | undefined)?.DEFECT;

                    valuesWithLabels.push(
                        `X: ${xyzSI.xValue}, Y: ${xyzSI.yValue}, DEFECT: ${metaValue === "OK" ? "NONE" : metaValue}`
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
        new MouseWheelZoomModifier(),
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate,
            showXLine: false,
            showYLine: false,
            tooltipContainerBackground: appTheme.MutedSkyBlue + 55,
        })
    );

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext, setDataIndex };
};
