import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import ChartPanel from "./ChartPanel/ChartPanel";
import { ChartSpec, ChartType } from "./ChartPanel/ChartSpec";
import { SciChartGroup } from "scichart-react";
import { DraggablePanel } from "./DraggablePanel/DraggablePanel";
import { DraggableProvider } from "./DraggablePanel/DraggableContext";
import { ChartStateProvider, useChartState } from "./context/ChartStateContext";
import { AppHeader } from "./components/AppHeader";

function AppContent() {
  const { chartState, chartCount, pointCount, dataUpdateRate } =
    useChartState();

  // There's a lot of charts here! Scroll them into view
  useScrollAnimation();

  // Initialize chart specs. 50 charts of varying types
  const [charts, setCharts] = useState<ChartSpec[]>(() => {
    const chartTypes = Object.values(ChartType);
    const cols = 4;
    return Array.from({ length: chartCount }, (_, index) => ({
      chartType: chartTypes[index % chartTypes.length],
      pointCount,
      dataUpdateRate: dataUpdateRate,
      title: `Chart ${index + 1}`,
      position: {
        left: `${(index % cols) * 25}%`,
        top: Math.floor(index / cols) * 200,
      },
      drawLabels: chartState.drawLabels,
      useNativeText: chartState.useNativeText,
      reduceAxisElements: chartState.reduceAxisElements,
      cacheLabels: chartState.cacheLabels,
      hideOutOfView: chartState.hideOutOfView,
    }));
  });

  // Update charts when chartState changes
  useEffect(() => {
    setCharts((prevCharts) =>
      prevCharts.map((chart) => ({
        ...chart,
        drawLabels: chartState.drawLabels,
        useNativeText: chartState.useNativeText,
        reduceAxisElements: chartState.reduceAxisElements,
        cacheLabels: chartState.cacheLabels,
        hideOutOfView: chartState.hideOutOfView,
      }))
    );
  }, [chartState]);

  return (
    <DraggableProvider
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AppHeader />
      <div
        className="App"
        style={{
          position: "relative",
          height: "calc(100vh - 40px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <SciChartGroup>
          {charts.map((spec, index) => (
            <DraggablePanel key={index} positionable={spec} width="25%">
              <ChartPanel
                chartSpec={spec}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </DraggablePanel>
          ))}
        </SciChartGroup>
      </div>
    </DraggableProvider>
  );
}

function App() {
  return (
    <ChartStateProvider>
      <AppContent />
    </ChartStateProvider>
  );
}

export default App;
