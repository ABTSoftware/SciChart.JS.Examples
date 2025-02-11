import React, { createContext, useContext, useState } from "react";

interface DraggableContextType {
  maxZIndex: number;
  bringToFront: () => number;
}

const DraggableContext = createContext<DraggableContextType | null>(null);

export function DraggableProvider({ children }: { children: React.ReactNode }) {
  const [maxZIndex, setMaxZIndex] = useState(1);

  const bringToFront = () => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    return newZIndex;
  };

  return (
    <DraggableContext.Provider value={{ maxZIndex, bringToFront }}>
      {children}
    </DraggableContext.Provider>
  );
}

export function useDraggable() {
  const context = useContext(DraggableContext);
  if (!context) {
    throw new Error("useDraggable must be used within a DraggableProvider");
  }
  return context;
}
