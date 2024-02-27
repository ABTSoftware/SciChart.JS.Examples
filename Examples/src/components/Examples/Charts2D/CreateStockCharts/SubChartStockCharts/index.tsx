import * as React from "react";
import { appTheme, multiPaneData } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";
import { FinChartLegendModifier, IFinanceLegendModifierOptions } from "./FinChartLegendModifier";

import {
    SciChartSurface,
    BasePaletteProvider,
    calcAverageForArray,
    chartBuilder,
    CustomAnnotation,
    EAutoRange,
    EAxisAlignment,
    EAxisType,
    EChart2DModifierType,
    EDataFilterType,
    EFillPaletteMode,
    EHorizontalAnchorPoint,
    ESeriesType,
    EStrokePaletteMode,
    EVerticalAnchorPoint,
    EXyDirection,
    I2DSubSurfaceOptions,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    NumberRange,
    parseColorToUIntArgb,
    Rect,
    SciChartVerticalGroup,
    Thickness,
} from "scichart";

export const mainChartWrapper = "cc_chart";
export const mainChartWrapper2 = "cc_chart2";
export const subChartWrapper1 = "subChartWrapper1";
export const subChartWrapper2 = "subChartWrapper2";
export const subChartWrapper3 = "subChartWrapper3";
export const dividerId1 = "dividerId1";
export const dividerId2 = "dividerId2";
export const containerId = "containerId";
export const containerId2 = "containerId2";

const getDataForSecondPane = (xValues: number[], closeValues: number[]) => {
    const macdArray: number[] = [];
    const signalArray: number[] = [];
    const divergenceArray: number[] = [];
    for (let i = 0; i < xValues.length; i++) {
        const maSlow = calcAverageForArray(closeValues, 12, i);
        const maFast = calcAverageForArray(closeValues, 25, i);
        const macd = maSlow - maFast;
        macdArray.push(macd);
        const signal = calcAverageForArray(macdArray, 9, i);
        signalArray.push(signal);
        const divergence = macd - signal;
        divergenceArray.push(divergence);
    }

    return { macdArray, signalArray, divergenceArray };
};

const getDataForThirdPane = (xValues: number[], closeValues: number[]) => {
    const RSI_PERIOD = 14;
    const rsiArray: number[] = [];
    const gainArray: number[] = [];
    const lossArray: number[] = [];
    rsiArray.push(NaN);
    gainArray.push(NaN);
    lossArray.push(NaN);
    for (let i = 1; i < xValues.length; i++) {
        const previousClose = closeValues[i - 1];
        const currentClose = closeValues[i];
        const gain = currentClose > previousClose ? currentClose - previousClose : 0;
        gainArray.push(gain);
        const loss = previousClose > currentClose ? previousClose - currentClose : 0;
        lossArray.push(loss);
        const relativeStrength =
            calcAverageForArray(gainArray, RSI_PERIOD) / calcAverageForArray(lossArray, RSI_PERIOD);
        const rsi = 100 - 100 / (1 + relativeStrength);
        rsiArray.push(rsi);
    }

    return { rsiArray };
};

export const drawExample = async () => {
    const verticalGroup = new SciChartVerticalGroup();
    const { dateValues: xValues, openValues, highValues, lowValues, closeValues, volumeValues } = multiPaneData;
    const { macdArray, signalArray, divergenceArray } = getDataForSecondPane(xValues, closeValues);
    const { rsiArray } = getDataForThirdPane(xValues, closeValues);

    const axisAlignment = EAxisAlignment.Right;

    const commonSubChartSurfaceOptions: I2DSubSurfaceOptions = {
        subChartPadding: Thickness.fromNumber(10),
        isTransparent: false,
        theme: appTheme.SciChartJsTheme,
    };

    const subChartModifiers = [
        { type: EChart2DModifierType.ZoomPan, options: { xyDirection: EXyDirection.XDirection } },
        { type: EChart2DModifierType.PinchZoom, options: { xyDirection: EXyDirection.XDirection } },
        { type: EChart2DModifierType.ZoomExtents, options: { xyDirection: EXyDirection.XDirection } },
        { type: EChart2DModifierType.MouseWheelZoom, options: { xyDirection: EXyDirection.XDirection } },
    ];

    const upCol = appTheme.VividGreen;
    const downCol = appTheme.MutedRed;
    const opacity = "AA";

    const { sciChartSurface: mainSurface, wasmContext } = await chartBuilder.build2DChart(mainChartWrapper2, {
        surface: {
            id: "mainSurface",
            theme: appTheme.SciChartJsTheme,
        },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                isVisible: false,
            },
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                isVisible: false,
            },
        },
        modifiers: {
            type: EChart2DModifierType.Custom,
            customType: FinChartLegendModifier.customType,
            options: {
                crosshairStroke: appTheme.ForegroundColor,
            } as IFinanceLegendModifierOptions,
        },
        subCharts: [
            {
                surface: {
                    ...commonSubChartSurfaceOptions,
                    position: new Rect(0, 0, 1, 0.5),
                    id: "subChart1",
                    subChartContainerId: subChartWrapper1,
                },
                xAxes: {
                    type: EAxisType.CategoryAxis,
                    options: {
                        drawLabels: false,
                        autoRange: EAutoRange.Once,
                        // maxAutoTicks: 20,
                        useNativeText: false,
                        minorsPerMajor: 3,
                    },
                },
                yAxes: [
                    {
                        type: EAxisType.NumericAxis,
                        options: {
                            maxAutoTicks: 10,
                            autoRange: EAutoRange.Always,
                            growBy: new NumberRange(0.3, 0.11),
                            labelPrecision: 2,
                            labelPrefix: "$",
                            axisAlignment,
                            drawMinorGridLines: false,
                        },
                    },
                    {
                        type: EAxisType.NumericAxis,
                        options: {
                            id: "yAxis2",
                            isVisible: false,
                            autoRange: EAutoRange.Always,
                            growBy: new NumberRange(0, 3),
                        },
                    },
                ],
                series: [
                    {
                        type: ESeriesType.CandlestickSeries,
                        ohlcData: {
                            dataSeriesName: "OHLC Close",
                            xValues,
                            openValues,
                            highValues,
                            lowValues,
                            closeValues,
                        },
                        options: {
                            brushUp: upCol + opacity,
                            brushDown: downCol + opacity,
                            strokeUp: upCol,
                            strokeDown: downCol,
                        },
                    },
                    {
                        type: ESeriesType.LineSeries,
                        xyData: {
                            xValues,
                            yValues: closeValues,
                            filter: {
                                type: EDataFilterType.XyMovingAverage,
                                options: {
                                    dataSeriesName: "MA 50 Low",
                                    length: 50,
                                },
                            },
                        },
                        options: {
                            stroke: appTheme.VividSkyBlue,
                            strokeThickness: 2,
                        },
                    },
                    {
                        type: ESeriesType.LineSeries,
                        xyData: {
                            xValues,
                            yValues: closeValues,
                            filter: {
                                type: EDataFilterType.XyMovingAverage,
                                options: {
                                    dataSeriesName: "MA 200 High",
                                    length: 200,
                                },
                            },
                        },
                        options: {
                            stroke: appTheme.VividPink,
                            strokeThickness: 2,
                        },
                    },
                    {
                        type: ESeriesType.ColumnSeries,
                        xyData: {
                            dataSeriesName: "Volume",
                            xValues,
                            yValues: volumeValues,
                        },
                        options: {
                            yAxisId: "yAxis2",
                            dataPointWidth: 0.5,
                            strokeThickness: 0,
                            paletteProvider: new VolumePaletteProvider(
                                openValues,
                                closeValues,
                                upCol + opacity,
                                downCol + opacity
                            ),
                        },
                    },
                ],

                modifiers: subChartModifiers,
                sharedData: {},
            },
            {
                surface: {
                    ...commonSubChartSurfaceOptions,
                    position: new Rect(0, 0.5, 1, 0.3),
                    subChartContainerId: subChartWrapper2,
                    id: "subChart2",
                },
                xAxes: [
                    {
                        type: EAxisType.CategoryAxis,
                        options: {
                            drawLabels: false,
                            drawMajorTickLines: false,
                            drawMinorTickLines: false,
                            useNativeText: false,
                            minorsPerMajor: 3,
                        },
                    },
                ],
                yAxes: [
                    {
                        type: EAxisType.NumericAxis,
                        options: {
                            maxAutoTicks: 6,
                            autoRange: EAutoRange.Always,
                            growBy: new NumberRange(0.1, 0.1),
                            axisAlignment,
                            labelPrecision: 2,
                            drawMinorGridLines: false,
                        },
                    },
                ],
                series: [
                    {
                        type: ESeriesType.BandSeries,
                        xyyData: {
                            dataSeriesName: "MACD",
                            xValues,
                            yValues: signalArray,
                            y1Values: macdArray,
                        },
                        options: {
                            stroke: downCol,
                            strokeY1: upCol,
                            fill: upCol + opacity,
                            fillY1: downCol + opacity,
                        },
                    },
                    {
                        type: ESeriesType.ColumnSeries,
                        xyData: {
                            dataSeriesName: "Divergence",
                            xValues,
                            yValues: divergenceArray,
                        },
                        options: {
                            dataPointWidth: 0.5,
                            paletteProvider: new MacdHistogramPaletteProvider(upCol + opacity, downCol + opacity),
                        },
                    },
                ],
                modifiers: subChartModifiers,
            },
            {
                surface: {
                    ...commonSubChartSurfaceOptions,
                    position: new Rect(0, 0.8, 1, 0.2),
                    subChartPadding: Thickness.fromNumber(10),
                    id: "subChart3",
                    isTransparent: false,
                    subChartContainerId: subChartWrapper3,
                },
                xAxes: {
                    type: EAxisType.CategoryAxis,
                    options: {
                        drawLabels: true,
                        drawMajorTickLines: true,
                        drawMinorTickLines: false,
                        useNativeText: false,
                        minorsPerMajor: 3,
                    },
                },
                yAxes: {
                    type: EAxisType.NumericAxis,
                    options: {
                        labelPrecision: 0,
                        maxAutoTicks: 6,
                        autoRange: EAutoRange.Always,
                        growBy: new NumberRange(0.1, 0.1),
                        axisAlignment,
                        drawMinorGridLines: false,
                    },
                },
                series: {
                    type: ESeriesType.LineSeries,
                    xyData: { dataSeriesName: "RSI", xValues, yValues: rsiArray },
                    options: {
                        stroke: appTheme.VividSkyBlue,
                        strokeThickness: 2,
                    },
                },
                modifiers: subChartModifiers,
            },
        ],
    });

    const [subSurface1, subSurface2, subSurface3] = mainSurface.subCharts;

    verticalGroup.addSurfaceToGroup(subSurface1);
    verticalGroup.addSurfaceToGroup(subSurface2);
    verticalGroup.addSurfaceToGroup(subSurface3);

    const chart1XAxis = subSurface1.xAxes.get(0);
    const chart2XAxis = subSurface2.xAxes.get(0);
    const chart3XAxis = subSurface3.xAxes.get(0);

    // Synchronize visible ranges
    chart1XAxis.visibleRangeChanged.subscribe((data1) => {
        chart2XAxis.visibleRange = data1.visibleRange;
        chart3XAxis.visibleRange = data1.visibleRange;
    });
    chart2XAxis.visibleRangeChanged.subscribe((data1) => {
        chart1XAxis.visibleRange = data1.visibleRange;
        chart3XAxis.visibleRange = data1.visibleRange;
    });
    chart3XAxis.visibleRangeChanged.subscribe((data1) => {
        chart1XAxis.visibleRange = data1.visibleRange;
        chart2XAxis.visibleRange = data1.visibleRange;
    });

    // Add some trades to the chart using the Annotations API
    for (let i = 0; i < subSurface1.renderableSeries.get(0).dataSeries.count(); i++) {
        // Every 1000th bar, add a buy annotation
        if (i % 1000 === 0) {
            subSurface1.annotations.add(buyMarkerAnnotation(i, lowValues[i]));
        }
        // Every 1000th bar between buys, add a sell annotation
        if ((i + 500) % 1000 === 0) {
            subSurface1.annotations.add(sellMarkerAnnotation(i, highValues[i]));
        }
    }

    // Resizing Logic
    const firstDividerElement = document.getElementById(dividerId1);
    const secondDividerElement = document.getElementById(dividerId2);
    let isDraggingFirst = false;
    let isDraggingSecond = false;
    let dragStartPosition: number;
    const container = document.getElementById(containerId2);

    const baseHeight = container.offsetHeight;
    const minPaneSize = 0.2;

    const resizePanesFirst = (mouseYOffset: number) => {
        let newPosition = mouseYOffset / baseHeight;

        if (newPosition < minPaneSize) {
            newPosition = minPaneSize;
        }

        if (newPosition > subSurface3.subPosition.y - minPaneSize) {
            newPosition = subSurface3.subPosition.y - minPaneSize;
        }
        firstDividerElement.style.top = `${newPosition * 100}%`;
        subSurface1.subPosition = new Rect(0, 0, 1, newPosition);
        subSurface2.subPosition = new Rect(0, newPosition, 1, subSurface3.subPosition.y - newPosition);
    };

    const resizePanesSecond = (mouseYOffset: number) => {
        let newPosition = mouseYOffset / baseHeight;

        if (newPosition > 1 - minPaneSize) {
            newPosition = 1 - minPaneSize;
        }

        if (newPosition < subSurface1.subPosition.height + minPaneSize) {
            newPosition = subSurface1.subPosition.height + minPaneSize;
        }
        secondDividerElement.style.top = `${newPosition * 100}%`;
        subSurface2.subPosition = new Rect(
            0,
            subSurface1.subPosition.height,
            1,
            newPosition - subSurface1.subPosition.height
        );
        subSurface3.subPosition = new Rect(0, newPosition, 1, 1 - newPosition);
    };

    const mouseDownHandlerFirst = (event: MouseEvent) => {
        isDraggingFirst = true;
        dragStartPosition = event.clientY;
    };

    const mouseDownHandlerSecond = (event: MouseEvent) => {
        isDraggingSecond = true;
        dragStartPosition = event.clientY;
    };

    const mouseUpHandler = () => {
        if (!isDraggingFirst && !isDraggingSecond) {
            return;
        }

        isDraggingFirst = false;
        isDraggingSecond = false;
    };

    const mouseMoveHandler = (event: MouseEvent) => {
        if (!isDraggingFirst && !isDraggingSecond) {
            return;
        }

        const rect = container.getBoundingClientRect();
        const mouseYOffset = event.clientY - rect.top;

        if (isDraggingFirst) {
            resizePanesFirst(mouseYOffset);
        } else {
            resizePanesSecond(mouseYOffset);
        }
    };

    const paneMouseDownHandler = (event: MouseEvent) => {
        event.preventDefault();
    };

    firstDividerElement.addEventListener("mousedown", mouseDownHandlerFirst);
    secondDividerElement.addEventListener("mousedown", mouseDownHandlerSecond);
    container.addEventListener("mousedown", paneMouseDownHandler);
    container.addEventListener("mouseup", mouseUpHandler);
    container.addEventListener("mousemove", mouseMoveHandler);
    container.addEventListener("mouseleave", mouseUpHandler);

    firstDividerElement.style.top = `${subSurface1.subPosition.height * 100}%`;
    secondDividerElement.style.top = `${subSurface3.subPosition.y * 100}%`;

    return { sciChartSurface: mainSurface, wasmContext };
};

/**
 * An example PaletteProvider applied to the volume column series. It will return green / red
 * fills and strokes when the main price data bar is up or down
 */
// tslint:disable-next-line: max-classes-per-file
class VolumePaletteProvider extends BasePaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private openValues: number[];
    private closeValues: number[];
    private volumeUpArgb: number;
    private volumnDownArgb: number;

    constructor(openValues: number[], closeValues: number[], volumeUpColor: string, volumeDownColor: string) {
        super();
        this.openValues = openValues;
        this.closeValues = closeValues;
        this.volumeUpArgb = parseColorToUIntArgb(volumeUpColor);
        this.volumnDownArgb = parseColorToUIntArgb(volumeDownColor);
    }

    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        const open = this.openValues[index];
        const close = this.closeValues[index];

        return close >= open ? this.volumeUpArgb : this.volumnDownArgb;
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return this.overrideFillArgb(xValue, yValue, index);
    }
}

// tslint:disable-next-line: max-classes-per-file
class MacdHistogramPaletteProvider extends BasePaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;
    private aboveZeroArgb: number;
    private belowZeroArgb: number;

    constructor(aboveZeroColor: string, belowZeroColor: string) {
        super();

        this.aboveZeroArgb = parseColorToUIntArgb(aboveZeroColor);
        this.belowZeroArgb = parseColorToUIntArgb(belowZeroColor);
    }

    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return yValue >= 0 ? this.aboveZeroArgb : this.belowZeroArgb;
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return this.overrideFillArgb(xValue, yValue, index);
    }
}

// Returns a CustomAnnotation that represents a buy marker arrow
// The CustomAnnotation supports SVG as content. Using Inkscape or similar you can create SVG content for annotations
const buyMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString:
            '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">' +
            '<g transform="translate(-53.867218,-75.091687)">' +
            '<path style="fill:#1cb61c;fill-opacity:0.34117647;stroke:#00b400;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"' +
            'd="m 55.47431,83.481251 c 7.158904,-7.408333 7.158904,-7.408333 7.158904,-7.408333 l 7.158906,7.408333 H 66.212668 V 94.593756 H 59.053761 V 83.481251 Z"' +
            "/>" +
            "</g>" +
            "</svg>",
    });
};

// Returns a CustomAnnotation that represents a sell marker arrow
// The CustomAnnotation supports SVG as content. Using Inkscape or similar you can create SVG content for annotations
const sellMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString:
            '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">' +
            '<g transform="translate(-54.616083,-75.548914)">' +
            '<path style="fill:#b22020;fill-opacity:0.34117648;stroke:#990000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"' +
            'd="m 55.47431,87.025547 c 7.158904,7.408333 7.158904,7.408333 7.158904,7.408333 L 69.79212,87.025547 H 66.212668 V 75.913042 h -7.158907 v 11.112505 z"' +
            "/>" +
            "</g>" +
            "</svg>",
    });
};

export default function SubChartStockCharts() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
            });
        };
    }, []);

    return (
        <div
            className={classes.ChartsWrapper}
            id={containerId2}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                touchAction: "none",
            }}
        >
            <div
                id={subChartWrapper1}
                style={{
                    position: "absolute", // important
                }}
            />
            <div
                id={dividerId1}
                style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "#2B2D70",
                    cursor: "row-resize",
                    position: "absolute",
                    zIndex: 1,
                }}
            >
                <div style={{ height: "4px", width: "100%", borderBottom: "2px dashed" }}></div>
            </div>
            <div
                id={subChartWrapper2}
                style={{
                    position: "absolute", // important
                }}
            />
            <div
                id={dividerId2}
                style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "#2B2D70",
                    cursor: "row-resize",
                    position: "absolute",
                    zIndex: 1,
                }}
            >
                <div style={{ height: "4px", width: "100%", borderBottom: "2px dashed" }}></div>
            </div>
            <div
                id={subChartWrapper3}
                style={{
                    position: "absolute", // important
                }}
            />
            <div
                id={mainChartWrapper2}
                style={{
                    minWidth: "100%",
                    maxWidth: "100%",
                    width: "100%",
                    minHeight: "100%",
                    maxHeight: "100%",
                    height: "100%",
                }}
            ></div>
        </div>
    );
}
