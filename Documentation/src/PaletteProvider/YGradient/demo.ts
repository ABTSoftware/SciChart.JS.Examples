import {
  IStrokePaletteProvider,
  IPointMetadata,
  IRenderableSeries,
  EStrokePaletteMode,
  parseColorToUIntArgb,
  SciChartSurface,
  FastLineRenderableSeries,
  NumericAxis,
  XyDataSeries,
  makeIncArray,
  PaletteFactory,
  GradientParams,
  NumberRange,
  Point,
} from "scichart";

async function lineChartWithyGradient(divElementId: string) {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElementId
  );
  // Create XAxis
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  // Create YAxis
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = makeIncArray(250);
  const yValues = makeIncArray(
    250,
    1,
    (y) => Math.sin(y * 0.05) + Math.sin(y * 0.01)
  );

  // #region ExampleA
  const yGradientPalette = PaletteFactory.createYGradient(
    wasmContext,
    new GradientParams(new Point(0, 0), new Point(0, 1), [
      { offset: 0, color: "blue" },
      { offset: 0.5, color: "green" },
      { offset: 1, color: "red" },
    ]),
    new NumberRange(-0.5, 2) // the range of y-values to apply the gradient to
  );
  // #endregion

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      strokeThickness: 5,
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
      paletteProvider: yGradientPalette,
    })
  );
  sciChartSurface.zoomExtents();
}

lineChartWithyGradient("scichart-root");
