async function orthogonalProjection(divElementId) {
  const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
    ECameraProjectionMode,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
  } = SciChart;

  // or, for npm, import { SciChart3DSurface, ... } from "scichart"

  // #region ExampleA
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    cameraOptions: {
      id: "Primary Camera",
      position: new Vector3(400, 400, 400),
      target: new Vector3(0, 100, 0),
    }
  });

  // Start off with the default camera
  const camera = sciChart3DSurface.camera;

  // Debug log as before
  camera.propertyChanged.subscribe((args) => {
    const cameraDebug = camera.debugOutput();
    document.getElementById("debug-camera").innerHTML = cameraDebug.map(line => `<p>${line}</p>`).join("");
  });

  // Switch to orthogonal projection
  // In orthogonal projection mode, the camera is positioned by position,target
  // however the viewing 'cone' no longer obeys perspective but is parallel
  //
  // orthoWidth/orthoHeight must be set to the desired width/height of the camera's view in world dimensions
  // larger numbers means more 'zoomed out'
  // aspectRatio is the ratio of orthoWidth/orthoHeight
  camera.projectionMode = ECameraProjectionMode.Orthogonal;
  camera.orthoWidth = 800;
  camera.orthoHeight = 550;

  // Also note: SciChart.js has camera.toPersective() and camera.toOrthogonal() methods to quickly switch back/forth
  // #endregion

  // SciChart.js 3D supports only a single x,y,z axis. Declare your axis like this
  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" })
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

  sciChart3DSurface.chartModifiers.add(
    new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
    new OrbitModifier3D(), // provides 3d rotation on left mouse drag
    new ResetCamera3DModifier()); // resets camera position on double-click
};

orthogonalProjection("scichart-root");
