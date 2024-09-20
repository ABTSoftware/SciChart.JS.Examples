import {
    DateTimeNumericAxis,
    EllipsePointMarker,
    ENumericFormat,
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
    formatUnixDateToHumanStringHHMMSS,
    EYRangeMode,
    easing,
    DpiHelper,
    BoxAnnotation,
    HitTestInfo,
    GenericAnimation,
    NumberRangeAnimator,
    ChartModifierBase2D,
    ModifierMouseArgs,
    IChartModifierBaseOptions,
    NativeTextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EWrapTo,
    VerticalSliceModifier,
    ETradeChartLabelFormat,
    formatUnixDateToHumanStringDDMM,
} from "scichart";
import { appTheme } from "../../../theme";

/**
 * Zooms in on a specific xValue
 * @param xValue
 */
function ZoomIn(
    sciChartSurface: SciChartSurface,
    xValue: number,
    yValue: number,
    range: number,
    nextRange?: number
): void {
    const xAxis = sciChartSurface.xAxes.get(0) as DateTimeNumericAxis;
    const yAxis = sciChartSurface.yAxes.get(0);
    const lineSeries = sciChartSurface.renderableSeries.get(0);
    const newRange = new NumberRange(xValue - range, xValue + range);

    const newBox = new BoxAnnotation({
        fill: "#FFFFFF33",
        stroke: "#FFFFFFaa",
        strokeThickness: 1,
        x1: xAxis.visibleRange.min,
        x2: xAxis.visibleRange.max,
        y1: -1.5,
        y2: 1.5,
    });

    sciChartSurface.annotations.add(newBox);
    const targetXSize = xAxis.visibleRange.diff / 150;
    const targetYSize = yAxis.visibleRange.diff / 30;
    const zoomTime = 750;
    const zoomBox = new GenericAnimation<NumberRange>({
        from: xAxis.visibleRange,
        to: new NumberRange(xValue - targetXSize, xValue + targetXSize),
        duration: 350,
        ease: easing.outCirc,
        onAnimate: (from, to, progress) => {
            const xRange = NumberRangeAnimator.interpolate(from, to, progress);
            newBox.x1 = xRange.min;
            newBox.x2 = xRange.max;
            const yRange = NumberRangeAnimator.interpolate(
                yAxis.visibleRange,
                new NumberRange(yValue - targetYSize, yValue + targetYSize),
                progress
            );
            newBox.y1 = yRange.min;
            newBox.y2 = yRange.max;
        },
        onCompleted: () => {
            xAxis.animateVisibleRange(newRange, zoomTime, easing.outCirc, () => {
                sciChartSurface.annotations.remove(newBox);
                if (nextRange) {
                    setTimeout(() => ZoomIn(sciChartSurface, xValue, yValue, nextRange), 500);
                }
            });
            yAxis.animateVisibleRange(lineSeries.getYRange(newRange, false), zoomTime, easing.outCirc);
        },
    });
    sciChartSurface.addAnimation(zoomBox);
}

/**
 * Zooms out on the line series
 */
function ZoomOut(sciChartSurface: SciChartSurface): void {
    sciChartSurface.zoomExtents(500, easing.inSine);
}

/**
 * Zooms in on a random point on the line series
 */
function ZoomInRandomly(sciChartSurface: SciChartSurface, firstRange: number, secondRange: number): void {
    // simulate a random point on the chart
    const mousePointX = Math.random() * sciChartSurface.seriesViewRect.width + DpiHelper.PIXEL_RATIO;
    const mousePointY = Math.random() * sciChartSurface.seriesViewRect.height + DpiHelper.PIXEL_RATIO;

    // call renderableSeries.hitTestProvider.hitTest passing in the mouse point
    const hitTestInfo: HitTestInfo = sciChartSurface.renderableSeries
        .get(0)
        .hitTestProvider.hitTestXSlice(mousePointX, mousePointY);

    // animate:
    if (hitTestInfo.isHit) {
        ZoomIn(sciChartSurface, hitTestInfo.xValue, hitTestInfo.yValue, firstRange, secondRange);
    }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

// Unix Timestamps - 300 year data range with 1ms precision
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        useNativeText: true,
    });
    (xAxis.labelProvider as SmartDateLabelProvider).showYearOnWiderDate = true;
    xAxis.labelProvider.formatCursorLabel = (dataValue) => {
        const d = dataValue.toString();
        const s = d.substring(d.indexOf("."));
        return formatUnixDateToHumanString(dataValue) + " " + formatUnixDateToHumanStringHHMMSS(dataValue) + s;
    };
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1),
        labelPrecision: 3,
        labelFormat: ENumericFormat.SignificantFigures,
        autoRange: EAutoRange.Always,
        useNativeText: true,
    });

    sciChartSurface.yAxes.add(yAxis);

    // Create some data with clusters of points
    const base = 0;
    const xValues = [];
    const yValues = [];
    let x = base;
    const majorPointGap = 1000000000;
    for (let i = 0; i < 1000; i++) {
        x = x + majorPointGap;
        for (let j = 0; j < 10; j++) {
            x = x + Math.random() / (j + 1);
            let y = 0.5 * Math.sin(i * 0.1) - Math.cos(i * 0.03) * (2 - i / 500) + Math.random() / 10;
            xValues.push(x);
            yValues.push(y);
        }
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        isSorted: true,
        containsNaN: false,
    });
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividOrange,
        strokeThickness: 2,
        dataSeries: xyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, { fill: appTheme.MutedBlue }),
        // Use this mode so that the axis ranges sensible when zoomed really far in.
        yRangeMode: EYRangeMode.Visible,
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            x1: 0.5,
            y1: 0.1,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            fontSize: 24,
            opacity: 0.5,
            text: "Unix Timestamps - 300 years range with millisecond precision",
            wrapTo: EWrapTo.ViewRect,
        })
    );

    const tooltipDataTemplate: TRolloverTooltipDataTemplate = (si, title, labelX, labelY) => {
        let d = si.formattedXValue.split(" ");
        return ["Date: " + d[0], "Time: " + d[1], "X: " + si.xValue.toString(), "Y: " + si.yValue.toString()];
    };

    // Optional: add zooming modifiers
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new RolloverModifier({ tooltipDataTemplate }),
        new VerticalSliceModifier({
            tooltipDataTemplate,
            x1: 0.2,
            xCoordinateMode: ECoordinateMode.Relative,
            isDraggable: true,
        }),
        new ZoomPanModifier(),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    sciChartSurface.zoomExtents();
    return {
        wasmContext,
        sciChartSurface,
        controls: {
            ZoomInRandomly: () => ZoomInRandomly(sciChartSurface, majorPointGap * 3, 10),
            ZoomOut: () => ZoomOut(sciChartSurface),
        },
    };
};

class MicroSecondSmartLabelProvider extends SmartDateLabelProvider {
    public formatDateWide(labelRange: string, value: number): string {
        if (labelRange === ETradeChartLabelFormat.MilliSeconds) {
            let date = formatUnixDateToHumanStringDDMM(value);
            date = date + "\n" + formatUnixDateToHumanStringHHMMSS(value);
            return date;
        } else {
            return super.formatDateWide(labelRange, value);
        }
    }

    public formatDatePrecise(labelRange: string, value: number): string {
        if (labelRange === ETradeChartLabelFormat.MilliSeconds) {
            const seconds = value.toString();
            const sstring = seconds.substring(seconds.indexOf(".") - 2);
            const sVal = Number.parseFloat(sstring);
            console.log(value, sstring, sVal);
            return sVal.toPrecision(7);
        } else {
            return super.formatDatePrecise(labelRange, value);
        }
    }

    public formatSmartLabel(
        labelRange: string,
        value: number,
        prevValue: number,
        prevPrevValue: number,
        originalValue: number
    ): string {
        console.log(labelRange);
        const wideDate = this.formatDateWide(labelRange, value);
        if (labelRange === ETradeChartLabelFormat.MilliSeconds) {
            const newDate = prevValue === undefined || wideDate !== this.formatDateWide(labelRange, prevValue);
            if (newDate) {
                return wideDate;
            } else {
                return this.formatDatePrecise(labelRange, originalValue) + "s";
            }
        } else {
            let label = super.formatSmartLabel(labelRange, value, prevValue, prevPrevValue, originalValue);
            if (labelRange === ETradeChartLabelFormat.Seconds || labelRange === ETradeChartLabelFormat.MilliSeconds) {
                label += "s";
            }
            return label;
        }
    }
}

// Seconds since midnight. 2 weeks range with nanosecond precsion
export const drawExample2 = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const baseDate = new Date(2024, 0, 1).getTime() / 1000;

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        useNativeText: true,
        //dateOffset: baseDate
        labelProvider: new MicroSecondSmartLabelProvider({ dateOffset: baseDate }),
    });

    xAxis.labelProvider.formatCursorLabel = (dataValue) => {
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
            autoRange: EAutoRange.Always,
            useNativeText: true,
        })
    );

    const xValues = [];
    const yValues = [];
    let x = 0;
    const majorPointGap = 4000;
    for (let i = 0; i < 300; i++) {
        x = x + majorPointGap;
        for (let j = 0; j < 3; j++) {
            x = x + Math.random() * 100;
            for (let k = 0; k < 8; k++) {
                x = x + Math.random() / 10000;
                const l = i * 3 + j;
                let y = 0.5 * Math.sin(l * 0.02) - (Math.cos(l * 0.1) * l) / 500 + Math.random() / 10;
                xValues.push(x);
                yValues.push(y);
            }
        }
    }

    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        isSorted: true,
        containsNaN: false,
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 2,
        dataSeries: xyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext),
        yRangeMode: EYRangeMode.Visible,
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            x1: 0.5,
            y1: 0.1,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            fontSize: 24,
            opacity: 0.5,
            text: "Using dateOffset - 2 weeks range with nanosecond precision",
            wrapTo: EWrapTo.ViewRect,
        })
    );

    const tooltipDataTemplate: TRolloverTooltipDataTemplate = (si, title, labelX, labelY) => {
        // si.formattedXValue is xValue + dateOffset
        let d = si.formattedXValue.split(" ");
        return ["Date: " + d[0], "Time: " + d[1], "X: " + si.xValue.toString(), "Y: " + si.yValue.toString()];
    };

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new RolloverModifier({ tooltipDataTemplate }),
        new VerticalSliceModifier({
            tooltipDataTemplate,
            x1: 0.2,
            xCoordinateMode: ECoordinateMode.Relative,
            isDraggable: true,
        }),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    sciChartSurface.zoomExtents();
    return {
        wasmContext,
        sciChartSurface,
        controls: {
            ZoomInRandomly: () => ZoomInRandomly(sciChartSurface, majorPointGap, 0.0003),
            ZoomOut: () => ZoomOut(sciChartSurface),
        },
    };
};
