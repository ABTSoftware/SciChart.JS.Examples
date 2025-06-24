async function initSciChart() {
  await SciChart.chartBuilder.buildChart("scichart-root", {
    series: {
      type: "LineSeries",
      options: { stroke: "steelblue" },
      xyData: {
        xValues: [1, 2, 5, 8, 10],
        yValues: [3, 1, 7, 5, 8],
      },
    },
  });
}

initSciChart();
