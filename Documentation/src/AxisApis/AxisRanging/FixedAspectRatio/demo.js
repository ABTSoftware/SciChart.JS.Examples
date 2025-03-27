async function fixedAspectRatio(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        TextAnnotation,
        ZoomPanModifier,
        MouseWheelZoomModifier,
        NumberRange,
        XAxisDragModifier,
        YAxisDragModifier,
        ZoomExtentsModifier,
        RubberBandXyZoomModifier,
        XyScatterRenderableSeries,
        XyDataSeries,
        XPointMarker,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart with X,Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    const xAxis = new NumericAxis(wasmContext, {
        majorGridLineStyle: { color: "white" },
    });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        majorGridLineStyle: { color: "white" },
    });
    sciChartSurface.yAxes.add(yAxis);

    const { width, height } = sciChartSurface.renderSurface.viewportSize;
    // force the ratio of the visibleRanges to be constant even when one is changed
    const ratio = height / width;
    xAxis.visibleRange = new NumberRange(-10, 10);
    yAxis.visibleRange = new NumberRange(-10 * ratio, 10 * ratio);

    // subscribe to visibleRangeChanged on each Axis
    // avoid infinte loop due to floating point problems
    const epsilon = 1e-10;
    xAxis.visibleRangeChanged.subscribe((data) => {
        const yRange = yAxis.visibleRange;
        if (Math.abs(yRange.diff / data.visibleRange.diff - ratio) > epsilon) {
            const newYDiff = ratio * data.visibleRange.diff;
            const halfDiff = (newYDiff - yRange.diff) / 2;
            yAxis.visibleRange = new NumberRange(yRange.min - halfDiff, yRange.max + halfDiff);
        }
    });
    yAxis.visibleRangeChanged.subscribe((data) => {
        const xRange = xAxis.visibleRange;
        if (Math.abs(data.visibleRange.diff / xRange.diff - ratio) > epsilon) {
            const newXDiff = data.visibleRange.diff / ratio;
            const halfDiff = (newXDiff - xRange.diff) / 2;
            xAxis.visibleRange = new NumberRange(xRange.min - halfDiff, xRange.max + halfDiff);
        }
    });
    // #endregion

    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new XPointMarker(wasmContext, {
                stroke: "red",
                width: 10,
                height: 10,
            }),
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [-2, 0, 2, -2, 0, 2, -2, 0, 2],
                yValues: [-2, -2, -2, 0, 0, 0, 2, 2, 2],
            }),
        })
    );

    // add pan and zoom behaviour
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new XAxisDragModifier(),
        new YAxisDragModifier()
    );
}

fixedAspectRatio("scichart-root");
