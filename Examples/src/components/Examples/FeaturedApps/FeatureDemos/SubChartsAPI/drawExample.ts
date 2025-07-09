import {
    appendData,
    createRenderableSeries,
    generateData,
    getDataSeriesTypeForRenderableSeries,
    getSubChartPositionIndexes,
    prePopulateData,
} from "./helpers";

import {
    BaseDataSeries,
    EAnnotationLayer,
    ECoordinateMode,
    EDataSeriesType,
    EAutoRange,
    ENumericFormat,
    EHorizontalAnchorPoint,
    EMultiLineAlignment,
    ESeriesType,
    IRenderableSeries,
    INumericAxisOptions,
    I2DSubSurfaceOptions,
    MouseWheelZoomModifier,
    NativeTextAnnotation,
    NumericAxis,
    NumberRange,
    Rect,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
    SciChartSubSurface,
    SciChartSurface,
    StackedColumnCollection,
    StackedColumnRenderableSeries,
    StackedMountainCollection,
    StackedMountainRenderableSeries,
    Thickness,
    TSciChart,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";

export type TMessage = {
    title: string;
    detail: string;
};

const axisOptions: INumericAxisOptions = {
    useNativeText: true,
    isVisible: false,
    drawMajorBands: false,
    drawMinorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,
    drawMajorGridLines: false,
    labelStyle: { fontSize: 8 },
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    autoRange: EAutoRange.Always,
};

// theme overrides
const sciChartTheme = appTheme.SciChartJsTheme;

export const drawGridExample = async (
    rootElement: string | HTMLDivElement,
    updateMessages: (newMessages: TMessage[]) => void
) => {
    const subChartsNumber = 64;
    const columnsNumber = 8;
    const rowsNumber = 8;

    const dataSettings = {
        seriesCount: 3,
        pointsOnChart: 5000,
        sendEvery: 30,
        initialPoints: 20,
    };

    const originalGetStrokeColor = sciChartTheme.getStrokeColor;
    let counter = 0;
    sciChartTheme.getStrokeColor = (index: number, max: number, context: TSciChart) => {
        const currentIndex = counter % subChartsNumber;
        counter += 3;
        return originalGetStrokeColor.call(sciChartTheme, currentIndex, subChartsNumber, context);
    };

    const originalGetFillColor = sciChartTheme.getFillColor;
    sciChartTheme.getFillColor = (index: number, max: number, context: TSciChart) => {
        const currentIndex = counter % subChartsNumber;
        counter += 3;
        return originalGetFillColor.call(sciChartTheme, currentIndex, subChartsNumber, context);
    };
    ///

    const { wasmContext, sciChartSurface: mainSurface } = await SciChartSurface.createSingle(rootElement, {
        theme: sciChartTheme,
    });

    const mainXAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        id: "mainXAxis",
    });

    mainSurface.xAxes.add(mainXAxis);
    const mainYAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        id: "mainYAxis",
    });
    mainSurface.yAxes.add(mainYAxis);

    const seriesTypes = [
        ESeriesType.LineSeries,
        // ESeriesType.BubbleSeries,
        //ESeriesType.StackedColumnSeries,
        ESeriesType.ColumnSeries,
        //ESeriesType.StackedMountainSeries,
        ESeriesType.BandSeries,
        ESeriesType.ScatterSeries,
        ESeriesType.CandlestickSeries,
        // ESeriesType.TextSeries
    ];

    const subChartPositioningCoordinateMode = ECoordinateMode.Relative;

    const subChartsMap: Map<
        SciChartSubSurface,
        { seriesType: ESeriesType; dataSeriesType: EDataSeriesType; dataSeriesArray: BaseDataSeries[] }
    > = new Map();

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
            theme: sciChartTheme,
            position,
            parentXAxisId: mainXAxis.id,
            parentYAxisId: mainYAxis.id,
            coordinateMode: subChartPositioningCoordinateMode,
            subChartPadding: Thickness.fromNumber(1),
            viewportBorder: {
                color: "rgba(150, 74, 148, 0.51)",
                border: 2,
            },
        };

        // create sub-surface
        const subChartSurface = mainSurface.addSubChart(subChartOptions);

        // add axes to the sub-surface
        const subChartXAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-XAxis`,
            growBy: new NumberRange(0.0, 0.0),
            useNativeText: true,
        });

        subChartSurface.xAxes.add(subChartXAxis);

        const subChartYAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-YAxis`,
            growBy: new NumberRange(0.01, 0.1),
            useNativeText: true,
            autoRange: EAutoRange.Always,
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

            subChartXAxis.visibleRange = new NumberRange(0, dataSeries.count());

            dataSeriesArray[i] = dataSeries;

            // add series to the sub-chart and apply additional configurations per series type
            if (seriesType === ESeriesType.StackedColumnSeries) {
                if (i === 0) {
                    stackedCollection = new StackedColumnCollection(wasmContext, {
                        dataPointWidth: 1,
                        xAxisId: subChartXAxis.id,
                        yAxisId: subChartYAxis.id,
                    });
                    subChartSurface.renderableSeries.add(stackedCollection);
                }
                (rendSeries as StackedColumnRenderableSeries).stackedGroupId = i.toString();
                (stackedCollection as StackedColumnCollection).add(rendSeries as StackedColumnRenderableSeries);
            } else if (seriesType === ESeriesType.StackedMountainSeries) {
                if (i === 0) {
                    stackedCollection = new StackedMountainCollection(wasmContext, {
                        xAxisId: subChartXAxis.id,
                        yAxisId: subChartYAxis.id,
                    });
                    subChartSurface.renderableSeries.add(stackedCollection);
                }
                (stackedCollection as StackedMountainCollection).add(rendSeries as StackedMountainRenderableSeries);
            } else if (seriesType === ESeriesType.ColumnSeries) {
                // create Stacked Y Axis
                if (i === 0) {
                    subChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
                        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
                    rendSeries.yAxisId = subChartYAxis.id;
                } else {
                    const additionalYAxis = new NumericAxis(wasmContext, {
                        ...axisOptions,
                        id: `${subChartSurface.id}-YAxis${i}`,
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

            subChartSurface.zoomExtents(0);
        }

        subChartsMap.set(subChartSurface, { seriesType, dataSeriesType, dataSeriesArray });

        return positive;
    };

    // generate the subcharts grid
    for (let subChartIndex = 0; subChartIndex < subChartsNumber; ++subChartIndex) {
        const seriesType = seriesTypes[subChartIndex % seriesTypes.length];
        initSubChart(seriesType, subChartIndex);
    }

    // setup for realtime updates
    let isRunning: boolean = false;
    const newMessages: TMessage[] = [];
    let loadStart = 0;
    let loadCount: number = 0;
    let avgRenderTime: number = 0;

    let dataGenerationStart: DOMHighResTimeStamp;
    let dataGenerationEnd: DOMHighResTimeStamp;
    let dataAppendStart: DOMHighResTimeStamp;
    let dataAppendEnd: DOMHighResTimeStamp;
    let renderStart: DOMHighResTimeStamp;
    let renderEnd: DOMHighResTimeStamp;
    let lastRenderEnd: DOMHighResTimeStamp;

    let lastPaintEnd: DOMHighResTimeStamp;
    let paintEnd: DOMHighResTimeStamp;

    const dataStore = new Map(
        mainSurface.subCharts.map((subChart) => [
            subChart,
            Array.from(Array(dataSettings.seriesCount)).map((_) => null),
        ])
    );

    const updateCharts = () => {
        if (!isRunning) {
            return;
        }

        loadStart = new Date().getTime();
        dataGenerationStart = performance.now();
        subChartsMap.forEach(({ seriesType, dataSeriesArray, dataSeriesType }, subSurface) => {
            const pointsToUpdate = Math.round(Math.max(1, dataSeriesArray[0].count() / 50));
            for (let i = 0; i < dataSettings.seriesCount; i++) {
                dataStore.get(subSurface)[i] = generateData(
                    seriesType,
                    dataSeriesArray[i],
                    dataSeriesType,
                    i,
                    dataSettings.pointsOnChart,
                    pointsToUpdate
                );
            }
        });

        dataAppendStart = performance.now();
        subChartsMap.forEach(({ seriesType, dataSeriesArray, dataSeriesType }, subSurface) => {
            const pointsToUpdate = Math.round(Math.max(1, dataSeriesArray[0].count() / 50));
            for (let i = 0; i < dataSettings.seriesCount; i++) {
                const data = dataStore.get(subSurface)[i];
                appendData(
                    seriesType,
                    dataSeriesArray[i],
                    dataSeriesType,
                    i,
                    dataSettings.pointsOnChart,
                    pointsToUpdate,
                    data
                );
            }
        });
        dataAppendEnd = performance.now();

        setTimeout(updateCharts, dataSettings.sendEvery);
    };
    mainSurface.preRenderAll.subscribe(() => {
        renderStart = performance.now();
    });
    // mainSurface.painted.subscribe(() => {
    //     lastPaintEnd = paintEnd;
    //     paintEnd = performance.now();
    // });

    // render time info calculation
    mainSurface.renderedToDestination.subscribe(() => {
        if (!isRunning || loadStart === 0) return;
        lastRenderEnd = renderEnd;
        renderEnd = performance.now();
        const reDrawTime = new Date().getTime() - loadStart;
        avgRenderTime = renderEnd - renderStart;
        const charts = Array.from(subChartsMap.values());
        const totalPoints = charts[0].dataSeriesArray[0].count() * dataSettings.seriesCount * charts.length;
        newMessages.push({
            title: `Points`,
            detail: `${totalPoints}`,
        });
        newMessages.push({
            title: `Generate`,
            detail: `${(dataAppendStart - dataGenerationStart).toFixed(1)}ms`,
        });
        newMessages.push({
            title: `Append`,
            detail: `${(dataAppendEnd - dataAppendStart).toFixed(1)}ms`,
        });
        newMessages.push({
            title: `Render`,
            detail: `${avgRenderTime.toFixed(2)}ms`,
        });
        newMessages.push({
            title: `FPS`,
            detail: `${(1000 / (renderEnd - lastRenderEnd)).toFixed(1)}`,
        });

        updateMessages(newMessages);
        newMessages.length = 0;
    });

    // Buttons for chart
    const startUpdate = () => {
        console.log("start streaming");
        loadCount = 0;
        avgRenderTime = 0;
        loadStart = 0;
        isRunning = true;
        updateCharts();
    };

    const stopUpdate = () => {
        console.log("stop streaming");
        isRunning = false;
    };

    const setLabels = (show: boolean) => {
        subChartsMap.forEach((v, k) => {
            k.xAxes.get(0).isVisible = show;
            k.yAxes.asArray().forEach((y) => (y.isVisible = show));
        });
    };

    return {
        wasmContext,
        sciChartSurface: mainSurface,
        controls: {
            startUpdate,
            stopUpdate,
            setLabels,
        },
    };
};
