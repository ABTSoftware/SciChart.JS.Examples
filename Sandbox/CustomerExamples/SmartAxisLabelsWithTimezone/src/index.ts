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
    CursorModifier,
    ZoomExtentsModifier
} from 'scichart';
import { axisLabelDateFormatter } from './axisLabelDateFormatter';
import { DateTickProvider } from './DateTickProvider';
import { SmartDateTZLabelProvider } from './SmartDateTZLabelProvider';
import { createDateTzConverter } from './timezones';
import { createDataSeries } from './createDataSeries';

async function initSciChart() {
    const settings = { timezone: 'utc', locale: 'en' };

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

    const updateSettings = (xAxis$: NumericAxis) => {
        const { timezone, locale } = settings;
        // Calculate ticks which respect the time zone
        xAxis$.tickProvider = new DateTickProvider(wasmContext, timezone);
        // Draws nice axis labels timezone and locale specific
        xAxis$.labelProvider = new SmartDateTZLabelProvider(timezone, locale);
        const dateTzConverter = createDateTzConverter(timezone);
        // This is needed for Cursor and Rollover chart modifiers
        xAxis$.labelProvider.formatCursorLabel = timestamp =>
            axisLabelDateFormatter.toFullDateTime(timestamp, dateTzConverter, locale);
    };
    updateSettings(xAxis);

    sciChartSurface.xAxes.add(xAxis);

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment: EAxisAlignment.Left,
            labelStyle: { color: EColor.Orange },
            cursorLabelPrecision: 4,
            visibleRange: new NumberRange(-2.2, 2.2),
            autoRange: EAutoRange.Never,
            visibleRangeSizeLimit: new NumberRange(0.1, 1000),
            useSharedCache: false,
            useNativeText: true,
            labelPrecision: 2
        })
    );

    const dataSeries = createDataSeries(wasmContext, 0, { dataSeriesName: 'Sinewave Green' });
    const renderableSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: EColor.Orange,
        strokeThickness: 3,
        dataSeries,
        isVisible: true
    });
    sciChartSurface.renderableSeries.add(renderableSeries);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new CursorModifier(),
        new ZoomExtentsModifier()
    );

    // Subscribe to timezone changes
    const timezoneSelect = document.getElementById('timezones') as HTMLSelectElement;
    timezoneSelect.addEventListener('input', () => {
        settings.timezone = timezoneSelect.options[timezoneSelect.selectedIndex].value;
        console.log(settings);
        updateSettings(xAxis);
    });

    // Subscribe to locale changes
    const localeSelect = document.getElementById('locales') as HTMLSelectElement;
    localeSelect.addEventListener('input', () => {
        settings.locale = localeSelect.options[localeSelect.selectedIndex].value;
        console.log(settings);
        updateSettings(xAxis);
    });
}

initSciChart();
