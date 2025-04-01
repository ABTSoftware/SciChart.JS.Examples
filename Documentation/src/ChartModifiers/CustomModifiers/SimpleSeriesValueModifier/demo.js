import * as SciChart from "scichart";

// #region ExampleA
const { CustomChartModifier2D, AxisMarkerAnnotation } = SciChart;

// Example of a Custom ChartModifier to display Axis Marker annotations on the Y-Axis
// showing the latest value of each series
class SimpleSeriesValueModifier extends CustomChartModifier2D {
    constructor() {
        super();
        this.annotationsBySeries = new Map();
    }

    // override onParentSurfaceRendered from the base class. Called when the chart redraws
    onParentSurfaceRendered() {
        super.onParentSurfaceRendered();

        // Manage annotation lifecycle
        if (this.parentSurface.renderableSeries.size() !== this.annotationsBySeries.size) {
            this.resetAllMarkers();
            this.createMarkers();
        }

        // Update annotation placement
        this.annotationsBySeries.forEach((series, annotation) => {
            const count = series.dataSeries.count();
            if (count === 0) {
                annotation.isVisible = false;
                return;
            }
            const lastYValue = series.dataSeries.getNativeYValues().get(count - 1);
            annotation.y1 = lastYValue;
            annotation.isVisible = true;
        });
    }

    // override onDetach resetting the state
    onDetach() {
        super.onDetach();
        this.resetAllMarkers();
    }

    resetAllMarkers() {
        this.annotationsBySeries.forEach((series, annotation) => {
            this.parentSurface.annotations.remove(annotation);
            annotation.delete();
        });
        this.annotationsBySeries.clear();
    }

    createMarkers() {
        this.parentSurface.renderableSeries.asArray().forEach(series => {
            const annotation = new AxisMarkerAnnotation({
                // Axis marker fill
                backgroundColor: series.stroke,
                // Axis text color
                color: "White"
                // TODO: You could choose white or black for text depending on the color of the series
                // TODO: You could choose a different property from the series for different series types, e.g. candle, mountain, column
            });
            this.annotationsBySeries.set(annotation, series);
            this.parentSurface.annotations.add(annotation);
        });
    }
}
// #endregion

async function customSeriesValueModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    const yValues2 = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
        yValues2.push(0.5 * Math.cos(i * 0.11) - Math.sin(i * 0.015));
    }

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            })
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2
            })
        })
    );

    // Add zooming, panning for the example
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());

    // #region ExampleB
    // Add the custom modifier to the chart
    sciChartSurface.chartModifiers.add(new SimpleSeriesValueModifier());
    // #endregion
}

customSeriesValueModifier("scichart-root");
