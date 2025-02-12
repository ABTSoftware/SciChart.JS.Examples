import React, { useState, useCallback } from "react";
import { LabelControl } from "./Controls/LabelControl";
import ChartPanel from "./ChartPanel/ChartPanel";
import { ChartSpec, ChartType } from "./ChartPanel/ChartSpec";
import { SciChartGroup } from "scichart-react";
import { DraggablePanel } from "./DraggablePanel/DraggablePanel";
import { DraggableProvider } from "./DraggablePanel/DraggableContext";
import { FpsControl } from "./FpsControl";

function App() {
  const [chartState, setChartState] = useState({
    reduceAxisElements: true,
    drawLabels: false,
    useNativeText: true,
    cacheLabels: true,
    hideOutOfView: true,
  });
  const [pointCount, setPointCount] = useState(200);
  const [chartCount, setChartCount] = useState(100);
  const [dataUpdateRate, setDataUpdateRate] = useState(1);

  const handlePropertyChange = useCallback(
    (propertyName: string, value: boolean) => {
      setChartState((prev) => ({ ...prev, [propertyName]: value }));
      setCharts((charts) =>
        charts.map((chart) => ({
          ...chart,
          [propertyName]: value,
        }))
      );
    },
    []
  );

  // Initialize chart specs. 50 charts of varying types
  const [charts, setCharts] = useState<ChartSpec[]>(() => {
    const chartTypes = Object.values(ChartType);
    const cols = 4;
    return Array.from({ length: chartCount }, (_, index) => ({
      chartType: chartTypes[index % chartTypes.length],
      pointCount,
      dataUpdateRate: dataUpdateRate,
      chartTitle: `Chart ${index + 1}`,
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

  return (
    <DraggableProvider
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          padding: "10px",
          backgroundColor: "rgba(70, 130, 180, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "40px",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <LabelControl
          label="Reduce Axis Elements"
          checked={chartState.reduceAxisElements}
          propertyName="reduceAxisElements"
          onChange={handlePropertyChange}
        />
        <LabelControl
          label="Draw Labels"
          checked={chartState.drawLabels}
          propertyName="drawLabels"
          onChange={handlePropertyChange}
        />
        <LabelControl
          label="Native Text"
          checked={chartState.useNativeText}
          propertyName="useNativeText"
          onChange={handlePropertyChange}
        />
        <LabelControl
          label="Cache Labels"
          checked={chartState.cacheLabels}
          propertyName="cacheLabels"
          onChange={handlePropertyChange}
        />
        <LabelControl
          label="Freeze Charts out of view"
          checked={chartState.hideOutOfView}
          propertyName="hideOutOfView"
          onChange={handlePropertyChange}
        />
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: "20px",
            color: "#333",
          }}
        >
          <span>ChartCount: {chartCount}</span>
          <span>PointCount: {chartCount * pointCount}</span>
          <FpsControl />
        </div>
      </div>
      <div
        className="App"
        style={{
          position: "relative",
          height: "calc(100vh - 40px)",
          overflowY: "auto",
        }}
      >
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
