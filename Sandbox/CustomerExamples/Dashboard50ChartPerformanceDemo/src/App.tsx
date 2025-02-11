import React, { useState } from "react";
import ChartPanel from "./ChartPanel";
import { ChartSpec, ChartType } from "./ChartSpec";
import { SciChartGroup } from "scichart-react";
import { DraggablePanel } from "./DraggablePanel";
import { DraggableProvider } from "./DraggableContext";
import { FpsControl } from "./FpsControl";

function App() {
  // Initialize chart specs. 50 charts of varying types
  const [charts] = useState<ChartSpec[]>(() => {
    const chartTypes = Object.values(ChartType);
    const cols = 4;
    return Array.from({ length: 50 }, (_, index) => ({
      chartType: chartTypes[index % chartTypes.length],
      pointCount: 1000,
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
      <div className="App" style={{ position: "relative", height: "100vh" }}>
        <FpsControl />
        <SciChartGroup>
          {charts.map((spec, index) => (
            <DraggablePanel key={index} positionable={spec} width="25%">
              <ChartPanel
                chartSpec={spec}
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
