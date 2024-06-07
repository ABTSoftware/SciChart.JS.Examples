import {
    DateTimeNumericAxis,
    EllipsePointMarker,
    ENumericFormat,
    deleteSafe,
    isRealNumber,
    SmartDateLabelProvider,
    MouseWheelZoomModifier,
    RolloverModifier,
    TRolloverTooltipDataTemplate,
    RubberBandXyZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyDataSeries,
    NumericAxis,
    FastLineRenderableSeries,
    SciChartSurface,
    NumberRange,
    EAutoRange,
    EAxisAlignment,
    EExecuteOn,
    formatUnixDateToHumanString,
    formatUnixDateToHumanStringHHMMSS
} from "scichart"

import { getIndicesRange } from "scichart/Charting/Model/BaseDataSeries"

// Unix Timestamps - 300 year data range with 1ms precision
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        useNativeText: true,
    });
    (xAxis.labelProvider as SmartDateLabelProvider).showYearOnWiderDate = true;
    xAxis.labelProvider.formatCursorLabel = dataValue => {
        const d = new Date(dataValue * 1000);
        const s = (dataValue * 1000).toString();
    const ds = d.getTime().toString();
        const r = s.replace(ds, "");
        return formatUnixDateToHumanString(dataValue) + " " + formatUnixDateToHumanStringHHMMSS(dataValue) + r;
    };
    sciChartSurface.xAxes.add(xAxis);

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-1, 1),
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.1, 0.1),
            labelPrecision: 3,
            labelFormat: ENumericFormat.SignificantFigures,
            autoRange: EAutoRange.Always
        })
    );

    const base = Date.now() / 1000;
    const xValues = [];
    const yValues = [];
    let x = base;
    for (let i = 0; i < 1000; i++) {
        x = x + 10000000;
        for (let j = 0; j < 10; j++) {
            x = x + Math.random();
            let y = 0.5 * Math.sin(i) - Math.cos(i * 0.3) + Math.random() / 100;
            xValues.push(x);
            yValues.push(y);
        }
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        isSorted: true,
        containsNaN: false
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 2,
        dataSeries: xyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext)
    });

    lineSeries.getYRange = (visibleRange, isCategoryAxis) => {
        const xValues = xyDataSeries.getNativeXValues();
        const yValues = xyDataSeries.getNativeYValues();
        // TODO: getPositiveRange
        const count = xValues.size();
        // if one point
        // We will expand zero width ranges in the axis
        if (count === 1) {
            const y = yValues.get(0);
            return new NumberRange(y, y);
        }

        const indicesRange = getIndicesRange(
            wasmContext,
            xValues,
            visibleRange,
            xyDataSeries.dataDistributionCalculator.isSortedAscending
        );

        const iMin = Math.max(Math.floor(indicesRange.min + 1), 0);
        const iMax = Math.min(Math.ceil(indicesRange.max - 1), count - 1);
        if (iMax < iMin) {
            return undefined;
        }

        let minMax: DoubleRange;
        
        try {
            minMax = wasmContext.NumberUtil.MinMaxWithIndex(yValues, iMin, iMax - iMin + 1) as DoubleRange;
            if (!isRealNumber(minMax.min) || !isRealNumber(minMax.max)) {
                return undefined;
            }
            return new NumberRange(minMax.min, minMax.max);
        } finally {
            // @ts-ignore
            deleteSafe(minMax);
        }
    };

    sciChartSurface.renderableSeries.add(lineSeries);

    const tooltipDataTemplate: TRolloverTooltipDataTemplate = (si, title, labelX, labelY) => {
        let d = si.formattedXValue.split(" ");
        return ["Date: " + d[0], "Time: " + d[1], "Y: " + si.formattedYValue];
    };
    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new RolloverModifier({ tooltipDataTemplate }),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

// Seconds since midnight. 2 weeks range with nanosecond precsion
export const drawExample2 = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);
    const baseDate = Date.now() / 1000;

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        useNativeText: true,
        dateOffset: baseDate
    });

    xAxis.labelProvider.formatCursorLabel = dataValue => {
        const d = dataValue.toString();
        return (
            formatUnixDateToHumanString(baseDate + dataValue) +
            " " +
            formatUnixDateToHumanStringHHMMSS(baseDate + dataValue) +
            d.substring(d.indexOf("."))
        );
    };

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.1, 0.1),
            labelPrecision: 3,
            labelFormat: ENumericFormat.SignificantFigures,
            autoRange: EAutoRange.Always
        })
    );

    const xValues = [];
    const yValues = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < 1000; i++) {
        x = x + Math.random() * 2500;
        y = y + Math.random() - 0.5;
        xValues.push(x);
        yValues.push(y);
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        isSorted: true,
        containsNaN: false
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 2,
        dataSeries: xyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext)
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    const tooltipDataTemplate: TRolloverTooltipDataTemplate = (si, title, labelX, labelY) => {
        let d = si.formattedXValue.split(" ");
        return ["X: " + si.xValue.toString(), "Date: " + d[0], "Time: " + d[1], "Y: " + si.formattedYValue];
    };
    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new RolloverModifier({ tooltipDataTemplate }),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};
