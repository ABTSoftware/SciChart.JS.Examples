async function numericAxis3D(divElementId) {
  // #region ExampleA
  // Demonstrates how to create a 3D chart with X,Y,Z axis in SciChart.js
  const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    NumberRange,
    SciChartJsNavyTheme,
    ENumericFormat,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
  } = SciChart;

  // or, for npm, import { SciChart3DSurface, ... } from "scichart"

  // Create a SciChart3DSurface in the host <div id=".." />
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    worldDimensions: new Vector3(300, 200, 300),
    cameraOptions: {
      position: new Vector3(300, 300, 300),
      target: new Vector3(0, 50, 0),
    }
  });

  // Create an xAxis and assign to SciChart3DSurface
  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
    // All these properties are optional
    // ...
    // Enable flags like drawing gridlines
    drawMajorGridLines: true,
    drawMinorGridLines: true,
    drawLabels: true,
    axisTitle: "X Axis, 4-decimal places",
    // set VisibleRange. If not SciChart will calculate this on startup
    visibleRange: new NumberRange(0, 1000),
    // Enable decision labels with 4 significant figures
    labelFormat: ENumericFormat.Scientific,
    cursorLabelFormat: ENumericFormat.Decimal,
    labelPrecision: 4,
    // Hint to show no more than 5 labels on the axis
    maxAutoTicks: 5,
    // Offset our labels so that they dont overlap
    titleOffset: 50,
    tickLabelsOffset: 10,
  });

  // Create the Y-Axis and assign to SciChart3DSurface
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "Y Axis, 2 dp, prefix & postfix",
    labelPrecision: 2,
    labelPrefix: "$",
    labelPostfix: " USD",
    visibleRange: new NumberRange(10, 10000),
    // Hint to show no more than 5 labels on the axis
    maxAutoTicks: 5,
    // Offset our labels so that they dont overlap
    titleOffset: 50,
    tickLabelsOffset: 10,
  })
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "Z Axis, 0 dp",
    // labelFormat: ENumericFormat.Scientific,
    visibleRange: new NumberRange(0, 1000),
    labelPrecision: 0,
    labelPostfix: " kWh",
    // Hint to show no more than 5 labels on the axis
    maxAutoTicks: 5,
    // Offset our labels so that they dont overlap
    titleOffset: 50,
    tickLabelsOffset: 10,
  });

  // Optional: add zooming, panning for the example
  sciChart3DSurface.chartModifiers.add(
    new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
    new OrbitModifier3D(), // provides 3d rotation on left mouse drag
    new ResetCamera3DModifier()); // resets camera position on double-click
  // #endregion
};

numericAxis3D("scichart-root");
