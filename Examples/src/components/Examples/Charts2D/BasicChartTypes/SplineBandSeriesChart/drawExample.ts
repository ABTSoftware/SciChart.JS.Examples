import {
    AxisMarkerAnnotation,
    EAxisAlignment,
    ECoordinateMode,
    EDragMode,
    EHorizontalAnchorPoint,
    ELegendOrientation,
    ELegendPlacement,
    EllipsePointMarker,
    FadeAnimation,
    LegendModifier,
    MouseWheelZoomModifier,
    NativeTextAnnotation,
    NumberRange,
    NumericAxis,
    ScaleAnimation,
    SciChartSurface,
    SplineBandRenderableSeries,
    XyyDataSeries,
    YAxisDragModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { XyyBezierRenderDataTransform } from "scichart/Charting/Visuals/RenderableSeries/RenderDataTransforms/BezierRenderDataTransform";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { appTheme } from "../../../theme";
import { xValues } from "../StackedMountainChart/data/stackedMountainChartData";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-1.75, 0.75),
            backgroundColor: appTheme.VividSkyBlue + "33",
            labelStyle: { color: appTheme.VividOrange },
            majorTickLineStyle: { color: appTheme.VividOrange },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Right,
            id: "y2",
            visibleRange: new NumberRange(-0.9, 1.6),
            backgroundColor: appTheme.VividPurple + "33",
            labelStyle: { color: appTheme.VividRed },
            majorTickLineStyle: { color: appTheme.VividRed },
        })
    );

    // The spline bandseries requires a special dataseries type called XyyDataSeries
    // This stores X, Y1, Y2 point data for the two lines in the band
    const yData = ExampleDataProvider.getDampedSinewave(0, 0.9, 0, 0.002, 1000, 17);
    const y1Data = ExampleDataProvider.getDampedSinewave(0, 0.9, 0, 0.002, 1000, 16);

    const xValues: number[] = [];
    const yValues: number[] = [];
    const y1Values: number[] = [];

    for (let i = 0; i < 20; i++) {
        const index = i * 50;
        xValues.push(yData.xValues[index]);
        yValues.push(yData.yValues[index]);
        y1Values.push(y1Data.yValues[index]);
    }

    // Create the band series and add to the chart
    const rendSeries = new SplineBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values, dataSeriesName: "Default Spline" }),
        strokeThickness: 3,
        fill: appTheme.VividOrange + "33",
        fillY1: appTheme.VividSkyBlue + "33",
        stroke: appTheme.VividOrange,
        strokeY1: appTheme.VividSkyBlue,
        interpolationPoints: 20, // Choose the number of points to interpolate for smoothing
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: appTheme.PaleSkyBlue,
            stroke: appTheme.VividSkyBlue,
        }),
        animation: new ScaleAnimation({ duration: 800, zeroLine: 0, fadeEffect: true }),
    });

    sciChartSurface.renderableSeries.add(rendSeries);

    const bezierSeries = new SplineBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues,
            yValues,
            y1Values,
            dataSeriesName: "XyyBezier (Range Restricted)",
        }),
        stroke: appTheme.VividPurple,
        strokeY1: appTheme.VividRed,
        fill: appTheme.VividPurple + "33",
        fillY1: appTheme.VividRed + "33",
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: appTheme.PaleSkyBlue,
            stroke: appTheme.VividSkyBlue,
        }),
        yAxisId: "y2",
        strokeThickness: 3,
        interpolationPoints: 20, // Choose the number of points to interpolate for smoothing
        animation: new ScaleAnimation({ duration: 800, zeroLine: 0, fadeEffect: true }),
    });
    const bezierTransform = new XyyBezierRenderDataTransform(
        bezierSeries,
        wasmContext,
        [bezierSeries.drawingProviders[0]],
        { interpolationPoints: 20, curvature: 0.5 }
    );
    bezierSeries.renderDataTransform = bezierTransform;
    sciChartSurface.renderableSeries.add(bezierSeries);

    const curvatureAnnotation = new AxisMarkerAnnotation({
        yCoordinateMode: ECoordinateMode.Relative,
        y1: 0.5,
        yAxisId: "y2",
        formattedValue: "Bezier Curvature 0.5",
        backgroundColor: appTheme.VividPurple,
        isEditable: true,
        onDrag: (args) => {
            bezierTransform.curvature = curvatureAnnotation.y1;
            curvatureAnnotation.formattedValue = "Bezier Curvature " + curvatureAnnotation.y1.toFixed(2);
        },
    });
    sciChartSurface.annotations.add(curvatureAnnotation);

    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            x1: 0.9,
            y1: 0.9,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            text: "Drag the left or right y axis to overlay and compare the series",
            fontSize: 16,
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new YAxisDragModifier({ dragMode: EDragMode.Panning }),
        new MouseWheelZoomModifier(),
        new LegendModifier({
            orientation: ELegendOrientation.Vertical,
            placement: ELegendPlacement.TopRight,
            showCheckboxes: true,
        })
    );

    return { wasmContext, sciChartSurface };
};
