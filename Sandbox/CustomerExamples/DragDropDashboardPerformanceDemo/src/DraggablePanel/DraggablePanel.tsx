import React, { useState, useRef, useEffect } from "react";
import { useDraggable } from "./DraggableContext";
import { Positionable } from "./Positionable";

interface DraggablePanelProps {
  children: React.ReactNode;
  positionable: Positionable;
  width: string;
}

interface WindowState {
  isMaximized: boolean;
  isMinimized: boolean;
  previousState?: {
    position: { left: number | string; top: number };
    width: string;
    height: string;
  };
}

// A DraggablePanel component that can be dragged around the screen on mouse-down
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
  const [windowState, setWindowState] = useState<WindowState>({
    isMaximized: false,
    isMinimized: false,
  });
  const [panelSize, setPanelSize] = useState({ width, height: "200px" });
  const resizeRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const handleMaximize = () => {
    console.log(`handleMaximise`);
    if (!windowState.isMaximized) {
      setWindowState((prev) => ({
        ...prev,
        isMaximized: true,
        previousState: {
          position: position,
          width: panelSize.width,
          height: panelSize.height,
        },
      }));
      const container = document.querySelector(".App");
      const scrollTop = container ? container.scrollTop : 0;
      setPosition({ left: 0, top: scrollTop });
      setPanelSize({ width: "100%", height: "100%" });
    } else {
      const prevState = windowState.previousState;
      if (prevState) {
        setWindowState((prev) => ({ ...prev, isMaximized: false }));
        setPosition(prevState.position);
        setPanelSize({ width: prevState.width, height: prevState.height });
      }
    }
    const newZIndex = bringToFront();
    setZIndex(newZIndex);
  };

  const handleMinimize = () => {
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const handleHeaderMouseDown = (e: React.PointerEvent) => {
    console.log(`handleHeaderMouseDown`);
    if (windowState.isMaximized) return;
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const container = document.querySelector(".App");
    const containerRect = container?.getBoundingClientRect() || { top: 0 };
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - (rect.top - containerRect.top),
    });
    setIsDragging(true);
    const newZIndex = bringToFront();
    setZIndex(newZIndex);
    element.setPointerCapture(e.pointerId);
  };

  const handleMouseMove = (e: React.PointerEvent) => {
    if (isDragging && !windowState.isMaximized) {
      const container = document.querySelector(".App");
      const scrollTop = container ? container.scrollTop : 0;
      const containerRect = container?.getBoundingClientRect();
      const newLeft = e.clientX - dragOffset.x;
      const newTop = e.clientY - dragOffset.y + scrollTop;

      const newPosition = {
        left: Math.max(0, newLeft),
        top: Math.max(0, newTop),
      };
      setPosition(newPosition);
      setIsDragged(true);
      positionable.position = newPosition;
    }

    if (resizeRef.current.isDragging && !windowState.isMaximized) {
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      // Update both dimensions simultaneously
      setPanelSize({
        width: `${Math.max(200, resizeRef.current.startWidth + deltaX)}px`,
        height: `${Math.max(100, resizeRef.current.startHeight + deltaY)}px`,
      });
    }
  };

  const handleMouseUp = (e: React.PointerEvent) => {
    if (isDragging) {
      const element = e.currentTarget as HTMLElement;
      element.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    resizeRef.current.isDragging = false;
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    const element = e.currentTarget as HTMLElement;
    element.setPointerCapture(e.pointerId);

    const panel = element.closest("[data-panel]") as HTMLElement;
    if (!panel) return;

    resizeRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: panel.offsetWidth,
      startHeight: panel.offsetHeight,
    };
    const newZIndex = bringToFront();
    setZIndex(newZIndex);
  };

  return (
    <div
      data-panel
      style={{
        position: "absolute",
        left: isDragged ? `${position.left}px` : position.left,
        top: `${position.top}px`,
        width: panelSize.width,
        height: windowState.isMinimized ? "20px" : panelSize.height,
        zIndex,
        border: "1px solid SteelBlue",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: windowState.isMinimized ? "height 0.2s ease-out" : "none",
      }}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
    >
      <div
        style={{
          height: "20px",
          backgroundColor: "rgba(70, 130, 180, 0.8)",
          cursor: windowState.isMaximized ? "default" : "grab",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          padding: "0 5px",
          justifyContent: "space-between",
        }}
        onPointerDown={handleHeaderMouseDown}
      >
        <span style={{ color: "white", fontSize: "12px" }}>
          {positionable.title}
        </span>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
            style={{
              width: "16px",
              height: "16px",
              border: "none",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            {windowState.isMinimized ? "+" : "-"}
          </button>
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            style={{
              width: "16px",
              height: "16px",
              border: "none",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            {windowState.isMaximized ? "❐" : "□"}
          </button>
        </div>
      </div>
      {!windowState.isMinimized && (
        <>
          <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "15px",
              height: "15px",
              cursor: "se-resize",
              backgroundColor: "transparent",
              backgroundImage: `linear-gradient(135deg, transparent 50%, rgba(70, 130, 180, 0.3) 50%)`,
              borderLeft: "1px solid rgba(70, 130, 180, 0.5)",
              borderTop: "1px solid rgba(70, 130, 180, 0.5)",
            }}
            onPointerDown={startResize}
          />
        </>
      )}
    </div>
  );
}
