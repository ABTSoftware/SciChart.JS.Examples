import React, { useState, useRef } from "react";
import "./styles.css";
import { SciChartGroup, SciChartReact } from "scichart-react";
import { initChart } from "./initChart";
import { DataManager } from "./DataManager";

function App() {
  const [charts, setCharts] = useState([0, 1]); // Initialize with 2 charts
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
            <SciChartReact
              key={chartId}
              initChart={(div) => initChart(div, chartId)}
              onInit={async (initResult) => {
                const data = await dataManager.fetchData(chartId);
                initResult.setData(data.xValues, data.yValues);
              }}
              style={{ height: `${100 / charts.length}%` }}
            />
          ))}
        </SciChartGroup>
      </div>
    </div>
  );
}

export default App;
