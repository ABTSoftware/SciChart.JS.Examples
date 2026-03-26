# Smith Chart Redesign Spec

## Goal

Replace the current `drawExample.ts` implementation (which draws ~40 circles/arcs as 200-point `XyDataSeries` polylines) with a new architecture using paired custom axis classes that draw true hardware-accelerated arcs via `renderContext.drawArcs`. This is SciChart-idiomatic, eliminates ~40 series objects and ~8000 data points, and produces geometrically perfect circles regardless of zoom level.

---

## Architecture

Split into two files:

### `smithChartAxes.ts` (new)

Exports:

-   `SmithResistanceTickProvider` — custom tick provider for R values
-   `SmithReactanceTickProvider` — custom tick provider for X values
-   `SmithChartResistanceAxis extends NumericAxis` — X axis; draws constant-R circles + unit circle + real axis
-   `SmithChartReactanceAxis extends NumericAxis` — Y axis; draws constant-X arcs (± mirrored)

### `drawExample.ts` (rewrite)

-   Wire `SmithChartResistanceAxis` as xAxis, `SmithChartReactanceAxis` as yAxis
-   Replace 3× `XyDataSeries` highlight series with 3× `ArcAnnotation`
-   Keep `SmithChartDragModifier` (unchanged logic)
-   Remove `preRender` aspect-ratio hack (no longer needed — `getArcParams` takes `aspectRatio`)
-   Keep all `TextAnnotation` readouts

---

## Smith Chart Mathematics

### Coordinate system

The Γ plane is a standard Cartesian plane (Γ_real on X axis, Γ_imag on Y axis). The unit circle is the boundary |Γ| = 1. Data lives within the unit disk.

### Constant-R circles (drawn by `SmithChartResistanceAxis`)

For normalised resistance `r`:

-   Centre: `(r/(1+r), 0)` in data coordinates
-   Radius: `1/(1+r)` in data coordinates
-   All circles pass through `(1, 0)` and are tangent to the right edge

### Constant-X arcs (drawn by `SmithChartReactanceAxis`)

For normalised reactance `x` (both `+x` and `-x` are mirrored):

-   Centre: `(1, 1/x)` in data coordinates (or `(1, -1/x)` for negative)
-   Radius: `1/|x|` in data coordinates
-   Arc runs from `(1, 0)` (right edge of chart) to unit-circle intersection:
    -   `xInt = (x²-1)/(1+x²)`, `yInt = ±2x/(1+x²)`

---

## The `drawGridLines` Override Pattern

Both axes follow the pattern from `PolarAxisBase.ts`:

```ts
protected drawGridLines(renderContext, tickCoords, pen, isMajor) {
    // 1. Get the sibling axis via this.parentSurface
    // 2. Get the viewport pixel dimensions from coordinate calculators
    // 3. Get raw data values (R or X) from this.getTicksWithCoords()
    //    (ignore the tickCoords parameter — it gives pixel positions but we need data values)
    // 4. For each data value, compute circle/arc centre and radius in data coords
    // 5. Convert to pixel coords using xCalc.getCoordinate() / yCalc.getCoordinate()
    // 6. Compute aspectRatio = xCalc.getCoordWidth(1) / yCalc.getCoordWidth(1)
    // 7. Call getArcParams(...) to create SCRTArcVertex
    // 8. Push into vecArcs, call renderContext.drawArcs(...)
}
```

### Axis cross-wiring

Like `PolarAxisBase`, in `measure()` each axis locates its sibling:

```ts
// In SmithChartResistanceAxis (X axis):
const yAxis = this.parentSurface.yAxes.get(0) as SmithChartReactanceAxis;
this.sibling = yAxis;

// In SmithChartReactanceAxis (Y axis):
const xAxis = this.parentSurface.xAxes.get(0) as SmithChartResistanceAxis;
this.sibling = xAxis;
```

Both axes need to know the sibling exists to draw grid lines that span the full viewport.

---

## Key SciChart APIs

### `getArcParams` (from `NativeObject.ts`)

```ts
getArcParams(
    wasmContext: TSciChart,
    centerX: number,    // pixel X of arc centre (in native/viewport coords)
    centerY: number,    // pixel Y of arc centre (FLIPPED: vpHeight - yCalc.getCoordinate(cy_data))
    startAngle: number, // radians; 0 = full circle start
    endAngle: number,   // radians; 2π = full circle
    radius: number,     // pixel radius
    innerRadius: number,// 0 for lines
    isGridLineMode: number, // 1 = anti-aliased arc line, 0 = filled sector
    aspectRatio: number,    // xCalc.getCoordWidth(1) / yCalc.getCoordWidth(1)
    lineThickness: number
): SCRTArcParams
```

### `renderContext.drawArcs` (from `WebGlRenderContext2D.ts`)

```ts
renderContext.drawArcs(
    vertices: VectorArcVertex,
    xCenter: number,  // pixel X of viewport reference centre (for rotation)
    yCenter: number,  // pixel Y (native, flipped)
    rotation: number, // 0 for Smith chart
    clipRect: Rect,
    pen: SCRTPen,
    brush?: SCRTBrush,
    left: number,     // svr.left (series view rect left)
    top: number       // svr.top
)
```

### `getVectorArcVertex` / `getArcVertex`

```ts
import { getVectorArcVertex, getArcVertex } from "scichart/Charting/Visuals/...";
// or from the same NativeObject imports as getArcParams
const vecArcs = getVectorArcVertex(wasmContext);
const arc = getArcVertex(wasmContext);
arc.MakeCircularArc(arcParms);
vecArcs.push_back(arc);
```

### WebGL Y-flip

In SciChart's native pixel space, Y is flipped: `nativeY = vpHeight - pixelY`

-   `vpHeight = yCalc.getCoordinate(yAxis.visibleRange.min)` (bottom of viewport)
-   Or compute from `renderContext` viewport dimensions

---

## `ArcAnnotation` for Interactive Highlights

Used for the 3 interactive highlight overlays (R circle, X arc, |Γ| circle).

### Full circle (for R highlight and |Γ| highlight)

```ts
// Circle centred at (cx, 0) with radius rad:
new ArcAnnotation({
    x1: cx - rad,
    y1: 0, // left point on diameter
    x2: cx + rad,
    y2: 0, // right point on diameter
    height: 0, // chord IS the diameter → height = 0 gives full circle
    isLineMode: true,
    stroke: "#FF4444",
    strokeThickness: 2.5,
});
```

**Update on drag:** set `.x1`, `.x2`, `.height` properties directly — no series rebuild.

### Arc segment (for X highlight)

For constant-X arc with circle centre `(cx, cy)`, start point `(1, 0)`, end point `(xInt, yInt)`:

```ts
const height = arcHeightFromCenter(1, 0, xInt, yInt, cx, cy);
new ArcAnnotation({
    x1: 1,
    y1: 0,
    x2: xInt,
    y2: yInt,
    height,
    isLineMode: true,
    stroke: "#4488FF",
    strokeThickness: 2.5,
});
```

### `arcHeightFromCenter` helper

Given two endpoints and the circle centre, compute the `height` parameter (perpendicular offset from chord midpoint to arc):

```ts
function arcHeightFromCenter(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number): number {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    const len = Math.sqrt(diffX * diffX + diffY * diffY);
    // Normal vector pointing from chord midpoint toward circle centre
    const normalX = diffY / len;
    const normalY = -diffX / len;
    // Project (centre - midpoint) onto normal
    return (cx - midX) * normalX + (cy - midY) * normalY;
}
```

---

## Tick Values

### `SmithResistanceTickProvider`

```ts
majorTicks = [0, 0.2, 0.5, 1, 2, 5, 10, 20, 50];
minorTicks = [0.1, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 1.4, 1.6, 1.8, 3, 4];
```

### `SmithReactanceTickProvider`

```ts
majorTicks = [0.2, 0.5, 1, 2, 5, 10, 20, 50]; // positive only; negative mirror is implicit
minorTicks = [0.1, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 1.4, 1.6, 1.8, 3, 4];
```

---

## Ownership of Grid Elements

| Element                     | Drawn by                                                                       |
| --------------------------- | ------------------------------------------------------------------------------ |
| Unit circle                 | `SmithChartResistanceAxis.drawGridLines` (r=0 case or always drawn separately) |
| Real axis line (horizontal) | `SmithChartResistanceAxis.drawGridLines`                                       |
| Constant-R circles          | `SmithChartResistanceAxis.drawGridLines`                                       |
| Constant-X arcs (+X)        | `SmithChartReactanceAxis.drawGridLines`                                        |
| Constant-X arcs (−X)        | `SmithChartReactanceAxis.drawGridLines` (mirrored)                             |
| R labels                    | `TextAnnotation` in `drawExample.ts` (unchanged)                               |
| X labels                    | `TextAnnotation` in `drawExample.ts` (unchanged)                               |
| Interactive highlights      | 3× `ArcAnnotation` in `drawExample.ts`                                         |
| Draggable point             | `XyScatterRenderableSeries` in `drawExample.ts` (unchanged)                    |
| Readout text                | `TextAnnotation` in `drawExample.ts` (unchanged)                               |

---

## What Gets Removed vs Kept

### Removed from `drawExample.ts`

-   `createCircle()` helper function
-   `createReactanceArc()` helper function
-   `createLine()` helper function
-   All `FastLineRenderableSeries` for grid circles/arcs (~40 series)
-   All `XyDataSeries` for grid circles/arcs
-   `preserveAspectRatio()` function
-   `preRender.subscribe()` aspect-ratio hack
-   `rCircleDS`, `xArcDS`, `gammaCircleDS` (`XyDataSeries`)
-   3× `FastLineRenderableSeries` for highlights
-   `populateRCircle()`, `populateXArc()`, `populateCircle()` functions

### Added to `drawExample.ts`

-   Import of `SmithChartResistanceAxis`, `SmithChartReactanceAxis` from `./smithChartAxes`
-   Import of `ArcAnnotation` from scichart
-   `arcHeightFromCenter()` helper
-   `rCircleAnnotation`, `xArcAnnotation`, `gammaCircleAnnotation` — 3× `ArcAnnotation`
-   `updateInteractiveElements()` sets `.x1/.x2/.height` on `ArcAnnotation` objects instead of rebuilding `XyDataSeries`

### Kept in `drawExample.ts` (unchanged)

-   `SciChartSurface.create()`
-   All `TextAnnotation` readouts
-   `SmithChartDragModifier` class
-   `pointDS` / `XyScatterRenderableSeries` (draggable dot)
-   `ZoomExtentsModifier`, `MouseWheelZoomModifier`, `PinchZoomModifier`
-   Impedance conversion formula: `Z = (1+Γ)/(1−Γ)`

---

## Files to Create/Modify

| File                | Action                                                                   |
| ------------------- | ------------------------------------------------------------------------ |
| `smithChartAxes.ts` | **Create** — tick providers + axis subclasses                            |
| `drawExample.ts`    | **Rewrite** — wire new axes, ArcAnnotation highlights, remove old series |

No other files need to change (index.tsx, exampleInfo.tsx, vanilla.ts are untouched).

---

## Open Questions / Risks

1. **Import paths for `getArcParams`, `getVectorArcVertex`, `getArcVertex`** — need to confirm exact import path from scichart package (likely `scichart/Charting/Visuals/RenderContext/NativeObject` or similar). Look at PolarAxisBase.ts imports.

2. **`drawGridLines` override signature** — confirm exact TypeScript signature from `AxisBase2D.ts`. It likely takes `(renderContext: WebGlRenderContext2D, tickCoords: number[], linesPen: SCRTPen, isMajor: boolean)`.

3. **`getTicksWithCoords()` method** — confirm this method exists on `AxisBase2D` and returns `{ majorTicks, minorTicks, majorTickCoords, minorTickCoords }` with the raw data values accessible.

4. **`ArcAnnotation` height=0 for full circle** — needs verification. The chord `(cx-rad, 0)` to `(cx+rad, 0)` is a diameter, so `height=0` should give a semicircle — may need `height` small positive/negative, or two arcs. **Alternative:** Use `x1=cx, y1=rad, x2=cx, y2=-rad` (vertical chord) to avoid ambiguity.

5. **Clip rectangle for `drawArcs`** — the `clipRect` parameter clips arcs to the unit circle. Determine whether to pass the series view rect or a custom unit-circle clip.

6. **`measure()` override** — confirm that `measure()` is the right lifecycle hook for setting `this.sibling`. It may need to be `onAttach()` or similar.

---

## Reference Files to Read Before Implementing

These files are in the SciChart source (likely under `C:\SciChart\SciChart.Dev.Alt\` or the npm package):

-   `Charting/Visuals/Axis/PolarAxisBase.ts` — the key pattern to follow
-   `Charting/Annotations/ArcAnnotation.ts` — full circle / arc annotation API
-   `Charting/Visuals/Axis/AxisBase2D.ts` — `drawGridLines` signature, `getTicksWithCoords`
-   `Charting/Visuals/RenderContext/NativeObject.ts` — `getArcParams`, `getVectorArcVertex`, `getArcVertex`
-   `Charting/Visuals/RenderContext/WebGlRenderContext2D.ts` — `drawArcs` signature
