import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyScatterRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

async function initSciChart() {
    // Below find a trial / BETA key for SciChart.js.
    // This Expires in 30 days - or 14th November 2020
    // Set this license key once in your app before calling SciChartSurface.create, e.g.
    SciChartSurface.setRuntimeLicenseKey("WcnXtRLwGVtfNA59XwvDQA11wSpykEA1NEpARELTB+Aq6kf2nJSK9GgWOKvCJA6P+jNg2xcVLw3oM7EdIIi0MJtvorAARa9au01LV/xLJ1jdOeDeMXpw/eT5ajSpukKcJXHe97tzsBzfB6wRziW6LgNjuB3ykFIk+tGvOmJyhRewYjF+FCSb/0q8Bq8em4lNmOfONzJz5spVWvvfHdn5iIYfvv00hhduow4bFzxXnRucLtHl2Bm1yFvrVYe0UOQcFpJ9DZ4S96GLhSw9SIkUSAy/C5r3FvdCkX8d40ehAg+n78w92QXwh4B41xF0f+9OHpeV3byaZDNr5L1afdS3qCahoyeYEnmt4hYdmGH3uS+KtC29bAcVXUqNA9P3pESndALjlEimVNfr6RrfKEY3jroWtPXEx2Oo9XcD3ZLUJiRrjDL0lTf/3a6+KN1xsl2K2eymqyo9Wggy7Mf3WymmvURil7SaxE3xBP5LWWGPMEXvf9m7vXGz6fkEtsZhdEC3HQprBwEGyV1zPdLxDqtWO9ltEBEBlS2FrzJ3984/zSp9sbc=");

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);    

    // Create a Scatter series, and Line series and add to chart
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, { 
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "White", stroke: "SteelBlue" }),
    });
    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#4083B7", strokeThickness: 2 });
    sciChartSurface.renderableSeries.add(lineSeries, scatterSeries);

    // Create and populate some XyDataSeries with static data
    // Note: you can pass xValues, yValues arrays to constructors, and you can use appendRange for bigger datasets
    const scatterData = new XyDataSeries(wasmContext, { dataSeriesName: "Cos(x)" });
    const lineData = new XyDataSeries(wasmContext, { dataSeriesName: "Sin(x)" });

    for(let i = 0; i < 1000; i++) {
        lineData.append(i, Math.sin(i*0.1));
        scatterData.append(i, Math.cos(i*0.1));
    }

    // Assign these dataseries to the line/scatter renderableseries
    scatterSeries.dataSeries = scatterData;
    lineSeries.dataSeries = lineData;

    // SciChart will now redraw with static data
    // 

    // Part 2: Updating data in realtime 
    // 

    let phase = 0.0;    
    
    const updateDataFunc = () => {

        // update the datapoints in the dataseries
        // Note updateRange() passing in array is higher performance for larger datasets
        for(let i = 0; i < 1000; i++) {
            lineData.update(i, Math.sin(i * 0.1 + phase));
            scatterData.update(i, Math.cos(i * 0.1 + phase));
        }

        phase += 0.01;

        // Repeat at 60Hz
        setTimeout(updateDataFunc, 1/60);
    };

    updateDataFunc();
}

initSciChart();
