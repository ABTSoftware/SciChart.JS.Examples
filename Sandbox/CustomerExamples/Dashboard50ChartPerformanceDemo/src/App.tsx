import React, { useState } from "react";
import ChartPanel from "./ChartPanel";
import { ChartSpec, ChartType } from "./ChartSpec";
import { SciChartGroup } from "scichart-react";

interface ChartPosition {
  left: number | string;
  top: number;
  isDragged?: boolean;
  zIndex: number;
}

function App() {
  const [maxZIndex, setMaxZIndex] = useState(1);
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
      isDragged: false,
      zIndex: 1,
    }));
  });

  // Dragging state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    setDragIndex(index);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    // Bring to front
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = {
        ...newPositions[index],
        zIndex: newZIndex,
      };
      return newPositions;
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragIndex !== null) {
      setPositions((prev) => {
        const newPositions = [...prev];
        newPositions[dragIndex] = {
          left: e.clientX - dragOffset.x,
          top: e.clientY - dragOffset.y,
          isDragged: true,
          zIndex: maxZIndex,
        };
        return newPositions;
      });
    }
  };

  const handleMouseUp = () => {
    setDragIndex(null);
  };

  return (
    <div
      className="App"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ position: "relative", height: "100vh" }}
    >
      <SciChartGroup>
        {charts.map((spec, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: positions[index].isDragged
                ? `${positions[index].left}px`
                : positions[index].left,
              top: `${positions[index].top}px`,
              width: "25%",
              cursor: dragIndex === index ? "grabbing" : "grab",
              zIndex: positions[index].zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(index, e)}
          >
            <ChartPanel
              chartSpec={spec}
              style={{ width: "100%", height: "200px" }}
            />
          </div>
        ))}
      </SciChartGroup>
    </div>
  );
}

export default App;
