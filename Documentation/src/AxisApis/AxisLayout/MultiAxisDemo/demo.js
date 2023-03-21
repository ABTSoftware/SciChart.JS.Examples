async function multipleAxis(divElementId) {
  // Demonstrates how to configure multiple axis in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    ELabelAlignment,
    EAxisAlignment,
    NumberRange,
    ENumericFormat
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const ID_X_AXIS_2 = "xAxis2";
  const ID_Y_AXIS_2 = "yAxis2";

  const titleStyle1 = {
    color: "#50C7E0",
    fontSize: 30,
  };
  const labelStyle1 = {
    color: "#50C7E0"
  };
  const titleStyle2 = {
    color: "#F48420",
    fontSize: 30,
  };
  const labelStyle2 = {
    color: "#F48420",
    alignment: ELabelAlignment.Right
  };

  // #region ExampleA
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // Add a primary X,Y Axis pair
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
    axisAlignment: EAxisAlignment.Bottom,
    axisTitle: "X Axis Bottom",
    axisTitleStyle: titleStyle1,
    labelStyle: labelStyle1,
    backgroundColor: "#50C7E022",
    axisBorder: {
      borderTop: 1,
      color: "#50C7E0"
    }
  }));

  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisAlignment: EAxisAlignment.Left,
    axisTitle: "Y Axis Left",
    axisTitleStyle: titleStyle1,
    labelStyle: labelStyle1,
    growBy: new NumberRange(0.1, 0.1),
    backgroundColor: "#50C7E022",
    axisBorder: {
      borderRight: 1,
      color: "#50C7E0"
    }
  }));

  // Add a secondary X,Y Axis pair
  // Series are tied to the axis via the ID_
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
    id: ID_X_AXIS_2,
    axisTitleStyle: titleStyle2,
    labelStyle: labelStyle2,
    axisAlignment: EAxisAlignment.Top,
    axisTitle: "X Axis Top",
    backgroundColor: "#F4842022",
    axisBorder: {
      borderBottom: 1,
      color: "#F48420"
    }
  }));

  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    id: ID_Y_AXIS_2,
    axisTitleStyle: titleStyle2,
    labelStyle: labelStyle2,
    axisAlignment: EAxisAlignment.Right,
    axisTitle: "Y Axis Right",
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 2,
    growBy: new NumberRange(0.1, 0.1),
    backgroundColor: "#F4842022",
    axisBorder: {
      borderLeft: 1,
      color: "#F48420"
    }
  }));
  // #endregion
};

multipleAxis("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to configure multiple axis in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
    ELabelAlignment
  } = SciChart;

  const ID_X_AXIS_2 = "xAxis2";
  const ID_Y_AXIS_2 = "yAxis2";

  const titleStyle1 = {
    color: "#50C7E0",
    fontSize: 30,
  };
  const labelStyle1 = {
    color: "#50C7E0"
  };
  const titleStyle2 = {
    color: "#F48420",
    fontSize: 30,
  };
  const labelStyle2 = {
    color: "#F48420",
    alignment: ELabelAlignment.Right
  };

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: [
      {
        type: EAxisType.NumericAxis,
        options: {
          axisAlignment: EAxisAlignment.Bottom,
          axisTitle: "X Axis Bottom",
          axisTitleStyle: titleStyle1,
          labelStyle: labelStyle1,
          backgroundColor: "#50C7E022",
          axisBorder: {
            borderTop: 1,
            color: "#50C7E0"
          }
        }
      },
      {
        type: EAxisType.NumericAxis,
        options: {
          id: ID_X_AXIS_2,
          axisTitleStyle: titleStyle2,
          labelStyle: labelStyle2,
          axisAlignment: EAxisAlignment.Top,
          axisTitle: "X Axis Top",
          backgroundColor: "#F4842022",
          axisBorder: {
            borderBottom: 1,
            color: "#F48420"
          }
        }
      }
    ],
    yAxes: [
      {
        type: EAxisType.NumericAxis,
        options: {
          axisAlignment: EAxisAlignment.Left,
          axisTitle: "Y Axis Left",
          axisTitleStyle: titleStyle1,
          labelStyle: labelStyle1,
          growBy: new NumberRange(0.1, 0.1),
          backgroundColor: "#50C7E022",
          axisBorder: {
            borderRight: 1,
            color: "#50C7E0"
          }
        }
      },
      {
        type: EAxisType.NumericAxis,
        options: {
          id: ID_Y_AXIS_2,
          axisTitleStyle: titleStyle2,
          labelStyle: labelStyle2,
          axisAlignment: EAxisAlignment.Right,
          axisTitle: "Y Axis Right",
          labelFormat: ENumericFormat.Decimal,
          labelPrecision: 2,
          growBy: new NumberRange(0.1, 0.1),
          backgroundColor: "#F4842022",
          axisBorder: {
            borderLeft: 1,
            color: "#F48420"
          }
        }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
