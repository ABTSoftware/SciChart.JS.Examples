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
    EAutoRange,
    NumberRange,
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

    const color_OK = parseColorToUIntArgb(appTheme.PaleTeal);
    const color_Blue = parseColorToUIntArgb(appTheme.VividBlue);
    const color_Orange = parseColorToUIntArgb(appTheme.VividOrange);
    const color_Red = parseColorToUIntArgb(appTheme.VividRed);
    const defectsObjectColors: Record<DefectKey, number> = {
        OK: color_OK,
        S02: color_Blue,
        S04: color_Blue,
        S12: color_Blue,
        S14: color_Blue,
        S16: color_Blue,
        S23: color_Blue,
        S26: color_Blue,
        S27: color_Blue,
        S28: color_Blue,
        S36: color_Orange,
        S42: color_Blue,
        S48: color_Red,
        S49: color_Blue,
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

    const { xValues, yValues, zValues } = data;

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
                return defectsObjectColors[meta.DEFECT as DefectKey];
            }
            return undefined;
        }
    }

    // true = gradient, false = solid
    setChart(true);

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
        new MouseWheelZoomModifier()
        // new CursorModifier({
        //     showTooltip: true,
        //     tooltipDataTemplate,
        //     showXLine: false,
        //     showYLine: false,
        //     tooltipContainerBackground: appTheme.MutedSkyBlue + 55,
        // })
    );

    return { sciChartSurface, wasmContext, setChart };
};
