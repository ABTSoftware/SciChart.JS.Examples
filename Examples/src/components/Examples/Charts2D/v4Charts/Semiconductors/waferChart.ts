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
} from "scichart";
import { appTheme } from "../../../theme";
import { WaferLotData } from "./waferData";

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
    });

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
        flippedCoordinates: true,
    });
    sciChartSurface.yAxes.add(yAxis);

    // Generate mock wafer data based on the selected point
    // In a real application, you would use actual wafer data

    let dataJSON: RectangleMeta[] = [];

    // Generate a grid of points

    const generateGridOfPoints = (selectedPoint: WaferLotData) => {
        const containerWidth = sciChartSurface.domChartRoot.clientWidth;

        const waferSize = 21; //containerWidth <= 500 ? 50 : 100; // Size of the wafer grid

        dataJSON = [];

        for (let row = 0; row < waferSize; row++) {
            for (let col = 0; col < waferSize; col++) {
                // Calculate distance from center to create a circular pattern
                const centerX = waferSize / 2;
                const centerY = waferSize / 2;
                const distance = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));

                // Only include points within the circular wafer area
                if (distance <= waferSize / 2) {
                    // Determine defect type based on distance from center and selected point values
                    let defectType: DefectKey = "OK";

                    // Use the selected point's values to influence the defect distribution
                    const randomValue = Math.random() * Math.pow(Math.cbrt(selectedPoint.Input2), 1.5); //* (Math.sqrt(selectedPoint.Measure3 * 10));

                    if (distance > waferSize / 2.5) {
                        // Edge defects are more common
                        if (randomValue < 0.6) defectType = "S48";
                        else if (randomValue < 0.8) defectType = "S36";
                    } else if (distance < waferSize / 5) {
                        // Center defects
                        if (randomValue < 0.3) defectType = "S28";
                    }

                    // Create a data point with values influenced by the selected point
                    dataJSON.push({
                        MAP_ROW: row,
                        MAP_COL: col,
                        FF_ROW: Math.floor(Math.random() * 10),
                        FF_COL: Math.floor(Math.random() * 10),
                        WIF_COL: Math.floor(Math.random() * 50),
                        WIF_ROW: Math.floor(Math.random() * 50),
                        DEFECT: defectType,
                        MR: selectedPoint.Measure1 + (Math.random() - 0.5) * 20,
                        HR: selectedPoint.Measure2 + (Math.random() - 0.5) * 10,
                        HDI: selectedPoint.Measure3 + (Math.random() - 0.5) * 5,
                        MR2: selectedPoint.Input1 + (Math.random() - 0.5) * 30,
                    });
                }
            }
        }
    };

    let dataSeries = new XyzDataSeries(wasmContext, {});

    const setData = (selectedPoint: WaferLotData) => {
        generateGridOfPoints(selectedPoint);

        sciChartSurface.renderableSeries.clear(true);

        console.log({ dataJSON });

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

    setData(selectedPoint);

    // Add tooltip template
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
        new MouseWheelZoomModifier(),
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate,
            showXLine: false,
            showYLine: false,
            tooltipContainerBackground: appTheme.MutedSkyBlue + 55,
        })
    );

    // Add title to show which point was selected
    // const titleElement = document.createElement('div');
    // titleElement.style.textAlign = 'center';
    // titleElement.style.color = appTheme.MutedSkyBlue;
    // titleElement.style.fontSize = '14px';
    // titleElement.style.padding = '5px';
    // titleElement.textContent = `Wafer Plot for Date: ${selectedPoint.Date}, Quality: ${selectedPoint.Quality}`;

    // Insert title before the chart
    // const chartElement = rootElement instanceof HTMLDivElement ? rootElement : document.getElementById(rootElement as string);
    // if (chartElement && chartElement.parentNode) {
    //     chartElement.parentNode.insertBefore(titleElement, chartElement);
    // }

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};
