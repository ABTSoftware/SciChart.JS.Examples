
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

    // That's it! You just created your first SciChartSurface!
}

initSciChart();
