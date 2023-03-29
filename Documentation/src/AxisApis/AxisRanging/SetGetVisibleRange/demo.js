async function getSetVisibleRange(divElementId) {

  // #region ExampleA
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    NumberRange,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // Create a chart with X,Y axis
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Allow updating visibleRange
  document.getElementById("update-chart-button").addEventListener("click", () => {
    const yAxis = sciChartSurface.yAxes.get(0);

    const min = Math.random() * 0.5;
    yAxis.visibleRange = new NumberRange(min, min + 1);
    const range = yAxis.visibleRange;
    const message = `YAxis VisibleRange is ${range.min.toFixed(2)}, ${range.max.toFixed(2)}`;
    document.getElementById("update-range-label").textContent = message;
    console.log(message);
  });
  // #endregion

  // Outside the public documentation - lets add some data to show autorange
  const { FastLineRenderableSeries, XyDataSeries } = SciChart;
  const xValues = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
  const yValues = xValues.map(x => Math.sin(x * 0.2));

  const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    dataSeries,
    stroke: "#50C7E0",
    strokeThickness: 3,
  }));
};

getSetVisibleRange("scichart-root");





async function builderExample(divElementId) {
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EAxisType,
    NumberRange
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const xValues = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
  const yValues = xValues.map(x => Math.sin(x * 0.2));

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: { axisTitle: "X Axis" }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(0, 1)
      }
    },
    series: [
      {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues,
          yValues
        },
        options: {
          stroke: "#50C7E0",
          strokeThickness: 3,
        }
      }
    ]
  });

  document.getElementById("update-chart-button").addEventListener("click", () => {
    const yAxis = sciChartSurface.yAxes.get(0);

    console.log(`Setting Axis.VisibleRange = -0.2, 1.2`);
    yAxis.visibleRange = new NumberRange(-0.2, 1.2);
    const range = yAxis.visibleRange;
    console.log(`Axis VisibleRange is ${range.min}, ${range.max}`);
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
