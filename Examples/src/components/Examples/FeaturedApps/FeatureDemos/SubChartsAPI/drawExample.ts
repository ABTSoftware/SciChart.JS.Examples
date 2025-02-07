import {
    appendData,
    createRenderableSeries,
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

    const seriesNamesMap: { [key in ESeriesType]?: string } = {
        [ESeriesType.LineSeries]: "Line",
        [ESeriesType.StackedColumnSeries]: "Stacked Column",
        [ESeriesType.ColumnSeries]: "Column",
        [ESeriesType.StackedMountainSeries]: "Mountain",
        [ESeriesType.BandSeries]: "Band",
        [ESeriesType.CandlestickSeries]: "Candle",
    };

    const seriesTypes = [
        ESeriesType.LineSeries,
        // ESeriesType.BubbleSeries,
        ESeriesType.StackedColumnSeries,
        ESeriesType.ColumnSeries,
        ESeriesType.StackedMountainSeries,
        ESeriesType.BandSeries,
        // ESeriesType.ScatterSeries,
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
            // title: seriesNamesMap[seriesType],
            titleStyle: {
                placeWithinChart: true,
                fontSize: 12,
                padding: Thickness.fromString("10 4 0 4"),
                color: appTheme.ForegroundColor,
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

    const updateCharts = () => {
        if (!isRunning) {
            return;
        }
        loadStart = new Date().getTime();
        subChartsMap.forEach(({ seriesType, dataSeriesArray, dataSeriesType }) => {
            for (let i = 0; i < dataSettings.seriesCount; i++) {
                const pointsToUpdate = Math.round(Math.max(1, dataSeriesArray[i].count() / 50));
                appendData(
                    seriesType,
                    dataSeriesArray[i],
                    dataSeriesType,
                    i,
                    dataSettings.pointsOnChart,
                    pointsToUpdate
                );
            }
        });

        setTimeout(updateCharts, dataSettings.sendEvery);
    };

    // render time info calculation
    mainSurface.rendered.subscribe(() => {
        if (!isRunning || loadStart === 0) return;
        const reDrawTime = new Date().getTime() - loadStart;
        avgRenderTime = (avgRenderTime * loadCount + reDrawTime) / (loadCount + 1);
        const charts = Array.from(subChartsMap.values());
        const totalPoints = charts[0].dataSeriesArray[0].count() * 3 * charts.length;
        newMessages.push({
            title: `Total Points `,
            detail: `${totalPoints}`,
        });
        newMessages.push({
            title: `Average Render Time `,
            detail: `${avgRenderTime.toFixed(2)} ms`,
        });
        newMessages.push({
            title: `Max FPS `,
            detail: `${Math.min(60, 1000 / avgRenderTime).toFixed(1)}`,
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
        if (mainSurface.chartModifiers.size() === 0) {
            mainSurface.chartModifiers.add(
                new MouseWheelZoomModifier(),
                new ZoomPanModifier({ enableZoom: true }),
                new ZoomExtentsModifier()
            );
        }
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
