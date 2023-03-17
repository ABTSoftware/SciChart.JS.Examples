

async function chartWithTextAxis(divElementId) {
  // #region ExampleA
  // Demonstrates how to configure a text axis in SciChart.js
  // using TextLabelProvider & NumericAxis
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TextLabelProvider,
    FastColumnRenderableSeries,
    XyDataSeries,
    GradientParams,
    Point
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // Create the labelProvider
  const labelProvider = new TextLabelProvider( {
    // When passed as an array, labels will be used in order
    labels: [
      "Bananas",
      "Apples",
      "Oranges",
      "Strawberries",
      "Plums"
    ]
  });

  // Create an XAxis with a TextLabelProvider
  const xAxis = new NumericAxis(wasmContext, { labelProvider });
  sciChartSurface.xAxes.add(xAxis);

  // Create a YAxis
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Create a column chart with the data. Labels are mapped to sequential X-values
  sciChartSurface.renderableSeries.add(new FastColumnRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [0,1,2,3,4],
      yValues: [0.1, 0.2, 0.4, 0.8, 1.1],
    }),
    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
      { color: "rgba(70,130,180,0.77)", offset: 0 },
      { color: "rgba(70,130,180,0.0)", offset: 1 },
    ]),
    stroke: "#FFFFFF77",
    strokeThickness: 2,
  }));
  // #endregion
};

chartWithTextAxis("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to configure a text axis in SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    ELabelProviderType,
    EAxisType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        labelProvider: {
          type: ELabelProviderType.Text,
          options: {
            // When passed as an array, labels will be used in order
            labels: [
              "Bananas",
              "Apples",
              "Oranges",
              "Strawberries",
              "Plums"
            ]
          }
        }
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: { }
    },
    series: [
      {
        type: ESeriesType.ColumnSeries,
        xyData: {
          xValues: [0,1,2,3,4],
          yValues: [0.1, 0.2, 0.4, 0.8, 1.1],
        },
        options: {
          fillLinearGradient: {
            gradientStops: [{ color:"rgba(70,130,180,0.77)",offset:0.0 },{ color: "rgba(70,130,180,0.0)", offset:1 }],
            startPoint: { x:0, y:0 },
            endPoint: { x:0, y:1 }
          },
          stroke: "#FFFFFF77",
          strokeThickness: 2,
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
