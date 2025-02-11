import React, { useState } from "react";
import { useDraggable } from "./DraggableContext";
import { Positionable } from "./Positionable";

interface DraggablePanelProps {
  children: React.ReactNode;
  positionable: Positionable;
  width: string;
}

export function DraggablePanel({
  children,
  positionable,
  width,
}: DraggablePanelProps) {
  const { bringToFront } = useDraggable();
  const [position, setPosition] = useState(positionable.position);
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
      positionable.position = newPosition;
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
        border: "1px solid SteelBlue",
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
