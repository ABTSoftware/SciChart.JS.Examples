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

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
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
        const stackedMountain = new SmoothStackedMountainRenderableSeries(wasmContext, {
            id: i.toString(),
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            fill: AUTO_COLOR,
            stroke: AUTO_COLOR,
            strokeThickness: 2,
            // From 3.4 Animations can be added to individual stacked series
            animation: new ScaleAnimation({ duration: 500, delay: i * 200 }),
        });
        stackedMountainCollection.add(stackedMountain);
    }

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

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
                // If you want to zoom to the new range when making a series visible, you need to force a recalculation of the Accumulated values first
                //stackedMountainCollection.setAccumulatedValuesDirty();
                //stackedMountainCollection.updateAccumulatedVectors();
                //sciChartSurface.zoomExtents();
                data.sourceSeries.runAnimation(
                    new ScaleAnimation({
                        duration: 500,
                    })
                );
            } else {
                // To animate out, we have to trick the series into remaining visible while the animation runs.
                // We set the backing value of isVisible to true, and only set it false when the animation completes
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
                            // Force the legend to update
                            legendModifier.sciChartLegend.invalidateLegend();
                            //sciChartSurface.zoomExtents();
                        },
                    })
                );
            }
        })
    );

    sciChartSurface.zoomExtents();

    const toggleHundredPercentMode = (value: boolean) => {
        stackedMountainCollection.isOneHundredPercent = value;
        sciChartSurface.zoomExtents(200);
    };

    return { sciChartSurface, controls: { toggleHundredPercentMode } };
};
