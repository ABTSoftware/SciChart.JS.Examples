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
    ECoordinateMode,
    VerticalSliceModifier,
    CursorModifier,
    ChartModifierBase2D,
} from "scichart";
import { appTheme } from "../../../theme";
import { getData, TDataEntry, availablePages, getRequestsNumberPerTimestamp } from "./data-generation";
import { TChartViewOptions, tooltipDataTemplateKey } from "./chart-configurations";

const fillColors = ["#f6086c", "#47bde6", "#34c19c", "#f4840b"];

export const createPageStatisticsChart = async (divElementId: string | HTMLDivElement, options: TChartViewOptions) => {
    const { isMobileView, isLargeView } = options;

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        title: "URL statistics",
        titleStyle: {
            useNativeText: true,
            placeWithinChart: !isLargeView,
            padding: Thickness.fromString("15 0 0 0"),
            fontSize: 16,
            color: appTheme.ForegroundColor,
        },
    });

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_DDMM,
        useNativeText: true,
        labelStyle: {
            fontSize: isLargeView ? 12 : 10,
        },
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: isLargeView ? "Requests" : undefined,
        axisTitleStyle: {
            fontSize: 20,
            color: appTheme.ForegroundColor,
        },
        labelStyle: {
            fontSize: isLargeView ? 12 : 10,
        },
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0, 0.3),
        labelPrecision: 0,
        keepLabelsWithinAxis: false,
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
            fill: fillColors[index],
            stroke: fillColors[index],
            strokeThickness: 0,
            opacity: 0.8,
            stackedGroupId: "StackedGroupId",
        });

        stackedColumnCollection.add(rendSeries);
    });

    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    sciChartSurface.renderableSeries.add(stackedColumnCollection);

    const legendModifier = new LegendModifier({
        showLegend: isLargeView,
        placement: ELegendPlacement.TopLeft,
        orientation: ELegendOrientation.Vertical,
        backgroundColor: "#0d1523",
    });

    const zoomAndScrollDirection = EXyDirection.XDirection;

    let rolloverModifier: ChartModifierBase2D;

    if (isMobileView) {
        rolloverModifier = new VerticalSliceModifier({
            id: "PageStatisticsRolloverModifier",
            showTooltip: true,
            tooltipDataTemplate: tooltipDataTemplateKey,

            x1: 0.75,
            xCoordinateMode: ECoordinateMode.Relative,
            isDraggable: true,
        });
    } else {
        const defaultRolloverModifier = new RolloverModifier({
            id: "PageStatisticsRolloverModifier",
            showTooltip: true,
            snapToDataPoint: true,
            tooltipDataTemplate: tooltipDataTemplateKey,
        });

        defaultRolloverModifier.rolloverLineAnnotation.showLabel = true;
        defaultRolloverModifier.rolloverLineAnnotation.axisLabelFill = "#e8c667";
        defaultRolloverModifier.rolloverLineAnnotation.axisLabelStroke = "#0d1523";
        rolloverModifier = defaultRolloverModifier;
    }

    sciChartSurface.chartModifiers.add(
        legendModifier,
        rolloverModifier,
        new ZoomExtentsModifier({ xyDirection: zoomAndScrollDirection }),
        new ZoomPanModifier({ enableZoom: true, xyDirection: zoomAndScrollDirection }),
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
            sciChartSurface.titleStyle.placeWithinChart = false;
            yAxis.visibleRange = new NumberRange(0, 100);
            yAxis.visibleRangeLimit = new NumberRange(0, 100);
            yAxis.labelProvider.formatLabel = (dataValue: number) => `${dataValue}%`;
        } else {
            sciChartSurface.titleStyle.placeWithinChart = true;
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

export const getPageStatisticsChartConfig =
    (options: TChartViewOptions) => async (divElementId: string | HTMLDivElement) =>
        createPageStatisticsChart(divElementId, options);
