async function tooltips3D(divElementId) {
  const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
    EAutoRange,
    NumberRange,
    SpherePointMarker3D,
    ScatterRenderableSeries3D,
    XyzDataSeries3D,
    SurfaceMeshRenderableSeries3D,
    UniformGridDataSeries3D,
    GradientColorPalette,
    PointLineRenderableSeries3D,
    EDrawMeshAs,
    TooltipModifier3D,
    EMeshPaletteMode
  } = SciChart;

  // or, for npm, import { SciChart3DSurface, ... } from "scichart"

  // Create a SciChart3DSurface in the host <div id=".." />
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    worldDimensions: new Vector3(300, 200, 300),
    cameraOptions: {
      position: new Vector3(-300, 300, 300),
      target: new Vector3(0, 50, 0),
    }
  });

  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "X Axis",
  });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "Y Axis",
    visibleRange: new NumberRange(0, 3)
  });
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "Z Axis",
  });

  sciChart3DSurface.renderableSeries.add(
    new SurfaceMeshRenderableSeries3D(wasmContext, {
      dataSeries: new UniformGridDataSeries3D(wasmContext, {
        yValues: [
          [0.1, 0.4, 0.4, 0.2, 0.8],
          [0.6, 0.4, 0.6, 0.1, 0.7],
          [0.2, 0.4, 0.3, 0.4, 0.0],
          [0.6, 0.4, 0.6, 0.1, 0.7],
          [0.1, 0.4, 0.4, 0.2, 0.8],
        ],
        dataSeriesName: "Surface mesh"
      }),
      meshColorPalette: new GradientColorPalette(wasmContext, {
        gradientStops: [
          {offset: 1, color: "#EC0F6C"}, // yValues >= maximum mapped to this color
          {offset: 0.55, color: "#F48420"},
          {offset: 0.3, color: "#67BDAF"},
          {offset: 0.2, color: "#50C7E0"},
          {offset: 0.1, color: "#264B93"},
          {offset: 0, color: "#14233C"}  // yValues <= minimum mapped to this color
        ]
      }),
      minimum: 0,
      maximum: 1,
      opacity: 0.77,
      drawSkirt: false,
      stroke: "White",
      strokeThickness: 2,
      lightingFactor: 0.2,
      meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_SOLID_CELLS,
      drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME
    })
  );

  // #region ExampleA
  // Declare a tooltip and add to the chart like this.
  const tooltipModifier = new TooltipModifier3D({
      crosshairStroke: "#83D2F5",
      crosshairStrokeThickness: 3,
      tooltipContainerBackground: "#537ABD",
      tooltipTextStroke: "White",
      tooltipLegendOffsetX: 10,
      tooltipLegendOffsetY: 10,

      // Allows placement of tooltip in a custom div anywhere in your app
      placementDivId: "tooltipContainerDivId"
    });

  sciChart3DSurface.chartModifiers.add(tooltipModifier);
  // #endregion
};

tooltips3D("scichart-root");
