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

async function initSciChart() {
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    "scichart-root-1"
  );

  // Generate a data set for sine wave
  const xValues = [];
  const yValues = [];
  for (let i = 0; i <= 100; i++) {
    const x = 0.1 * i;
    xValues.push(x);
    yValues.push(Math.sin(x));
  }

  const xAxis = new NumericAxis(wasmContext);
  // Make the chart vertical by setting X Axis Alignment to Left or Right
  xAxis.axisAlignment = EAxisAlignment.Left;
  xAxis.axisTitleRenderer.text = "X Axis";
  xAxis.growBy = new NumberRange(0.1, 0.1);
  // Use this property to flip the axis orientation
  xAxis.flippedCoordinates = false;
  sciChartSurface.xAxes.add(xAxis);

  const yAxis = new NumericAxis(wasmContext);
  // Make the chart vertical by setting Y Axis Alignment to Top or Bottom
  yAxis.axisAlignment = EAxisAlignment.Top;
  yAxis.axisTitleRenderer.text = "Y Axis";
  yAxis.growBy = new NumberRange(0.1, 0.1);
  // Use this property to flip the axis orientation
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
    // For RolloverModifier to work correctly with Vertical Chart isVerticalChart flag needs to be set True
    new RolloverModifier({ isVerticalChart: true })
  );

  sciChartSurface.zoomExtents();
}

initSciChart();
