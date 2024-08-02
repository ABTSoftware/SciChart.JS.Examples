const {
  SciChartSurface,
  FastLineRenderableSeries,
  NumericAxis,
  XyDataSeries,
  makeIncArray,
  PaletteFactory,
  GradientParams,
  NumberRange,
  Point,
  SciChartJsNavyTheme,
  EllipsePointMarker,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
} = SciChart;

async function lineChartWithGradient(divElementId) {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );
  // Create XAxis
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  // Create YAxis
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) })
  );

  const xValues = makeIncArray(30);
  const yValues = makeIncArray(
    30,
    1,
    (y) => -Math.sin(y * 0.2) - Math.sin(y * 0.1)
  );

  // #region ExampleA
  const gradientPalette = PaletteFactory.createGradient(
    wasmContext,
    new GradientParams(new Point(0, 0), new Point(1, 1), [
      { color: "red", offset: 0 },
      { color: "pink", offset: 0.2 },
      { color: "yellow", offset: 0.5 },
      { color: "purple", offset: 0.7 },
      { color: "green", offset: 1 },
    ]),
    // Optional parameters to control which elements of the palette are enabled
    {
      enableFill: false, // Applies to fills on mountain, column
      enableStroke: true, // Applies to stroke on all series
      enablePointMarkers: true, // Applies to pointmarkers if present
      strokeOpacity: 1.0,
      pointMarkerOpacity: 0.7,
      fillOpacity: 0.0,
    }
  );

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      strokeThickness: 5,
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
      pointMarker: new EllipsePointMarker(wasmContext, {
        width: 20,
        height: 20,
        strokeThickness: 0,
      }),
      paletteProvider: gradientPalette,
    })
  );
  // #endregion

  sciChartSurface.chartModifiers.add(
    new MouseWheelZoomModifier(),
    new ZoomPanModifier(),
    new ZoomExtentsModifier()
  );
  sciChartSurface.zoomExtents();
}

lineChartWithGradient("scichart-root");
