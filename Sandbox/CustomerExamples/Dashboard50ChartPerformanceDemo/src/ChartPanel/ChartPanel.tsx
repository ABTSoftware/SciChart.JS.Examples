import React from "react";
import { SciChartReact } from "scichart-react";
import { ChartSpec } from "./ChartSpec";
import { initChart } from "./initChart";

interface ChartPanelProps {
  chartSpec: ChartSpec;
  style?: React.CSSProperties;
  optimized?: boolean;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({
  chartSpec,
  style,
  optimized = true,
}) => {
  return (
    <SciChartReact
      initChart={async (rootElement) =>
        initChart(rootElement, chartSpec, optimized)
      }
      onDelete={(initResult) => initResult.onDeleteChart()}
      style={style}
    />
  );
};

export default ChartPanel;
