async function axisStyling(divElementId) {
  // #region ExampleA
  // Demonstrates how to style numeric axis in SciChart.js
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

  // Create and style xAxis
  sciChartSurface.xAxes.add(
      new NumericAxis(wasmContext, {
        axisTitle: ["X Axis", "bold, italic, with multi-line title"],
        drawMajorBands: true,
        axisBandsFill: "#FF665555",
        axisTitleStyle: {
          fontSize: 16,
          fontFamily: "Arial",
          color: "#4682b4",
          fontWeight: "bold",
          fontStyle: "italic"
        },
        majorGridLineStyle: { strokeThickness: 1, color: "#ADFF2F", strokeDasharray: [10, 5] },
        minorGridLineStyle: { strokeThickness: 1, color: "#EE82EE", strokeDasharray: [2, 2] },
        majorTickLineStyle: { strokeThickness: 1, color: "Blue", tickSize: 8 },
        minorTickLineStyle: { strokeThickness: 1, color: "Red", tickSize: 4 },
        labelStyle: {
          fontSize: 16,
          fontWeight: "bold",
          fontStyle: "Italic",
          color: "#4682b4",
          fontFamily: "Arial"
        }
      })
  );

  // Create and style left YAxis
  sciChartSurface.yAxes.add(
      new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        axisBandsFill: "#FF665555",
        axisTitle: "Left Y Axis",
        axisTitleStyle: {
          fontSize: 25,
          fontFamily: "Montserrat",
          fontWeight: "bold",
          color: "#DC143C"
        },
        majorGridLineStyle: { strokeThickness: 1, color: "#ADFF2F", strokeDasharray: [10, 5] },
        minorGridLineStyle: { strokeThickness: 1, color: "#EE82EE", strokeDasharray: [2, 2] },
        majorTickLineStyle: { strokeThickness: 1, color: "#ADFF2F", tickSize: 8 },
        minorTickLineStyle: { strokeThickness: 1, color: "#EE82EE",  tickSize: 4 },
        labelStyle: {
          fontSize: 15,
          color: "#DC143C",
          fontFamily: "Arial"
        }
      })
  );
  // #endregion
};

axisStyling("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to style a numeric axis in SciChart.js using the Builder API
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
        axisTitle: "X Axis",
        drawMajorBands: true,
        axisBandsFill: "#FF665555",
        axisTitleStyle: {
          fontSize: 16,
          fontFamily: "Arial",
          color: "#4682b4",
          fontWeight: "bold",
          fontStyle: "italic"
        },
        majorGridLineStyle: { strokeThickness: 1, color: "#ADFF2F", strokeDasharray: [10, 5] },
        minorGridLineStyle: { strokeThickness: 1, color: "#EE82EE", strokeDasharray: [2, 2] },
        majorTickLineStyle: { strokeThickness: 1, color: "Blue", tickSize: 8 },
        minorTickLineStyle: { strokeThickness: 1, color: "Red", tickSize: 4 },
        labelStyle: {
          fontSize: 16,
          fontWeight: "bold",
          fontStyle: "Italic",
          color: "#4682b4",
          fontFamily: "Arial"
        }
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisAlignment: EAxisAlignment.Left,
        axisBandsFill: "#FF665555",
        axisTitle: "Left Y Axis",
        axisTitleStyle: {
          fontSize: 25,
          fontFamily: "Montserrat",
          fontWeight: "bold",
          color: "#DC143C"
        },
        majorGridLineStyle: { strokeThickness: 1, color: "#ADFF2F", strokeDasharray: [10, 5] },
        minorGridLineStyle: { strokeThickness: 1, color: "#EE82EE", strokeDasharray: [2, 2] },
        majorTickLineStyle: { strokeThickness: 1, color: "#ADFF2F", tickSize: 8 },
        minorTickLineStyle: { strokeThickness: 1, color: "#EE82EE",  tickSize: 4 },
        labelStyle: {
          fontSize: 15,
          color: "#DC143C",
          fontFamily: "Arial"
        }
      }
    }
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
