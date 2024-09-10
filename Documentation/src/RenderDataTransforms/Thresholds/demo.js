"use strict";

const scichart_1 = SciChart;
// #region ExampleA
class ThresholdRenderDataTransform extends scichart_1.XyBaseRenderDataTransform {
  constructor(parentSeries, wasmContext, thresholds) {
    super(parentSeries, wasmContext, [parentSeries.drawingProviders[0]]);
    this.thresholds = new scichart_1.ObservableArrayBase();
    this.thresholds.add(...thresholds);
    this.onThresholdsChanged = this.onThresholdsChanged.bind(this);
    this.thresholds.collectionChanged.subscribe(this.onThresholdsChanged);
  }
  onThresholdsChanged(data) {
    this.requiresTransform = true;
    if (this.parentSeries.invalidateParentCallback) {
      this.parentSeries.invalidateParentCallback();
    }
  }
  delete() {
    this.thresholds.collectionChanged.unsubscribeAll();
    super.delete();
  }
  createPointSeries() {
    return new scichart_1.XyPointSeriesResampled(
      this.wasmContext,
      new scichart_1.NumberRange(0, 0)
    );
  }
  runTransformInternal(renderPassData) {
    const numThresholds = this.thresholds.size();
    if (numThresholds === 0) {
      return renderPassData.pointSeries;
    }
    const {
      xValues: oldX,
      yValues: oldY,
      indexes: oldI,
      resampled,
    } = renderPassData.pointSeries;
    const { xValues, yValues, indexes } = this.pointSeries;
    const iStart = resampled ? 0 : renderPassData.indexRange.min;
    const iEnd = resampled ? oldX.size() - 1 : renderPassData.indexRange?.max;
    xValues.clear();
    yValues.clear();
    indexes.clear();
    // This is the index of the threshold we are currently under.
    let level = 0;
    let lastY = oldY.get(iStart);
    // Find the starting level
    for (let t = 0; t < numThresholds; t++) {
      if (lastY > this.thresholds.get(t)) {
        level++;
      }
    }
    let lastX = oldX.get(iStart);
    xValues.push_back(lastX);
    yValues.push_back(lastY);
    indexes.push_back(0);
    let newI = 0;
    for (let i = iStart + 1; i <= iEnd; i++) {
      const y = oldY.get(i);
      const x = oldX.get(i);
      if (level > 0 && lastY > this.thresholds.get(level - 1)) {
        if (y === this.thresholds.get(level - 1)) {
          // decrease level but don't add a point
          level--;
        }
        while (y < this.thresholds.get(level - 1)) {
          // go down
          const t = this.thresholds.get(level - 1);
          // interpolate to find intersection
          const f = (lastY - t) / (lastY - y);
          const xNew = lastX + (x - lastX) * f;
          newI++;
          xValues.push_back(xNew);
          yValues.push_back(t);
          // use original data index so metadata works
          indexes.push_back(i);
          // potentially push additional data to extra vectors to identify threshold level
          console.log(lastX, lastX, x, y, t, f, xNew);
          level--;
          if (level === 0) break;
        }
      }
      if (level < numThresholds && lastY <= this.thresholds.get(level)) {
        if (y === this.thresholds.get(level)) {
          // increase level but don't add a point
          level++;
        }
        while (y > this.thresholds.get(level)) {
          // go up
          const t = this.thresholds.get(level);
          const f = (t - lastY) / (y - lastY);
          const xNew = lastX + (x - lastX) * f;
          newI++;
          xValues.push_back(xNew);
          yValues.push_back(t);
          indexes.push_back(i);
          console.log(lastX, lastX, x, y, t, f, xNew);
          level++;
          if (level === numThresholds) break;
        }
      }
      lastY = y;
      lastX = x;
      newI++;
      xValues.push_back(lastX);
      yValues.push_back(lastY);
      indexes.push_back(newI);
    }
    return this.pointSeries;
  }
}
const colorNames = ["green", "blue", "yellow", "red"];
const colors = colorNames.map((c) => (0, scichart_1.parseColorToUIntArgb)(c));
class ThresholdPaletteProvider extends scichart_1.DefaultPaletteProvider {
  get isRangeIndependant() {
    return true;
  }
  constructor(thresholds) {
    super();
    this.strokePaletteMode = scichart_1.EStrokePaletteMode.SOLID;
    this.thresholds = thresholds;
  }
  overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
    if (index == 0) {
      this.lastY = yValue;
    }
    for (let i = 0; i < this.thresholds.length; i++) {
      const threshold = this.thresholds[i];
      if (yValue <= threshold && this.lastY <= threshold) {
        this.lastY = yValue;
        //console.log(index, yValue, i);
        return colors[i];
      }
    }
    this.lastY = yValue;
    //console.log(index, yValue, this.thresholds.length);
    return colors[this.thresholds.length];
  }
}
// #endregion
async function thresholds(divElementId) {
  const { sciChartSurface, wasmContext } =
    await scichart_1.SciChartSurface.create(divElementId, {
      theme: new scichart_1.SciChartJsNavyTheme(),
    });
  // sciChartSurface.debugRendering = true;
  const xAxis = new scichart_1.NumericAxis(wasmContext);
  sciChartSurface.xAxes.add(xAxis);
  const yAxis = new scichart_1.NumericAxis(wasmContext, {
    growBy: new scichart_1.NumberRange(0.05, 0.05),
  });
  sciChartSurface.yAxes.add(yAxis);
  const lineSeries = new scichart_1.FastLineRenderableSeries(wasmContext, {
    pointMarker: new scichart_1.EllipsePointMarker(wasmContext, {
      stroke: "transparent",
      fill: "black",
      width: 10,
      height: 10,
    }),
    dataLabels: {
      style: {
        fontFamily: "Arial",
        fontSize: 10,
      },
      color: "white",
    },
    strokeThickness: 5,
  });
  sciChartSurface.renderableSeries.add(lineSeries);
  const thresholds = [1.5, 3, 5];
  const transform = new ThresholdRenderDataTransform(
    lineSeries,
    wasmContext,
    thresholds
  );
  lineSeries.renderDataTransform = transform;
  const paletteProvider = new ThresholdPaletteProvider(thresholds);
  lineSeries.paletteProvider = paletteProvider;
  const dataSeries = new scichart_1.XyDataSeries(wasmContext, {
    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    yValues: [0, 1, 2, 3, 6, 4, 1, 1, 7, 5, 4],
  });
  lineSeries.dataSeries = dataSeries;
  const makeThresholdAnnotation = (i) => {
    const thresholdAnn = new scichart_1.HorizontalLineAnnotation({
      isEditable: true,
      stroke: colorNames[i + 1],
      y1: thresholds[i],
      showLabel: true,
    });
    thresholdAnn.dragDelta.subscribe((args) => {
      if (
        (i < colorNames.length - 2 && thresholdAnn.y1 >= thresholds[i + 1]) ||
        (i > 0 && thresholdAnn.y1 <= thresholds[i - 1])
      ) {
        // Prevent reordering thresholds
        thresholdAnn.y1 = thresholds[i];
      } else {
        // Update threshold from annotation position
        thresholds[i] = thresholdAnn.y1;
        paletteProvider.thresholds = thresholds;
        transform.thresholds.set(i, thresholdAnn.y1);
      }
    });
    sciChartSurface.annotations.add(thresholdAnn);
  };
  for (let i = 0; i < thresholds.length; i++) {
    makeThresholdAnnotation(i);
  }
  sciChartSurface.chartModifiers.add(new scichart_1.ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new scichart_1.ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new scichart_1.MouseWheelZoomModifier());
  //sciChartSurface.chartModifiers.add(new RolloverModifier());
  sciChartSurface.zoomExtents();
  return { sciChartSurface, wasmContext };
}
thresholds("scichart-root");
