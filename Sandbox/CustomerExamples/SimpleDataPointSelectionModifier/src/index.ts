import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SimpleDataPointSelectionModifier } from "./SimpleDataPointSelectionModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { NumberRange } from "scichart/Core/NumberRange";

async function initSciChart() {
  // LICENSING //
  // Set your license code here
  // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  //
  // e.g.
  //
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
  //
  // Also, once activated (trial or paid license) having the licensing wizard open on your machine
  // will mean any or all applications you run locally will be fully licensed.

  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext, {
    growBy: new NumberRange(0.05, 0.05)
  });

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // Create some data and set on a line series
  const xyData1 = new XyDataSeries(wasmContext);
  const xyData2 = new XyDataSeries(wasmContext);
  const xyData3 = new XyDataSeries(wasmContext);
  for (let i = 0; i < 250; i++) {
    xyData1.append(i, Math.sin(i * 0.1));
    xyData2.append(i, Math.sin(i * 0.1) * 0.7);
    xyData3.append(i, Math.sin(i * 0.1) * 0.3);
  }

  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: xyData1,
      stroke: "red",
      pointMarker: new EllipsePointMarker(wasmContext, { fill: "red", strokeThickness: 0 })
    }),
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: xyData2,
      stroke: "green",
      pointMarker: new EllipsePointMarker(wasmContext, { fill: "green", strokeThickness: 0 })
    }),
    new FastLineRenderableSeries(wasmContext, {
      dataSeries: xyData3,
      stroke: "blue",
      pointMarker: new EllipsePointMarker(wasmContext, { fill: "blue", strokeThickness: 0 })
    })
  );

  // Add a custom modifier to select ranges
  sciChartSurface.chartModifiers.add(
    new ZoomExtentsModifier(),
    new SimpleDataPointSelectionModifier(),
    new MouseWheelZoomModifier()
  );
}

initSciChart();
