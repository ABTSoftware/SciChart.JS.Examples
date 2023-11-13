import {
    SciChartSurface,
    XyDataSeries,
    NumericAxis,
    ENumericFormat,
    NumberRange,
    FastMountainRenderableSeries,
    GradientParams,
    Point,
    CursorModifier,
    RolloverModifier,
    ZoomExtentsModifier,
    EXyDirection,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    IDataLabelProviderOptions,
    IPointMetadata,
    EDataLabelSkipMode,
    EllipsePointMarker,
    EHorizontalTextPosition,
    IPointMarkerPaletteProvider,
    TPointMarkerArgb,
    parseColorToUIntArgb,
    SeriesInfo,
    CursorTooltipSvgAnnotation,
    EVerticalTextPosition,
    Thickness,
    BasePaletteProvider,
    EStrokePaletteMode,
    EFillPaletteMode,
    parseArgbToHtmlColor
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
import { TDataEntry, getData, getRequestsNumberPerTimestamp } from "./data-generation";
import { TInitFunction } from "./SciChart";
import { TChartConfigResult } from "./chart-configurations";

export type TMainChartConfigFunc = TInitFunction<
    SciChartSurface,
    TChartConfigResult<SciChartSurface> & { updateThreshold: (value: number) => void }
>;

export const createChart1: TMainChartConfigFunc = async (divElementId: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        padding: Thickness.fromString("10 10 2 10"),
        title: "Number of requests for time period",
        titleStyle: {
            placeWithinChart: true,
            fontSize: 16,
            color: appTheme.ForegroundColor
        }
    });

    const data = getData();

    const { xValues, yValues, groupedEntries } = getRequestsNumberPerTimestamp(data);
    const metadata = groupedEntries.map(entries => ({
        isSelected: false,
        entries
    }));
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        metadata,
        containsNaN: false,
        isSorted: true,
        dataEvenlySpacedInX: true
    });

    let averageDurationThreshold = 1600;

    const getAverageDurationFromMetadata = (pointMetadata: IPointMetadata) => {
        const { entries } = pointMetadata as typeof metadata[number];
        const averageDuration = entries.reduce((acc, value) => acc + value.duration, 0) / entries.length;
        return Math.round(averageDuration);
    };

    const dataLabels: IDataLabelProviderOptions = {
        color: "#f6086c",
        style: {
            fontFamily: "Arial",
            fontSize: 14,
            padding: Thickness.fromNumber(10)
        },
        horizontalTextPosition: EHorizontalTextPosition.Center,
        verticalTextPosition: EVerticalTextPosition.Above,
        skipMode: EDataLabelSkipMode.SkipIfOverlapNext,
        metaDataSelector: (pointMetadata: IPointMetadata) => {
            const averageDuration = getAverageDurationFromMetadata(pointMetadata);
            return averageDuration > averageDurationThreshold ? `${Math.round(averageDuration)}ms` : undefined;
        }
    };

    class CustomPaletteProvider extends BasePaletteProvider implements IPointMarkerPaletteProvider {
        public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
        public readonly fillPaletteMode = EFillPaletteMode.GRADIENT;

        private highlightedFill = parseColorToUIntArgb("#ae418d");
        private highlightedStroke = parseColorToUIntArgb("#f6086c");

        public overrideStrokeArgb(
            xValue: number,
            yValue: number,
            index: number,
            opacity?: number,
            metadata?: IPointMetadata
        ): number {
            // TODO this should not be required
            return parseColorToUIntArgb(appTheme.VividTeal, opacity * 255);
        }

        public overridePointMarkerArgb(
            xValue: number,
            yValue: number,
            index: number,
            opacity?: number,
            metadata?: IPointMetadata
        ): TPointMarkerArgb {
            const averageDuration = getAverageDurationFromMetadata(metadata);
            return averageDuration > averageDurationThreshold
                ? { fill: this.highlightedFill, stroke: this.highlightedStroke }
                : { fill: undefined, stroke: undefined };
        }
    }

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Date Axis",
        axisTitleStyle: {
            fontSize: 20,
            color: appTheme.ForegroundColor
        },
        visibleRangeLimit: dataSeries.getXRange(),
        labelFormat: ENumericFormat.Date_DDMM,
        isInnerAxis: true
        // useNativeText: true,
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Requests",
        axisTitleStyle: {
            fontSize: 20,
            color: appTheme.ForegroundColor
        },
        labelStyle: {
            color: appTheme.ForegroundColor
        },
        visibleRangeLimit: new NumberRange(0, 1000),
        labelPrecision: 0,
        useNativeText: true
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const paletteProvider = new CustomPaletteProvider();

    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries,
        dataLabels,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 8,
            height: 8,
            stroke: "#0bf4cd",
            fill: "#17243d",
            strokeThickness: 2,
            opacity: 1
        }),
        stroke: "#34c19c",
        strokeThickness: 2,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#67bdaf", offset: 0 },
            { color: "#223459 ", offset: 1 }
        ]),
        paletteProvider
    });

    sciChartSurface.renderableSeries.add(mountainSeries);

    const cursorModifier = new CursorModifier({
        id: "TotalRequestsCursorModifier",
        showTooltip: false,
        showAxisLabels: true,
        // showXLine: false,
        showYLine: false,
        crosshairStrokeDashArray: [10, 20],
        crosshairStrokeThickness: 2,
        axisLabelFill: "#e8c667",
        axisLabelStroke: "#0d1523",
        tooltipContainerBackground: "#34c19c",
        tooltipLegendOffsetX: 100
        // tooltipLegendTemplate: getTooltipLegendTemplate,
    });

    const getTooltipDataTemplate = (
        seriesInfo: SeriesInfo,
        tooltipTitle: string,
        tooltipLabelX: string,
        tooltipLabelY: string
    ) => {
        // Lines here are returned to the tooltip and displayed as text-line per tooltip
        const lines: string[] = [];
        // lines.push(tooltipTitle);
        const metadataEntry = seriesInfo.pointMetadata as typeof metadata[number];
        const averageDuration = getAverageDurationFromMetadata(metadataEntry);
        lines.push(`Count: ${seriesInfo.formattedYValue}`);
        lines.push(`Avg. Time: ${averageDuration}ms`);
        return lines;
    };

    const rolloverModifier = new RolloverModifier({
        id: "TotalRequestsRolloverModifier",
        showTooltip: true,
        showRolloverLine: false,
        tooltipDataTemplate: getTooltipDataTemplate
    });
    sciChartSurface.chartModifiers.add(
        cursorModifier,
        rolloverModifier,
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ id: "ZoomPanModifier", xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection })
    );

    sciChartSurface.zoomExtentsX();

    const adjustYAxisVisibleRange = () => {
        const growFactor = 1.5;
        yAxis.visibleRange = new NumberRange(0, yAxis.getMaximumRange().max * growFactor);
    };

    adjustYAxisVisibleRange();

    const updateData = (newData: TDataEntry[]) => {
        const { xValues, yValues, groupedEntries } = getRequestsNumberPerTimestamp(newData);
        const metadata = groupedEntries.map((entries) => ({
            isSelected: false,
            entries,
        }));
        const oldDataSeries = dataSeries;

        oldDataSeries.clear();
        oldDataSeries.appendRange(xValues, yValues, metadata);

        adjustYAxisVisibleRange();
    };

    const updateThreshold = (value: number) => {
        averageDurationThreshold = value;
        sciChartSurface.invalidateElement();
    };

    return { sciChartSurface, updateData, updateThreshold };
};
