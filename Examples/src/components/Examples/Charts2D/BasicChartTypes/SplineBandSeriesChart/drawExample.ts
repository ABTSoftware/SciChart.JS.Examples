import {
    EAxisAlignment,
    EDragMode,
    ELegendOrientation,
    EllipsePointMarker,
    FadeAnimation,
    LegendModifier,
    MouseWheelZoomModifier,
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
        new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(-1.5, 1) })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Right,
            id: "y2",
            visibleRange: new NumberRange(-0.5, 2),
        })
    );

    // The spline bandseries requires a special dataseries type called XyyDataSeries
    // This stores X, Y1, Y2 point data for the two lines in the band
    const yData = ExampleDataProvider.getDampedSinewave(0, 1.0, 0, 0.005, 1000, 13);
    const y1Data = ExampleDataProvider.getDampedSinewave(0, 1.0, 0, 0.005, 1000, 12);

    const xValues: number[] = [];
    const yValues: number[] = [];
    const y1Values: number[] = [];

    for (let i = 0; i < 10; i++) {
        const index = i * 100;
        xValues.push(yData.xValues[index]);
        yValues.push(yData.yValues[index]);
        y1Values.push(y1Data.yValues[index]);
    }

    // Create the band series and add to the chart
    const rendSeries = new SplineBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values, dataSeriesName: "Cubic Spline" }),
        strokeThickness: 3,
        fill: appTheme.VividOrange + "33",
        fillY1: appTheme.VividSkyBlue + "33",
        stroke: appTheme.VividOrange,
        strokeY1: appTheme.VividSkyBlue,
        interpolationPoints: 20, // Choose the number of points to interpolate for smoothing
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
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
            dataSeriesName: "Range Restricted bezier",
        }),
        stroke: appTheme.VividPurple,
        strokeY1: appTheme.VividRed,
        fill: appTheme.VividPurple + "33",
        fillY1: appTheme.VividRed + "33",
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            fill: appTheme.PaleSkyBlue,
            stroke: appTheme.VividSkyBlue,
        }),
        yAxisId: "y2",
        strokeThickness: 3,
        interpolationPoints: 20, // Choose the number of points to interpolate for smoothing
        animation: new ScaleAnimation({ duration: 800, zeroLine: 0, fadeEffect: true }),
    });
    bezierSeries.renderDataTransform = new XyyBezierRenderDataTransform(
        bezierSeries,
        wasmContext,
        [bezierSeries.drawingProviders[0]],
        { interpolationPoints: 20, curvature: 0.3 }
    );
    sciChartSurface.renderableSeries.add(bezierSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new YAxisDragModifier({ dragMode: EDragMode.Panning }),
        new MouseWheelZoomModifier(),
        new LegendModifier({ orientation: ELegendOrientation.Vertical, showCheckboxes: true })
    );

    return { wasmContext, sciChartSurface };
};
