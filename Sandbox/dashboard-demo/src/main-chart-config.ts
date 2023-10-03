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
    parseArgbToHtmlColor,
} from 'scichart';
import { appTheme } from 'scichart-example-dependencies';
import { TDataEntry, getData, getRequestsNumberPerTimestamp } from './data-generation';
import { TMainChartConfigFunc } from './chart-configurations';

export const createChart1: TMainChartConfigFunc = async (divElementId: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        padding: Thickness.fromString('10 10 2 10'),
        title: 'Number of requests for time period',
        titleStyle: {
            placeWithinChart: true,
            fontSize: 16,
        },
    });

    const data = getData();

    const { xValues, yValues, groupedEntries } = getRequestsNumberPerTimestamp(data);
    const metadata = groupedEntries.map((entries) => ({
        isSelected: false,
        entries,
    }));
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        metadata,
        containsNaN: false,
        isSorted: true,
        dataEvenlySpacedInX: true,
    });

    let averageDurationThreshold = 1600;

    const getAverageDurationFromMetadata = (pointMetadata: IPointMetadata) => {
        const { entries } = pointMetadata as (typeof metadata)[number];
        const averageDuration = entries.reduce((acc, value) => acc + value.duration, 0) / entries.length;
        return Math.round(averageDuration);
    };

    const dataLabels: IDataLabelProviderOptions = {
        color: appTheme.VividRed,
        style: {
            fontFamily: 'Arial',
            fontSize: 14,
            padding: Thickness.fromNumber(10),
        },
        horizontalTextPosition: EHorizontalTextPosition.Center,
        verticalTextPosition: EVerticalTextPosition.Above,
        skipMode: EDataLabelSkipMode.SkipIfOverlapNext,
        metaDataSelector: (pointMetadata: IPointMetadata) => {
            const averageDuration = getAverageDurationFromMetadata(pointMetadata);
            return averageDuration > averageDurationThreshold ? `${Math.round(averageDuration)}ms` : undefined;
        },
    };

    class CustomPaletteProvider extends BasePaletteProvider implements IPointMarkerPaletteProvider {
        public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
        public readonly fillPaletteMode = EFillPaletteMode.GRADIENT;

        private highlightedFill = parseColorToUIntArgb(appTheme.MutedRed);
        private highlightedStroke = parseColorToUIntArgb(appTheme.VividRed);

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
        axisTitle: 'Date Axis',
        axisTitleStyle: {
            fontSize: 20,
        },
        visibleRangeLimit: dataSeries.getXRange(),
        labelFormat: ENumericFormat.Date_DDMM,
        isInnerAxis: true,
        useNativeText: true,
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: 'Requests',
        axisTitleStyle: {
            fontSize: 20,
        },
        visibleRangeLimit: new NumberRange(0, 1000),
        labelPrecision: 0,
        useNativeText: true,
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
            fill: appTheme.VividSkyBlue,
            strokeThickness: 2,
            opacity: 1,
        }),
        stroke: appTheme.VividGreen,
        strokeThickness: 2,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.VividTeal, offset: 0 },
            { color: parseArgbToHtmlColor(parseColorToUIntArgb(appTheme.VividTeal, 250)), offset: 0.2 },
            { color: parseArgbToHtmlColor(parseColorToUIntArgb(appTheme.VividTeal, 0)), offset: 1 },
        ]),
        paletteProvider,
    });

    sciChartSurface.renderableSeries.add(mountainSeries);
    // Override the standard legend displayed by RolloverModifier
    const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
        let outputSvgString = '';

        // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
        seriesInfos.forEach((seriesInfo, index) => {
            const y = 20 + index * 20;
            const textColor = seriesInfo.stroke;
            let legendText = seriesInfo.formattedYValue;
            const metadataEntry = seriesInfo.pointMetadata as (typeof metadata)[number];
            const averageDuration = getAverageDurationFromMetadata(metadataEntry);
            legendText = `Avg. Request Duration: ${averageDuration};  Requests Number: ${metadataEntry.entries.length}`;
            outputSvgString += `<text x="8" y="${y}" font-size="13" font-family="Verdana" fill="${textColor}">
            ${legendText}
        </text>`;
        });

        return `<svg width="100%" height="100%">
                ${outputSvgString}
            </svg>`;
    };
    const cursorModifier = new CursorModifier({
        id: 'TotalRequestsCursorModifier',
        showTooltip: false,
        showAxisLabels: true,
        // showXLine: false,
        showYLine: false,
        crosshairStrokeDashArray: [10, 20],
        crosshairStrokeThickness: 2,
        tooltipLegendOffsetX: 100,
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
        const metadataEntry = seriesInfo.pointMetadata as (typeof metadata)[number];
        const averageDuration = getAverageDurationFromMetadata(metadataEntry);
        lines.push(`Count: ${seriesInfo.formattedYValue}`);
        lines.push(`Avg. Time: ${averageDuration}ms`);
        return lines;
    };

    const rolloverModifier = new RolloverModifier({
        id: 'TotalRequestsRolloverModifier',
        showTooltip: true,
        showRolloverLine: false,
        tooltipDataTemplate: getTooltipDataTemplate,
    });
    sciChartSurface.chartModifiers.add(
        cursorModifier,
        rolloverModifier,
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ id: 'ZoomPanModifier', xyDirection: EXyDirection.XDirection }),
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
