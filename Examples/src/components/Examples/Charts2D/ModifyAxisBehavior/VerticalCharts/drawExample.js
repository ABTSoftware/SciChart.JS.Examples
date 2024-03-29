import {
    EAxisAlignment,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EllipsePointMarker,
    EVerticalAnchorPoint,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    SplineLineRenderableSeries,
    TextAnnotation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
export const drawExample = async (rootElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Setting an XAxis on the Left or Right
    // and YAxis on the Top or Bottom
    // causes the chart and series to be rotated vertically
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis with Alignment = Left",
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.1, 0.1),
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Y Axis with Alignment = Bottom",
            axisAlignment: EAxisAlignment.Bottom,
            growBy: new NumberRange(0.1, 0.1),
        })
    );
    // Generate some data. xValues/yValues are just arrays of numbers
    const generator = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(100);
    const xValues = generator.xValues;
    const yValues = generator.yValues;
    // Add a line series to the chart. This will be drawn vertically.
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 9,
                height: 9,
                fill: appTheme.ForegroundColor,
                stroke: appTheme.VividOrange,
            }),
            strokeThickness: 5,
            stroke: appTheme.VividOrange,
        })
    );
    // Add title / instructions
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0.0,
            yCoordShift: 10,
            y1: 0.5,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 16,
            opacity: 0.77,
            textColor: appTheme.ForegroundColor,
            text: "To rotate a chart in SciChart.js, set XAxis.alignment = Left/Right and YAxis.alignment=Top/Bottom",
        })
    );
    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};
