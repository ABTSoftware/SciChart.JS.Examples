async function chartWithNumericAxisAndDates(divElementId) {
  // Demonstrates how to configure a numeric axis in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    NumberRange,
    EAxisAlignment,
    ENumericFormat,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // #region ExampleA
  // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
  const minDate = new Date("2023-03-1");
  const maxDate = new Date("2023-03-10");

  // When you create the Axis
  const xAxis = new NumericAxis(wasmContext, {
    axisTitle: "X Axis, Numeric, Date Formatting",
    // Specify ENumericFormat option with dates (see Enum for more options)
    labelFormat: ENumericFormat.Date_DDMMYY,
    cursorLabelFormat: ENumericFormat.Date_DDMMYY,
    // We need to specify some visibleRange to see these two dates
    // SciChart.js expects linux timestamp / 1000
    visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
  });

  // Add the xAxis to the chart
  sciChartSurface.xAxes.add(xAxis);
  // #endregion

  // Creating a NumericAxis as a YAxis on the left
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "Y Axis, Numeric",
    axisAlignment: EAxisAlignment.Left,
  }));
};

chartWithNumericAxisAndDates("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    NumberRange,
    EAxisAlignment,
    ENumericFormat,
    EAxisType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
  const minDate = new Date("2023-03-1");
  const maxDate = new Date("2023-03-10");

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "X Axis, Numeric, Date Formatting",
        // Specify ENumericFormat option with dates (see Enum for more options)
        labelFormat: ENumericFormat.Date_DDMMYY,
        cursorLabelFormat: ENumericFormat.Date_DDMMYY,
        // We need to specify some visibleRange to see these two dates
        // SciChart.js expects linux timestamp / 1000
        visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis, Left, default formatting",
        axisAlignment: EAxisAlignment.Left,
      }
    },
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
