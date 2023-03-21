// #region ExampleA
const {
  NumericTickProvider
} = SciChart;

// or, for npm, import { NumericTickProvider, ... } from "scichart"

class CustomTickProvider extends NumericTickProvider {
  constructor(wasmContext) {
    super(wasmContext);
  }

  getMinorTicks(minorDelta, majorDelta, visibleRange) {
    // Todo here: calculate your tick spacing based on axis minorDelta, majorDelta and visibleRange
    // Note we do not return major ticks here, so minor ticks exclude the majors
    return [0.2, 0.4, 0.6, 0.8, 1.2, 1.4, 1.6, 1.8,
      2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8,
      4.2, 4.4, 4.6, 4.8, 5.0, 5.2, 5.4, 5.6, 5.8,
      6.0, 6.2, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6,
      7.8, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.6, 9.8];
  }

  getMajorTicks(minorDelta, majorDelta, visibleRange) {
    // Todo here: calculate your tick spacing based on axis minorDelta, majorDelta and visibleRange
    // Note we return the major tick intervals and label intervals here
    return [0,1,2,4,8];
  }
}
// #endregion

async function tickProvider(divElementId) {
  // #region ExampleB
  // Demonstrates how to apply a custom tickprovider in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // Adjust major/minor gridline style to make it clearer for the demo
  const styleOptions = {
    majorGridLineStyle: { color: "#50C7E077"},
    minorGridLineStyle: { color: "#50C7E033"},
  };

  // Create an XAxis on the bottom
  const xAxis = new NumericAxis(wasmContext, {
    ...styleOptions,
    axisTitle: "Custom TickProvider - unequally spaced gridlines"
  });

  // Apply the tickProvider
  xAxis.tickProvider = new CustomTickProvider(wasmContext);

  // Add the xAxis to the chart
  sciChartSurface.xAxes.add(xAxis);

  // You can also apply a tickprovider in constructor options
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    tickProvider: new CustomTickProvider(),
    ...styleOptions
  }));
  // #endregion
};

tickProvider("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to apply a custom tickprovider in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleC

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Custom TickProvider - unequally spaced gridlines"
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis"
      }
    },
  });

  // Tickproviders must be applied after the fact using the Builder API
  sciChartSurface.xAxes.get(0).tickProvider = new CustomTickProvider(wasmContext);
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
