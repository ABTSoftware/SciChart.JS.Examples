async function cameraProperties(divElementId) {
  const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
    CameraController,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
  } = SciChart;

  // or, for npm, import { SciChart3DSurface, ... } from "scichart"

  // #region ExampleA
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    // Optional camera options passed into create Method
    cameraOptions: {
      position: new Vector3(300, 300, 300),
      target: new Vector3(0, 50, 0),
    }
  });

  // A camera may be attached to a chart after creation
  sciChart3DSurface.camera = new CameraController(wasmContext, {
    id: "Primary Camera",
    position: new Vector3(300, 300, 300),
    target: new Vector3(0, 50, 0),
  });
  // #endregion

  // #region ExampleB
  const camera = sciChart3DSurface.camera;

  // propertyChanged is raised each time any property changes on the camera
  camera.propertyChanged.subscribe((args) => {
    // Log current properties to console. debugOutput returns array of strings
    const cameraDebug = camera.debugOutput();

    // Output the same information to a div on the page
    document.getElementById("debug-camera").innerHTML = cameraDebug.map(line => `<p>${line}</p>`).join("");
  });
  // #endregion

  // trigger a property change for the example
  camera.target = new Vector3(0, 60, 0);

  // SciChart.js 3D supports only a single x,y,z axis. Declare your axis like this
  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" })
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

  sciChart3DSurface.chartModifiers.add(
    new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
    new OrbitModifier3D(), // provides 3d rotation on left mouse drag
    new ResetCamera3DModifier()); // resets camera position on double-click
};

cameraProperties("scichart-root");
