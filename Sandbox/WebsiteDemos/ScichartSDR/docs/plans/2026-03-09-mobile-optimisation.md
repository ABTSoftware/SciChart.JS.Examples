# Mobile Optimisation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix Android Chrome layout break, prevent browser zoom hijacking touch events, add pinch-to-zoom on the spectrum/waterfall charts, and use lower-load defaults on mobile.

**Architecture:** Four independent changes — viewport meta fix, CSS `dvh` + `touch-action` fix, a new `usePinchZoom` hook wired into the existing `chartsContainerRef`, and mobile-aware initial state in `useReceiverSettings`. No new dependencies.

**Tech Stack:** React 19, TypeScript, CSS, Pointer Events API

---

### Task 1: Viewport meta — prevent browser zoom hijacking touch

**Files:**
- Modify: `index.html`

**Step 1: Update the viewport meta tag**

Replace:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

With:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

`user-scalable=no` prevents the browser from intercepting pinch gestures as page zoom. Without this, touching the charts triggers browser zoom instead of reaching the app's pointer events.

**Step 2: Verify build**

```bash
npm run build
```

Expected: clean build, no errors.

**Step 3: Commit**

```bash
git add index.html
git commit -m "fix: prevent browser zoom hijacking touch events on mobile"
```

---

### Task 2: CSS — fix 100dvh layout and add touch-action on charts

**Files:**
- Modify: `src/App.css`

**Step 1: Fix `100vh` → `100dvh` and add touch-action**

Find and replace the following in `src/App.css`.

**Change 1** — `.receiver-page`: replace `height: 100vh` with `height: 100dvh`.

Before:
```css
.receiver-page {
  height: 100vh;
  padding: 2px;
```

After:
```css
.receiver-page {
  height: 100dvh;
  padding: 2px;
```

**Change 2** — inside `@media (max-width: 900px)`, `.receiver-frame`: replace `height: 100vh` with `height: 100dvh`.

Before (inside the 900px media query):
```css
  .receiver-frame {
    border-radius: 0;
    height: 100vh;
    min-height: 0;
  }
```

After:
```css
  .receiver-frame {
    border-radius: 0;
    height: 100dvh;
    min-height: 0;
  }
```

**Change 3** — inside `@media (max-width: 600px)`, `.controls-panel`: replace `max-height: 50vh` with `max-height: 50dvh`.

Before (inside the 600px media query):
```css
  .controls-panel {
    max-height: 50vh;
    overflow-y: auto;
  }
```

After:
```css
  .controls-panel {
    max-height: 50dvh;
    overflow-y: auto;
  }
```

**Change 4** — add `touch-action: none` to `.receiver-charts` so single-finger swipes are not intercepted as page scroll:

Before:
```css
.receiver-charts {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #020c18;
  overflow: hidden;
}
```

After:
```css
.receiver-charts {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #020c18;
  overflow: hidden;
  touch-action: none;
}
```

**Step 2: Verify build**

```bash
npm run build
```

Expected: clean build, no errors.

**Step 3: Commit**

```bash
git add src/App.css
git commit -m "fix: use 100dvh for mobile address bar, touch-action none on charts"
```

---

### Task 3: usePinchZoom hook

**Files:**
- Create: `src/features/receiver/hooks/usePinchZoom.ts`
- Modify: `src/features/receiver/hooks/index.ts`

**Step 1: Create the hook**

Create `src/features/receiver/hooks/usePinchZoom.ts`:

```ts
import { useEffect, useRef } from "react";

export function usePinchZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  setZoomLevel: (fn: (prev: number) => number) => void,
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
```

Key points:
- Only activates when `pointersRef.current.size === 2` — single-finger interactions are untouched.
- `lastDistRef` is reset to `null` when finger count drops below 2, preventing jumps when a new pinch starts.
- Cleans up all listeners on unmount.

**Step 2: Export from index**

In `src/features/receiver/hooks/index.ts`, add:

```ts
export { usePinchZoom } from "./usePinchZoom";
```

Full file after edit:
```ts
export { useFrequency } from "./useFrequency";
export { usePinchZoom } from "./usePinchZoom";
export { useRadio } from "./useRadio";
export { useReceiverSettings } from "./useReceiverSettings";
```

**Step 3: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no TypeScript errors.

**Step 4: Commit**

```bash
git add src/features/receiver/hooks/usePinchZoom.ts src/features/receiver/hooks/index.ts
git commit -m "feat: add usePinchZoom hook for two-finger zoom on charts"
```

---

### Task 4: Wire usePinchZoom into App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Import the hook**

In `src/App.tsx`, add to the existing hook imports:

```ts
import { useFrequency } from "./features/receiver/hooks/useFrequency";
import { usePinchZoom } from "./features/receiver/hooks/usePinchZoom";
import { useReceiverSettings } from "./features/receiver/hooks/useReceiverSettings";
import { useRadio } from "./features/receiver/hooks/useRadio";
```

**Step 2: Call the hook**

In the `App` function body, the existing wheel zoom handler is:

```ts
const { setZoomLevel } = frequency;
useEffect(() => {
  const container = chartsContainerRef.current;
  if (!container) return;
  const handler = (e: WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.87;
    setZoomLevel((prev) => Math.min(4, Math.max(1, prev * factor)));
  };
  container.addEventListener("wheel", handler, { passive: false });
  return () => container.removeEventListener("wheel", handler);
}, [setZoomLevel]);
```

Directly after this `useEffect`, add:

```ts
usePinchZoom(chartsContainerRef, setZoomLevel);
```

**Step 3: Verify build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire pinch-to-zoom on spectrum/waterfall charts"
```

---

### Task 5: Mobile-aware defaults in useReceiverSettings

**Files:**
- Modify: `src/features/receiver/hooks/useReceiverSettings.ts`

**Step 1: Add mobile detection and apply to initial state**

At the top of `useReceiverSettings.ts`, after the imports, add:

```ts
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
```

Then update three `useState` initializers:

**`sampleRate`** — change from:
```ts
const [sampleRate, setSampleRate] = useState(2_048_000);
```
To:
```ts
const [sampleRate, setSampleRate] = useState(isMobile ? 1_024_000 : 2_048_000);
```

**`fftSize`** — change from:
```ts
const [fftSize, setFftSize] = useState(FFT_SIZE);
```
To:
```ts
const [fftSize, setFftSize] = useState(isMobile ? 1024 : FFT_SIZE);
```

**`performanceTradeoff`** — change from:
```ts
const [performanceTradeoff, setPerformanceTradeoff] =
  useState<PerformanceTradeoff>("cpu");
```
To:
```ts
const [performanceTradeoff, setPerformanceTradeoff] =
  useState<PerformanceTradeoff>(isMobile ? "latency" : "cpu");
```

The `isMobile` const is defined once in module scope (outside the hook function), so it's evaluated once per page load and does not cause re-renders.

Note: `FFT_SIZE` is imported from `../constants` and equals `2048`. The mobile fallback `1024` is hardcoded (not a new constant) since it's only used in one place.

**Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: clean build, no errors.

**Step 3: Commit**

```bash
git add src/features/receiver/hooks/useReceiverSettings.ts
git commit -m "fix: use lower sample rate and FFT size by default on mobile"
```
