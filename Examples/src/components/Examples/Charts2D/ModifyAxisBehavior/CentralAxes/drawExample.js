import { appTheme } from "scichart-example-dependencies";
import {
    CentralAxesLayoutManager,
    EAnimationType,
    EAxisAlignment,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EInnerAxisPlacementCoordinateMode,
    ELineDrawMode,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    PinchZoomModifier,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Optional parameters to control exact placement of the axis
    // These are defaults: which fix the axes in the center of the chart
    // Relative coordinate mode and 0.5 means 'place half way'
    // const options: ICentralAxesLayoutManagerOptions = {
    //     horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
    //     verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
    //     horizontalAxisPosition: 0.5,
    //     verticalAxisPosition: 0.5
    // };
    // These options keep the axes crossing at (0,0), so the axes pan with the chart
    const options = {
        horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
        verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.DataValue,
        horizontalAxisPosition: 0,
        verticalAxisPosition: 0,
    };
    // Control the placement of the axis by specifying CentralAxesLayoutManager
    // and isInnerAxis property
    sciChartSurface.layoutManager = new CentralAxesLayoutManager(options);
    // Configure x,y axis with central layout - oscilloscope style
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-5, 5),
            isInnerAxis: true,
            axisAlignment: EAxisAlignment.Top,
            labelStyle: {
                color: appTheme.PaleSkyBlue,
            },
            axisBorder: {
                borderTop: 1,
                color: appTheme.VividSkyBlue,
            },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-5, 5),
            isInnerAxis: true,
            axisAlignment: EAxisAlignment.Left,
            labelStyle: {
                color: appTheme.PaleSkyBlue,
            },
            axisBorder: {
                borderLeft: 1,
                color: appTheme.VividSkyBlue,
            },
        })
    );
    // Add a line series
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            drawNaNAs: ELineDrawMode.PolyLine,
            dataSeries: getButterflyCurve(wasmContext, 20000),
            isDigitalLine: false,
            stroke: appTheme.VividTeal,
            animation: { type: EAnimationType.Fade, options: { duration: 500 } },
        })
    );
    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "SciChart.js allows axis layout customisation including Central axis",
            fontSize: 16,
            textColor: appTheme.ForegroundColor,
            x1: 0,
            xCoordShift: 10,
            y1: 0,
            yCoordShift: 10,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );
    // Add some interaction modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );
    return { sciChartSurface, wasmContext };
};
function getButterflyCurve(wasmContext, count = 2000) {
    const temp = 0.01;
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < count; i++) {
        const t = i * temp;
        const multiplier = Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5);
        const x = Math.sin(t) * multiplier;
        const y = Math.cos(t) * multiplier;
        dataSeries.append(x, y);
    }
    return dataSeries;
}
