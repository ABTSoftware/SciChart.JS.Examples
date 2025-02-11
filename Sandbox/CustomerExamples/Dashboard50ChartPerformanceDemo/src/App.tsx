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
    }));
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>SciChart.js with React hello world!</h1>
        <p>
          In this example we setup webpack, react and use scichart +
          scichart-react to create a simple chart with one X and Y axis
        </p>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        <SciChartGroup>
          {charts.map((spec, index) => (
            <ChartPanel key={index} chartSpec={spec} />
          ))}
        </SciChartGroup>
      </div>
    </div>
  );
}

export default App;
