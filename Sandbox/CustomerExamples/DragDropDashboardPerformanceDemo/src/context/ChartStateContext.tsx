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
  setPointCount: (value: number) => void;
  setDataUpdateRate: (value: number) => void;
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
    drawLabels: true,
    useNativeText: true,
    cacheLabels: true,
    hideOutOfView: true,
  });
  const [pointCount, setPointCount] = useState(200);
  const [chartCount] = useState(100);
  const [dataUpdateRate, setDataUpdateRate] = useState(1);

  const handlePropertyChange = useCallback(
    (propertyName: string, value: boolean | number) => {
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
        setPointCount,
        setDataUpdateRate,
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
