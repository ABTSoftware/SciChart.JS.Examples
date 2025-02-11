import React, { useState } from "react";
import { useDraggable } from "./DraggableContext";

interface DraggablePanelProps {
  children: React.ReactNode;
  initialPosition: {
    left: number | string;
    top: number;
  };
  width: string;
  onPositionChange?: (position: { left: number | string; top: number }) => void;
}

export function DraggablePanel({
  children,
  initialPosition,
  width,
  onPositionChange,
}: DraggablePanelProps) {
  const { bringToFront } = useDraggable();
  const [position, setPosition] = useState(initialPosition);
  const [isDragged, setIsDragged] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    const newZIndex = bringToFront();
    setZIndex(newZIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        left: e.clientX - dragOffset.x,
        top: e.clientY - dragOffset.y,
      };
      setPosition(newPosition);
      setIsDragged(true);
      onPositionChange?.(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: isDragged ? `${position.left}px` : position.left,
        top: `${position.top}px`,
        width,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {children}
    </div>
  );
}
