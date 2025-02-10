import React from "react";
import "./styles.css";
import { SciChartGroup, SciChartReact } from "scichart-react";
import { SciChartSurface, NumericAxis, SciChartJsNavyTheme } from "scichart";

const simpleChart = async (divElement, chartId) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElement,
    {
      title: `Chart ${chartId}`,
      titleStyle: { fontSize: 28 },
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "X Axis" })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "Y Axis" })
  );

  return { sciChartSurface };
};

function App() {
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
        {/* TODO: Add chart controls here */}
      </div>
      <SciChartGroup>
        <SciChartReact
          initChart={(div) => simpleChart(div, 0)}
          style={{ height: "300px" }}
        />
        <SciChartReact
          initChart={(div) => simpleChart(div, 1)}
          style={{ height: "300px" }}
        />
      </SciChartGroup>
    </div>
  );
}

export default App;
