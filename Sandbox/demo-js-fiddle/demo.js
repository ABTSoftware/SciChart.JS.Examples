const { SciChartSurface, chartBuilder } = SciChart;

async function initSciChart() {

  // Create the SciChartSurface
  const {
	sciChartSurface,
	wasmContext
  } = await chartBuilder.build2DChart("scichart-root", {
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
SciChartSurface.useWasmFromCDN();

initSciChart();
