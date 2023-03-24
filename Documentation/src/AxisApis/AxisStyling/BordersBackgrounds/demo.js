async function axisStyling(divElementId) {
  // #region ExampleA
  // Demonstrates how to style axis borders and background in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    EAxisAlignment,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

    const yAxis = new NumericAxis(wasmContext, {
        axisTitleStyle: { color: "#368BC1" },
        id: "RightAxis",
        axisTitle: "Right Axis",
        axisBorder: {
            borderLeft: 1,
            color: "#368BC1" // Blue color
        },
        backgroundColor: "#368BC111"
    });

    const leftYAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        axisTitleStyle: { color: "#228B22" },
        axisTitle: "Left Axis",
        axisBorder: {
            borderRight: 1,
            color: "#228B22" // Green color
        },
        backgroundColor: "#228B2222"
    });

    const xAxis = new NumericAxis(wasmContext, {
        axisTitleStyle: { color: "#EEEEEE" },
        axisTitle: "X Axis",
        axisBorder: {
            borderTop: 1,
            color: "#EEEEEE" // Green color
        },
        backgroundColor: "#EEEEEE11"
    });

    sciChartSurface.yAxes.add(yAxis, leftYAxis);
    sciChartSurface.xAxes.add(xAxis);
    // #endregion
};

axisStyling("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to style a numeric axis in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisAlignment,
    EAxisType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
          axisTitleStyle: { color: "#EEEEEE" },
          axisTitle: "X Axis",
          axisBorder: {
              borderTop: 1,
              color: "#EEEEEE" // Green color
        },
        backgroundColor: "#EEEEEE11"
        }
    },
    yAxes: [{
      type: EAxisType.NumericAxis,
      options: {
          axisTitleStyle: { color: "#368BC1" },
          id: "RightAxis",
          axisTitle: "Right Axis",
          axisBorder: {
              borderLeft: 1,
              color: "#368BC1" // Blue color
          },
          backgroundColor: "#368BC111"
      }
    },
        {
            type: EAxisType.NumericAxis,
            options: {
                axisAlignment: EAxisAlignment.Left,
                axisTitleStyle: { color: "#228B22" },
                axisTitle: "Left Axis",
                axisBorder: {
                    borderRight: 1,
                    color: "#228B22" // Green color
                },
                backgroundColor: "#228B2222"
            }
        }]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
