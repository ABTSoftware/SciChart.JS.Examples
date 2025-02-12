import React, { useEffect, useRef } from "react";
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
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup subscription when component unmounts
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

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
