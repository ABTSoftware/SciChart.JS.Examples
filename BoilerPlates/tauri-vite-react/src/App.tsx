import { useEffect, useRef } from "react";
import {
  SciChartSurface,
  XyDataSeries,
  NumericAxis,
  NumberRange,
  SplineMountainRenderableSeries,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier
} from "scichart";

SciChartSurface.UseCommunityLicense();

// This is for the programmatic way of defining a chart
async function drawExample(rootElement: string | HTMLDivElement) {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext, {
    axisTitle: "X Axis",
    growBy: new NumberRange(0.1, 0.1),
  })
  sciChartSurface.xAxes.add(xAxis);

  const yAxis = new NumericAxis(wasmContext, {
    axisTitle: "Y Axis",
    growBy: new NumberRange(0.1, 0.1),
  });
  sciChartSurface.yAxes.add(yAxis);

  // Create a series and add to the chart
  const mountain = new SplineMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [1, 2, 3, 4],
      yValues: [1, 4, 7, 3],
    }),
    fill: "#3ca832",
    stroke: "#eb911c",
    strokeThickness: 4,
    opacity: 0.4,
  });
  sciChartSurface.renderableSeries.add(mountain);

  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier()
  )

  return { sciChartSurface, wasmContext };
}

function App() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mount the chart programmatically (no scichart-react wrapper). Keep the surface promise so we
    // can delete it on unmount — this also handles React StrictMode's double-invoke in dev.
    const chartPromise = drawExample(chartRef.current!);
    return () => {
      chartPromise.then(({ sciChartSurface }) => sciChartSurface.delete());
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>SciChart with Tauri + React + Vite</h1>

      <div ref={chartRef} style={{ width: "90%", height: "60vh" }} />
    </div>
  );
}

export default App;
