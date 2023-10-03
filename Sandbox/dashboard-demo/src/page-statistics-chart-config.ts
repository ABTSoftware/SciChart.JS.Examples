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
    EAxisAlignment,
    TRolloverTooltipDataTemplate,
    XySeriesInfo,
} from 'scichart';
import { appTheme } from 'scichart-example-dependencies';
import { getData, TDataEntry, availablePages, getRequestsNumberPerTimestamp } from './data-generation';
import { TPageStatsChartConfigFunc, tooltipDataTemplateKey } from './chart-configurations';

// per page
export const createChart2: TPageStatsChartConfigFunc = async (divElementId: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        title: 'URL statistics',
        titleStyle: {
            useNativeText: true,
            padding: Thickness.fromString('15 0 0 0'),
            // placeWithinChart: true,
            alignment: ETextAlignment.Center,
            fontSize: 20,
        },
    });

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_DDMM,
        useNativeText: true,
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: 'Requests',
        axisTitleStyle: {
            fontSize: 20,
        },
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0, 0.3),
        labelPrecision: 0,
        keepLabelsWithinAxis: true,
        useNativeText: true,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const data = getData();

    const stackedColumnCollection = new StackedColumnCollection(wasmContext, {});

    // filtered per page
    const getNumberOfRequestsForPage = (data: TDataEntry[], page: string) =>
        data.map((entry) => (entry.page === page ? entry : { ...entry, page: null }));

    availablePages.forEach((page, index) => {
        const pageData = getNumberOfRequestsForPage(data, page);
        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: page,
            containsNaN: false,
            dataEvenlySpacedInX: true,
            isSorted: true,
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
        tooltipDataTemplate: tooltipDataTemplateKey,
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
    yAxis.visibleRangeLimit = new NumberRange(0, undefined);
    yAxis.visibleRangeSizeLimit = new NumberRange(10, Number.MAX_SAFE_INTEGER);

    const adjustYAxisVisibleRange = () => {
        if (stackedColumnCollection.isOneHundredPercent) {
            return;
        }

        stackedColumnCollection.updateAccumulatedVectors();
        const growFactor = 1.3;
        const maxRange = stackedColumnCollection.getYRange(xAxis.getMaximumRange(), yAxis.isCategoryAxis);
        yAxis.visibleRange = new NumberRange(0, maxRange.max * growFactor);
    };

    adjustYAxisVisibleRange();

    const toggleIsHundredPercent = () => {
        stackedColumnCollection.isOneHundredPercent = !stackedColumnCollection.isOneHundredPercent;

        if (stackedColumnCollection.isOneHundredPercent) {
            yAxis.visibleRange = new NumberRange(0, 100);
            yAxis.visibleRangeLimit = new NumberRange(0, 100);
            yAxis.labelProvider.formatLabel = (dataValue: number) => `${dataValue}%`;
        } else {
            yAxis.visibleRangeLimit = new NumberRange(0, undefined);
            yAxis.labelProvider.formatLabel = (dataValue: number) => `${dataValue}`;
            adjustYAxisVisibleRange();
        }
    };

    const updateData = (data: TDataEntry[]) => {
        availablePages.forEach((page, index) => {
            const pageData = getNumberOfRequestsForPage(data, page);
            const { xValues, yValues } = getRequestsNumberPerTimestamp(pageData);
            const oldRendSeries = stackedColumnCollection.get(index) as StackedColumnRenderableSeries;
            const dataSeries = oldRendSeries.dataSeries as XyDataSeries;
            dataSeries.clear();
            dataSeries.appendRange(xValues, yValues);

            adjustYAxisVisibleRange();
        });
    };

    return { sciChartSurface, updateData, toggleIsHundredPercent };
};
