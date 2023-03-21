async function centralAxis(divElementId) {
  // #region ExampleA
  // Demonstrates how to configure a central axis in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // Create an XAxis on the bottom
  const xAxis = new NumericAxis(wasmContext, {
  });

  // Add the xAxis to the chart
  sciChartSurface.xAxes.add(xAxis);

  // Creating a NumericAxis as a YAxis on the left
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
  }));
  // #endregion
};

centralAxis("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to configure a central axis in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
      }
    },
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
