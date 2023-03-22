async function verticallyStackedAxis(divElementId) {
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    EAxisAlignment,
    LeftAlignedOuterVerticallyStackedAxisLayoutStrategy
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // #region ExampleA
  sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy
      = new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
  // #endregion

  // Create an XAxis on the bottom
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "X Axis",
    axisTitleStyle: { fontSize: 13 },
    backgroundColor: "#50C7E022",
    axisBorder: { color: "#50C7E0", borderTop: 1 }
  }));

  // Create several YAxis on the left
  // Creating a NumericAxis as a YAxis on the left
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis0", axisTitle: "Y Axis 0", axisAlignment: EAxisAlignment.Left }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis1", axisTitle: "Y Axis 1", axisAlignment: EAxisAlignment.Left }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis2", axisTitle: "Y Axis 2", axisAlignment: EAxisAlignment.Left }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis3", axisTitle: "Y Axis 3", axisAlignment: EAxisAlignment.Left }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis4", axisTitle: "Y Axis 4", axisAlignment: EAxisAlignment.Left }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis5", axisTitle: "Y Axis 5", axisAlignment: EAxisAlignment.Left }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis6", axisTitle: "Y Axis 6", axisAlignment: EAxisAlignment.Left }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { id: "YAxis7", axisTitle: "Y Axis 7", axisAlignment: EAxisAlignment.Left }));

  // To make it clearer what's happening, colour the axis backgrounds & borders
  const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420", "#364BA0", "#882B91", "#67BDAF", "#C52E60"];
  sciChartSurface.yAxes.asArray().forEach((yAxis, index) => {
    yAxis.backgroundColor = axisColors[index] + "22";
    yAxis.axisBorder = { color: axisColors[index], borderRight: 1 };
    yAxis.axisTitleStyle.fontSize = 13;
  });
};

verticallyStackedAxis("scichart-root");

