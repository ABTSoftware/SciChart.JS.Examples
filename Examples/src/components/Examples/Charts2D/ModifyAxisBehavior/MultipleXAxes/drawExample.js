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
const titleStyle1 = {
    color: appTheme.VividSkyBlue,
    fontSize: 30,
};
const labelStyle1 = {
    color: appTheme.VividSkyBlue,
};
const titleStyle2 = {
    color: appTheme.VividOrange,
    fontSize: 30,
};
const labelStyle2 = {
    color: appTheme.VividOrange,
    alignment: ELabelAlignment.Right,
};
const ID_X_AXIS_2 = "xAxis2";
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
            axisTitle: "X Axis Bottom",
            axisTitleStyle: titleStyle1,
            labelStyle: labelStyle1,
            backgroundColor: appTheme.VividSkyBlue + "22",
            axisBorder: {
                borderTop: 1,
                color: appTheme.VividSkyBlue,
            },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Y Axis Left",
            axisTitleStyle: titleStyle1,
            labelStyle: labelStyle1,
            growBy: new NumberRange(0.1, 0.1),
            backgroundColor: appTheme.VividSkyBlue + "22",
            axisBorder: {
                borderRight: 1,
                color: appTheme.VividSkyBlue,
            },
        })
    );
    // Add a secondary X,Y Axis pair
    // Series are tied to the axis via the ID_
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            id: ID_X_AXIS_2,
            axisTitleStyle: titleStyle2,
            labelStyle: labelStyle2,
            axisAlignment: EAxisAlignment.Top,
            axisTitle: "X Axis Top",
            backgroundColor: appTheme.VividOrange + "22",
            axisBorder: {
                borderBottom: 1,
                color: appTheme.VividOrange,
            },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: ID_Y_AXIS_2,
            axisTitleStyle: titleStyle2,
            labelStyle: labelStyle2,
            axisAlignment: EAxisAlignment.Right,
            axisTitle: "Y Axis Right",
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            growBy: new NumberRange(0.1, 0.1),
            backgroundColor: appTheme.VividOrange + "22",
            axisBorder: {
                borderLeft: 1,
                color: appTheme.VividOrange,
            },
        })
    );
    // generate some data
    let data = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(100);
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
                fill: appTheme.VividSkyBlue,
                stroke: appTheme.VividSkyBlue,
            }),
        })
    );
    data = new RandomWalkGenerator().Seed(90210).getRandomWalkSeries(100);
    // The second line series we specify X/Y axis ids to bind this to the correct axis
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividOrange,
            strokeThickness: 3,
            dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
            xAxisId: ID_X_AXIS_2,
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
            x1: 47,
            y1: -3.5,
            fontSize: 18,
            textColor: appTheme.VividSkyBlue,
            text: "Blue series is bound to the Left, Bottom axis",
        })
    );
    // Note annotations need X,Y Axis Id as well in multi-axis scenarios
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 74,
            y1: 4.4,
            fontSize: 18,
            textColor: appTheme.VividOrange,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            yAxisId: ID_Y_AXIS_2,
            xAxisId: ID_X_AXIS_2,
            text: "Orange series is bound to the Top, Right axis",
        })
    );
    return { sciChartSurface, wasmContext };
};
