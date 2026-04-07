# Smith Chart — Annotations & Interactions Design

**Date:** 2026-04-07  
**Scope:** Tier 1 (full readouts, outer rim scales, multiple markers) + Tier 2 (admittance overlay, VSWR circle, component chain)  
**Location:** `Examples/src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/`

---

## 1. Architecture

**Approach:** React state owns all app state; SciChart is the render target updated imperatively via adapter modules.

### File structure

```
SmithChart/
├── drawExample.ts          — init SciChart, wire all modules together, export drawExample
├── smithChartAxes.ts       — existing: SmithChartResistanceAxis, SmithChartReactanceAxis
│                             + add unit circle arc + angle rim drawing here
├── smithChartMarkers.ts    — NEW: marker creation, drag callbacks, per-marker readout
├── smithChartChain.ts      — NEW: component chain state, arc point computation, series management
├── smithChartRim.ts        — NEW: helper functions for rim tick/label drawing (called by axes)
├── smithChartAdmittance.ts — NEW: admittance grid axes (180°-rotated clones of impedance axes)
├── useSmithChart.ts        — NEW: React hook; single source of truth for all app state
└── index.tsx               — existing: layout, toolbar, readout panel (React)
```

### React state shape

```ts
type Marker = {
  id: string;
  label: string; // "M1", "M2", …
  gamma: { re: number; im: number };
  isChainStart: boolean;
};

type ComponentType =
  | "seriesL"
  | "seriesC"
  | "seriesR"
  | "shuntL"
  | "shuntC"
  | "shuntR"
  | "TL";

type ChainStep = {
  id: string;
  type: ComponentType;
  value: number; // SI units (H, F, Ω) or wavelengths for TL
  frequency: number; // Hz — global at time of adding step
  fromGamma: { re: number; im: number };
  toGamma: { re: number; im: number };
  arcPoints: { re: number; im: number }[];
};

type SmithState = {
  markers: Marker[];
  chain: ChainStep[];
  chainStartGamma: { re: number; im: number } | null; // if not from a marker
  activeMarkerId: string | null;
  frequency: number; // Hz — global frequency for reactive components
  vswr: number; // VSWR target circle value
  vswrShaded: boolean; // shade interior of VSWR circle
  gridMode: "Z" | "Y" | "ZY";
  zOpacity: number; // 0–1
  yOpacity: number; // 0–1
};
```

Each SciChart module exports an adapter class constructed once at init with an `update(state: SmithState)` method. `drawExample.ts` calls `adapter.update(state)` in a `useEffect` for each module.

### UI layout

```
┌─────────────────────────────────────────────────┬────────────────┐
│                                                 │  READOUT PANEL │
│              SciChart Surface                   │  ▼ M1 (red)   │
│                                                 │    Γ = …      │
│                                                 │    Z = …      │
│                                                 │    VSWR = …   │
│                                                 │  ► M2 (blue)  │
│                                                 │                │
│                                                 │  CHAIN STEPS   │
│                                                 │  → Series L … │
└─────────────────────────────────────────────────┴────────────────┘
│ [Z][Y][ZY]  Z ▓▓░  Y ▓░░  |  freq [1GHz]  [+Marker]  [Series L▼] [10nH] [Add] [Undo]  |  VSWR [2.0] ↕ [shade] │
```

---

## 2. Markers & Readout Panel (`smithChartMarkers.ts`)

### Lifecycle

- **Place:** click inside unit circle → new marker, auto-label M1/M2/…
- **Drag:** `CustomAnnotation` with `isEditable: true`; `dragDelta` callback updates React state
- **Delete / promote:** right-click context menu → "Delete" or "Use as chain start"
- **Promote:** sets `marker.isChainStart = true`; chain module uses this as origin

> **Note:** Read `SciChartDemo/src/components/Examples/FeaturedApps/WaveHeatmapInteractions` for custom modifier and drag interaction patterns before implementing.

### Per-marker readouts (all from `gamma.re`, `gamma.im`)

| Field         | Formula                       |
| ------------- | ----------------------------- |
| Γ             | `re + j·im`                   |
| \|Γ\|         | `√(re²+im²)`                  |
| ∠Γ            | `atan2(im, re)` in degrees    |
| Z = r+jx      | `(1+Γ)/(1−Γ)`                 |
| Y = g+jb      | `1/Z`                         |
| VSWR          | `(1+\|Γ\|)/(1−\|Γ\|)`         |
| Return loss   | `−20·log₁₀(\|Γ\|)` dB         |
| Mismatch loss | `−10·log₁₀(1−\|Γ\|²)` dB      |
| Q             | `\|x\|/r`                     |
| WTG           | `(π − ∠Γ_rad) / (4π)` mod 0.5 |
| WTL           | `0.5 − WTG`                   |

### Readout panel (React sidebar)

Collapsible cards, one per marker, colour-matched to the marker dot. Active marker (last clicked/dragged) expanded; others collapsed. Each card shows the full readout table above.

### Removed

The existing single-point `SmithChartDragModifier` and the raw `pointDS` / `XyScatterRenderableSeries` are removed. Markers replace this entirely.

---

## 3. Outer Rim & Dynamic Spokes (`smithChartRim.ts` + `smithChartAxes.ts`)

### Unit circle

Moved from `FastLineRenderableSeries` (360-point polyline) into `SmithChartResistanceAxis.drawGridLines` as a hardware arc — consistent with the rest of the gridlines.

### Static angle-of-Γ ring

Drawn inside `SmithChartResistanceAxis.drawGridLines` immediately outside the unit circle (radius ~1.0 to ~1.08 in data coords):

- Major ticks every 30° with degree labels (−180° to +180°)
- Minor ticks every 10°
- Label positioning via `getRimLabelOffset(angleDeg)` from `smithChartRim.ts` — same angular offset/anchor rules as polar axis labels (vertical offset at top/bottom, horizontal at left/right, diagonal elsewhere)

`smithChartRim.ts` exports pure helper functions (no class):

- `drawRimTicks(renderContext, xCalc, yCalc, wasmContext, pen)` — tick arcs + labels
- `getRimLabelOffset(angleDeg): { dx: number; dy: number }` — anchor offset for a given angle

### Dynamic spokes (per marker)

One `LineAnnotation` per marker from `(re, im)` to `(cos(θ)·1.08, sin(θ)·1.08)`, colour-matched to the marker. A `TextAnnotation` at the rim endpoint shows WTG / WTL / ∠Γ, positioned using `getRimLabelOffset`. Updated whenever the marker moves.

---

## 4. Component Chain (`smithChartChain.ts`)

### Component mathematics

| Type          | Movement                     | Arc curve                             |
| ------------- | ---------------------------- | ------------------------------------- |
| Series L      | Up constant-R circle         | Parametric along R = const circle     |
| Series C      | Down constant-R circle       | Same                                  |
| Series R      | Along constant-X arc         | Parametric along X = const arc        |
| Shunt L       | Along constant-G circle      | Compute on Y-plane, convert back to Γ |
| Shunt C       | Along constant-G circle      | Same                                  |
| Shunt R       | Along constant-B arc         | Same                                  |
| TL (length d) | Clockwise rotation by `2d/λ` | Arc of constant-\|Γ\| circle          |

Each step computes ~100 parametric arc points from `fromGamma` to `toGamma`.

### Rendering

Each step gets its own `XyDataSeries` + `FastLineRenderableSeries` (coloured arc). An arrowhead `CustomAnnotation` at `toGamma` shows direction. Steps can be individually highlighted; the last step can be undone (series removed, step popped from chain).

### Chain origin

Either a marker with `isChainStart: true`, or a standalone start point set via "Set start" in the toolbar (clicks the chart to place the origin without creating a named marker).

### Frequency

A single global frequency field in the toolbar (default 1 GHz). Applied to all reactive components when a step is added. Stored per-step in `ChainStep.frequency` so the chain is reproducible if frequency changes later.

---

## 5. Admittance Overlay (`smithChartAdmittance.ts`)

Two new axis subclasses — `SmithChartAdmittanceResistanceAxis` and `SmithChartAdmittanceReactanceAxis` — that extend the impedance axes with their draw logic rotated 180° (all centres mapped through `cx → −cx`, `cy → −cy`).

Added to the surface at init alongside the impedance axes. Visibility and opacity driven by `SmithState.gridMode`, `SmithState.zOpacity`, `SmithState.yOpacity`:

| gridMode | Impedance axes      | Admittance axes     |
| -------- | ------------------- | ------------------- |
| Z        | visible at zOpacity | hidden              |
| Y        | hidden              | visible at yOpacity |
| ZY       | visible at zOpacity | visible at yOpacity |

Opacity applied by adjusting the alpha of `axis.majorGridLineStyle.color` and `axis.minorGridLineStyle.color`.

---

## 6. VSWR Target Circle

A single `ArcAnnotation` (full circle, centred at origin, radius `r = (VSWR−1)/(VSWR+1)`). Optional `fill` at low opacity for the "acceptable match" shading zone.

Two synced controls:

- **Numeric input** in toolbar — change value → update annotation radius
- **Draggable handle** — `CustomAnnotation` at `(r, 0)` on the real axis; drag → update numeric input + redraw circle

Shading toggle in toolbar sets `ArcAnnotation.fill` on/off.

---

## 7. What Gets Removed vs Added

### Removed from `drawExample.ts`

- `createCircle()` — unit circle polyline
- `populateRCircle()`, `populateXArc()`, `populateCircle()` — highlight polylines
- `rCircleDS`, `xArcDS`, `gammaCircleDS` (`XyDataSeries`) + 3 `FastLineRenderableSeries`
- Outer unit circle `FastLineRenderableSeries`
- `SmithChartDragModifier` class
- `pointDS` / `XyScatterRenderableSeries`
- 5 individual `TextAnnotation` readouts

### Added to `drawExample.ts`

- Imports of all new modules
- Instantiation of adapter classes
- `useEffect` calls to `adapter.update(state)` on state change
- Wiring of toolbar callbacks to `dispatch` actions

### Kept (unchanged)

- `SciChartSurface.create()`
- `SmithChartResistanceAxis` / `SmithChartReactanceAxis` (extended, not replaced)
- `ZoomExtentsModifier`, `MouseWheelZoomModifier`, `PinchZoomModifier`
- Impedance formula: `Z = (1+Γ)/(1−Γ)`

---

## 8. Open Questions / Risks

1. **Editable annotation drag API** — confirm `CustomAnnotation` exposes a `dragDelta` or `onDrag` callback (vs. needing a custom modifier). Check `WaveHeatmapInteractions` example first.
2. **Axis opacity API** — confirm `axis.majorGridLineStyle` is mutable at runtime (not requiring axis recreation).
3. **ArcAnnotation fill** — confirm `ArcAnnotation` supports a fill colour for the VSWR shading zone.
4. **Right-click context menu** — SciChart doesn't provide one natively; needs a React portal rendered at mouse position on `contextmenu` event.
5. **Admittance axis subclassing** — confirm the 180° rotation approach works cleanly; alternative is a single axis that takes a `isAdmittance: boolean` constructor option.
