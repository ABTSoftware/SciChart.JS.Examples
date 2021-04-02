async function initSciChart() {

  // Create the SciChartSurface
	const {
	  sciChartSurface,
	  wasmContext
	} = await SciChart.SciChartSurface.create("scichart-root");
  sciChartSurface.applyTheme(new SciChart.SciChartJSLightTheme());
  // Create the X & Y Axis
	const xAxis = new SciChart.NumericAxis(wasmContext);
	sciChartSurface.xAxes.add(xAxis);

	const yAxis = new SciChart.NumericAxis(wasmContext, {
	  growBy: new SciChart.NumberRange(0.05, 0.05)
	});
	sciChartSurface.yAxes.add(yAxis);
  
  // That's it! You now have a SciChartSurface!
}

// Required for jsfiddle. Configure where to load wasm files
SciChart.SciChartSurface.configure({
	wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@1.3.1500/_wasm/scichart2d.wasm",
  dataUrl: "https://cdn.jsdelivr.net/npm/scichart@1.3.1500/_wasm/scichart2d.data"
});

initSciChart();
