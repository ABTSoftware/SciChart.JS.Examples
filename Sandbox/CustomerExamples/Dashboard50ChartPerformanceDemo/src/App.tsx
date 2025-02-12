import React, { useState } from "react";
import ChartPanel from "./ChartPanel/ChartPanel";
import { ChartSpec, ChartType } from "./ChartPanel/ChartSpec";
import { SciChartGroup } from "scichart-react";
import { DraggablePanel } from "./DraggablePanel/DraggablePanel";
import { DraggableProvider } from "./DraggablePanel/DraggableContext";
import { FpsControl } from "./FpsControl";

function App() {
  const [reduceAxisElements, setReduceAxisElements] = useState(true);
  const [drawLabels, setDrawLabels] = useState(false);
  const [useNativeText, setUseNativeText] = useState(true);
  const [cacheLabels, setCacheLabels] = useState(true);
  const [pointCount, setPointCount] = useState(200);
  const [chartCount, setChartCount] = useState(50);
  const [dataUpdateRate, setDataUpdateRate] = useState(1);
  const [hideOutOfView, setHideOutOfView] = useState(true);

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
      drawLabels: drawLabels,
      useNativeText: useNativeText,
      reduceAxisElements: reduceAxisElements,
      cacheLabels: cacheLabels,
      hideOutOfView: hideOutOfView,
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
            onChange={(e) => {
              setReduceAxisElements(e.target.checked);
              setCharts((charts) =>
                charts.map((chart) => ({
                  ...chart,
                  reduceAxisElements: e.target.checked,
                }))
              );
            }}
          />{" "}
          Reduce Axis Elements
        </label>
        <label style={{ color: "#333" }}>
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={(e) => {
              setDrawLabels(e.target.checked);
              setCharts((charts) =>
                charts.map((chart) => ({
                  ...chart,
                  drawLabels: e.target.checked,
                }))
              );
            }}
          />{" "}
          Draw Labels
        </label>
        <label style={{ color: "#333" }}>
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={(e) => {
              setUseNativeText(e.target.checked);
              setCharts((charts) =>
                charts.map((chart) => ({
                  ...chart,
                  useNativeText: e.target.checked,
                }))
              );
            }}
          />{" "}
          Native Text
        </label>
        <label style={{ color: "#333" }}>
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={(e) => {
              setCacheLabels(e.target.checked);
              setCharts((charts) =>
                charts.map((chart) => ({
                  ...chart,
                  cacheLabels: e.target.checked,
                }))
              );
            }}
          />{" "}
          Cache Labels
        </label>
        <label style={{ color: "#333" }}>
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={(e) => {
              setHideOutOfView(e.target.checked);
              setCharts((charts) =>
                charts.map((chart) => ({
                  ...chart,
                  hideOutOfView: e.target.checked,
                }))
              );
            }}
          />{" "}
          Freeze Charts out of view
        </label>
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
        style={{ position: "relative", height: "calc(100vh - 40px)" }}
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
