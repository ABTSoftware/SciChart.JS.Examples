import {
    EAxisAlignment,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ELabelAlignment,
    EllipsePointMarker,
    ENumericFormat,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    TextAnnotation,
    XAxisDragModifier,
    XyDataSeries,
    YAxisDragModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
const ID_Y_AXIS_2 = "yAxis2";
export const drawExample = async (rootElement) => {
    // Create the SciChartSurface with theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Add a primary X,Y Axis pair
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Bottom,
            axisTitle: "Shared X Axis",
            axisTitleStyle: {
                color: appTheme.VividGreen,
                fontSize: 30,
            },
            labelStyle: {
                color: appTheme.VividGreen,
            },
            backgroundColor: appTheme.VividGreen + "22",
            axisBorder: {
                borderTop: 1,
                color: appTheme.VividGreen,
            },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Y Axis Left",
            axisTitleStyle: {
                color: appTheme.VividSkyBlue,
                fontSize: 30,
            },
            labelStyle: {
                color: appTheme.VividSkyBlue,
            },
            growBy: new NumberRange(0.2, 0.2),
            backgroundColor: appTheme.VividSkyBlue + "22",
            axisBorder: {
                borderRight: 1,
                color: appTheme.VividSkyBlue,
            },
        })
    );
    // generate some data
    let data = new RandomWalkGenerator().Seed(7331).getRandomWalkSeries(100);
    // Add the first line series on the primary X,Y axis
    // This occurs be default as FastLineRenderableSeries XAxisId and YAxisId are set to a default value
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 5,
                height: 5,
                fill: appTheme.VividGreen,
                stroke: appTheme.VividGreen,
            }),
        })
    );
    // Add a secondary Y Axis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: ID_Y_AXIS_2,
            axisTitleStyle: {
                color: appTheme.VividOrange,
                fontSize: 30,
            },
            labelStyle: {
                color: appTheme.VividOrange,
                alignment: ELabelAlignment.Right,
            },
            axisAlignment: EAxisAlignment.Right,
            axisTitle: "Y Axis Right",
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            growBy: new NumberRange(0.2, 0.2),
            backgroundColor: appTheme.VividOrange + "22",
            axisBorder: {
                borderLeft: 1,
                color: appTheme.VividOrange,
            },
        })
    );
    // Create some data & series for that axis
    data = new RandomWalkGenerator().Seed(1209).getRandomWalkSeries(100);
    // The second line series we specify X/Y axis ids to bind this to the correct axis
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividOrange,
            strokeThickness: 3,
            dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
            yAxisId: ID_Y_AXIS_2,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 5,
                height: 5,
                fill: appTheme.VividOrange,
                stroke: appTheme.VividOrange,
            }),
        })
    );
    // Optional: Add some interactivity modifiers to enable zooming and panning
    sciChartSurface.chartModifiers.add(
        new YAxisDragModifier(),
        new XAxisDragModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );
    // Add a title over the chart with information
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0,
            y1: 0,
            yCoordShift: 20,
            xCoordShift: 20,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 18,
            opacity: 0.55,
            textColor: appTheme.ForegroundColor,
            text: "SciChart.js supports unlimited X,Y axis. Drag an axis to see the series scale",
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 30,
            y1: 1.1,
            fontSize: 18,
            textColor: appTheme.VividSkyBlue,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            text: "Blue series is bound to the Shared X-Axis, and Left Y-Axis",
        })
    );
    // Note annotations need X,Y Axis ID as well in multi-axis scenarios
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 26,
            y1: -1,
            fontSize: 18,
            textColor: appTheme.VividOrange,
            yAxisId: ID_Y_AXIS_2,
            text: "Orange series is bound to the Shared X-Axis, and Right Y-Axis",
        })
    );
    return { sciChartSurface, wasmContext };
};
