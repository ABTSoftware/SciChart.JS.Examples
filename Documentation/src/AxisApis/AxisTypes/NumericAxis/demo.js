async function chartWithNumericAxis(divElementId) {
  // #region ExampleA
  // Demonstrates how to configure a numeric axis in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    EAutoRange,
    EAxisAlignment,
    ENumericFormat,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // Create an XAxis on the bottom
  const xAxis = new NumericAxis(wasmContext, {
    // All these properties are optional
    // ...
    // Enable flags like drawing gridlines
    drawMajorGridLines: true,
    drawMinorGridLines: true,
    drawLabels: true,
    // Set multiline title
    axisTitle: ["X Axis, Bottom", "2 decimal places"],
    // Set the alignment and autoRange
    axisAlignment: EAxisAlignment.Bottom,
    autoRange: EAutoRange.Once,
    // Enable decision labels with 4 significant figures
    labelFormat: ENumericFormat.Decimal,
    cursorLabelFormat: ENumericFormat.Decimal,
    labelPrecision: 4,
  });

  // Add the xAxis to the chart
  sciChartSurface.xAxes.add(xAxis);

  // Creating a NumericAxis as a YAxis on the left
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "Y Axis, Left, 4 dp",
    axisAlignment: EAxisAlignment.Left,
    labelFormat: ENumericFormat.Decimal,
    cursorLabelFormat: ENumericFormat.Decimal,
    labelPrecision: 4,
    labelPrefix: "$",
    labelPostfix: " USD"
  }));
  // #endregion

  // For the example - but not the documentation - show a line series
  const { FastLineRenderableSeries, XyDataSeries } = SciChart;
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
    }),
    stroke: "#0066FF",
    strokeThickness: 3,
  }));
};

chartWithNumericAxis("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to configure a numeric axis in SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EThemeProviderType,
    EAutoRange,
    EAxisAlignment,
    ENumericFormat,
    EAxisType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        // All these properties are optional
        // ...
        // Enable flags like drawing gridlines
        drawMajorGridLines: true,
        drawMinorGridLines: true,
        drawLabels: true,
        // Set title, alignment and autorange
        axisTitle: "X Axis, Bottom, 2 decimal places",
        axisAlignment: EAxisAlignment.Bottom,
        autoRange: EAutoRange.Once,
        // Enable decision labels with 4 significant figures
        labelFormat: ENumericFormat.Decimal,
        cursorLabelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis, Left, default formatting",
        axisAlignment: EAxisAlignment.Left,
        axisTitle: "Y Axis, Left, 4 dp",
        axisAlignment: EAxisAlignment.Left,
        labelFormat: ENumericFormat.Decimal,
        cursorLabelFormat: ENumericFormat.Decimal,
        labelPrecision: 4,
        labelPrefix: "$",
        labelPostfix: " USD"
      }
    },
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
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
