import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";

const X_VISIBLE_RANGE = new NumberRange(-1, 3);
const Y_VISIBLE_RANGE = new NumberRange(-1, 5);
const X_TITLE = "X Axis";
const Y_TITLE = "Y Axis";

// Chart for y = x^2, x in [-2, 2], step 0.1, 40 steps
const xValues = [];
const yValues = [];
for (let i = 0; i <= 100; i++) {
  const x = 0.1 * i;
  xValues.push(x);
  yValues.push(Math.sin(x));
}

async function initSciChart() {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    "scichart-root-1"
  );

  const xAxis = new NumericAxis(wasmContext);
  xAxis.visibleRange = X_VISIBLE_RANGE;
  xAxis.axisAlignment = EAxisAlignment.Left;
  xAxis.axisTitleRenderer.text = X_TITLE;
  xAxis.growBy = new NumberRange(0.1, 0.1);
  xAxis.flippedCoordinates = false;
  sciChartSurface.xAxes.add(xAxis);

  const yAxis = new NumericAxis(wasmContext);
  yAxis.visibleRange = Y_VISIBLE_RANGE;
  yAxis.axisAlignment = EAxisAlignment.Top;
  yAxis.axisTitleRenderer.text = Y_TITLE;
  yAxis.growBy = new NumberRange(0.1, 0.1);
  yAxis.flippedCoordinates = true;
  sciChartSurface.yAxes.add(yAxis);

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
      stroke: "orange"
    })
  );

  sciChartSurface.chartModifiers.add(new ZoomPanModifier());
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
  sciChartSurface.chartModifiers.add(
    new RolloverModifier({ isVerticalChart: true })
  );

  sciChartSurface.zoomExtents();
}

initSciChart();
