async function bandChartThresholds(divElementId) {
  // Demonstrates how to create a band chart using SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    FastBandRenderableSeries ,
    XyyDataSeries,
    SciChartJsNavyTheme
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // #region ExampleA
  // Use a Band series to render a mountain chart with horizontal threshold.
  const xValues = [];
  const yValues = [];
  const y1Values = [];
  const POINTS = 1000;
  const threshold = 0.4;
  const STEP = (3 * Math.PI) / POINTS;
  for (let i = 0; i <= 1000; i++) {
    const k = 1 - i / 2000;
    xValues.push(i);
    yValues.push(threshold); // constant value for Y
    y1Values.push(Math.cos(i * STEP) * k);
  }

  const bandSeries = new FastBandRenderableSeries(wasmContext, {
    dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
    stroke: "Transparent", // render Y stroke as transparent
    strokeY1: "#50C7E0",   // render Y1 transparent as blue
    fill: "#FF191933",     // have different fills above/below the threshold. This is fill above
    fillY1: "#50C7E033",   // fill below
    strokeThickness: 2,
  });

  sciChartSurface.renderableSeries.add(bandSeries);
  // #endregion

  // Add this label & annotation to the chart
  const { HorizontalLineAnnotation, ELabelPlacement } = SciChart;
  sciChartSurface.annotations.add(new HorizontalLineAnnotation({
    y1: threshold,
    stroke: "#FF1919",
    axisLabelFill: "White",
    strokeThickness: 1,
    strokeDashArray: [5, 5],
    opacity: 0.6,
    labelPlacement: ELabelPlacement.BottomRight, labelValue: "Values above this line are red",
    showLabel: true
  }));

  // Optional: add zooming, panning for the example
  const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier, new ZoomExtentsModifier());
}

bandChartThresholds("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a band chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const xValues = [];
  const yValues = [];
  const y1Values = [];
  const POINTS = 1000;
  const threshold = 0.4;
  const STEP = (3 * Math.PI) / POINTS;
  for (let i = 0; i <= 1000; i++) {
    const k = 1 - i / 2000;
    xValues.push(i);
    yValues.push(threshold); // constant value for Y
    y1Values.push(Math.cos(i * STEP) * k);
  }

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    series: [
      {
        type: ESeriesType.BandSeries,
        xyyData: {
          xValues,
          yValues,
          y1Values
        },
        options: {
          stroke: "Transparent", // render Y stroke as transparent
          strokeY1: "#50C7E0",   // render Y1 transparent as blue
          fill: "#FF191933",     // have different fills above/below the threshold. This is fill above
          fillY1: "#50C7E033",   // fill below
          strokeThickness: 2,
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
