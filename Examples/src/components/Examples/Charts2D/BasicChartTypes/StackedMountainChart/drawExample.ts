import {
    ELegendOrientation,
    ELegendPlacement,
    LegendModifier,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    StackedMountainCollection,
    StackedMountainRenderableSeries,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { xValues, y1Values, y2Values, y3Values, y4Values } from "./data/stackedMountainChartData";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));

    // A collection stacks its series in insertion order.
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    for (const { yValues, dataSeriesName, fill } of [
        { yValues: y1Values, dataSeriesName: "Apples", fill: appTheme.VividPurple },
        { yValues: y2Values, dataSeriesName: "Pears", fill: appTheme.VividPink },
        { yValues: y3Values, dataSeriesName: "Bananas", fill: appTheme.VividSkyBlue },
        { yValues: y4Values, dataSeriesName: "Oranges", fill: appTheme.VividOrange },
    ]) {
        stackedMountainCollection.add(
            new StackedMountainRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName }),
                fill: fill + "AA",
                stroke: appTheme.PaleSkyBlue,
                strokeThickness: 2,
            })
        );
    }
    stackedMountainCollection.animation = new WaveAnimation({ duration: 600, fadeEffect: true });

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

    // Add a legend to the chart to show the series
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: false,
            showSeriesMarkers: true,
        })
    );

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, stackedMountainCollection };
};
