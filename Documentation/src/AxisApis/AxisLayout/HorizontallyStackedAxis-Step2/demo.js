async function horizontallyStackedAxis(divElementId) {
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    EAxisAlignment,
    FastLineRenderableSeries,
    XyDataSeries,
    BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
    NumberRange
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const {wasmContext, sciChartSurface} = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // #region ExampleA
  // Create an YAxis on the Left
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "Y Axis",
    axisTitleStyle: { fontSize: 13 },
    backgroundColor: "#50C7E022",
    axisBorder: {color: "#50C7E0", borderRight: 1 },
    axisAlignment: EAxisAlignment.Left,
    growBy: new NumberRange(0.1, 0.1)
  }));

  // Create several XAxis
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis0", axisTitle: "X Axis 0" }));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis1", axisTitle: "X Axis 1" }));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis2", axisTitle: "X Axis 2" }));
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { id: "XAxis3", axisTitle: "X Axis 3" }));

  // Enable stacking of axis
  sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy = new BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy();

  // To make it clearer what's happening, colour the axis backgrounds & borders
  const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420" ];
  sciChartSurface.xAxes.asArray().forEach((xAxis, index) => {
    xAxis.backgroundColor = axisColors[index] + "22";
    xAxis.axisBorder = {color: axisColors[index], borderRight: 1};
    xAxis.axisTitleStyle.fontSize = 13;
  });

  // Let's add some series to the chart to show how they also behave with axis
  const getOptions = (index) => {
    const xValues = Array.from(Array(50).keys());
    const yValues = xValues.map(x => Math.sin(x * 0.4 + index));

    return {
      xAxisId: `XAxis${index}`,
      stroke: axisColors[index],
      strokeThickness: 2,
      dataSeries: new XyDataSeries(wasmContext, {xValues, yValues })
    };
  };

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(0)}));
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(1)}));
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(2)}));
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(3)}));
  // #endregion
};

horizontallyStackedAxis("scichart-root");





async function builderExample(divElementId) {
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
    EAxisAlignment,
    ESeriesType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const xValues = Array.from(Array(50).keys());
  const yValues = xValues.map(x => Math.sin(x * 0.4));
  const yValues1 = xValues.map(x => Math.sin(x * 0.4 + 1));
  const yValues2 = xValues.map(x => Math.sin(x * 0.4 + 2));
  const yValues3 = xValues.map(x => Math.sin(x * 0.4 + 3));

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis",
        axisTitleStyle: { fontSize: 13 },
        backgroundColor: "#50C7E022",
        axisBorder: { color: "#50C7E0", borderRight: 1 },
        axisAlignment: EAxisAlignment.Left
      }
    },
    xAxes: [
      {
        type: EAxisType.NumericAxis,
        options: { id: "XAxis0", axisTitle: "X Axis 0", backgroundColor: "#50C7E022", axisBorder: { borderTop: 1, color: "#50C7E0" } }
      },
      {
        type: EAxisType.NumericAxis,
        options: { id: "XAxis1", axisTitle: "X Axis 0", backgroundColor: "#EC0F6C22", axisBorder: { borderTop: 1, color: "#EC0F6C" } }
      },
      {
        type: EAxisType.NumericAxis,
        options: { id: "XAxis2", axisTitle: "X Axis 0", backgroundColor: "#30BC9A22", axisBorder: { borderTop: 1, color: "#30BC9A" } }
      },
      {
        type: EAxisType.NumericAxis,
        options: { id: "XAxis3", axisTitle: "X Axis 0", backgroundColor: "#F4842022", axisBorder: { borderTop: 1, color: "#F48420" } }
      },
    ],
    series: [
      {
        type: ESeriesType.LineSeries,
        options: { stroke: "#50C7E0", strokeThickness: 2, xAxisId: "XAxis0" },
        xyData: { xValues, yValues }
      },
      {
        type: ESeriesType.LineSeries,
        options: { stroke: "#EC0F6C", strokeThickness: 2, xAxisId: "XAxis1" },
        xyData: { xValues, yValues: yValues1 }
      },
      {
        type: ESeriesType.LineSeries,
        options: { stroke: "#30BC9A", strokeThickness: 2, xAxisId: "XAxis2" },
        xyData: { xValues, yValues: yValues2 }
      },
      {
        type: ESeriesType.LineSeries,
        options: { stroke: "#F48420", strokeThickness: 2, xAxisId: "XAxis3" },
        xyData: { xValues, yValues: yValues3 }
      }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
