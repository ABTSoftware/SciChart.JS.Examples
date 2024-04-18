import {
    ELegendOrientation,
    ELegendPlacement,
    LegendModifier,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    StackedMountainCollection,
    StackedMountainRenderableSeries, WaveAnimation,
    XyDataSeries, ZoomExtentsModifier, ZoomPanModifier
} from "scichart";
import {appTheme} from "scichart-example-dependencies";
import {xValues, y1Values, y2Values, y3Values, y4Values} from "./data/stackedMountainChartData";

export const divElementId = "chart";

export const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));

    // Create the three Stacked Mountain series
    const stackedMountain1 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values, dataSeriesName: "Apples" }),
        fill: appTheme.VividPurple + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2
    });
    const stackedMountain2 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values, dataSeriesName: "Pears" }),
        fill: appTheme.VividPink + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2
    });
    const stackedMountain3 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y3Values, dataSeriesName: "Oranges" }),
        fill: appTheme.VividSkyBlue + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2
    });
    const stackedMountain4 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y4Values, dataSeriesName: "Oranges" }),
        fill: appTheme.VividOrange + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2
    });

    // Group these StackedMountain series together in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    stackedMountainCollection.add(stackedMountain1, stackedMountain2, stackedMountain3, stackedMountain4);
    stackedMountainCollection.animation = new WaveAnimation({ duration: 600, fadeEffect: true });

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add a legend to the chart to show the series
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: false,
            showSeriesMarkers: true
        })
    );

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, stackedMountainCollection };
};
