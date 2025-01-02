import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  FastLineRenderableSeries,
  XyScatterRenderableSeries,
  EllipsePointMarker,
  ZoomExtentsModifier,
  RubberBandXyZoomModifier,
  ZoomPanModifier,
  EExecuteOn,
  NumberRange,
  EZoomState,
} from "scichart";

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // Create a Scatter series, and Line series and add to chart
  const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
    pointMarker: new EllipsePointMarker(wasmContext, {
      width: 7,
      height: 7,
      fill: "White",
      stroke: "SteelBlue",
    }),
  });
  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "#4083B7",
    strokeThickness: 2,
  });
  sciChartSurface.renderableSeries.add(lineSeries, scatterSeries);

  // Create and populate some XyDataSeries with static data
  // Note: you can pass xValues, yValues arrays to constructors, and you can use appendRange for bigger datasets
  const scatterData = new XyDataSeries(wasmContext, {
    dataSeriesName: "Cos(x)",
  });
  const lineData = new XyDataSeries(wasmContext, { dataSeriesName: "Sin(x)" });

  for (let i = 0; i < 1000; i++) {
    lineData.append(i, Math.sin(i * 0.1));
    scatterData.append(i, Math.cos(i * 0.1));
  }

  // Assign these dataseries to the line/scatter renderableseries
  scatterSeries.dataSeries = scatterData;
  lineSeries.dataSeries = lineData;

  // #region ExampleA
  // import {
  //   ZoomExtentsModifier, RubberBandZoomModifier,
  //   ZoomPanModifier, EExecuteOn
  // } from "scichart";

  // Add ZoomExtentsModifier and RubberBandZoomModifier
  sciChartSurface.chartModifiers.add(
    new ZoomExtentsModifier({ isAnimated: false })
  );
  sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier());

  // Add ZoomPanModifier enabled on right-mouse button
  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier({ executeOn: EExecuteOn.MouseRightButton })
  );

  // Part 2: Appending data in realtime
  //
  const updateDataFunc = () => {
    // Append another data-point to the chart. We use dataSeries.count()
    // to determine the current length before appending
    const i = lineData.count();
    lineData.append(i, Math.sin(i * 0.1));
    scatterData.append(i, Math.cos(i * 0.1));

    // Prevent changing visibleRange if user is zooming or panning
    if (sciChartSurface.zoomState !== EZoomState.UserZooming) {
      xAxis.visibleRange = new NumberRange(i - 1000, i);
    }
  };
  // #endregion

  // Repeat at 60Hz
  setInterval(updateDataFunc, 1000 / 60);
}

initSciChart();
