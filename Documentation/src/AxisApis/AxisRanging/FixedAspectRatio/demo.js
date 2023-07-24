async function fixedAspectRation(divElementId) {

  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    TextAnnotation,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    NumberRange,
    XAxisDragModifier,
    YAxisDragModifier,
    ZoomExtentsModifier,
    RubberBandXyZoomModifier,
    XyScatterRenderableSeries,
    XyDataSeries,
    CrossPointMarker
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // #region ExampleA
  // Create a chart with X,Y axis
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  const xAxis = new NumericAxis(wasmContext, { majorGridLineStyle: { color: "white" } });
  sciChartSurface.xAxes.add(xAxis);
  const yAxis = new NumericAxis(wasmContext, { majorGridLineStyle: { color: "white" } });
  sciChartSurface.yAxes.add(yAxis);

  const { width, height } = sciChartSurface.renderSurface.viewportSize;
  // force the x and y tick spacing to be the same, regardless of the aspect ratio of the chart
  const ratio = height / width;
  xAxis.visibleRange = new NumberRange(-10, 10);
  yAxis.visibleRange = new NumberRange(-10 * ratio, 10 * ratio);

  // subscribe to visibleRangeChanged on each Axis
  // avoid infinte loop due to floating point problems
  const epsilon = 1E-10;
  xAxis.visibleRangeChanged.subscribe(data => { 
    const yRange = yAxis.visibleRange;
    if (Math.abs((yRange.diff / data.visibleRange.diff) - ratio) > epsilon) {
        const newYDiff = ratio * (data.visibleRange.diff);
        const halfDiff = (newYDiff - yRange.diff) / 2;
        yAxis.visibleRange = new NumberRange(yRange.min - halfDiff, yRange.max + halfDiff);
        
    }
  });
  yAxis.visibleRangeChanged.subscribe(data => { 
      const xRange = xAxis.visibleRange;
      if (Math.abs((data.visibleRange.diff / xRange.diff) - ratio) > epsilon) {
          const newXDiff = (data.visibleRange.diff) / ratio;
          const halfDiff = (newXDiff - xRange.diff) / 2;
          xAxis.visibleRange = new NumberRange(xRange.min - halfDiff, xRange.max + halfDiff);
      }
  });
  // #endregion

  // add pan and zoom behaviour
  sciChartSurface.chartModifiers.add(
    new ZoomExtentsModifier(),
    new RubberBandXyZoomModifier(),
    new MouseWheelZoomModifier(),
    new XAxisDragModifier(),
    new YAxisDragModifier()
  );
};

fixedAspectRation("scichart-root");


