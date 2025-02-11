import React, { useState } from "react";
import ChartPanel from "./ChartPanel";
import { ChartSpec, ChartType } from "./ChartSpec";
import { SciChartGroup } from "scichart-react";

function App() {
  // Initialize chart specs. 50 charts of varying types
  const [charts] = useState<ChartSpec[]>(() => {
    const chartTypes = Object.values(ChartType);
    return Array.from({ length: 50 }, (_, index) => ({
      chartType: chartTypes[index % chartTypes.length],
      pointCount: 1000,
      dataUpdateRate: 1,
      chartTitle: `Chart ${index + 1}`,
    }));
  });

  return (
    <div className="App">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        <SciChartGroup>
          {charts.map((spec, index) => (
            <ChartPanel
              key={index}
              chartSpec={spec}
              style={{ width: "100%", height: "200px" }}
            />
          ))}
        </SciChartGroup>
      </div>
    </div>
  );
}

export default App;
