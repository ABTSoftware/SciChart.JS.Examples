import {
    DateTimeNumericAxis,
    EllipsePointMarker,
    ENumericFormat,
    MouseWheelZoomModifier,
    RolloverModifier,
    RubberBandXyZoomModifier,
    ZoomExtentsModifier,
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
    NumberRangeAnimator,
    DpiHelper,
    BoxAnnotation,
    HitTestInfo,
} from "scichart";

// Unix Timestamps - 300 year data range with 1ms precision
export const drawExample = async (rootElement, isYRangeModeVisible) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        useNativeText: true,
    });
    xAxis.labelProvider.showYearOnWiderDate = true;
    xAxis.labelProvider.formatCursorLabel = (dataValue) => {
        const d = new Date(dataValue * 1000);
        const s = (dataValue * 1000).toString();
        const ds = d.getTime().toString();
        const r = s.replace(ds, "");
        return formatUnixDateToHumanString(dataValue) + " " + formatUnixDateToHumanStringHHMMSS(dataValue) + r;
    };
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(-1.5, 1.5),
        labelPrecision: 3,
        labelFormat: ENumericFormat.SignificantFigures,
        autoRange: EAutoRange.Once,
    });

    yAxis.visibleRangeChanged.subscribe(() => {
        // limit the range to -1.5, 1.5
        yAxis.visibleRange = new NumberRange(-1.5, 1.5);
    });

    sciChartSurface.yAxes.add(yAxis);

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
        containsNaN: false,
    });
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 2,
        dataSeries: xyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext),
        // Use this mode so that the axis ranges sensible when zoomed really far in.
        yRangeMode: isYRangeModeVisible ? EYRangeMode.Visible : EYRangeMode.Drawn,
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    // add an event listener for mousedown
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {
        // Translate the point to the series viewrect before hit-testing
        // Attention!
        // We need to multiply it by DpiHelper.PIXEL_RATIO
        // DpiHelper.PIXEL_RATIO is used for High DPI and Retina screen support and also for the browser scaling
        const mousePointX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const mousePointY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        // const translatedPoint = translateFromCanvasToSeriesViewRect(mousePoint, sciChartSurface.seriesViewRect);
        const HIT_TEST_RADIUS = 10 * DpiHelper.PIXEL_RATIO;

        // call renderableSeries.hitTestProvider.hitTest passing in the mouse point
        const hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(mousePointX, mousePointY, HIT_TEST_RADIUS);

        // animate:
        if (hitTestInfo.isHit) {
            ZoomIn(hitTestInfo.xValue);
        }

        console.log(hitTestInfo);
    });

    /**
     * Zooms in on a specific xValue
     * @param xValue
     */
    function ZoomIn(xValue) {
        const xAxis = sciChartSurface.xAxes.get(0);
        const newRange = new NumberRange(xValue - 10, xValue + 10);

        const newBox = new BoxAnnotation({
            fill: "#FFFFFF33",
            stroke: "#FFFFFFaa",
            strokeThickness: 1,
            x1: xValue - 20000000,
            x2: xValue + 20000000,
            y1: -1.5,
            y2: 1.5,
        });

        sciChartSurface.annotations.add(newBox);

        setTimeout(() => {
            xAxis.animateVisibleRange(newRange, 1500, easing.outSine);
        }, 200);

        setTimeout(() => {
            sciChartSurface.annotations.remove(newBox);
        }, 2000);
    }

    /**
     * Zooms in on a random point on the line series
     */
    function ZoomInRandomly() {
        // simulate a random point on the chart
        const mousePointX = Math.random() * sciChartSurface.seriesViewRect.width + DpiHelper.PIXEL_RATIO;
        const mousePointY = Math.random() * sciChartSurface.seriesViewRect.height + DpiHelper.PIXEL_RATIO;
        // const translatedPoint = translateFromCanvasToSeriesViewRect(mousePoint, sciChartSurface.seriesViewRect);
        const HIT_TEST_RADIUS = 10 * DpiHelper.PIXEL_RATIO;

        // call renderableSeries.hitTestProvider.hitTest passing in the mouse point
        const hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(mousePointX, mousePointY, HIT_TEST_RADIUS);

        // animate:
        if (hitTestInfo.isHit) {
            ZoomIn(hitTestInfo.xValue);
        }
    }

    /**
     * Zooms out on the line series
     */
    function ZoomOut() {
        const xAxis = sciChartSurface.xAxes.get(0);
        const newRange = lineSeries.dataSeries.xRange;
        xAxis.animateVisibleRange(newRange, 1500, easing.inSine);
    }

    const tooltipDataTemplate = (si, title, labelX, labelY) => {
        let d = si.formattedXValue.split(" ");
        return ["Date: " + d[0], "Time: " + d[1], "Y: " + si.formattedYValue];
    };

    // Optional: add zooming modifiers
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new RolloverModifier({ tooltipDataTemplate }),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    // const buildFrom = (xAxis:any) => ({
    //     minX: xAxis.visibleRange.min,
    //     maxX: xAxis.visibleRange.max
    // });
    // const buildTo = (xAxis:any) => ({
    //     minX: xAxis.visibleRange.min - 100000,
    //     maxX: xAxis.visibleRange.max + 100000
    // });
    // const visibleRangeAnimation = new GenericAnimation({
    //     from: buildFrom(xAxis),
    //     to: buildTo(xAxis),
    //     delay: 5000,
    //     duration: 3000,
    //     ease: easing.inSine,
    //     onAnimate: (from, to, progress) => {
    //         const xInterpolate = NumberRangeAnimator.interpolate(new NumberRange(from.minX, from.maxX), new NumberRange(to.minX, to.maxX), progress);
    //         xAxis.visibleRange = new NumberRange(xInterpolate.min, xInterpolate.max);
    //     },
    //     onCompleted: () => {
    //         visibleRangeAnimation.delay = 0;
    //         visibleRangeAnimation.from = visibleRangeAnimation.to;
    //         visibleRangeAnimation.to = buildTo(xAxis);
    //         visibleRangeAnimation.reset();
    //     }
    // });
    // add animation to the chart
    // sciChartSurface.animations.add(visibleRangeAnimation);

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface, controls: { ZoomInRandomly, ZoomOut } };
};

// vertical slice modifier
// Seconds since midnight. 2 weeks range with nanosecond precsion
export const drawExample2 = async (rootElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);
    const baseDate = Date.now() / 1000;

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        useNativeText: true,
        dateOffset: baseDate,
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
        containsNaN: false,
    });

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "#FF6600",
        strokeThickness: 2,
        dataSeries: xyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext),
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    const tooltipDataTemplate = (si, title, labelX, labelY) => {
        let d = si.formattedXValue.split(" ");
        return ["X: " + si.xValue.toString(), "Date: " + d[0], "Time: " + d[1], "Y: " + si.formattedYValue];
    };
    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        // new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new RolloverModifier({ tooltipDataTemplate }),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};
