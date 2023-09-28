import {
    SciChartSurface,
    Thickness,
    ETextAlignment,
    NumericAxis,
    ENumericFormat,
    NumberRange,
    StackedColumnCollection,
    XyDataSeries,
    StackedColumnRenderableSeries,
    AUTO_COLOR,
    WaveAnimation,
    LegendModifier,
    ELegendPlacement,
    ELegendOrientation,
    EXyDirection,
    RolloverModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    IRenderableSeries,
    SeriesSelectionModifier,
    HoveredChangedArgs,
    EAxisAlignment,
    TRolloverTooltipDataTemplate,
    XySeriesInfo,
} from 'scichart';
import { appTheme } from 'scichart-example-dependencies';
import { getData, TDataEntry, availablePages, getRequestsNumberPerTimestamp } from './data-generation';
import { TChartConfigFunc, tooltipDataTemplateKey } from './chart-configurations';

// per page
export const createChart2: TChartConfigFunc = async (divElementId: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        title: 'URL statistics',
        titleStyle: {
            useNativeText: true,
            padding: Thickness.fromString("15 0 0 0"),
            // placeWithinChart: true,
            alignment: ETextAlignment.Center,
            fontSize: 20,
        },
    });

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_DDMM,
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: 'Requests',
        axisTitleStyle: {
            fontSize: 20,
        },
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0, 0.5),
        labelPrecision: 0,
        keepLabelsWithinAxis: true,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const data = getData();

    const stackedColumnCollection = new StackedColumnCollection(wasmContext, {});

    // filtered per page
    const getNumberOfRequestsForPage = (data: TDataEntry[], page: string) =>
        data.filter((entry) => entry.page === page);

    availablePages.forEach((page, index) => {
        const pageData = getNumberOfRequestsForPage(data, page);
        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: page,
            ...getRequestsNumberPerTimestamp(pageData),
        });

        const rendSeries = new StackedColumnRenderableSeries(wasmContext, {
            dataSeries,
            fill: AUTO_COLOR,
            stroke: AUTO_COLOR,
            strokeThickness: 2,
            opacity: 0.8,
            stackedGroupId: 'StackedGroupId',
        });

        stackedColumnCollection.add(rendSeries);
    });

    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    sciChartSurface.renderableSeries.add(stackedColumnCollection);

    const legendModifier = new LegendModifier({
        placement: ELegendPlacement.TopLeft,
        orientation: ELegendOrientation.Vertical,
    });

    const zoomAndScrollDirection = EXyDirection.XDirection;

    const rolloverModifier = new RolloverModifier({
        id: 'PageStatisticsRolloverModifier',
        showTooltip: true,
        snapToDataPoint: true,
        tooltipDataTemplate: tooltipDataTemplateKey
    });
    sciChartSurface.chartModifiers.add(
        legendModifier,
        rolloverModifier,
        new ZoomExtentsModifier({ xyDirection: zoomAndScrollDirection }),
        new ZoomPanModifier({ xyDirection: zoomAndScrollDirection }),
        new MouseWheelZoomModifier({ xyDirection: zoomAndScrollDirection })
    );
    sciChartSurface.zoomExtents();

    xAxis.visibleRangeLimit = xAxis.visibleRange;
    // yAxis.zoomBy(yAxis.growBy.min, yAxis.growBy.max)

    const updateData = (data: TDataEntry[]) => {
        availablePages.forEach((page, index) => {
            const pageData = getNumberOfRequestsForPage(data, page);
            const dataSeries = new XyDataSeries(wasmContext, {
                dataSeriesName: page,
                ...getRequestsNumberPerTimestamp(pageData),
            });
            const oldRendSeries = stackedColumnCollection.get(index) as StackedColumnRenderableSeries;
            const oldDataSeries =  oldRendSeries.dataSeries
            oldRendSeries.dataSeries = dataSeries
            oldDataSeries.delete()

        });
    };

    return { sciChartSurface, updateData };
};
