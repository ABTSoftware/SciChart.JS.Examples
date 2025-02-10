import React, { useState } from "react";
import "./styles.css";
import { SciChartGroup, SciChartReact } from "scichart-react";
import { SciChartSurface, NumericAxis, SciChartJsNavyTheme } from "scichart";

const simpleChart = async (divElement, chartId) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElement,
    {
      title: `Chart ${chartId}`,
      titleStyle: { fontSize: 16 },
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "X Axis",
      axisTitleStyle: { fontSize: 12 },
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Y Axis",
      axisTitleStyle: { fontSize: 12 },
    })
  );

  return { sciChartSurface };
};

function App() {
  const [charts, setCharts] = useState([0, 1]); // Initialize with 2 charts

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
              initChart={(div) => simpleChart(div, chartId)}
              style={{ height: `${100 / charts.length}%` }}
            />
          ))}
        </SciChartGroup>
      </div>
    </div>
  );
}

export default App;
