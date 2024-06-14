import {
    AUTO_COLOR,
    BaseDataSeries,
    ELegendOrientation,
    ELegendPlacement,
    LegendModifier,
    makeIncArray,
    MouseWheelZoomModifier,
    NumericAxis,
    ScaleAnimation,
    SciChartSurface,
    StackedMountainCollection,
    SmoothStackedMountainRenderableSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    WaveAnimation,
    SweepAnimation,
} from "scichart";
import { appTheme } from "../../../theme";

export const divElementId = "chart";

export const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));

    // Group these StackedMountain series together in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);

    const xValues = makeIncArray(20);
    const strokes = [
        "#274b92ff",
        "#3784bcff",
        "#47bce5ff",
        "#7a7eb9ff",
        "#ae418cff",
        "#cb5878ff",
        "#e86f64ff",
        "#a89588ff",
        "#68bbadff",
        "#6585a2ff",
    ];
    for (let i = 0; i < 10; i++) {
        const yValues = xValues.map((x) => Math.random() * 10);

        // Create the three Stacked Mountain series
        const stackedMountain = new SmoothStackedMountainRenderableSeries(wasmContext, {
            id: i.toString(),
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            fill: AUTO_COLOR,
            stroke: AUTO_COLOR,
            strokeThickness: 2,
            animation: new ScaleAnimation({ duration: 500, delay: i * 200 }),
        });
        stackedMountainCollection.add(stackedMountain);
    }

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    const legendModifier = new LegendModifier({
        placement: ELegendPlacement.TopLeft,
        orientation: ELegendOrientation.Vertical,
        showLegend: true,
        showCheckboxes: true,
        showSeriesMarkers: true,
    });
    // Add a legend to the chart to show the series
    sciChartSurface.chartModifiers.add(legendModifier);

    stackedMountainCollection.asArray().forEach((series) =>
        series.isVisibleChanged.subscribe((data) => {
            if (data.isVisible) {
                stackedMountainCollection.setAccumulatedValuesDirty();
                stackedMountainCollection.updateAccumulatedVectors();
                sciChartSurface.zoomExtents();
                data.sourceSeries.runAnimation(
                    new ScaleAnimation({
                        duration: 500,
                        onCompleted: () => {
                            legendModifier.sciChartLegend.invalidateLegend();
                        },
                    })
                );
            } else {
                // @ts-ignore
                data.sourceSeries.isVisibleProperty = true;
                data.sourceSeries.runAnimation(
                    new ScaleAnimation({
                        duration: 500,
                        reverse: true,
                        onCompleted: () => {
                            (data.sourceSeries.dataSeries as BaseDataSeries).revertAnimationVectors();
                            // @ts-ignore
                            data.sourceSeries.isVisibleProperty = false;
                            legendModifier.sciChartLegend.invalidateLegend();
                            //sciChartSurface.zoomExtents();
                        },
                    })
                );
            }
        })
    );

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, stackedMountainCollection };
};
