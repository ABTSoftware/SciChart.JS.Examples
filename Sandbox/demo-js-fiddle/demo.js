async function initSciChart() {

  // Create the SciChartSurface
  const {
	sciChartSurface,
	wasmContext
  } = await SciChart.chartBuilder.build2DChart("scichart-root", {
	series: {
		type: "LineSeries", 
		xyData: {
		  	xValues: [1,2,3,4],
			yValues: [1,4,2,6]
	  }
  }

});
  
  // That's it! You now have a SciChartSurface!
}

// Required for jsfiddle. Configure where to load wasm files
SciChart.SciChartSurface.configure({
	wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@2.1.0-beta.40/_wasm/scichart2d.wasm",
  dataUrl: "https://cdn.jsdelivr.net/npm/scichart@2.1.0-beta.40/_wasm/scichart2d.data"
});

initSciChart();
