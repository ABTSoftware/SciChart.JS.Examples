import {
    buildSeries,
    ECoordinateMode,
    NumberRange,
    receiveNextEvent,
    Rect,
    SciChartSubSurface,
    SciChartSurface,
    Thickness,
    translateToNotScaledRect,
    TSciChartPerformanceData
} from "scichart";
import { PerformanceStatsModifier } from "scichart-addons/PerformanceStatsModifier";
import { SciChartVerticalGroup } from "scichart";
import { ESubSurfacePositionCoordinateMode } from "scichart";
import { addMainSurfaceAxes, addSubSurfaceAxes, addVisibleAxes } from "../../axes/axesConfig";
import { AxisSynchronizer } from "../../modifiers/AxisSynchronizer";
import { addModifiers } from "../../modifiers/modifiersConfig";
import { ProfilerSeriesConfigurator } from "../../series/seriesConfig";
import { addMeasuringAnnotation } from "../../annotations/visibleRangeDiffAnnotationConfig";
import { getAllData, TDataEntry } from "../../data/PerformanceStatsUtils";
import { addLegend } from "../../modifiers/PerformanceMarkLegend";
import { OverviewSubSurfaceModifier } from "../../modifiers/OverviewSubSurfaceModifier";
import { SciChartJsNavyTheme } from "scichart";
import { IRenderableSeries } from "scichart";
import { summaryMarkTypes } from "../../data/markTypeCategories";
import { EPerformanceMarkType } from "scichart";
import { CustomLabelProvider } from "../../axes/CustomSmartDateLabelProvider";
import { getIsEventMarkType } from "../../data/MarksParsing";

// All on one chart to sync zoom and pan
// allow disabling sync
// subchart per thread
// series group per wasmContext/surface/subSurface
export const getPerformanceInfoChartInitFunction = (rawData: TSciChartPerformanceData[]) => {
    const allData = getAllData(rawData);
    const { data, eventMarkTypes, operationEndMarkTypes, customOperationMarkTypes, customEventMarkTypes } = allData;

    const drawStats = async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface: mainSurface } = await SciChartSurface.createSingle(rootElement, {
            theme: new SciChartJsNavyTheme(),
            id: "PerformanceMonitor",
            // title: "Chart lifecycle checkpoints",
            titleStyle: {
                fontSize: 14
            },
            loader: false,
            disableAspect: true,
            padding: Thickness.fromNumber(0)
        });

        const { xAxis: mainXAxis, yAxis: mainYAxis } = addMainSurfaceAxes(mainSurface);

        // Also the mainSurface should be measured before drawing the following subChart.
        await receiveNextEvent(mainSurface.painted);
        //  mainSurface.chartModifiers.add(new PerformanceStatsModifier())
        mainSurface.chartModifiers.add(
            new OverviewSubSurfaceModifier({
                id: "overviewSubSurface",
                coordinateMode: [
                    ESubSurfacePositionCoordinateMode.Relative,
                    ESubSurfacePositionCoordinateMode.Relative
                ],
                position: new Rect(0, 0.9, 1, 0.1),
                isTransparent: false,
                overviewXAxisOptions: {
                    id: "overviewXAxis",
                    // axisTitle: "Recording Timelapse (HHMMSSms)",
                    isVisible: true,
                    isInnerAxis: false,
                    drawMajorBands: false,
                    drawMajorGridLines: false,
                    drawMinorGridLines: false,
                    majorTickLineStyle: {
                        color: "white",
                        tickSize: 8,
                        strokeThickness: 1
                    },
                    labelStyle: {
                        color: "white",
                        fontSize: 8
                    },
                    labelProvider: new CustomLabelProvider()
                },
                overviewYAxisOptions: {
                    id: "overviewYAxis",
                    flippedCoordinates: true,
                    growBy: new NumberRange(0.1, 0.1)
                },
                transformRenderableSeries: (rendSeries: IRenderableSeries) => {
                    const seriesType = rendSeries.id.split("-").shift() as EPerformanceMarkType;
                    if (
                        !summaryMarkTypes.includes(seriesType) &&
                        !eventMarkTypes.includes(seriesType) &&
                        !customOperationMarkTypes.includes(seriesType) &&
                        !customEventMarkTypes.includes(seriesType)
                    ) {
                        // we need only top level and custom marks in overview
                        return undefined;
                    }

                    // clone the series using builder api
                    const [overviewSeries] = buildSeries(wasmContext, rendSeries.toJSON(true));
                    overviewSeries.dataSeries.delete();
                    overviewSeries.dataSeries = rendSeries.dataSeries;
                    overviewSeries.xAxisId = "overviewXAxis";
                    overviewSeries.yAxisId = "overviewYAxis";
                    overviewSeries.strokeThickness = 5;
                    overviewSeries.opacity = 1;
                    overviewSeries.pointMarker.height = 5;
                    overviewSeries.pointMarker = getIsEventMarkType(seriesType)
                        ? overviewSeries.pointMarker
                        : undefined;
                    return overviewSeries;
                }
            })
        );

        await mainSurface.nextStateRender();

        // Add visible axes as a separate SubChart.
        // Reason: better handling if adding subchart into the verticalGroup compared to mainSurface

        const { absoluteTimeAxis } = addAxesSubChart(mainSurface);

        await mainSurface.nextStateRender();

        // Set SubCharts
        const subChartGenerator = getSubSurfaceGenerator(mainSurface, data.length);
        const subSurfaces = data.map(subChartGenerator);

        await mainSurface.nextStateRender();

        const verticalGroup = new SciChartVerticalGroup();
        mainSurface.subCharts.forEach(subSurface => {
            verticalGroup.addSurfaceToGroup(subSurface);
        });

        const axisSynchronizer = new AxisSynchronizer(
            new NumberRange(0, 10),
            subSurfaces.map(subSurface => subSurface.xAxes.get(0))
        );
        axisSynchronizer.addAxis(absoluteTimeAxis);
        axisSynchronizer.addAxis(mainXAxis);

        return { sciChartSurface: mainSurface, processedData: allData };
    };

    return drawStats;
};

function configureThreadStatsSurface(sciChartSurface: SciChartSubSurface, dataEntry: TDataEntry) {
    const { xAxis, yAxis } = addSubSurfaceAxes(sciChartSurface, dataEntry.timeOrigin);

    addMeasuringAnnotation(sciChartSurface, xAxis, yAxis);

    addModifiers(sciChartSurface, xAxis, yAxis);

    const seriesConfigurator = new ProfilerSeriesConfigurator(sciChartSurface, dataEntry, xAxis, yAxis);
    seriesConfigurator.addSeries();
    seriesConfigurator.addLaneMarkers();
}

function getSubSurfaceGenerator(mainSurface: SciChartSurface, subSurfaceNumber: number) {
    const [overviewSubChart, subChartWithAbsoluteAxis] = mainSurface.subCharts;
    const absoluteAxis = subChartWithAbsoluteAxis.xAxes.get(0);
    const subChartWithAbsoluteAxisHeight = subChartWithAbsoluteAxis.viewRect.height;
    const overviewSubChartHeight = translateToNotScaledRect(overviewSubChart.viewRect).height;

    const calculateSubChartPosition = (index: number) => {
        const heighPerSubSurface =
            (mainSurface.seriesViewRect.height - subChartWithAbsoluteAxisHeight - overviewSubChartHeight) /
            subSurfaceNumber;
        const x = mainSurface.seriesViewRect.left;
        const y = mainSurface.seriesViewRect.top + heighPerSubSurface * index;
        const width = mainSurface.seriesViewRect.width;
        const height = heighPerSubSurface;
        return translateToNotScaledRect(new Rect(x, y, width, height));
    };

    return (dataEntry: TDataEntry, i: number) => {
        const subSurface = SciChartSubSurface.createSubSurface(mainSurface, {
            id: `SubSurfaceForThread${i}`,
            isTransparent: false,
            coordinateMode: ESubSurfacePositionCoordinateMode.Pixel,
            position: calculateSubChartPosition(i)
        });

        mainSurface.genericAnimationsRun.subscribe(() => {
            subSurface.subPosition = calculateSubChartPosition(i);
        });

        configureThreadStatsSurface(subSurface, dataEntry);

        // TODO there seems to be an issue with immediate zoomExtents, thus delay is used as a workaround
        setTimeout(() => {
            subSurface.zoomExtentsX();
        }, 1000);
        return subSurface;
    };
}

function addAxesSubChart(mainSurface: SciChartSurface) {
    const [overviewSubChart] = mainSurface.subCharts;

    const calculateSubChartPosition = () => {
        const overviewSubChartHeight = overviewSubChart.viewRect.height;
        const height = 250;
        const x = mainSurface.seriesViewRect.left;
        const width = mainSurface.seriesViewRect.width;
        const y = mainSurface.viewRect.bottom - height - overviewSubChartHeight;
        return translateToNotScaledRect(new Rect(x, y, width, height));
    };

    const subSurface = SciChartSubSurface.createSubSurface(mainSurface, {
        id: `AbsoluteAxisSubSurface`,
        isTransparent: false,
        coordinateMode: ESubSurfacePositionCoordinateMode.Pixel,
        position: calculateSubChartPosition()
        // position: new Rect(0, 0, 1, 1),
        // padding: mainSurface.padding
    });

    overviewSubChart.rendered.subscribe(() => {
        subSurface.subPosition = calculateSubChartPosition();
    });

    return addVisibleAxes(subSurface);
}
