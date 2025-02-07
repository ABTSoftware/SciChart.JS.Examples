import React, { useState } from "react";
import { SciChartReact } from "scichart-react";
import { ToggleButton } from "./ToggleButton";
import { ChartContext } from "./ChartContext";
import { initChart } from "./initChart";

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
            style={{
              backgroundColor: "#E0E0E0",
              color: "#333",
              border: "none",
              padding: "8px 16px",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "background 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              outline: "none",
            }}
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
