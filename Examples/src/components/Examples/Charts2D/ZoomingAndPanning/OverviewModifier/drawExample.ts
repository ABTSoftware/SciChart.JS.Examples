import {
    EAutoRange,
    ECoordinateMode,
    EExecuteOn,
    EHorizontalAnchorPoint,
    EllipsePointMarker,
    EMultiLineAlignment,
    EVerticalAnchorPoint,
    EWrapTo,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NativeTextAnnotation,
    NumberRange,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartOverview,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";

export const overviewOptions = {
    theme: appTheme.SciChartJsTheme,
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create and add an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(500, 600) }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
        })
    );

    const POINTS = 1000;

    const data0 = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(POINTS);

    // Add a line series to the chart
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: data0.xValues, yValues: data0.yValues }),
            strokeThickness: 3,
            stroke: appTheme.VividSkyBlue,
        })
    );

    const data1 = new RandomWalkGenerator().Seed(42069).getRandomWalkSeries(POINTS);

    // Add a scatter series to the chart
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues }),
            pointMarker: new EllipsePointMarker(wasmContext, { fill: appTheme.VividPink, strokeThickness: 0 }),
            strokeThickness: 3,
        })
    );

    // Add an annotation with instructions over the chart
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 0.02,
            y1: 0.02,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            fontSize: 18,
            opacity: 0.55,
            textColor: appTheme.ForegroundColor,
            text: "SciChart.js supports an Overview scrollbar. Zoom the main chart or drag the overview to see it update",
            wrapTo: EWrapTo.ViewRect,
            multiLineAlignment: EMultiLineAlignment.Left,
        })
    );

    // This is the primary approach o. This will automatically bind to the parent surface
    // displaying its series. Zooming the chart will zoom the overview and vice versa
    // const overview = await SciChartOverview.create(sciChartSurface, divOverviewId, {
    //     theme: appTheme.SciChartJsTheme,
    // });

    // Optional: add some zoom pan interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } })
    );
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface };
};

export const drawOverview = async (sciChartSurface: SciChartSurface, divOverviewId: string | HTMLDivElement) => {
    const overview = await SciChartOverview.create(sciChartSurface, divOverviewId, overviewOptions);

    return {sciChartSurface: overview.overviewSciChartSurface};
};
