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
  EllipsePointMarker,
  SciChartJsNavyTheme,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
} = SciChart;

async function lineChartWithyGradient(divElementId) {
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
    (y) => Math.sin(y * 0.2) + Math.sin(y * 0.1)
  );

  // #region ExampleA
  const yGradientPalette = PaletteFactory.createYGradient(
    wasmContext,
    new GradientParams(new Point(0, 0), new Point(0, 1), [
      { offset: 0, color: "#3333FF" },
      { offset: 0.5, color: "#33FFAA" },
      { offset: 1, color: "#FF6600" },
    ]),
    // the range of y-values to apply the gradient to
    new NumberRange(0, 1.5),
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
      paletteProvider: yGradientPalette,
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

lineChartWithyGradient("scichart-root");
