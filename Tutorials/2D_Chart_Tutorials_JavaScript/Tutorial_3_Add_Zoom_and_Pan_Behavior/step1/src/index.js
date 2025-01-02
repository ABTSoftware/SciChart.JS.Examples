import {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    RubberBandXyZoomModifier,
    ZoomPanModifier,
    ZoomExtentsModifier
} from "scichart";

async function initSciChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    
    // Create 100 dataseries, each with 10k points
    for (let seriesCount = 0; seriesCount < 100; seriesCount++) {        
        const xyDataSeries = new XyDataSeries(wasmContext);

        const opacity = (1 - ((seriesCount / 120))).toFixed(2);

        // Populate with some data
        for(let i = 0; i < 10000; i++) {
            xyDataSeries.append(i, Math.sin(i* 0.01) * Math.exp(i*(0.00001*(seriesCount+1))));
        }

        // Add and create a line series with this data to the chart
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries,
            stroke: `rgba(176,196,222,${opacity})`,
            strokeThickness:2
        }));
    }

    // #region ExampleA

    // Ensure to import types e.g.
    // import { MouseWheelZoomModifier, ZoomPanModifier } from "scichart";

    const mouseWheelZoomModifier = new MouseWheelZoomModifier();
    const zoomPanModifier = new ZoomPanModifier();    
    const rubberBandZoomModifier = new RubberBandXyZoomModifier();
    const zoomExtentsModifier = new ZoomExtentsModifier();

    // Adds zoom, pan behaviours to the chart
    // Mousewheel zoom, panning and double-click to zoom to fit

    sciChartSurface.chartModifiers.add(zoomExtentsModifier);
    sciChartSurface.chartModifiers.add(zoomPanModifier);
    sciChartSurface.chartModifiers.add(rubberBandZoomModifier);
    sciChartSurface.chartModifiers.add(mouseWheelZoomModifier);
    // #endregion
}

initSciChart();
