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
    DefaultPaletteProvider,
    TSciChart,
    parseColorToUIntArgb,
    TCursorTooltipDataTemplate,
    SeriesInfo,
    CursorModifier,
    zeroArray2D,
    XyzDataSeries,
    BoxAnnotation,
    XyDataSeries,
    XyxyDataSeries,
    FastBubbleRenderableSeries,
    EllipsePointMarker,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    HeatmapColorMap,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    EFillPaletteMode,
} from "scichart";
import { appTheme } from "../../../theme";

// import { generateMultipleLotData, generateWaferData } from "./waferData";

// import { csvJSON } from "./helpers";
import { WaferData } from "./store";

export const waferId = "waferId";

export const drawWafer = async (dataJSON: WaferData[]) => {
    // This function generates data for the heatmap with contours series example
    // function generateExampleData(index: number, heatmapWidth: number, heatmapHeight: number, colorPaletteMax: number) {
    //     const zValues = zeroArray2D([heatmapHeight, heatmapWidth]);

    //     const angle = (Math.PI * 2 * index) / 30;
    //     let smallValue = 0;
    //     for (let x = 0; x < heatmapWidth; x++) {
    //         for (let y = 0; y < heatmapHeight; y++) {
    //             const v =
    //                 (1 + Math.sin(x * 0.04 + angle)) * 50 +
    //                 (1 + Math.sin(y * 0.1 + angle)) * 50 * (1 + Math.sin(angle * 2));
    //             const cx = heatmapWidth / 2;
    //             const cy = heatmapHeight / 2;
    //             const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
    //             const exp = Math.max(0, 1 - r * 0.008);
    //             const zValue = v * exp;
    //             zValues[y][x] = zValue > colorPaletteMax ? colorPaletteMax : zValue;
    //             zValues[y][x] += smallValue;
    //         }

    //         smallValue += 0.001;
    //     }

    //     return zValues;
    // }

    // const response = await fetch("./wfdata.csv");
    // const csvContent = await response.text();

    // // console.log(csvJSON(csvContent))

    // const dataJSON = csvJSON(csvContent);

    // let defect: Record<string, number> = {};

    // dataJSON.map((d) => {
    //     const defectKey = d["DEFECT"];
    //     if (!defect[defectKey]) {
    //         defect[defectKey] = 1;
    //     } else {
    //         defect[defectKey] += 1;
    //     }
    // });

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

    const defectsObject = {
        OK: 68077,
        S02: 32,
        S04: 8,
        S12: 25,
        S14: 1,
        S16: 25,
        S23: 229,
        S26: 336,
        S27: 164,
        S28: 27,
        S36: 1477,
        S42: 19,
        S48: 5686,
        S49: 183,
    };

    // console.log(dataJSON.length);
    // 76289 records

    // function noGradientColor(
    //     value: number,
    //     min: number,
    //     max: number,
    //     gradientSteps: { offset: number; color: string }[]
    // ) {
    //     // Normalize the value to a 0-1 range
    //     const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));

    //     // Find the appropriate color segment
    //     for (let i = 0; i < gradientSteps.length - 1; i++) {
    //         const currentStep = gradientSteps[i];
    //         const nextStep = gradientSteps[i + 1];

    //         if (normalizedValue >= currentStep.offset && normalizedValue <= nextStep.offset) {
    //             // If the value falls exactly on a step, return that color
    //             if (normalizedValue === currentStep.offset) {
    //                 return currentStep.color;
    //             }
    //             if (normalizedValue === nextStep.offset) {
    //                 return nextStep.color;
    //             }

    //             // For interpolation between colors, you could return the nearest step
    //             // or implement color interpolation if your colors support it
    //             const segmentProgress = (normalizedValue - currentStep.offset) / (nextStep.offset - currentStep.offset);

    //             // Return the color closer to the normalized value
    //             return segmentProgress < 0.5 ? currentStep.color : nextStep.color;
    //         }
    //     }

    //     // Fallback: return the last color if value is at maximum
    //     return gradientSteps[gradientSteps.length - 1].color;
    // }

    // function getGradientColor(
    //     value: number,
    //     min: number,
    //     max: number,
    //     gradientSteps: { offset: number; color: string }[]
    // ) {
    //     const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));

    //     // Find the segment
    //     for (let i = 0; i < gradientSteps.length - 1; i++) {
    //         const currentStep = gradientSteps[i];
    //         const nextStep = gradientSteps[i + 1];

    //         if (normalizedValue >= currentStep.offset && normalizedValue <= nextStep.offset) {
    //             const segmentProgress = (normalizedValue - currentStep.offset) / (nextStep.offset - currentStep.offset);

    //             // Return interpolated color (implementation depends on your color system)
    //             return interpolateColors(currentStep.color, nextStep.color, segmentProgress);
    //         }
    //     }

    //     return gradientSteps[gradientSteps.length - 1].color;
    // }

    // // Helper function for color interpolation (returns hex color string)
    // function interpolateColors(color1: string, color2: string, factor: number): string {
    //     // Parse color1 and color2 as hex strings (e.g. "#RRGGBB" or "#AARRGGBB")
    //     const parseHex = (hex: string) => {
    //         // Remove '#' if present
    //         hex = hex.replace(/^#/, "");
    //         // Support short hex
    //         if (hex.length === 3) {
    //             hex = hex
    //                 .split("")
    //                 .map((c) => c + c)
    //                 .join("");
    //         }
    //         // Support ARGB or RGB
    //         let r = 0,
    //             g = 0,
    //             b = 0;
    //         if (hex.length === 6) {
    //             r = parseInt(hex.substring(0, 2), 16);
    //             g = parseInt(hex.substring(2, 4), 16);
    //             b = parseInt(hex.substring(4, 6), 16);
    //         } else if (hex.length === 8) {
    //             // ignore alpha for now
    //             r = parseInt(hex.substring(2, 4), 16);
    //             g = parseInt(hex.substring(4, 6), 16);
    //             b = parseInt(hex.substring(6, 8), 16);
    //         }
    //         return { r, g, b };
    //     };
    //     const c1 = parseHex(color1);
    //     const c2 = parseHex(color2);
    //     const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    //     const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    //     const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    //     // Return as hex string
    //     return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    // }

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(waferId, {
        theme: appTheme.SciChartJsTheme,
    });

    // class HeatmapPaletteProvider extends DefaultPaletteProvider {
    //     private min;
    //     private max;
    //     private gradientSteps;
    //     private gradient;

    //     private _isRangeIndependant?: boolean = true;
    //     public get isRangeIndependant(): boolean {
    //         return this._isRangeIndependant;
    //     }
    //     public set isRangeIndependant(value: boolean) {
    //         this._isRangeIndependant = value;
    //     }

    //     public shouldUpdatePalette(): boolean {
    //         return false;
    //     }

    //     constructor(
    //         wasmContext: TSciChart,
    //         minimum: number,
    //         maximum: number,
    //         gradientSteps: { offset: number; color: string }[],
    //         gradient: boolean
    //     ) {
    //         super();
    //         this.min = minimum;
    //         this.max = maximum;
    //         this.gradientSteps = gradientSteps;
    //         this.gradient = gradient;
    //     }

    //     public overrideFillArgb(
    //         xValue: number,
    //         yValue: number,
    //         index: number,
    //         opacity?: number,
    //         metadata?: IPointMetadata
    //     ): number | undefined {
    //         const value = dataSeries.getNativeZValues().get(index);

    //         const gradinetCalc = this.gradient
    //             ? getGradientColor(value, this.min, this.max, this.gradientSteps)
    //             : noGradientColor(value, this.min, this.max, this.gradientSteps);

    //         return parseColorToUIntArgb(gradinetCalc);
    //     }
    // }

    // Add X-axis
    const xAxis = new NumericAxis(wasmContext, {
        // isVisible: false,
    });

    sciChartSurface.xAxes.add(xAxis);

    // Add Y-axis
    const yAxis = new NumericAxis(wasmContext, {
        // isVisible: false,
        flippedCoordinates: true,
    });
    sciChartSurface.yAxes.add(yAxis);

    const heatmapWidth = 300;
    const heatmapHeight = 200;
    const colorPaletteMax = 150;

    // const initialZValues = generateExampleData(3, heatmapWidth, heatmapHeight, colorPaletteMax);

    // const waferData = generateWaferData({
    //     waferRadius: 300, // Wafer radius in mm (typical 300mm wafer)
    //     dieSize: 10, // Die size in mm
    //     lotId: 1, // Lot identifier
    //     defectProbability: 0.01, // Base probability of defects
    //     edgeDefectMultiplier: 2.5, // Higher defect rate near edges
    //     centerX: 0, // Wafer center X coordinate
    //     centerY: 0, // Wafer center Y coordinate
    //     randomSeed: null, // Optional seed for reproducible results
    // });

    // console.log(generateMultipleLotData(10));

    // const data = waferData.reduce(
    //     (acc, curr) => {
    //         acc.xValues.push(curr.x);
    //         acc.yValues.push(curr.y);
    //         acc.zValues.push(curr.defects);
    //         return acc;
    //     },
    //     { xValues: [], yValues: [], zValues: [] }
    // );

    // MR, MR2, HR, HDI

    // console.log(dataJSON[0], JSON.stringify(dataJSON[0]));

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

    const data = dataJSON.reduce(
        (acc, curr) => {
            acc.xValues.push(+curr["MAP_COL"]);
            acc.yValues.push(+curr["MAP_ROW"]);
            acc.zValues.push(+curr["MR"]);
            return acc;
        },
        { xValues: [], yValues: [], zValues: [] }
    );

    function findMinMax(arr: number[]) {
        if (!Array.isArray(arr) || arr.length === 0) {
            return { min: undefined, max: undefined };
        }

        return {
            min: Math.min(...arr),
            max: Math.max(...arr),
        };
    }

    const { xValues, yValues, zValues } = data;

    const { min, max } = findMinMax(zValues);

    const dataSeries = new XyzDataSeries(wasmContext, {
        xValues,
        yValues,
        zValues,
        metadata: dataJSON.map((d) => ({ ...d, isSelected: false })),
    });

    const setChart = (gradient: boolean) => {
        sciChartSurface.renderableSeries.clear(true);

        const margin = 10;

        // const outlineRectangle = new FastRectangleRenderableSeries(wasmContext, {
        //     dataSeries: new XyxyDataSeries(wasmContext, {
        //         xValues: [-300 - margin],
        //         x1Values: [300 + 10 + margin],
        //         yValues: [-300 - 10 - margin],
        //         y1Values: [300 + margin],
        //     }),
        //     columnXMode: EColumnMode.StartEnd, // x, x1
        //     columnYMode: EColumnYMode.TopBottom, // y, y1
        //     // dataPointWidth: 10,
        //     // defaultY1: 10,
        //     fill: "white", //"#ffffff00",
        //     stroke: "white", //"#ffffff00", //"white",
        //     strokeThickness: 5,
        //     opacity: 0.5,
        //     topCornerRadius: 250,
        //     bottomCornerRadius: 250,
        // });

        // sciChartSurface.renderableSeries.add(outlineRectangle);

        // const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        //     dataSeries: new XyzDataSeries(wasmContext, {
        //         xValues: [0],
        //         yValues: [0],
        //         zValues: [300],
        //     }),
        //     pointMarker: new EllipsePointMarker(wasmContext, {
        //         width: 320,
        //         height: 320,
        //         strokeThickness: 0,
        //         fill: "white",
        //         opacity: 0.5
        //     }),
        // });

        // sciChartSurface.renderableSeries.add(bubbleSeries);

        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries,
            columnXMode: EColumnMode.Start,
            columnYMode: EColumnYMode.TopHeight,
            // paletteProvider: new HeatmapPaletteProvider(
            //     wasmContext,
            //     min,
            //     max,
            //     // [
            //     //     { offset: 0, color: appTheme.DarkIndigo },
            //     //     { offset: 0.2, color: appTheme.Indigo },
            //     //     { offset: 0.3, color: appTheme.VividSkyBlue },
            //     //     { offset: 0.5, color: appTheme.VividGreen },
            //     //     { offset: 0.7, color: appTheme.MutedRed },
            //     //     { offset: 0.9, color: appTheme.VividOrange },
            //     //     { offset: 1, color: appTheme.VividPink },
            //     // ],
            //     [
            //         { offset: 0, color: appTheme.DarkIndigo },
            //         { offset: 0.5, color: appTheme.VividSkyBlue },
            //         { offset: 1, color: appTheme.VividPink },
            //     ],
            //     // [
            //     //     { offset: 0, color: appTheme.VividBlue },
            //     //     { offset: 0.5, color: appTheme.ForegroundColor },
            //     //     { offset: 1, color: appTheme.VividRed },
            //     // ],
            //     gradient
            // ),
            // fill: "red",
            paletteProvider: new RectanglePaletteProvider(dataJSON as unknown as RectangleMeta[]),
            dataPointWidth: 1,
            defaultY1: 1,
            strokeThickness: 0,
        });
        sciChartSurface.renderableSeries.add(rectangleSeries);
    };

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
                // You may need to implement your own color parsing here
                return parseColorToUIntArgb(defectsObjectColors[meta.DEFECT as DefectKey]);
                // return parseColorToUIntArgb((defectsObjectColors[meta.DEFECT]));
            }
            return undefined;
        }
    }

    // true = gradient, false = solid
    setChart(true);

    // UniformHeatmapRenderableSeries

    // function generateExampleData(
    //     width: number,
    //     height: number,
    //     cpMax: number,
    //     index: number,
    //     maxIndex: number
    // ): number[][] {
    //     // Returns a 2-dimensional javascript array [height (y)] [width (x)] size
    //     const zValues = zeroArray2D([height, width]);

    //     // math.round but to X digits
    //     function roundTo(number: number, digits: number) {
    //         return number;
    //         // return parseFloat(number.toFixed(digits));
    //     }

    //     const angle = roundTo(Math.PI * 2 * index, 3) / maxIndex;

    //     // When appending data to a 2D Array for the heatmap, the order of appending (X,Y) does not matter
    //     // but when accessing the zValues[][] array, we set data [y] then [x]
    //     for (let y = 0; y < height; y++) {
    //         for (let x = 0; x < width; x++) {
    //             const v =
    //                 (1 + roundTo(Math.sin(x * 0.04 + angle), 3)) * 50 +
    //                 (1 + roundTo(Math.sin(y * 0.1 + angle), 3)) * 50 * (1 + roundTo(Math.sin(angle * 2), 3));
    //             const cx = width / 2;
    //             const cy = height / 2;
    //             const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
    //             const exp = Math.max(0, 1 - r * 0.008);
    //             const zValue = v * exp + Math.random() * 10;
    //             zValues[y][x] = zValue > cpMax ? cpMax : zValue;
    //         }
    //     }
    //     return zValues;
    // }

    // const MAX_SERIES = 100;
    // const WIDTH = 300;
    // const HEIGHT = 200;

    // const initialZValues: number[][] = generateExampleData(WIDTH, HEIGHT, 200, 20, MAX_SERIES);

    // console.log({ initialZValues });

    // const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
    //     xStart: 0,
    //     xStep: 1,
    //     yStart: 0,
    //     yStep: 1,
    //     zValues: initialZValues,
    // });

    // const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
    //     dataSeries: heatmapDataSeries,
    //     useLinearTextureFiltering: false,
    //     colorMap: new HeatmapColorMap({
    //         minimum: 0,
    //         maximum: 200,
    //         gradientStops: [
    //             { offset: 1, color: appTheme.VividPink },
    //             { offset: 0.9, color: appTheme.VividOrange },
    //             { offset: 0.7, color: appTheme.MutedRed },
    //             { offset: 0.5, color: appTheme.VividGreen },
    //             { offset: 0.3, color: appTheme.VividSkyBlue },
    //             { offset: 0.2, color: appTheme.Indigo },
    //             { offset: 0, color: appTheme.DarkIndigo },
    //         ],
    //     }),
    // });

    // // Add heatmap to the chart
    // sciChartSurface.renderableSeries.add(heatmapSeries);

    // UniformHeatmapRenderableSeries end

    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[]) => {
        const valuesWithLabels: string[] = [];

        seriesInfos
            // .filter((si) => si.dataSeriesType !== "Xyxy")
            .forEach((si, i) => {
                // if (si.dataSeriesType === "Xyxy") {
                //     return null;
                // }

                // const dataObj = dataJSON[i]
                // console.log(dataObj)

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

    return { sciChartSurface, wasmContext, setChart };
};
