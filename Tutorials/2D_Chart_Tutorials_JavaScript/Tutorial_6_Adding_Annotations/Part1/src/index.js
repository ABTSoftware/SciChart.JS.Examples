import { SciChartSurface, NumericAxis, LineAnnotation } from "scichart";

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Add line annotation
  sciChartSurface.annotations.add(
    new LineAnnotation({
      stroke: "#FF6600",
      strokeThickness: 3,
      x1: 1.0,
      x2: 4.0,
      y1: 6.0,
      y2: 9.0,
    })
  );
}

initSciChart();
