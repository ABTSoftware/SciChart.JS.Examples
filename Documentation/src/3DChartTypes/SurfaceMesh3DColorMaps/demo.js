async function surfaceMesh3DChart(divElementId) {
  // Demonstrates how to create a 3D surface mesh chart with X,Y,Z axis in SciChart.js
  const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    TooltipModifier3D,
    EDrawMeshAs,
    UniformGridDataSeries3D,
    SurfaceMeshRenderableSeries3D,
    GradientColorPalette,
    EMeshPaletteMode,
    NumberRange
  } = SciChart;

  // or, for npm, import { SciChart3DSurface, ... } from "scichart"

  // Create a SciChart3DSurface in the host <div id=".." />
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    worldDimensions: new Vector3(300, 200, 300),
    cameraOptions: {
      position: new Vector3(-300, 300, -300),
      target: new Vector3(0, 50, 0),
    }
  });

  // Declare your X,Y,Z axis
  const growBy = new NumberRange(0.2, 0.2);
  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis", growBy });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis", growBy });
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis", growBy });;

  // #region ExampleA
  // Create a Surface Mesh with MeshColorPalette
  const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
    minimum: 0,   // minimum value corresponds to colorMap offset=0
    maximum: 10,  // maximum value corresponds to colorMap offset=1
    dataSeries: new UniformGridDataSeries3D(wasmContext, {
      yValues: [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
      ],
    }),
    meshColorPalette: new GradientColorPalette(wasmContext, {
      gradientStops: [
        {offset: 1, color: "#EC0F6C"}, // yValues >= maximum mapped to this color
        {offset: 0.55, color: "#F48420"},
        {offset: 0.3, color: "#67BDAF"},
        {offset: 0.2, color: "#50C7E0"},
        {offset: 0.1, color: "#264B93"},
        {offset: 0, color: "#14233C"}  // yValues <= minimum mapped to this color
      ],
    }),
    opacity: 0.77,
    stroke: "White",
    strokeThickness: 1,
    drawSkirt: false,
    drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME, // Draw mesh as solid, wireframe or solid wireframe
    meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_SOLID_CELLS, // Interpolation mode for cell colors
  });

  sciChart3DSurface.renderableSeries.add(series);
  // #endregion

  // Optional: add zooming, panning for the example
  sciChart3DSurface.chartModifiers.add(
    new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
    new OrbitModifier3D(), // provides 3d rotation on left mouse drag
    new ResetCamera3DModifier(), // resets camera position on double-click
    new TooltipModifier3D(),
    );
};

surfaceMesh3DChart("scichart-root");
