import React, { useState } from "react";
import { SciChartReact } from "scichart-react";
import { ToggleButton } from "./ToggleButton";
import { ChartContext } from "./ChartContext";
import { initChart } from "./initChart";
import "./styles.css";

function App() {
  const [chartState, setChartState] = useState(null);

  return (
    <ChartContext.Provider value={{ chartState, setChartState }}>
      <div className="App">
        <header className="App-header">
          <h1>&lt;SciChartReact/&gt; with custom chart controls</h1>
        </header>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            backgroundColor: "lightgrey",
            padding: "10px",
          }}
        >
          <ToggleButton label="Zoom" modifierKey="rubberBandZoomModifier" />
          <ToggleButton label="Pan" modifierKey="zoomPanModifier" />
          <ToggleButton label="Tooltip" modifierKey="rolloverModifier" />
          <button
            onClick={() => chartState?.sciChartSurface?.zoomExtents(500)}
            className={`normal-button`}
          >
            Zoom to Fit
          </button>
        </div>
        <SciChartReact
          initChart={initChart}
          onInit={(initResult) => setChartState(initResult)}
          style={{ maxWidth: 900, height: 600 }}
        ></SciChartReact>
      </div>
    </ChartContext.Provider>
  );
}

export default App;
