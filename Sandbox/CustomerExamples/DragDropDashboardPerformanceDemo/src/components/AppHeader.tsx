import React from "react";
import { LabelControl } from "../Controls/LabelControl";
import { FpsControl } from "../FpsControl";
import { useChartState } from "../context/ChartStateContext";

export function AppHeader() {
  const { chartState, handlePropertyChange, chartCount, pointCount } =
    useChartState();

  return (
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
  );
}
