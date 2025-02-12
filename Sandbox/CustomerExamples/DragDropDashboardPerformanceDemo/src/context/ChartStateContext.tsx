import React, { createContext, useContext, useState, useCallback } from "react";

interface ChartState {
  reduceAxisElements: boolean;
  drawLabels: boolean;
  useNativeText: boolean;
  cacheLabels: boolean;
  hideOutOfView: boolean;
}

interface ChartStateContextType {
  chartState: ChartState;
  handlePropertyChange: (propertyName: string, value: boolean) => void;
  pointCount: number;
  chartCount: number;
  dataUpdateRate: number;
}

const ChartStateContext = createContext<ChartStateContextType | undefined>(
  undefined
);

export function ChartStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chartState, setChartState] = useState<ChartState>({
    reduceAxisElements: true,
    drawLabels: false,
    useNativeText: true,
    cacheLabels: true,
    hideOutOfView: true,
  });
  const [pointCount] = useState(200);
  const [chartCount] = useState(100);
  const [dataUpdateRate] = useState(1);

  const handlePropertyChange = useCallback(
    (propertyName: string, value: boolean) => {
      setChartState((prev) => ({ ...prev, [propertyName]: value }));
    },
    []
  );

  return (
    <ChartStateContext.Provider
      value={{
        chartState,
        handlePropertyChange,
        pointCount,
        chartCount,
        dataUpdateRate,
      }}
    >
      {children}
    </ChartStateContext.Provider>
  );
}

export function useChartState() {
  const context = useContext(ChartStateContext);
  if (context === undefined) {
    throw new Error("useChartState must be used within a ChartStateProvider");
  }
  return context;
}
