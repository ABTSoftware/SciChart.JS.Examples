const {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
} = SciChart;

// or, for npm, import { SciChartSurface, ... } from "scichart"

async function simpleLineChart(divElementId) {
  console.log("code");
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

  const xyDataSeries = new XyDataSeries(wasmContext, {
    xValues,
    yValues,
  });

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: xyDataSeries
  });

  sciChartSurface.renderableSeries.add(lineSeries);
};

simpleLineChart("scichart-root");

const {
  chartBuilder,
  ESeriesType,
} = SciChart;

async function simpleLineChartWithBuilderApi(divElementId) {
  console.log("builder");
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
          yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
        },
        options: {
          stroke: "#0066FF",
          strokeThickness: 5,
        }
      }
    ]
  });
};

if (location.search.includes("builder=1")) {
    simpleLineChartWithBuilderApi("scichart-root");
}