import React from "react";
import { SciChartReact } from "scichart-react";
import { ChartSpec } from "./ChartSpec";
import { initChart } from "./initChart";

interface ChartPanelProps {
  chartSpec: ChartSpec;
  style?: React.CSSProperties;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ chartSpec, style }) => {
  // Use chartSpec properties as part of the key to force re-creation when they change
  const chartKey = `${chartSpec.drawLabels}-${chartSpec.useNativeText}-${chartSpec.reduceAxisElements}-${chartSpec.cacheLabels}`;

  return (
    <SciChartReact
      key={chartKey}
      initChart={async (rootElement) => initChart(rootElement, chartSpec)}
      onDelete={(initResult) => initResult.onDeleteChart()}
      style={style}
    />
  );
};

export default ChartPanel;
