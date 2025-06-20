import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  FastLineRenderableSeries,
  XyScatterRenderableSeries,
  EllipsePointMarker,
} from "scichart";

async function initSciChart() {
  // #region ExampleA
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

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

  // SciChart will now redraw with static data
  //
  // #endregion

  // #region ExampleB

  let phase = 0.0;

  const updateDataFunc = () => {
    // update the datapoints in the dataseries
    // Note dataSeries.updateRange() passing in array is
    // higher performance for larger datasets vs. calling dataSeries.update() in a loop
    for (let i = 0; i < 1000; i++) {
      lineData.update(i, Math.sin(i * 0.1 + phase));
      scatterData.update(i, Math.cos(i * 0.1 + phase));
    }

    phase += 0.01;
  };

  // Update data at 60Hz
  setInterval(updateDataFunc, 1000 / 60);
  // #endregion
}

initSciChart();
