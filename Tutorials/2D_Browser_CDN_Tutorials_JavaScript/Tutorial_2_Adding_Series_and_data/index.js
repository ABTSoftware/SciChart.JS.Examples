
async function initSciChart() {
    // LICENSING //
    // Set your license code here. See https://www.scichart.com/licensing-scichart-js/
	// for instructions  
    
	// Load SciChart.js from CDN. Ensure version numbers match the script in index.html
	SciChart.SciChartSurface.configure({
		dataUrl: "https://cdn.jsdelivr.net/npm/scichart@2.1.0-beta.40/_wasm/scichart2d.data",
		wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@2.1.0-beta.40/_wasm/scichart2d.wasm"
	});

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChart.SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new SciChart.NumericAxis(wasmContext);
    const yAxis = new SciChart.NumericAxis(wasmContext);
    
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

        // Create 100 dataseries, each with 10k points
    for (let seriesCount = 0; seriesCount < 100; seriesCount++) {        
        const xyDataSeries = new SciChart.XyDataSeries(wasmContext);

        const opacity = (1 - ((seriesCount / 120))).toFixed(2);

        // Populate with some data
        for(let i = 0; i < 10000; i++) {
            xyDataSeries.append(i, Math.sin(i* 0.01) * Math.exp(i*(0.00001*(seriesCount+1))));
        }

        // Add and create a line series with this data to the chart
        // Create a line series        
        const lineSeries = new SciChart.FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries, 
            stroke: `rgba(176,196,222,${opacity})`,
            strokeThickness:2
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    }
}

initSciChart();
