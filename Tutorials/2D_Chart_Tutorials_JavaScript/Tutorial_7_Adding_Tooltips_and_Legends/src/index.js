import {
  SciChartSurface,
  NumericAxis,
  XyDataSeries,
  FastLineRenderableSeries,
  RolloverModifier,
  LegendModifier,
  CursorModifier,
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

  // Create 5 dataseries, each with 10k points
  for (let seriesCount = 0; seriesCount < 5; seriesCount++) {
    const xyDataSeries = new XyDataSeries(wasmContext);

    const opacity = (1 - seriesCount / 5).toFixed(2);

    // Populate with some data
    for (let i = 0; i < 10000; i++) {
      xyDataSeries.append(
        i,
        Math.sin(i * 0.01) * Math.exp(i * (0.00001 * (seriesCount * 10 + 1)))
      );
    }

    // Add and create a line series with this data to the chart
    // Create a line series
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
      dataSeries: xyDataSeries,
      stroke: `rgba(176,196,222,${opacity})`,
      strokeThickness: 2,
    });
    sciChartSurface.renderableSeries.add(lineSeries);
  }
  // #endregion

  // #region ExampleB

  // ...
  // import { LegendModifier } from "scichart";
  //
  // Add a Legend
  sciChartSurface.chartModifiers.add(
    new LegendModifier({ showCheckboxes: true })
  );

  // #endregion

  // #region ExampleC

  // ...
  // import { CursorModifier } from "scichart";
  //
  // Add axis label tooltips using CursorModifier
  const cursorModifier = new CursorModifier({
    axisLabelFill: "#FFFFFF",
    axisLabelStroke: "#00FF00",
    showAxisLabels: true,
    showTooltip: false,
    showXLine: true,
    showYLine: true,
  });
  sciChartSurface.chartModifiers.add(cursorModifier);

  // #endregion

  // #region ExampleD

  // ...
  // import { RolloverModifier } from "scichart";
  //
  // Add a tooltip behavior using the RolloverModifier
  const tooltipModifier = new RolloverModifier({
    showTooltip: true,
    showAxisLabel: true,
    showRolloverLine: true,
    rolloverLineStroke: "#FF6600",
    rolloverLineStrokeThickness: 2,
  });
  sciChartSurface.chartModifiers.add(tooltipModifier);

  // #endregion

  // Add an event listener to enable/disable the Tooltips
  const inputEnableTooltip = document.getElementById("enable-tooltip");
  inputEnableTooltip.addEventListener("input", (event) => {
    tooltipModifier.isEnabled = inputEnableTooltip.checked;
    console.log("Enabling Tooltip");
  });
}

initSciChart();
