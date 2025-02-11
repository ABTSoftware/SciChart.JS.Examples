import React, { useState, useRef } from "react";
import "./styles.css";
import { SciChartGroup, SciChartReact } from "scichart-react";
import { initChart } from "./initChart";
import { DataManager } from "./DataManager";
// #region AxisSynchronizer
import { AxisSynchroniser } from "./AxisSynchronizer";

function App() {
  const [charts, setCharts] = useState([0, 1]); // Initialize with 2 charts
  const [axisSynchronizer, setAxisSynchronizer] = useState(
    new AxisSynchroniser()
  );
  // #endregion

  // Create a DataManager class to proxy fetching data
  const [dataManager] = useState(() => new DataManager());

  const addChart = () => {
    setCharts([...charts, charts.length]);
  };

  const removeChart = () => {
    if (charts.length > 0) {
      setCharts(charts.slice(0, -1));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>&lt;SciChartReact/&gt; chart groups</h1>
      </header>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          backgroundColor: "lightgrey",
          padding: "10px",
        }}
      >
        <button onClick={addChart} style={{ margin: "0 10px" }}>
          Add Chart
        </button>
        <button onClick={removeChart} style={{ margin: "0 10px" }}>
          Remove Chart
        </button>
      </div>
      <div style={{ height: "600px" }}>
        <SciChartGroup>
          {charts.map((chartId) => (
            // #region SciChartReact Component
            <SciChartReact
              key={chartId}
              initChart={(div) => initChart(div, chartId, "chartGroupId")}
              // After initialization, fetch data and call setData on the chart (see initChart.js)
              // onInit cannot be an async function, so use dataManager.fetchData().then() to update the chart
              onInit={(initResult) => {
                dataManager.fetchData(chartId).then((data) => {
                  initResult.setData(data.xValues, data.yValues);
                });

                // After init, add the chart to axis synchronizer
                axisSynchronizer.addAxis(
                  initResult.sciChartSurface.xAxes.get(0)
                );
              }}
              onDelete={(initResult) => {
                // After delete, remove the chart from axis synchronizer
                axisSynchronizer.removeAxis(
                  initResult.sciChartSurface.xAxes.get(0)
                );
              }}
              style={{ height: `${100 / charts.length}%` }}
            />
            // #endregion
          ))}
        </SciChartGroup>
      </div>
    </div>
  );
}

export default App;
