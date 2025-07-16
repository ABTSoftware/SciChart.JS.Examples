import { SciChartReact } from "scichart-react";
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
      <h1>SciChart with React + Vite</h1>

      <SciChartReact 
        style={{ width: 900 }}

        // This is for our useBuilderAPI config (uncomment and comment `initChart` to see)
        // config={{
        //   type: ESciChartSurfaceType.Default2D,
        //   xAxes: [{ type: EAxisType.NumericAxis }],
        //   yAxes: [{ type: EAxisType.NumericAxis }],
        //   series: [
        //     {
        //       type: ESeriesType.SplineMountainSeries,
        //       options: {
        //         fill: "#3ca832",
        //         stroke: "#eb911c",
        //         strokeThickness: 4,
        //         opacity: 0.4,
        //       },
        //       xyData: {
        //         xValues: [1, 2, 3, 4],
        //         yValues: [1, 4, 7, 3],
        //       },
        //     },
        //   ],
        //   modifiers: [
        //     { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
        //     { type: EChart2DModifierType.MouseWheelZoom },
        //     { type: EChart2DModifierType.ZoomExtents },
        //   ],
        // }}

        // or use initChart function
        initChart={drawExample}
      />
    </div>
  );
}

export default App;
