async function verticallyStackedAxis(divElementId) {
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    EAxisAlignment,
    LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
    FastLineRenderableSeries,
    XyDataSeries
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // Create an XAxis on the bottom
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "X Axis",
    axisTitleStyle: { fontSize: 13 },
    backgroundColor: "#50C7E022",
    axisBorder: { color: "#50C7E0", borderTop: 1 }
  }));

  // #region ExampleA
  sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy
      = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();

  // ...

  // Create several YAxis on the left using stackedAxisLength
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    id: "Y0",
    axisAlignment: EAxisAlignment.Left,
    axisTitle: "50% Size",
    stackedAxisLength: "50%" // Occupy 50% of available viewport size
  }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    id: "Y1",
    axisAlignment: EAxisAlignment.Left,
    axisTitle: "Default"
  }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    id: "Y2",
    axisAlignment: EAxisAlignment.Left,
    axisTitle: "Default"
  }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    id: "Y3",
    axisAlignment: EAxisAlignment.Left,
    axisTitle: "200 pixels",
    stackedAxisLength: 200 // Occupy exactly 200 pixels
  }));
  // #endregion

  // To make it clearer what's happening, colour the axis backgrounds & borders
  const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420" ];
  sciChartSurface.yAxes.asArray().forEach((yAxis, index) => {
    yAxis.backgroundColor = axisColors[index] + "22";
    yAxis.axisBorder = { color: axisColors[index], borderRight: 1 };
    yAxis.axisTitleStyle.fontSize = yAxis.stackedAxisLength === undefined ? 13 : 15;
    yAxis.axisTitleStyle.color = yAxis.stackedAxisLength === undefined ? "#FFFFFF77" : "#FFFFFF";
  });

  // Let's add some series to the chart to show how they also behave with axis
  const getOptions = (index) => {
    const xValues = Array.from(Array(50).keys());
    const yValues = xValues.map(x => Math.sin(x * 0.4 + index));

    return {
      yAxisId: `Y${index}`,
      stroke: axisColors[index],
      strokeThickness: 2,
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    };
  };

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(0)}));
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(1)}));
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(2)}));
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {...getOptions(3)}));
};

verticallyStackedAxis("scichart-root");

