import React, { useState, useCallback } from "react";
import ChartPanel from "./ChartPanel";
import { ChartSpec, ChartType } from "./ChartSpec";
import { SciChartGroup } from "scichart-react";
import { DraggablePanel } from "./DraggablePanel";
import { DraggableProvider } from "./DraggableContext";
import { FpsControl } from "./FpsControl";

function App() {
  const [optimized, setOptimized] = useState(true);
  // Initialize chart specs. 50 charts of varying types
  const [charts] = useState<ChartSpec[]>(() => {
    const chartTypes = Object.values(ChartType);
    const cols = 4;
    return Array.from({ length: 50 }, (_, index) => ({
      chartType: chartTypes[index % chartTypes.length],
      pointCount: 200,
      dataUpdateRate: 1,
      chartTitle: `Chart ${index + 1}`,
      position: {
        left: `${(index % cols) * 25}%`,
        top: Math.floor(index / cols) * 200,
      },
    }));
  });

  return (
    <DraggableProvider>
      <div
        style={{
          padding: "10px",
          backgroundColor: "rgba(70, 130, 180, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "40px",
          boxSizing: "border-box",
        }}
      >
        <label style={{ color: "#333" }}>
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={(e) => setOptimized(e.target.checked)}
          />{" "}
          Optimize
        </label>
        <FpsControl />
      </div>
      <div
        className="App"
        style={{ position: "relative", height: "calc(100vh - 40px)" }}
      >
        <SciChartGroup>
          {charts.map((spec, index) => (
            <DraggablePanel key={index} positionable={spec} width="25%">
              <ChartPanel
                chartSpec={spec}
                optimized={optimized}
                style={{ width: "100%", height: "200px" }}
              />
            </DraggablePanel>
          ))}
        </SciChartGroup>
      </div>
    </DraggableProvider>
  );
}

export default App;
