import { useEffect, useRef } from "react";

export function usePinchZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  setZoomLevel: (fn: (prev: number) => number) => void
) {
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const lastDistRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const getPinchDist = (): number => {
      const [a, b] = [...pointersRef.current.values()];
      return Math.hypot(b.x - a.x, b.y - a.y);
    };

    const onPointerDown = (e: PointerEvent) => {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointersRef.current.size === 2) {
        lastDistRef.current = getPinchDist();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) return;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointersRef.current.size === 2 && lastDistRef.current !== null) {
        const dist = getPinchDist();
        const factor = dist / lastDistRef.current;
        setZoomLevel((prev) => Math.min(4, Math.max(1, prev * factor)));
        lastDistRef.current = dist;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) lastDistRef.current = null;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [containerRef, setZoomLevel]);
}
