import {
    DateTimeNumericAxis,
    // EllipsePointMarker,
    ENumericFormat,
    MouseWheelZoomModifier,
    TRolloverTooltipDataTemplate,
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
    HitTestInfo,
    easing,
    DpiHelper,
    formatUnixDateToHumanStringHHMMSS,
    BoxAnnotation,
    GenericAnimation,
    NumberRangeAnimator,
    VerticalSliceModifier,
    ECoordinateMode,
    SeriesInfo,
    RolloverLegendSvgAnnotation
} from "scichart";

// Seconds since midnight. 2 weeks range with nanosecond precsion
export const drawExample = async (rootElement: string | HTMLDivElement) => {
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

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.05, 0.05),
        labelPrecision: 3,
        labelFormat: ENumericFormat.SignificantFigures,
        autoRange: EAutoRange.Always,
    })

    sciChartSurface.yAxes.add(yAxis);

    // build data
    const xValues = [];
    const yValues = [];
    
    const dataPoints = 10000000;
    
    for (let i = 1; i < dataPoints; i++) {
        // Calculate y value using sine function with decaying amplitude
        const y = Math.sin(i/500000);
    
        // Push values to arrays
        xValues.push(i/10);
        yValues.push(y + 0.1 * Math.random());
    }

    // add data to line series
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
        // pointMarker: new EllipsePointMarker(wasmContext),
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    const vSlice1 = new VerticalSliceModifier({
        x1: 10000,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#fff",
        lineSelectionColor: "#888",
        showTooltip: true,
    });

    sciChartSurface.chartModifiers.add(vSlice1);

    // Optional: add zooming, panning for the example
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    sciChartSurface.zoomExtents();

    /**
     * Zooms in on a specific xValue
     * @param xValue
     */
    function ZoomIn(xValue: number, yValue: number): void {
        const xAxis = sciChartSurface.xAxes.get(0) as DateTimeNumericAxis;
        const newRange = new NumberRange(xValue - 1, xValue + 1);

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
        const targetXSize = xAxis.visibleRange.diff / 75;
        const targetYSize = yAxis.visibleRange.diff / 50;
        const zoomBox = new GenericAnimation<NumberRange>({
            from: xAxis.visibleRange,
            to: new NumberRange(xValue - targetXSize, xValue + targetXSize),
            duration: 300,
            ease: easing.outCirc,
            onAnimate: (from, to, progress) => {
                const xRange = NumberRangeAnimator.interpolate(from, to, progress);
                newBox.x1 = xRange.min;
                newBox.x2 = xRange.max;
                const yRange = NumberRangeAnimator.interpolate(
                    new NumberRange(-1.5, 1.5),
                    new NumberRange(yValue - targetYSize, yValue + targetYSize),
                    progress
                );
                newBox.y1 = yRange.min;
                newBox.y2 = yRange.max;
            },
            onCompleted: () => {
                xAxis.animateVisibleRange(newRange, 1000, easing.outCirc, () => {
                    sciChartSurface.annotations.remove(newBox);
                });
                yAxis.animateVisibleRange(lineSeries.getYRange(newRange), 1000, easing.outCirc);
            },
        });
        sciChartSurface.addAnimation(zoomBox);
    }

    /**
     * Zooms in on a random point on the line series
     */
    function ZoomInRandomly(): void {
        // simulate a random point on the chart
        const mousePointX = Math.random() * sciChartSurface.seriesViewRect.width + DpiHelper.PIXEL_RATIO;
        const mousePointY = Math.random() * sciChartSurface.seriesViewRect.height + DpiHelper.PIXEL_RATIO;

        // call renderableSeries.hitTestProvider.hitTest passing in the mouse point
        const hitTestInfo: HitTestInfo = lineSeries.hitTestProvider.hitTestXSlice(mousePointX, mousePointY);

        // animate:
        if (hitTestInfo.isHit) {
            ZoomIn(hitTestInfo.xValue, hitTestInfo.yValue);
        }
    }

    /**
     * Zooms out on the line series
     */
    function ZoomOut(): void {
        const xAxis = sciChartSurface.xAxes.get(0) as DateTimeNumericAxis;
        const newRange = lineSeries.dataSeries.xRange;
        xAxis.animateVisibleRange(newRange, 500, easing.inSine);
    }

    return { wasmContext, sciChartSurface, controls: { ZoomInRandomly, ZoomOut } };
};