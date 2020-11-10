import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";

async function initSciChart() {
  // Below find a trial / BETA key for SciChart.js.
  // This Expires in 30 days - or 14th November 2020
  // Set this license key once in your app before calling SciChartSurface.create, e.g.
  // SciChartSurface.setRuntimeLicenseKey(
  //     "YOUR_RUNTIME_KEY"
  // );

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

  const lineSeries = new FastLineRenderableSeries(wasmContext, {
    stroke: "orange",
  });
  lineSeries.strokeThickness = 3;
  sciChartSurface.renderableSeries.add(lineSeries);

  lineSeries.dataSeries = new XyDataSeries(wasmContext, {
    xValues: [50, 300, 550],
    yValues: [50, 300, 550],
  });

  sciChartSurface.chartModifiers.add(new ZoomPanModifier());

  // That's it! You just created your first SciChartSurface!
}

function App() {
  React.useEffect(() => {
    console.log("on load");
    initSciChart();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div id="scichart-root" style={{ width: 600, margin: "auto" }} />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
