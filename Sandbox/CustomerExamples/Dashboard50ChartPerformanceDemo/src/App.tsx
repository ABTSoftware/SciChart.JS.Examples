import React, { useState } from "react";
import ChartPanel from "./ChartPanel";
import { ChartSpec, ChartType } from "./ChartSpec";
import { SciChartGroup } from "scichart-react";
import { DraggablePanel } from "./DraggablePanel";
import { DraggableProvider } from "./DraggableContext";

interface ChartPosition {
  left: number | string;
  top: number;
}

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

  // Store positions for each chart
  const [positions, setPositions] = useState<ChartPosition[]>(() => {
    const cols = 4;
    return charts.map((_, index) => ({
      left: `${(index % cols) * 25}%`,
      top: Math.floor(index / cols) * 200,
    }));
  });

  const handlePositionChange = (index: number, newPosition: ChartPosition) => {
    setPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = newPosition;
      return newPositions;
    });
  };

  return (
    <DraggableProvider>
      <div className="App" style={{ position: "relative", height: "100vh" }}>
        <SciChartGroup>
          {charts.map((spec, index) => (
            <DraggablePanel
              key={index}
              initialPosition={positions[index]}
              width="25%"
              onPositionChange={(newPosition) =>
                handlePositionChange(index, newPosition)
              }
            >
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
