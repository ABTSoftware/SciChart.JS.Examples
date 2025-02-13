import React from "react";
import { LabelControl } from "../Controls/LabelControl";
import { FpsControl } from "../FpsControl";
import { useChartState } from "../context/ChartStateContext";
import { DiscreteSlider } from "./DiscreteSlider";

export function AppHeader() {
  const {
    chartState,
    handlePropertyChange,
    chartCount,
    pointCount,
    setPointCount,
    setDataUpdateRate,
  } = useChartState();

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
        fontSize: "14px",
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
        label="Freeze Hidden Charts"
        checked={chartState.hideOutOfView}
        propertyName="hideOutOfView"
        onChange={handlePropertyChange}
      />
      <DiscreteSlider
        value={pointCount}
        onChange={(value) => {
          setPointCount(value);
          setDataUpdateRate(value / 100);
        }}
        marks={[
          { value: 0, label: "100" },
          { value: 1, label: "1k" },
          { value: 2, label: "10k" },
          { value: 3, label: "100k" },
        ]}
        values={[100, 1000, 10000, 100000]}
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
        <span>
          PointCount: {(chartCount * pointCount).toLocaleString("en-US")}
        </span>
        <FpsControl />
      </div>
    </div>
  );
}
