import {SciChartSurface} from "scichart/charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/charting/model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {MouseWheelZoomModifier} from "scichart/charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomPanModifier} from "scichart/charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/charting/ChartModifiers/ZoomExtentsModifier";

async function initSciChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);    
    
    // Create 100 dataseries, each with 10k points
    for (let seriesCount = 0; seriesCount < 100; seriesCount++) {        
        const xyDataSeries = new XyDataSeries(wasmContext);

        const opacity = (1 - ((seriesCount / 120))).toFixed(2);

        // Populate with some data
        for(let i = 0; i < 10000; i++) {
            xyDataSeries.append(i, Math.sin(i* 0.01) * Math.exp(i*(0.00001*(seriesCount+1))));
        }

        // Add and create a line series with this data to the chart
        // Create a line series        
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries, 
            stroke: `rgba(176,196,222,${opacity})`,
            strokeThickness:2
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    }

    // Add zoom, pan behaviours to the chart. Mousewheel zoom, panning and double-click to 
    // zoom to fit
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(wasmContext))
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(wasmContext))
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(wasmContext))
}

initSciChart();
