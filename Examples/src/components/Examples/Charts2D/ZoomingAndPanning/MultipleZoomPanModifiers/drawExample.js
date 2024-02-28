import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
import {
    easing,
    EHorizontalAnchorPoint,
    EllipsePointMarker,
    ENumericFormat,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    PinchZoomModifier,
    RubberBandXyZoomModifier,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    EExecuteOn,
    TextAnnotation,
    ECoordinateMode,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );
    // Add some data
    const data1 = ExampleDataProvider.getFourierSeriesZoomed(0.6, 0.13, 5.0, 5.15);
    const lineSeries0 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: data1.xValues,
            yValues: data1.yValues,
            dataSeriesName: "First Line Series",
        }),
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 0,
            fill: appTheme.VividSkyBlue,
        }),
    });
    sciChartSurface.renderableSeries.add(lineSeries0);
    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: data2.xValues,
            yValues: data2.yValues,
            dataSeriesName: "Second Line Series",
        }),
        strokeThickness: 3,
        stroke: appTheme.VividOrange,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 0,
            fill: appTheme.VividOrange,
        }),
    });
    sciChartSurface.renderableSeries.add(lineSeries1);
    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 0.11, 5.0, 5.15);
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: data3.xValues,
            yValues: data3.yValues,
            dataSeriesName: "Third Line Series",
        }),
        strokeThickness: 3,
        stroke: appTheme.MutedPink,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 0,
            fill: appTheme.MutedPink,
        }),
    });
    sciChartSurface.renderableSeries.add(lineSeries2);
    // Here is where we add the zoom, pan behaviour
    sciChartSurface.chartModifiers.add(
        // use RubberBandXyZoomModifier with Right Mouse Button
        // use easingFunction to animate zoom
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton, easingFunction: easing.elastic }),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        // use PinchZoomModifier to allow zooming with pinch gesture on touch devices
        new PinchZoomModifier(),
        // Zoom extents on double click
        new ZoomExtentsModifier({ easingFunction: easing.elastic })
    );
    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Zoom Pan Modifiers Demo",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: -50,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.33,
            fontSize: 48,
            fontWeight: "Bold",
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Multiple zoom, pan behaviours enabled on a single chart",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.38,
            fontSize: 28,
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Try mouse-wheel, left/right mouse drag, mousewheel on axis, pinch zoom, double-click to zoom to fit etc...",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: 50,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.45,
            fontSize: 17,
        })
    );
    return { wasmContext, sciChartSurface };
};
