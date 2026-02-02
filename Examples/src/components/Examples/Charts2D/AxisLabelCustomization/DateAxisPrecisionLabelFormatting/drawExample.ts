import {
    DateTimeNumericAxis,
    EllipsePointMarker,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyDataSeries,
    NumericAxis,
    FastLineRenderableSeries,
    SciChartSurface,
    EAutoRange,
    SmartDateLabelProvider,
    EResamplingMode,
    EDatePrecision,
    EHighPrecisionLabelMode,
    ETradeChartLabelFormat,
    NumberRange,
    RubberBandXyZoomModifier,
    NativeTextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
} from "scichart";
import { format, fromUnixTime } from "date-fns";

const toUTC = (date: Date) => {
    // SciChart internally uses UTC dates, so convert to UTC
    return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    const startDate = new Date("2025-01-01T00:00:00Z");
    const startTimeSeconds = startDate.getTime() / 1000;

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisTitle: "Time",
        datePrecision: EDatePrecision.Nanoseconds, // Very important -> 1 x-value increment == 1 nanosecond
        highPrecisionLabelMode: EHighPrecisionLabelMode.Suffix,
        dateOffset: startTimeSeconds, // in seconds
        labelStyle: {
            color: "#FFFFFF", // make them stand out a bit
        },

        showWiderDateOnFirstLabel: true,
        showYearOnWiderDate: true,

        splitWideDateWithComma: false,

        showSecondsOnWideDate: true, // Usually these 2 should be opposites: when wide date shows seconds, precise date shouldn't.
        showSecondsOnPreciseDate: true,
    });
    sciChartSurface.xAxes.add(xAxis);

    const labelProvider = xAxis.labelProvider as SmartDateLabelProvider;

    // 1. Capture the original SciChart implementations
    const defaultFormatDateWide = labelProvider.formatDateWide.bind(labelProvider);
    const defaultFormatDatePrecise = labelProvider.formatDatePrecise.bind(labelProvider);

    // 2. Define the Custom "date-fns" implementations
    // Wide dates -> e.g. "Jan 01, 2025 12:00:00"
    const customFormatDateWide = (labelRange: ETradeChartLabelFormat | string, valueInSeconds: number) => {
        const date = toUTC(fromUnixTime(valueInSeconds));
        if (
            labelRange === ETradeChartLabelFormat.Nanoseconds ||
            labelRange === ETradeChartLabelFormat.Microseconds ||
            labelRange === ETradeChartLabelFormat.MilliSeconds
        ) {
            return format(date, "MMM dd, yyyy HH:mm:ss");
        } else if (labelRange === ETradeChartLabelFormat.Seconds || labelRange === ETradeChartLabelFormat.Minutes) {
            return format(date, "MMM dd, yyyy");
        } else if (labelRange === ETradeChartLabelFormat.Days) {
            return format(date, "MMM yyyy");
        } else {
            return format(date, "yyyy");
        }
    };

    // Precise dates -> e.g. "12:59:59" or "03s12345ns"
    const customFormatDatePrecise = (
        labelRange: ETradeChartLabelFormat | string,
        valueInSeconds: number,
        rawValue?: number
    ) => {
        const date = toUTC(fromUnixTime(valueInSeconds));

        // High precision logic
        if (
            labelRange === ETradeChartLabelFormat.Nanoseconds ||
            labelRange === ETradeChartLabelFormat.Microseconds ||
            labelRange === ETradeChartLabelFormat.MilliSeconds
        ) {
            const mode = labelProvider.highPrecisionLabelMode;

            if (mode === EHighPrecisionLabelMode.Suffix && rawValue !== undefined) {
                const tps = labelProvider.datePrecision;
                const wholeSeconds = Math.floor(rawValue / tps);
                const ticksWithinSecond = rawValue - wholeSeconds * tps;
                const subSecondOffset = ticksWithinSecond / tps;

                const seconds = date.getUTCSeconds();
                const secondsStr = seconds.toString().padStart(2, "0");

                if (labelRange === ETradeChartLabelFormat.Nanoseconds) {
                    const ns = Math.round(subSecondOffset * 1_000_000_000);
                    return `${secondsStr}:${ns}ns`;
                }
                if (labelRange === ETradeChartLabelFormat.Microseconds) {
                    const us = Math.round(subSecondOffset * 1_000_000);
                    return `${secondsStr}:${us}µs`;
                }
                const ms = Math.round(subSecondOffset * 1_000);
                return `${secondsStr}:${ms}ms`;
            }
            return format(date, "ss.SSS");
        }

        if (labelRange === ETradeChartLabelFormat.Seconds) return format(date, "HH:mm:ss");
        if (labelRange === ETradeChartLabelFormat.Minutes) return format(date, "HH:mm");
        if (labelRange === ETradeChartLabelFormat.Days || labelRange === ETradeChartLabelFormat.Months)
            return format(date, "dd");

        return format(date, "dd/MM/yy");
    };

    // 3. Logic to toggle between them
    const setUseDateFns = (useCustom: boolean) => {
        if (useCustom) {
            labelProvider.formatDateWide = customFormatDateWide;
            labelProvider.formatDatePrecise = customFormatDatePrecise;
        } else {
            labelProvider.formatDateWide = defaultFormatDateWide;
            labelProvider.formatDatePrecise = defaultFormatDatePrecise;
        }
        // Force redraw to apply changes to existing labels
        sciChartSurface.invalidateElement();
    };

    // Apply custom by default initially
    setUseDateFns(true);

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Signal (mV)",
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
        })
    );

    // Data Generation
    const xValues: number[] = [];
    const yValues: number[] = [];
    type Generator = (i: number) => number;

    const addCluster = (startOffsetNano: number, count: number, generator: Generator) => {
        for (let i = 0; i < count; i++) {
            const x = startOffsetNano + i * 10_000_000;
            const noise = (Math.random() - 0.5) * 0.05;
            const y = generator(i) + noise;

            xValues.push(x);
            yValues.push(y);
        }
    };

    const ONE_SEC = 1_000_000_000; // Because we use `datePrecision = Nanoseconds`
    const ONE_MIN = ONE_SEC * 60;

    // 1. Damped Ringing
    addCluster(0, 2000, (i) => Math.sin(i * 0.1) * Math.exp(-i * 0.002) * 2);

    // 2. Frequency Chirp
    addCluster(1 * ONE_MIN, 2000, (i) => {
        const freq = 0.01 + i * 0.00005;
        return Math.sin(i * freq);
    });

    // 3. Amplitude Modulated Packet
    addCluster(3 * ONE_MIN, 2000, (i) => {
        const carrier = Math.sin(i * 0.1);
        const envelope = Math.sin(i * 0.03); // Slow envelope
        return carrier * envelope * 1.5;
    });

    // 4. Noisy "Heartbeat"
    addCluster(4 * ONE_MIN, 2000, (i) => {
        // spike every 200 points
        if (i % 200 < 20) return 1.0 + Math.random();
        return Math.random() * 0.2;
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            containsNaN: false,
            isSorted: true,
            dataSeriesName: "Sensor A",
        }),
        stroke: "#50C7E0",
        strokeThickness: 2,
        resamplingMode: EResamplingMode.None,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 4,
            height: 4,
            fill: "#2e3a59",
            stroke: "#50C7E0",
            strokeThickness: 1,
        }),
    });
    lineSeries.rolloverModifierProps.tooltipLabelX = "X";
    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier(), new ZoomPanModifier());
    sciChartSurface.zoomExtents();

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            x1: 0.5,
            y1: 0.08,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            text: `Zoom in & out while toggling the switch to see different axis label formats
            \nSee how you can also customize date formatting at lines 60, 80 in drawExample.ts!`,
            lineSpacing: 10,
            fontSize: 16,
            opacity: 0.7,
            textColor: "#FFFFFF",
        })
    );

    return {
        wasmContext,
        sciChartSurface,
        controls: { setUseDateFns },
    };
};
