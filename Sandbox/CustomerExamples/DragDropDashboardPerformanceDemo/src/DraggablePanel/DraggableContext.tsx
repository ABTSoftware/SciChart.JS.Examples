import React, { createContext, useContext, useState } from "react";

interface DraggableContextType {
  maxZIndex: number;
  bringToFront: () => number;
}

const DraggableContext = createContext<DraggableContextType | null>(null);

export function DraggableProvider({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [maxZIndex, setMaxZIndex] = useState(1);

  // Brings the current draggable element to the front, called on click/mouse-down
  const bringToFront = () => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    return newZIndex;
  };

  return (
    <div style={style}>
      <DraggableContext.Provider value={{ maxZIndex, bringToFront }}>
        {children}
      </DraggableContext.Provider>
    </div>
  );
}

export function useDraggable() {
  const context = useContext(DraggableContext);
  if (!context) {
    throw new Error("useDraggable must be used within a DraggableProvider");
  }
  return context;
}
