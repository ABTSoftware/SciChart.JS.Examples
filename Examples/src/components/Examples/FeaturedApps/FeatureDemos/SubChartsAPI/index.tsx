import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";

import { INumericAxisOptions, NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { SciChartSubSurface, SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import classes from "../../../Examples.module.scss";
import { appTheme } from "../../../theme";
import { makeStyles } from "@material-ui/core/styles";
import { RightAlignedOuterVerticallyStackedAxisLayoutStrategy } from "scichart/Charting/LayoutManager/RightAlignedOuterVerticallyStackedAxisLayoutStrategy";
import { EDataSeriesType } from "scichart/Charting/Model/IDataSeries";
import { StackedColumnCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedColumnCollection";
import { StackedColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries";
import { StackedMountainCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainCollection";
import { StackedMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries";
import { ESeriesType } from "scichart/types/SeriesType";
import { TSciChart } from "scichart/types/TSciChart";
import { Rect } from "scichart/Core/Rect";
import { I2DSubSurfaceOptions } from "scichart/Charting/Visuals/I2DSurfaceOptions";
import { NativeTextAnnotation } from "scichart/Charting/Visuals/Annotations/NativeTextAnnotation";
import { EMultiLineAlignment } from "scichart/types/TextPosition";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { EHorizontalAnchorPoint } from "scichart/types/AnchorPoint";
import { EAnnotationLayer } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import { FormControl, InputLabel, Select, MenuItem, Typography, Slider, ButtonGroup, Button } from "@material-ui/core";
import {
    GetRandomData,
    appendData,
    createRenderableSeries,
    getDataSeriesTypeForRenderableSeries,
    getSubChartPositionIndexes,
    prePopulateData
} from "./helpers";
import { BaseDataSeries } from "scichart/Charting/Model/BaseDataSeries";
import { ENumericFormat } from "scichart/types/NumericFormat";

type TMessage = {
    title: string;
    detail: string;
};

type TDataSeriesEntry = {
    dataSeriesType: EDataSeriesType;
    dataSeriesArray: BaseDataSeries[];
};

export const divElementId = "chart";

const axisOptions: INumericAxisOptions = {
    isVisible: false,
    drawMajorBands: false,
    drawMinorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    autoRange: EAutoRange.Always
};

// theme overrides
const theme = appTheme.SciChartJsTheme;
theme.strokePalette = ["#274b92", "#47bde6", "#ae418d", "#e97064", "#68bcae", "#634e96"];
theme.fillPalette = ["#274b9288", "#47bde688", "#ae418d88", "#e9706488", "#68bcae88", "#634e9688"];
theme.axisBandsFill = "#f2f3f4";
theme.majorGridLineBrush = "#d6dee8";

export const drawGridExample = async (updateMessages: (newMessages: TMessage[]) => void) => {
    const subChartsNumber = 64;
    const columnsNumber = 8;
    const rowsNumber = 8;

    let currentPointsCounter = 0;

    const dataSettings = {
        seriesCount: 3,
        pointsOnChart: 2000,
        pointsPerUpdate: 400,
        sendEvery: 0,
        initialPoints: 20
    };

    const originalGetStrokeColor = theme.getStrokeColor;
    let counter = 0;
    theme.getStrokeColor = (index: number, max: number, wasmContext: TSciChart) => {
        const currentIndex = counter % subChartsNumber;
        counter += 3;
        return originalGetStrokeColor.call(theme, currentIndex, subChartsNumber, wasmContext);
    };

    const originalGetFillColor = theme.getFillColor;
    theme.getFillColor = (index: number, max: number, wasmContext: TSciChart) => {
        const currentIndex = counter % subChartsNumber;
        counter += 3;
        return originalGetFillColor.call(theme, currentIndex, subChartsNumber, wasmContext);
    };
    ///

    const { wasmContext, sciChartSurface: mainSurface } = await SciChartSurface.create(divElementId, {
        theme
    });

    const mainXAxis = new NumericAxis(wasmContext, {
        ...axisOptions,
        // isVisible: true,
        // drawLabels: false,
        // drawMajorBands: false,
        // drawMajorGridLines: true,
        // drawMajorTickLines: false,
        // drawMinorGridLines: true,
        id: "mainXAxis",
        majorGridLineStyle: {
            color: "#d6dee8",
            strokeThickness: 1,
            strokeDashArray: [1, 20]
        },
        minorGridLineStyle: {
            color: "#d6dee8",
            strokeThickness: 1,
            strokeDashArray: [1, 20]
        }
    });

    mainSurface.xAxes.add(mainXAxis);
    const mainYAxis = new NumericAxis(wasmContext, {
        ...axisOptions,
        id: "mainYAxis"
    });
    mainSurface.yAxes.add(mainYAxis);

    const seriesNamesMap: { [key in ESeriesType]?: string } = {
        [ESeriesType.LineSeries]: "Line",
        [ESeriesType.StackedColumnSeries]: "Stacked Column",
        [ESeriesType.ColumnSeries]: "Column",
        [ESeriesType.StackedMountainSeries]: "Mountain",
        [ESeriesType.BandSeries]: "Band",
        [ESeriesType.CandlestickSeries]: "Candle"
    };

    const seriesTypes = [
        ESeriesType.LineSeries,
        // ESeriesType.BubbleSeries,
        ESeriesType.StackedColumnSeries,
        ESeriesType.ColumnSeries,
        ESeriesType.StackedMountainSeries,
        ESeriesType.BandSeries,
        // ESeriesType.ScatterSeries,
        ESeriesType.CandlestickSeries
        // ESeriesType.TextSeries
    ];

    const subChartPositioningCoordinateMode = ECoordinateMode.Relative;

    const subChartsMap: Map<SciChartSubSurface, TDataSeriesEntry> = new Map();

    const xValues = Array.from(new Array(dataSettings.initialPoints).keys());

    const initSubChart = (seriesType: ESeriesType, subChartIndex: number) => {
        // calculate sub-chart position and sizes
        const { rowIndex, columnIndex } = getSubChartPositionIndexes(subChartIndex, columnsNumber);
        const width = 1 / columnsNumber;
        const height = 1 / rowsNumber;

        const position = new Rect(columnIndex * width, rowIndex * height, width, height);

        // sub-surface configuration
        const subChartOptions: I2DSubSurfaceOptions = {
            id: `subChart-${subChartIndex}`,
            theme,
            position,
            parentXAxisId: mainXAxis.id,
            parentYAxisId: mainYAxis.id,
            coordinateMode: subChartPositioningCoordinateMode,
            subChartPadding: Thickness.fromNumber(3),
            viewportBorder: {
                color: "rgba(150, 74, 148, 0.51)",
                border: 2
            }
        };

        // create sub-surface
        const subChartSurface = mainSurface.addSubChart(subChartOptions);

        // add axes to the sub-surface
        const subChartXAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-XAxis`,
            growBy: new NumberRange(0.0, 0.0)
        });

        subChartSurface.xAxes.add(subChartXAxis);

        const subChartYAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-YAxis`,
            growBy: new NumberRange(0.01, 0.1)
        });
        subChartSurface.yAxes.add(subChartYAxis);

        // add series to sub-surface
        const dataSeriesArray: BaseDataSeries[] = new Array(dataSettings.seriesCount);
        const dataSeriesType = getDataSeriesTypeForRenderableSeries(seriesType);

        let stackedCollection: IRenderableSeries;
        const positive = [ESeriesType.StackedColumnSeries, ESeriesType.StackedMountainSeries].includes(seriesType);

        for (let i = 0; i < dataSettings.seriesCount; i++) {
            const { dataSeries, rendSeries } = createRenderableSeries(
                wasmContext,
                seriesType,
                subChartXAxis.id,
                subChartYAxis.id
            );

            dataSeriesArray[i] = dataSeries;

            // add series to the sub-chart and apply additional configurations per series type
            if (seriesType === ESeriesType.StackedColumnSeries) {
                if (i === 0) {
                    stackedCollection = new StackedColumnCollection(wasmContext, {
                        dataPointWidth: 1,
                        xAxisId: subChartXAxis.id,
                        yAxisId: subChartYAxis.id
                    });
                    subChartSurface.renderableSeries.add(stackedCollection);
                }
                (rendSeries as StackedColumnRenderableSeries).stackedGroupId = i.toString();
                (stackedCollection as StackedColumnCollection).add(rendSeries as StackedColumnRenderableSeries);
            } else if (seriesType === ESeriesType.StackedMountainSeries) {
                if (i === 0) {
                    stackedCollection = new StackedMountainCollection(wasmContext, {
                        xAxisId: subChartXAxis.id,
                        yAxisId: subChartYAxis.id
                    });
                    subChartSurface.renderableSeries.add(stackedCollection);
                }
                (stackedCollection as StackedMountainCollection).add(rendSeries as StackedMountainRenderableSeries);
            } else if (seriesType === ESeriesType.ColumnSeries) {
                // create Stacked Y Axis
                if (i === 0) {
                    subChartSurface.layoutManager.rightOuterAxesLayoutStrategy = new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
                    rendSeries.yAxisId = subChartYAxis.id;
                } else {
                    const additionalYAxis = new NumericAxis(wasmContext, {
                        ...axisOptions,
                        id: `${subChartSurface.id}-YAxis${i}`
                    });
                    subChartSurface.yAxes.add(additionalYAxis);
                    rendSeries.yAxisId = additionalYAxis.id;
                }

                subChartSurface.renderableSeries.add(rendSeries);
            } else {
                subChartSurface.renderableSeries.add(rendSeries);
            }

            // Generate points
            prePopulateData(dataSeries, dataSeriesType, xValues, positive);
            currentPointsCounter = dataSeries.count();

            subChartSurface.zoomExtents(0);
        }

        // add title to the sub-chart
        const titleAnnotation = new NativeTextAnnotation({
            xAxisId: subChartXAxis.id,
            yAxisId: subChartYAxis.id,
            multiLineAlignment: EMultiLineAlignment.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Pixel,
            x1: 0.5,
            fontSize: 12,
            y1: 10,
            text: seriesNamesMap[seriesType],
            annotationLayer: EAnnotationLayer.AboveChart,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center
        });

        subChartSurface.annotations.add(titleAnnotation);

        subChartsMap.set(subChartSurface, { dataSeriesType, dataSeriesArray });

        return positive;
    };

    // generate the subcharts grid
    for (let subChartIndex = 0; subChartIndex < subChartsNumber; ++subChartIndex) {
        const seriesType = seriesTypes[subChartIndex % seriesTypes.length];
        initSubChart(seriesType, subChartIndex);
    }

    // setup for realtime updates
    let isRunning: boolean = false;
    let newMessages: TMessage[] = [];
    let loadStart = 0;
    let loadCount: number = 0;
    let loadTimes: number[];
    let avgLoadTime: number = 0;
    let avgRenderTime: number = 0;

    const loadData = (data: { x: number[]; ys: number[][]; sendTime: number }) => {
        loadStart = new Date().getTime();
        const loadTime = loadStart - data.sendTime;
        loadTimes.push(loadTime);
        if (loadCount < 20) {
            avgLoadTime = (avgLoadTime * loadCount + loadTime) / (loadCount + 1);
            loadCount++;
        } else {
            const firstTime = loadTimes.shift();
            avgLoadTime = (avgLoadTime * loadCount + loadTime - firstTime) / loadCount;
        }

        const dataSeriesEntries = Array.from(subChartsMap.values());
        dataSeriesEntries.forEach((entry: TDataSeriesEntry, subChartIndex: number) => {
            const { dataSeriesArray, dataSeriesType } = entry;
            for (let i = 0; i < dataSettings.seriesCount; i++) {
                appendData(
                    dataSeriesArray[i],
                    dataSeriesType,
                    subChartIndex + i,
                    data.x,
                    data.ys,
                    dataSettings.pointsOnChart,
                    dataSettings.pointsPerUpdate
                );
            }
        });
    };

    const loadFromBuffer = () => {
        if (!isRunning) {
            return;
        }

        const sendTime = new Date().getTime();
        // create subsequent xValues
        const x = Array.from(Array(dataSettings.pointsPerUpdate).keys()).map(value => value + currentPointsCounter);

        const ys: number[][] = [];
        const yArraysMaxCount = subChartsNumber * dataSettings.seriesCount * 3;
        for (let i = 0; i < yArraysMaxCount; ++i) {
            // TODO replace hardcoded "positive" value
            // replace randomizer function
            ys.push(GetRandomData(x, false));
        }

        loadData({ x, ys, sendTime });
        currentPointsCounter += dataSettings.pointsPerUpdate;

        setTimeout(loadFromBuffer, dataSettings.sendEvery);
    };

    // render time info calculation
    mainSurface.rendered.subscribe(() => {
        if (!isRunning || loadStart === 0) return;
        const reDrawTime = new Date().getTime() - loadStart;
        avgRenderTime = (avgRenderTime * loadCount + reDrawTime) / (loadCount + 1);
        newMessages.push({
            title: `Average Render Time `,
            detail: `${avgRenderTime.toFixed(2)} ms`
        });
        newMessages.push({
            title: `Max FPS `,
            detail: `${Math.min(60, 1000 / avgRenderTime).toFixed(1)}`
        });
        updateMessages(newMessages);
        newMessages.length = 0;
    });

    // Buttons for chart
    const startStreaming = () => {
        console.log("start streaming");
        loadCount = 0;
        avgLoadTime = 0;
        avgRenderTime = 0;
        loadTimes = [];
        loadStart = 0;
        isRunning = true;
        loadFromBuffer();
    };

    const stopStreaming = () => {
        console.log("stop streaming");
        // socket?.disconnect();
        isRunning = false;
        if (mainSurface.chartModifiers.size() === 0) {
            mainSurface.chartModifiers.add(
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );
        }
    };

    return {
        wasmContext,
        subChartSurface: mainSurface,
        controls: {
            startStreaming,
            stopStreaming
        }
    };
};

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        justifyContent: "space-between",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1
    },
    infoBlock: {
        display: "flex",
        flex: "auto",
        marginLeft: 10,
        marginTop: 6
    },
    infoItem: {
        flex: "auto"
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function SubchartsGrid() {
    const [subChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [isDirty, setIsDirty] = React.useState<boolean>(false);

    const [messages, setMessages] = React.useState<TMessage[]>([]);
    const [controls, setControls] = React.useState({
        startStreaming: () => {},
        stopStreaming: () => {}
    });

    React.useEffect(() => {
        (async () => {
            const res = await drawGridExample((newMessages: TMessage[]) => {
                setMessages([...newMessages]);
            });

            setSciChartSurface(res.subChartSurface);

            setControls(res.controls);

            return () => {
                controls.stopStreaming();
                res.subChartSurface?.delete();
            };
        })();
        // Delete subChartSurface on unmount component to prevent memory leak
        return () => subChartSurface?.delete();
    }, []);

    const localClasses = useStyles();

    const handleStartStreaming = () => {
        setIsDirty(false);
        controls.startStreaming();
    };
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <FormControl className={classes.formControl}>
                        <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                            <Button id="startStreaming" onClick={handleStartStreaming}>
                                {isDirty ? "ReStart" : "Start"}
                            </Button>
                            <Button id="stopStreaming" onClick={controls.stopStreaming}>
                                Stop
                            </Button>
                        </ButtonGroup>
                    </FormControl>
                    <div className={localClasses.infoBlock}>
                        {messages.map((msg, index) => (
                            <div key={index} className={localClasses.infoItem}>
                                {msg.title}: {msg.detail}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={localClasses.chartArea} id={divElementId}></div>
            </div>
        </div>
    );
}
