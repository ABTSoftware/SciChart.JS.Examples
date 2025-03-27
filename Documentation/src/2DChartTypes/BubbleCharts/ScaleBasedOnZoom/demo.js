async function scaleBasedOnZoom(divElementId) {
    // Demonstrates how to create a bubble chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        XyzDataSeries,
        FastBubbleRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    const sizes = [];
    for (let i = 0; i < 30; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.2) - Math.cos(i * 0.04));
        sizes.push(Math.sin(i) * 60 + 3);
    }

    // #region ExampleA
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries: new XyzDataSeries(wasmContext, { xValues, yValues, zValues: sizes }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 256,
            height: 256,
            strokeThickness: 0,
            fill: "#4682b477",
        }),
    });

    // Adjust zMultiplier based on zoom level
    const adjustSeriesStyle = () => {
        const xAxis = sciChartSurface.xAxes.get(0);
        // Get the max range of the xAxis and calculate how zoomed in we are
        const seriesRange = xAxis.getMaximumRange();
        const zoomMultiplier = seriesRange.diff / xAxis.visibleRange.diff;

        // Calculate & apply a zoom factor
        const size =
            (Math.round(sciChartSurface.seriesViewRect.width) * zoomMultiplier) / bubbleSeries.dataSeries.count();
        bubbleSeries.zMultiplier = size * 0.05;
    };

    const usePreRenderCallback = (sciChartSurface, callback) => {
        let wasRendered = false;

        // initial setup - trigger on first redraw
        sciChartSurface.rendered.subscribe(() => {
            if (!wasRendered) {
                wasRendered = true;
                callback();
            }
        });

        // subsequent calls - trigger before render
        sciChartSurface.preRender.subscribe(() => {
            if (wasRendered) {
                callback();
            }
        });
    };

    // Callback called before render on SciChartSurface
    usePreRenderCallback(sciChartSurface, () => {
        adjustSeriesStyle();
    });

    sciChartSurface.renderableSeries.add(bubbleSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

scaleBasedOnZoom("scichart-root");
