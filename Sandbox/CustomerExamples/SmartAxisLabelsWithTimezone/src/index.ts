import {
    SciChartSurface,
    NumericAxis,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    EAxisAlignment,
    NumberRange,
    EAutoRange,
    EColor,
    FastLineRenderableSeries,
    CursorModifier
} from 'scichart';
import { axisLabelDateFormatter } from './axisLabelDateFormatter';
import { DateTickProvider } from './DateTickProvider';
import { SmartDateTZLabelProvider } from './SmartDateTZLabelProvider';
import { createDateTzConverter } from './timezones';
import { createDataSeries } from './createDataSeries';

async function initSciChart(timeZone: string, locale: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');
    const xAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.05, 0.05),
        // 2010 year min and 2030 year max
        visibleRangeLimit: new NumberRange(1262293200, 1893445200),
        // 5 seconds min size and 2 years max
        visibleRangeSizeLimit: new NumberRange(5, 2 * 31622400),
        useSharedCache: false,
        useNativeText: true
    });

    // Overrides getDeltaFromRange to get nice major and minor deltas for the ticks
    xAxis.deltaCalculator.getDeltaFromRange = axisLabelDateFormatter.getDeltaFromRange;

    // Calculate ticks which respect the time zone
    xAxis.tickProvider = new DateTickProvider(wasmContext, timeZone);

    // Draws nice axis labels timezone and locale specific
    xAxis.labelProvider = new SmartDateTZLabelProvider(timeZone, locale);

    const dateTzConverter = createDateTzConverter(timeZone);

    // This is needed for Cursor and Rollover chart modifiers
    xAxis.labelProvider.formatCursorLabel = timestamp =>
        axisLabelDateFormatter.toFullDateTime(timestamp, dateTzConverter, locale);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis1 = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        axisAlignment: EAxisAlignment.Left,
        labelStyle: { color: EColor.Orange },
        cursorLabelPrecision: 4,
        visibleRange: new NumberRange(-2.2, 2.2),
        autoRange: EAutoRange.Never,
        visibleRangeSizeLimit: new NumberRange(0.1, 1000),
        useSharedCache: false,
        useNativeText: true
    });
    yAxis1.labelProvider.precision = 2;
    sciChartSurface.yAxes.add(yAxis1);

    const firstSeriesData = createDataSeries(wasmContext, 0, { dataSeriesName: 'Sinewave Green' });
    const renderableSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: EColor.Orange,
        strokeThickness: 3,
        dataSeries: firstSeriesData,
        isVisible: true
    });
    sciChartSurface.renderableSeries.add(renderableSeries1);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier(), new CursorModifier());
}

initSciChart('Asia/Istanbul', 'de-DE');
