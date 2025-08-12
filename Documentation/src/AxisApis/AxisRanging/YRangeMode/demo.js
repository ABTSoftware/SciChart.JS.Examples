import * as SciChart from "scichart";

async function yRangeMode(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
        ZoomPanModifier,
        MouseWheelZoomModifier,
        NumberRange,
        ZoomExtentsModifier,
        FastLineRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        EYRangeMode,
        EAutoRange,
        NativeTextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart with X,Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

    const yAxis1 = new NumericAxis(wasmContext, { id: "y1", isVisible: false });
    const yAxis2 = new NumericAxis(wasmContext, {
        id: "y2",
        stackedAxisLength: "30%",
        autoRange: EAutoRange.Always
    });
    const yAxis3 = new NumericAxis(wasmContext, { id: "y3", isVisible: false });
    const yAxis4 = new NumericAxis(wasmContext, {
        id: "y4",
        stackedAxisLength: "30%",
        autoRange: EAutoRange.Always
    });
    const yAxis5 = new NumericAxis(wasmContext, { id: "y5", isVisible: false });

    sciChartSurface.yAxes.add(yAxis1, yAxis2, yAxis3, yAxis4, yAxis5);

    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const dataSeries = new XyDataSeries(wasmContext, { containsNaN: true });
    for (let x = 0; x < 20; x++) {
        let y = Math.sin(x);
        dataSeries.append(x, y + 20);
    }
    dataSeries.append(20, 1000);

    const lineSeriesDrawn = new FastLineRenderableSeries(wasmContext, {
        yAxisId: "y2",
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext),
        stroke: "red",
        yRangeMode: EYRangeMode.Drawn
    });
    sciChartSurface.renderableSeries.add(lineSeriesDrawn);

    const lineSeriesVisible = new FastLineRenderableSeries(wasmContext, {
        yAxisId: "y4",
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext),
        stroke: "green",
        yRangeMode: EYRangeMode.Visible
    });
    sciChartSurface.renderableSeries.add(lineSeriesVisible);

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            yAxisId: "y1",
            x1: 0.1,
            y1: 0.1,
            text: "Click to set outlying point just outside visible range",
            onClick: args => (xAxis.visibleRange = new NumberRange(0, 19.5))
        })
    );

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            yAxisId: "y1",
            x1: 0.1,
            y1: 0.5,
            text: "Click to show yRangeMode.Visible issue when zoomed in",
            onClick: args => (xAxis.visibleRange = new NumberRange(5.1, 9.9))
        })
    );

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            yAxisId: "y3",
            x1: 0.1,
            y1: 0.5,
            text: "ClipToYRange is Off.  Click to toggle.",
            onClick: args => {
                lineSeriesVisible.clipToYRange = !lineSeriesVisible.clipToYRange;
                args.sender.text = `ClipToYRange is ${
                    lineSeriesVisible.clipToYRange ? "On" : "Off"
                }.  Click to toggle.`;
            }
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
}

yRangeMode("scichart-root");
