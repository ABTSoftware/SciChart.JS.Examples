
async function dataSeriesAppending(divElementId) {

  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    EAutoRange
  } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"

  // Create a chart surface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    title: "Appending Data example every 20ms",
    titleStyle: { fontSize: 16 }
  });

  // For the example to work, axis must have EAutoRange.Always
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisTitle: "X Axis autoranged" }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisTitle: "Y Axis autoranged" }));

  // Start off with N X,Y values in the series
  const xValues = [];
  const yValues = [];
  let i = 0;
  for(; i < 100; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
  }

  // #region ExampleA
  // Create a DataSeries
  const xyDataSeries = new XyDataSeries(wasmContext, {
    // Optional: pass X,Y values to DataSeries constructor for fast initialization
    xValues,
    yValues
  });

  // Create a renderableSeries and assign the dataSeries
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    dataSeries: xyDataSeries,
    strokeThickness: 3,
    stroke: "#50C7E0"
  }));

  // Now let's use a timeout to appendRange() 10 new values every 20ms. After N appends, reset the dataSeries
  let updateCount = 0;
  const updateCallback = () => {
    const xUpdate = [];
    const yUpdate = [];
    for(let j = 0; j < 10; i++, j++) {
      xUpdate.push(i);
      yUpdate.push(0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
    }
    xyDataSeries.appendRange(xUpdate, yUpdate);

    // Just putting this in to reset the dataseries after N updates. We don't want the codepen example to grow infinitely!
    if (++updateCount % 250 === 0) {
      xyDataSeries.clear();
      j = 0;
      updateCount = 0;
    }
  }

  setTimeout(() => {
    updateCallback();
    setInterval(updateCallback, 20);
  }, 20);
  // #endregion
}

dataSeriesAppending("scichart-root");



