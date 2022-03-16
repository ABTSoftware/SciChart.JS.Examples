async function initSciChart() {
  // In order to load data file from the CDN we need to set dataUrl
  SciChart.SciChartSurface.configure({
    dataUrl: `https://cdn.jsdelivr.net/npm/scichart@${SciChart.libraryVersion}/_wasm/scichart2d.data`,
    wasmUrl: `https://cdn.jsdelivr.net/npm/scichart@${SciChart.libraryVersion}/_wasm/scichart2d.wasm`
  });
  await SciChart.chartBuilder.buildChart("scichart-root", {
    series: {
      type: "LineSeries",
      options: { stroke: "steelblue" },
      xyData: {
        xValues: [1, 2, 5, 8, 10],
        yValues: [3, 1, 7, 5, 8]
      }}
  });
}

initSciChart();
