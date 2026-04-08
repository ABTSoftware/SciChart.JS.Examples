# Smith Chart Tier 1 + 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add named markers with full RF readouts, an angle-of-Γ rim scale, Z/Y admittance overlay, VSWR target circle, and a component-chain matching network designer to the SciChart Smith Chart example.

**Architecture:** React owns all app state via a `useSmithChart` hook; SciChart is updated imperatively through a single `update(state: SmithState)` function returned by `drawExample.ts`. The custom modifier fires `dispatch()` calls into the React reducer when user interactions occur (click-to-place, drag). New SciChart concerns are isolated in focused modules. Pure math is exported for unit testing.

**Tech Stack:** React 19, SciChart.JS, TypeScript, MUI, Mocha + ts-node (tests run via `npm run testUnit` from `Examples/`)

**All file paths are relative to:** `Examples/src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/`

---

## File Map

| File                                   | Status      | Responsibility                                                                                       |
| -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `useSmithChart.ts`                     | **Create**  | React state shape, reducer, initial state                                                            |
| `smithChartMarkers.ts`                 | **Create**  | Marker readout math (exported), marker CustomAnnotation management, drag modifier, spoke annotations |
| `smithChartRim.ts`                     | **Create**  | Pure helpers: `drawRimTicks`, `getRimLabelOffset`                                                    |
| `smithChartAxes.ts`                    | **Modify**  | Add unit circle arc + angle-of-Γ rim ring drawing in `SmithChartResistanceAxis.drawGridLines`        |
| `smithChartAdmittance.ts`              | **Create**  | Admittance axis pair (180°-rotated clones)                                                           |
| `smithChartChain.ts`                   | **Create**  | Chain step math (exported for testing) + rendering adapter                                           |
| `drawExample.ts`                       | **Rewrite** | Wire all modules; return `{ sciChartSurface, setDispatch, update }`                                  |
| `index.tsx`                            | **Rewrite** | Layout, toolbar, readout panel; connect `dispatch` + `update` via `onInit`                           |
| `testUnit/SmithChart/readouts.test.ts` | **Create**  | Unit tests for marker readout math                                                                   |
| `testUnit/SmithChart/rim.test.ts`      | **Create**  | Unit tests for `getRimLabelOffset`                                                                   |
| `testUnit/SmithChart/chain.test.ts`    | **Create**  | Unit tests for chain step math                                                                       |

---

## ═══════════════ TIER 1 FOUNDATION ═══════════════

---

## Task 1: useSmithChart state hook

**Files:**

- Create: `useSmithChart.ts`
- Create: `Examples/testUnit/SmithChart/` (directory)

- [ ] **Step 1: Write the failing test**

Create `Examples/testUnit/SmithChart/useSmithChart.test.ts`:

```ts
import { assert } from "chai";
import {
  initialSmithState,
  smithReducer,
} from "../../src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/useSmithChart";

describe("smithReducer", () => {
  it("initial state has no markers", () => {
    const s = initialSmithState();
    assert.deepEqual(s.markers, []);
  });

  it("ADD_MARKER creates a labelled marker", () => {
    const s0 = initialSmithState();
    const s1 = smithReducer(s0, {
      type: "ADD_MARKER",
      gamma: { re: 0.3, im: 0.4 },
    });
    assert.equal(s1.markers.length, 1);
    assert.equal(s1.markers[0].label, "M1");
    assert.deepEqual(s1.markers[0].gamma, { re: 0.3, im: 0.4 });
    assert.equal(s1.activeMarkerId, s1.markers[0].id);
  });

  it("ADD_MARKER auto-increments label (M1, M2, M3)", () => {
    let s = initialSmithState();
    s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0, im: 0 } });
    s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0.5, im: 0 } });
    s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0, im: 0.5 } });
    assert.equal(s.markers.map((m) => m.label).join(","), "M1,M2,M3");
  });

  it("MOVE_MARKER updates gamma and keeps id", () => {
    let s = initialSmithState();
    s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0.3, im: 0 } });
    const id = s.markers[0].id;
    s = smithReducer(s, {
      type: "MOVE_MARKER",
      id,
      gamma: { re: 0.5, im: 0.2 },
    });
    assert.deepEqual(s.markers[0].gamma, { re: 0.5, im: 0.2 });
    assert.equal(s.markers[0].id, id);
  });

  it("REMOVE_MARKER removes by id", () => {
    let s = initialSmithState();
    s = smithReducer(s, { type: "ADD_MARKER", gamma: { re: 0.3, im: 0 } });
    const id = s.markers[0].id;
    s = smithReducer(s, { type: "REMOVE_MARKER", id });
    assert.equal(s.markers.length, 0);
  });

  it("SET_VSWR updates vswr value", () => {
    let s = initialSmithState();
    s = smithReducer(s, { type: "SET_VSWR", vswr: 2.5 });
    assert.equal(s.vswr, 2.5);
  });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
cd Examples && npm run testUnit 2>&1 | head -20
```

Expected: `Error: Cannot find module` or similar — `useSmithChart.ts` doesn't exist yet.

- [ ] **Step 3: Create `useSmithChart.ts`**

```ts
import { useReducer } from "react";

export type GammaPoint = { re: number; im: number };

export type Marker = {
  id: string;
  label: string;
  gamma: GammaPoint;
  isChainStart: boolean;
};

export type ComponentType =
  | "seriesL"
  | "seriesC"
  | "seriesR"
  | "shuntL"
  | "shuntC"
  | "shuntR"
  | "TL";

export type ChainStep = {
  id: string;
  type: ComponentType;
  value: number; // SI units (H, F, Ω) or wavelengths for TL
  frequency: number; // Hz at time of adding step
  fromGamma: GammaPoint;
  toGamma: GammaPoint;
  arcPoints: GammaPoint[];
};

export type GridMode = "Z" | "Y" | "ZY";

export type SmithState = {
  markers: Marker[];
  chain: ChainStep[];
  chainStartGamma: GammaPoint | null; // when chain does not start from a marker
  activeMarkerId: string | null;
  frequency: number; // Hz, global for reactive components
  vswr: number;
  vswrShaded: boolean;
  gridMode: GridMode;
  zOpacity: number; // 0–1
  yOpacity: number; // 0–1
};

export type SmithAction =
  | { type: "ADD_MARKER"; gamma: GammaPoint }
  | { type: "MOVE_MARKER"; id: string; gamma: GammaPoint }
  | { type: "REMOVE_MARKER"; id: string }
  | { type: "SET_ACTIVE_MARKER"; id: string | null }
  | { type: "SET_CHAIN_START"; gamma: GammaPoint }
  | { type: "PROMOTE_TO_CHAIN_START"; id: string }
  | { type: "ADD_CHAIN_STEP"; step: ChainStep }
  | { type: "UNDO_CHAIN_STEP" }
  | { type: "SET_VSWR"; vswr: number }
  | { type: "SET_VSWR_SHADED"; shaded: boolean }
  | { type: "SET_GRID_MODE"; mode: GridMode }
  | { type: "SET_Z_OPACITY"; opacity: number }
  | { type: "SET_Y_OPACITY"; opacity: number }
  | { type: "SET_FREQUENCY"; frequency: number };

let _markerCounter = 0;

export function initialSmithState(): SmithState {
  _markerCounter = 0;
  return {
    markers: [],
    chain: [],
    chainStartGamma: null,
    activeMarkerId: null,
    frequency: 1e9,
    vswr: 2.0,
    vswrShaded: false,
    gridMode: "Z",
    zOpacity: 1.0,
    yOpacity: 0.7,
  };
}

export function smithReducer(
  state: SmithState,
  action: SmithAction
): SmithState {
  switch (action.type) {
    case "ADD_MARKER": {
      _markerCounter++;
      const marker: Marker = {
        id: `m-${Date.now()}-${_markerCounter}`,
        label: `M${_markerCounter}`,
        gamma: action.gamma,
        isChainStart: false,
      };
      return {
        ...state,
        markers: [...state.markers, marker],
        activeMarkerId: marker.id,
      };
    }
    case "MOVE_MARKER":
      return {
        ...state,
        markers: state.markers.map((m) =>
          m.id === action.id ? { ...m, gamma: action.gamma } : m
        ),
        activeMarkerId: action.id,
      };
    case "REMOVE_MARKER": {
      const newMarkers = state.markers.filter((m) => m.id !== action.id);
      const newActive =
        state.activeMarkerId === action.id
          ? newMarkers[newMarkers.length - 1]?.id ?? null
          : state.activeMarkerId;
      return { ...state, markers: newMarkers, activeMarkerId: newActive };
    }
    case "SET_ACTIVE_MARKER":
      return { ...state, activeMarkerId: action.id };
    case "PROMOTE_TO_CHAIN_START":
      return {
        ...state,
        markers: state.markers.map((m) => ({
          ...m,
          isChainStart: m.id === action.id,
        })),
        chainStartGamma: null,
        chain: [],
      };
    case "SET_CHAIN_START":
      return {
        ...state,
        markers: state.markers.map((m) => ({ ...m, isChainStart: false })),
        chainStartGamma: action.gamma,
        chain: [],
      };
    case "ADD_CHAIN_STEP":
      return { ...state, chain: [...state.chain, action.step] };
    case "UNDO_CHAIN_STEP":
      return { ...state, chain: state.chain.slice(0, -1) };
    case "SET_VSWR":
      return { ...state, vswr: Math.max(1.001, action.vswr) };
    case "SET_VSWR_SHADED":
      return { ...state, vswrShaded: action.shaded };
    case "SET_GRID_MODE":
      return { ...state, gridMode: action.mode };
    case "SET_Z_OPACITY":
      return { ...state, zOpacity: Math.min(1, Math.max(0, action.opacity)) };
    case "SET_Y_OPACITY":
      return { ...state, yOpacity: Math.min(1, Math.max(0, action.opacity)) };
    case "SET_FREQUENCY":
      return { ...state, frequency: action.frequency };
    default:
      return state;
  }
}

export function useSmithChart() {
  return useReducer(smithReducer, undefined, initialSmithState);
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd Examples && npm run testUnit 2>&1 | head -30
```

Expected: `7 passing`

- [ ] **Step 5: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/useSmithChart.ts testUnit/SmithChart/useSmithChart.test.ts && git commit -m "feat(smith-chart): add useSmithChart state hook and reducer"
```

---

## Task 2: Marker readout math

**Files:**

- Create: `smithChartMarkers.ts` (math exports only for now)
- Create: `Examples/testUnit/SmithChart/readouts.test.ts`

- [ ] **Step 1: Write failing tests**

Create `Examples/testUnit/SmithChart/readouts.test.ts`:

```ts
import { assert } from "chai";
import { computeReadouts } from "../../src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartMarkers";

const EPS = 1e-4;
const approx = (a: number, b: number) => Math.abs(a - b) < EPS;

describe("computeReadouts", () => {
  it("Γ=0 gives Z=1, VSWR=1, RL=Infinity, Q=0", () => {
    const r = computeReadouts({ re: 0, im: 0 });
    assert.ok(approx(r.gammaMag, 0));
    assert.ok(approx(r.zr, 1));
    assert.ok(approx(r.zx, 0));
    assert.ok(approx(r.vswr, 1));
    assert.equal(r.returnLoss, Infinity);
    assert.ok(approx(r.q, 0));
  });

  it("Γ=1∠0° (short) gives Z=0", () => {
    const r = computeReadouts({ re: -1, im: 0 });
    assert.ok(approx(r.gammaMag, 1));
    assert.ok(approx(r.zr, 0));
    assert.ok(approx(r.vswr, Infinity) || r.vswr > 1000);
  });

  it("Γ=j gives Z=-j (pure capacitor)", () => {
    // Γ = (0+j1): Z = (1+j)/(1-j) = j
    const r = computeReadouts({ re: 0, im: 1 });
    assert.ok(approx(r.zr, 0), `zr should be 0, got ${r.zr}`);
    assert.ok(approx(r.zx, 1), `zx should be 1, got ${r.zx}`);
  });

  it("Γ=0.5∠0° gives VSWR=3", () => {
    const r = computeReadouts({ re: 0.5, im: 0 });
    assert.ok(approx(r.vswr, 3));
  });

  it("WTG + WTL = 0.5 always", () => {
    const points = [
      { re: 0.3, im: 0.4 },
      { re: -0.5, im: 0.3 },
      { re: 0, im: -0.7 },
    ];
    for (const p of points) {
      const r = computeReadouts(p);
      assert.ok(
        approx(r.wtg + r.wtl, 0.5),
        `WTG+WTL should be 0.5 for Γ=(${p.re},${p.im})`
      );
    }
  });
});
```

- [ ] **Step 2: Run — expect failure**

```bash
cd Examples && npm run testUnit 2>&1 | head -10
```

- [ ] **Step 3: Create `smithChartMarkers.ts` with `computeReadouts`**

```ts
import { GammaPoint } from "./useSmithChart";

export type MarkerReadout = {
  gammaMag: number;
  gammaAngleDeg: number;
  zr: number;
  zx: number;
  gy: number;
  by: number;
  vswr: number;
  returnLoss: number;
  mismatchLoss: number;
  q: number;
  wtg: number;
  wtl: number;
};

export function computeReadouts(gamma: GammaPoint): MarkerReadout {
  const { re, im } = gamma;
  const gammaMag = Math.sqrt(re * re + im * im);
  const gammaAngleDeg = (Math.atan2(im, re) * 180) / Math.PI;

  // Z = (1+Γ)/(1−Γ)
  const denom = (1 - re) * (1 - re) + im * im;
  const zr = denom > 1e-10 ? (1 - re * re - im * im) / denom : Infinity;
  const zx = denom > 1e-10 ? (2 * im) / denom : Infinity;

  // Y = 1/Z
  const zMagSq = zr * zr + zx * zx;
  const gy = zMagSq > 1e-10 ? zr / zMagSq : Infinity;
  const by = zMagSq > 1e-10 ? -zx / zMagSq : Infinity;

  const vswr =
    gammaMag < 1 - 1e-10 ? (1 + gammaMag) / (1 - gammaMag) : Infinity;
  const returnLoss = gammaMag > 1e-10 ? -20 * Math.log10(gammaMag) : Infinity;
  const mismatchLoss =
    gammaMag < 1 - 1e-10 ? -10 * Math.log10(1 - gammaMag * gammaMag) : Infinity;
  const q = isFinite(zr) && zr > 1e-10 ? Math.abs(zx) / zr : Infinity;

  // WTG: (π − ∠Γ_rad) / (4π) mod 0.5
  const gammaAngleRad = Math.atan2(im, re);
  let wtg = ((Math.PI - gammaAngleRad) / (4 * Math.PI)) % 0.5;
  if (wtg < 0) wtg += 0.5;
  const wtl = 0.5 - wtg;

  return {
    gammaMag,
    gammaAngleDeg,
    zr,
    zx,
    gy,
    by,
    vswr,
    returnLoss,
    mismatchLoss,
    q,
    wtg,
    wtl,
  };
}
```

_(The SciChart adapter class `SmithMarkersAdapter` will be added to this file in Task 5.)_

- [ ] **Step 4: Run tests — expect pass**

```bash
cd Examples && npm run testUnit 2>&1 | head -20
```

Expected: all readout tests passing.

- [ ] **Step 5: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartMarkers.ts testUnit/SmithChart/readouts.test.ts && git commit -m "feat(smith-chart): add marker readout math with unit tests"
```

---

## Task 3: Rim helper functions

**Files:**

- Create: `smithChartRim.ts`
- Create: `Examples/testUnit/SmithChart/rim.test.ts`

- [ ] **Step 1: Write failing tests**

Create `Examples/testUnit/SmithChart/rim.test.ts`:

```ts
import { assert } from "chai";
import { getRimLabelOffset } from "../../src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartRim";

describe("getRimLabelOffset", () => {
  it("0° (right): dx ≥ 0, dy ≈ -h/2 (centred vertically)", () => {
    const o = getRimLabelOffset(0, 40, 16);
    assert.ok(o.dx >= 0);
    assert.ok(Math.abs(o.dy + 8) < 3, `dy should be ~-8, got ${o.dy}`);
  });
  it("90° (top): dx ≈ -w/2, dy < 0 (above)", () => {
    const o = getRimLabelOffset(90, 40, 16);
    assert.ok(Math.abs(o.dx + 20) < 4, `dx should be ~-20, got ${o.dx}`);
    assert.ok(o.dy < 0);
  });
  it("180° (left): dx < 0, dy ≈ -h/2", () => {
    const o = getRimLabelOffset(180, 40, 16);
    assert.ok(o.dx < 0);
    assert.ok(Math.abs(o.dy + 8) < 3);
  });
  it("270° (bottom): dx ≈ -w/2, dy ≥ 0 (below)", () => {
    const o = getRimLabelOffset(270, 40, 16);
    assert.ok(Math.abs(o.dx + 20) < 4);
    assert.ok(o.dy >= 0);
  });
  it("45°: dx ≥ 0, dy < 0 (upper right quadrant)", () => {
    const o = getRimLabelOffset(45, 40, 16);
    assert.ok(o.dx >= 0);
    assert.ok(o.dy < 0);
  });
});
```

- [ ] **Step 2: Run — expect failure**

```bash
cd Examples && npm run testUnit 2>&1 | head -10
```

- [ ] **Step 3: Create `smithChartRim.ts`**

```ts
import { TSciChart, Rect, DpiHelper } from "scichart";
import {
  WebGlRenderContext2D,
  ELineDrawMode,
} from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import {
  getVectorColorVertex,
  getVertex,
} from "scichart/Charting/Visuals/Helpers/NativeObject";

const RIM_INNER_RADIUS = 1.0;
const RIM_OUTER_RADIUS = 1.08;
const RIM_LABEL_RADIUS = 1.13;
const MAJOR_TICK_STEP = 30; // degrees
const MINOR_TICK_STEP = 10; // degrees
const CARDINAL_DEG = 10; // ±degrees around 0/90/180/270 treated as cardinal

/**
 * Returns pixel offset (dx, dy) to position a label of size (w × h) at an anchor
 * point on the rim, given the outward angle in standard degrees (CCW, 0=right).
 * Mirrors SmithChartAxisRenderer._positionLabel logic.
 */
export function getRimLabelOffset(
  angleDeg: number,
  w: number,
  h: number
): { dx: number; dy: number } {
  const GAP = 4;
  const angleRad = (angleDeg * Math.PI) / 180;
  const absModDeg = Math.abs(angleDeg) % 90;
  const isCardinal = absModDeg < CARDINAL_DEG || absModDeg > 90 - CARDINAL_DEG;
  const quadrant = Math.floor(((((angleDeg + CARDINAL_DEG) / 90) % 4) + 4) % 4);

  let dx = 0;
  let dy = 0;

  if (isCardinal) {
    if (quadrant === 0) {
      dy = -h / 2;
    } // right
    else if (quadrant === 1) {
      dx = -w / 2;
      dy = -h;
    } // top
    else if (quadrant === 2) {
      dx = -w;
      dy = -h / 2;
    } // left
    else {
      dx = -w / 2;
    } // bottom
  } else {
    if (Math.cos(angleRad) < 0) dx = -w;
    if (Math.sin(angleRad) > 0) dy = -h;
  }

  dx += GAP * Math.cos(angleRad);
  dy -= GAP * Math.sin(angleRad);

  return { dx, dy };
}

/**
 * Draws angle-of-Γ tick marks and labels around the rim (just outside the unit circle).
 * Called from SmithChartResistanceAxis.drawGridLines on the major pass.
 */
export function drawRimTicks(
  renderContext: WebGlRenderContext2D,
  xCalc: any,
  yCalc: any,
  wasmContext: TSciChart,
  majorPen: SCRTPen,
  minorPen: SCRTPen,
  svr: Rect,
  vpHeight: number,
  leftPad: number,
  topPad: number,
  clipRect: Rect,
  drawLabel: (text: string, px: number, py: number, angleDeg: number) => void
): void {
  const vertices = getVectorColorVertex(wasmContext);
  const vertex = getVertex(wasmContext, 0, 0);

  for (let deg = 0; deg < 360; deg += MINOR_TICK_STEP) {
    const isMajorTick = deg % MAJOR_TICK_STEP === 0;
    const rad = (deg * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);

    const innerR = RIM_INNER_RADIUS;
    const outerR = isMajorTick
      ? RIM_OUTER_RADIUS
      : (RIM_INNER_RADIUS + RIM_OUTER_RADIUS) / 2;

    const x1 = cosA * innerR;
    const y1 = sinA * innerR;
    const x2 = cosA * outerR;
    const y2 = sinA * outerR;

    vertex.SetPosition(xCalc.getCoordinate(x1), yCalc.getCoordinate(y1));
    vertices.push_back(vertex);
    vertex.SetPosition(xCalc.getCoordinate(x2), yCalc.getCoordinate(y2));
    vertices.push_back(vertex);

    if (isMajorTick) {
      // Label at standard degrees convention: 0° = right, CCW positive
      // The rim angle in the chart = angle of Γ. Label shows degrees.
      const labelAngle = deg > 180 ? deg - 360 : deg;
      const lx = xCalc.getCoordinate(cosA * RIM_LABEL_RADIUS);
      const ly = yCalc.getCoordinate(sinA * RIM_LABEL_RADIUS);
      drawLabel(`${labelAngle}°`, lx, ly, deg);
    }
  }

  if (vertices.size() > 0) {
    renderContext.drawLinesNative(
      vertices,
      majorPen,
      ELineDrawMode.DiscontinuousLine,
      clipRect,
      leftPad,
      topPad
    );
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd Examples && npm run testUnit 2>&1 | head -20
```

Expected: all rim tests passing.

- [ ] **Step 5: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartRim.ts testUnit/SmithChart/rim.test.ts && git commit -m "feat(smith-chart): add rim helper functions with unit tests"
```

---

## Task 4: Unit circle arc + angle-of-Γ ring in SmithChartResistanceAxis

**Context:** The unit circle is currently drawn as a `FastLineRenderableSeries` with 360 polyline points in `drawExample.ts`. Move it to a hardware arc in `SmithChartResistanceAxis.drawGridLines`, and add the angle ring tick marks.

**Files:**

- Modify: `smithChartAxes.ts`

- [ ] **Step 1: Add import for `drawRimTicks` at top of `smithChartAxes.ts`**

Find the existing imports block at top of file and add:

```ts
import { drawRimTicks } from "./smithChartRim";
```

- [ ] **Step 2: Add the unit circle + rim ring to `SmithChartResistanceAxis.drawGridLines`**

In `SmithChartResistanceAxis.drawGridLines`, at the end of the `isMajor` block (after the real-axis line drawing), add:

```ts
if (isMajor) {
  // ... existing real-axis line code stays above ...

  // Unit circle (r=0 → cx=0, rad=1)
  const ucx_px = xCalc.getCoordinate(0);
  const ucy_native = vpHeight - yCalc.getCoordinate(0);
  const urad_px = Math.abs(xCalc.getCoordWidth(1));
  const unitCircleParams = getArcParams(
    wasmContext,
    ucx_px,
    ucy_native,
    0,
    2 * Math.PI,
    urad_px,
    0,
    1,
    aspectRatio,
    linesPen.m_fThickness * 2
  );
  arc.MakeCircularArc(unitCircleParams);
  const unitVec = getVectorArcVertex(wasmContext);
  const unitArc = getArcVertex(wasmContext);
  unitArc.MakeCircularArc(unitCircleParams);
  unitVec.push_back(unitArc);
  renderContext.drawArcs(
    unitVec,
    0,
    0,
    0,
    clipRect,
    linesPen,
    undefined,
    leftPad,
    topPad
  );

  // Angle-of-Γ rim ring
  const svr = this.parentSurface.seriesViewRect;
  const drawLabel = (
    text: string,
    px: number,
    py: number,
    angleDeg: number
  ) => {
    // Use the axis renderer's label drawing — delegate to axisRenderer via a known hack:
    // We store the renderer locally and call a helper, or fall back to simple approach.
    // For now, defer label drawing to SmithChartAxisRenderer (drawLabels calls drawRimLabels).
    // The tick lines are drawn here; labels are drawn in the axisRenderer.drawLabels pass.
    // Store pending label info on the axis for the renderer to pick up.
    this._pendingRimLabels.push({ text, px, py, angleDeg });
  };
  this._pendingRimLabels = [];
  drawRimTicks(
    renderContext,
    xCalc,
    yCalc,
    wasmContext,
    linesPen,
    linesPen,
    svr,
    vpHeight,
    leftPad,
    topPad,
    clipRect,
    drawLabel
  );
}
```

- [ ] **Step 3: Add `_pendingRimLabels` field and `getRimLabels()` to `SmithChartResistanceAxis`**

At the top of the `SmithChartResistanceAxis` class body (before the constructor):

```ts
    public _pendingRimLabels: { text: string; px: number; py: number; angleDeg: number }[] = [];
```

- [ ] **Step 4: Update `SmithChartAxisRenderer.drawLabels` to render pending rim labels**

In `SmithChartAxisRenderer.drawLabels`, after the existing resistance-axis label rendering block, add:

```ts
// Rim labels (angle of Γ ring, major ticks)
if (this._isResistanceAxis) {
  const rAxis = axis as SmithChartResistanceAxis;
  for (const lbl of rAxis._pendingRimLabels) {
    const o = getRimLabelOffset(lbl.angleDeg, 32, 12); // approx text size
    drawLabel(
      lbl.text,
      lbl.px - svr.left + o.dx,
      lbl.py - svr.top + o.dy,
      lbl.angleDeg
    );
  }
}
```

Add the import for `getRimLabelOffset` at the top of the method (it's already in `smithChartRim.ts`). Since `smithChartAxisRenderer` is in the same file as the axes, just add the import at top of `smithChartAxes.ts`:

```ts
import { drawRimTicks, getRimLabelOffset } from "./smithChartRim";
```

- [ ] **Step 5: Verify visually — start dev server and check**

```bash
cd Examples && npm run dev
```

Navigate to the Smith Chart example. Verify:

- Unit circle is still drawn (now via hardware arc, not series)
- Angle tick marks appear around the rim at every 30°
- Degree labels are readable and don't overlap the chart content

- [ ] **Step 6: Remove the unit circle `FastLineRenderableSeries` from `drawExample.ts`**

In `drawExample.ts`, remove the block:

```ts
// ── Outer unit circle (drawn as a series for prominent styling) ───────────
sciChartSurface.renderableSeries.add(
  new FastLineRenderableSeries(wasmContext, {
    dataSeries: createCircle(wasmContext, 0, 0, 1),
    stroke: outerCircleColor,
    strokeThickness: 2,
  })
);
```

Remove the `outerCircleColor` variable and the `createCircle` function call at the top (but keep `createCircle` for now — it may still be used in the existing highlight series).

- [ ] **Step 7: Verify unit circle still visible after removing series**

Check dev server — unit circle should still display, now drawn by the axis.

- [ ] **Step 8: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartAxes.ts src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/drawExample.ts && git commit -m "feat(smith-chart): move unit circle to hardware arc, add angle-of-Gamma rim ring"
```

---

## Task 5: SmithMarkersAdapter — placement, drag, unit circle constraint

> **Before starting:** Read `src/components/Examples/FeaturedApps/WaveHeatmapInteractions/` to understand the drag modifier pattern used in this codebase. Specifically look for how `ChartModifierBase2D` intercepts mouse events and how draggable annotations are managed.

**Files:**

- Modify: `smithChartMarkers.ts` (append the adapter class)

The adapter manages `CustomAnnotation` objects (one per marker), a click modifier to place markers, drag handling to move them, spoke `LineAnnotation` + `TextAnnotation` for rim lines, and the three existing highlight arc series (R circle, X arc, Γ circle) which are now driven by the active marker.

- [ ] **Step 1: Add imports to `smithChartMarkers.ts`**

```ts
import {
  SciChartSurface,
  TSciChart,
  CustomAnnotation,
  LineAnnotation,
  TextAnnotation,
  ArcAnnotation,
  XyDataSeries,
  FastLineRenderableSeries,
  ECoordinateMode,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  ChartModifierBase2D,
  ModifierMouseArgs,
  EExecuteOn,
} from "scichart";
import { SmithState, SmithAction, GammaPoint, Marker } from "./useSmithChart";
import { computeReadouts } from "./smithChartMarkers";
import { getRimLabelOffset } from "./smithChartRim";
```

- [ ] **Step 2: Add `SmithMarkersAdapter` class to `smithChartMarkers.ts`**

```ts
// Marker colours — cycle through these
const MARKER_COLOURS = [
  "#FF4444",
  "#44AAFF",
  "#FFAA00",
  "#44FF88",
  "#FF44CC",
  "#88FF44",
];

export class SmithMarkersAdapter {
  private surface: SciChartSurface;
  private wasmContext: TSciChart;
  private markerAnnotations = new Map<string, CustomAnnotation>();
  private spokeLines = new Map<string, LineAnnotation>();
  private spokeLabels = new Map<string, TextAnnotation>();
  // Active-marker highlight arcs
  private rCircleDS: XyDataSeries;
  private xArcDS: XyDataSeries;
  private gammaCircleDS: XyDataSeries;
  private dispatch: (a: SmithAction) => void = () => {};
  private dragState: { id: string; startX: number; startY: number } | null =
    null;

  constructor(surface: SciChartSurface, wasmContext: TSciChart) {
    this.surface = surface;
    this.wasmContext = wasmContext;

    // Highlight series (inherited from old design — now driven by active marker)
    this.rCircleDS = new XyDataSeries(wasmContext);
    this.xArcDS = new XyDataSeries(wasmContext);
    this.gammaCircleDS = new XyDataSeries(wasmContext);

    surface.renderableSeries.add(
      new FastLineRenderableSeries(wasmContext, {
        dataSeries: this.rCircleDS,
        stroke: "#FF4444",
        strokeThickness: 2.5,
      }),
      new FastLineRenderableSeries(wasmContext, {
        dataSeries: this.xArcDS,
        stroke: "#4488FF",
        strokeThickness: 2.5,
      }),
      new FastLineRenderableSeries(wasmContext, {
        dataSeries: this.gammaCircleDS,
        stroke: "#44CC44",
        strokeThickness: 1.5,
        strokeDashArray: [5, 5],
      })
    );

    // Click-to-place modifier
    surface.chartModifiers.add(new SmithClickModifier(this));
  }

  setDispatch(d: (a: SmithAction) => void) {
    this.dispatch = d;
  }

  /** Called on every state update. Syncs annotations to current state. */
  update(state: SmithState): void {
    this._syncMarkerAnnotations(state);
    this._syncHighlights(state);
  }

  /** Called by SmithClickModifier to place a new marker */
  handleClick(gamma: GammaPoint): void {
    this.dispatch({ type: "ADD_MARKER", gamma });
  }

  /** Called by SmithClickModifier during drag */
  handleDrag(id: string, gamma: GammaPoint): void {
    this.dispatch({ type: "MOVE_MARKER", id, gamma });
  }

  private _syncMarkerAnnotations(state: SmithState): void {
    const surface = this.surface;

    // Remove annotations for deleted markers
    for (const [id, ann] of this.markerAnnotations) {
      if (!state.markers.find((m) => m.id === id)) {
        surface.annotations.remove(ann);
        this.markerAnnotations.delete(id);
        const spoke = this.spokeLines.get(id);
        if (spoke) {
          surface.annotations.remove(spoke);
          this.spokeLines.delete(id);
        }
        const lbl = this.spokeLabels.get(id);
        if (lbl) {
          surface.annotations.remove(lbl);
          this.spokeLabels.delete(id);
        }
      }
    }

    // Add / update annotations
    state.markers.forEach((marker, i) => {
      const colour = MARKER_COLOURS[i % MARKER_COLOURS.length];
      if (!this.markerAnnotations.has(marker.id)) {
        // Create marker annotation
        const ann = new CustomAnnotation({
          x1: marker.gamma.re,
          y1: marker.gamma.im,
          isEditable: true,
          annotationLayer: 1,
        });
        // Store marker id on annotation for drag lookup
        (ann as any)._smithMarkerId = marker.id;
        surface.annotations.add(ann);
        this.markerAnnotations.set(marker.id, ann);

        // Spoke line
        const spoke = new LineAnnotation({
          stroke: colour,
          strokeThickness: 1,
          strokeDashArray: [4, 4],
        });
        surface.annotations.add(spoke);
        this.spokeLines.set(marker.id, spoke);

        // Spoke label
        const spLabel = new TextAnnotation({
          xCoordinateMode: ECoordinateMode.DataValue,
          yCoordinateMode: ECoordinateMode.DataValue,
          fontSize: 10,
          fontFamily: "monospace",
          textColor: colour,
          horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
          verticalAnchorPoint: EVerticalAnchorPoint.Top,
        });
        surface.annotations.add(spLabel);
        this.spokeLabels.set(marker.id, spLabel);
      }

      // Update position
      const ann = this.markerAnnotations.get(marker.id)!;
      ann.x1 = marker.gamma.re;
      ann.y1 = marker.gamma.im;

      // Update spoke
      const theta = Math.atan2(marker.gamma.im, marker.gamma.re);
      const SPOKE_END = 1.08;
      const spoke = this.spokeLines.get(marker.id)!;
      spoke.x1 = marker.gamma.re;
      spoke.y1 = marker.gamma.im;
      spoke.x2 = Math.cos(theta) * SPOKE_END;
      spoke.y2 = Math.sin(theta) * SPOKE_END;

      // Update spoke label
      const ro = computeReadouts(marker.gamma);
      const LABEL_R = 1.14;
      const spLabel = this.spokeLabels.get(marker.id)!;
      spLabel.x1 = Math.cos(theta) * LABEL_R;
      spLabel.y1 = Math.sin(theta) * LABEL_R;
      spLabel.text = `${marker.label}\n${ro.gammaAngleDeg.toFixed(1)}°`;
    });
  }

  private _syncHighlights(state: SmithState): void {
    const active = state.markers.find((m) => m.id === state.activeMarkerId);
    if (!active) {
      this.rCircleDS.clear();
      this.xArcDS.clear();
      this.gammaCircleDS.clear();
      return;
    }
    const ro = computeReadouts(active.gamma);
    populateRCircle(this.rCircleDS, ro.zr);
    populateXArc(this.xArcDS, ro.zx);
    populateCircle(this.gammaCircleDS, 0, 0, ro.gammaMag);
  }
}

// ── SmithClickModifier ────────────────────────────────────────────────────────

class SmithClickModifier extends ChartModifierBase2D {
  readonly type = "SmithClickModifier";
  private adapter: SmithMarkersAdapter;
  private dragTargetId: string | null = null;

  constructor(adapter: SmithMarkersAdapter) {
    super({ executeCondition: { button: EExecuteOn.MouseLeftButton } });
    this.adapter = adapter;
  }

  override modifierMouseDown(args: ModifierMouseArgs): void {
    super.modifierMouseDown(args);
    if (!this.checkExecuteConditions(args).isPrimary) return;

    const xCalc = this.parentSurface.xAxes
      .get(0)
      .getCurrentCoordinateCalculator();
    const yCalc = this.parentSurface.yAxes
      .get(0)
      .getCurrentCoordinateCalculator();
    const re = xCalc.getDataValue(args.mousePoint.x);
    const im = yCalc.getDataValue(args.mousePoint.y);

    // Check if clicking on an existing marker annotation
    const hitMarker = this._hitTestMarker(args.mousePoint.x, args.mousePoint.y);
    if (hitMarker) {
      this.dragTargetId = hitMarker;
      args.handled = true;
      return;
    }

    // Only place if within unit circle
    if (re * re + im * im <= 1.0) {
      this.adapter.handleClick({ re, im });
    }
    args.handled = true;
  }

  override modifierMouseMove(args: ModifierMouseArgs): void {
    super.modifierMouseMove(args);
    if (!this.dragTargetId) return;

    const xCalc = this.parentSurface.xAxes
      .get(0)
      .getCurrentCoordinateCalculator();
    const yCalc = this.parentSurface.yAxes
      .get(0)
      .getCurrentCoordinateCalculator();
    let re = xCalc.getDataValue(args.mousePoint.x);
    let im = yCalc.getDataValue(args.mousePoint.y);

    // Clamp to unit circle
    const mag = Math.sqrt(re * re + im * im);
    if (mag > 1) {
      re /= mag;
      im /= mag;
    }

    this.adapter.handleDrag(this.dragTargetId, { re, im });
    args.handled = true;
  }

  override modifierMouseUp(args: ModifierMouseArgs): void {
    super.modifierMouseUp(args);
    this.dragTargetId = null;
  }

  private _hitTestMarker(px: number, py: number): string | null {
    const HIT_RADIUS = 12; // pixels
    for (const [id, ann] of this.adapter["markerAnnotations"]) {
      const xCalc = this.parentSurface.xAxes
        .get(0)
        .getCurrentCoordinateCalculator();
      const yCalc = this.parentSurface.yAxes
        .get(0)
        .getCurrentCoordinateCalculator();
      const ax = xCalc.getCoordinate(ann.x1 as number);
      const ay = yCalc.getCoordinate(ann.y1 as number);
      const dx = px - ax;
      const dy = py - ay;
      if (dx * dx + dy * dy < HIT_RADIUS * HIT_RADIUS) return id;
    }
    return null;
  }
}

// ── Highlight arc helpers (kept from original drawExample) ────────────────────

function populateRCircle(ds: XyDataSeries, r: number) {
  ds.clear();
  if (!isFinite(r) || r < 0) return;
  const cx = r / (1 + r);
  const rad = 1 / (1 + r);
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    ds.append(cx + rad * Math.cos(angle), rad * Math.sin(angle));
  }
}

function populateXArc(ds: XyDataSeries, xVal: number) {
  ds.clear();
  if (!isFinite(xVal)) return;
  if (Math.abs(xVal) < 0.001) {
    ds.append(-1, 0);
    ds.append(1, 0);
    return;
  }
  const absX = Math.abs(xVal);
  const isPos = xVal > 0;
  const radius = 1 / absX;
  const cx = 1;
  const cy = isPos ? radius : -radius;
  const xv2 = absX * absX;
  const xInt = (xv2 - 1) / (1 + xv2);
  const yInt = isPos ? (2 * absX) / (1 + xv2) : -(2 * absX) / (1 + xv2);
  const thetaOther = Math.atan2(yInt - cy, xInt - cx);
  const thetaOrigin = isPos ? -Math.PI / 2 : Math.PI / 2;
  let startAngle = isPos ? thetaOther : thetaOrigin;
  let endAngle = isPos ? thetaOrigin : thetaOther;
  while (endAngle <= startAngle) endAngle += 2 * Math.PI;
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const angle = startAngle + (i / n) * (endAngle - startAngle);
    ds.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }
}

function populateCircle(
  ds: XyDataSeries,
  cx: number,
  cy: number,
  radius: number
) {
  ds.clear();
  if (radius < 0.001) return;
  const n = 200;
  for (let i = 0; i <= n; i++) {
    const angle = (i / n) * 2 * Math.PI;
    ds.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd Examples && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "smithChart"
```

Expected: no errors in Smith Chart files.

- [ ] **Step 4: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartMarkers.ts && git commit -m "feat(smith-chart): add SmithMarkersAdapter with click-to-place and drag"
```

---

## Task 6: Rewrite drawExample.ts + index.tsx (Tier 1 wiring)

**Files:**

- Rewrite: `drawExample.ts`
- Rewrite: `index.tsx`

This task connects the state hook to the SciChart adapters and renders the readout panel.

- [ ] **Step 1: Rewrite `drawExample.ts`**

```ts
import {
  SciChartSurface,
  EAxisAlignment,
  NumberRange,
  ZoomExtentsModifier,
  MouseWheelZoomModifier,
  PinchZoomModifier,
  ZoomPanModifier,
  EExecuteOn,
} from "scichart";
import { appTheme } from "../../../theme";
import {
  SmithChartResistanceAxis,
  SmithChartReactanceAxis,
} from "./smithChartAxes";
import { SmithMarkersAdapter } from "./smithChartMarkers";
import { SmithState, SmithAction } from "./useSmithChart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: appTheme.SciChartJsTheme,
    }
  );

  const gridColor = "#aaaaaa";

  sciChartSurface.xAxes.add(
    new SmithChartResistanceAxis(wasmContext, {
      visibleRange: new NumberRange(-1.15, 1.15),
      axisAlignment: EAxisAlignment.Bottom,
      majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
      minorGridLineStyle: { color: gridColor, strokeThickness: 1 },
    })
  );

  sciChartSurface.yAxes.add(
    new SmithChartReactanceAxis(wasmContext, {
      visibleRange: new NumberRange(-1.15, 1.15),
      axisAlignment: EAxisAlignment.Left,
      majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
      minorGridLineStyle: { color: gridColor, strokeThickness: 1 },
    })
  );

  const markersAdapter = new SmithMarkersAdapter(sciChartSurface, wasmContext);

  sciChartSurface.chartModifiers.add(
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier(),
    new ZoomPanModifier({
      executeCondition: { button: EExecuteOn.MouseRightButton },
    })
  );

  const update = (state: SmithState) => {
    markersAdapter.update(state);
  };

  const setDispatch = (dispatch: (a: SmithAction) => void) => {
    markersAdapter.setDispatch(dispatch);
  };

  return { sciChartSurface, wasmContext, update, setDispatch };
};
```

- [ ] **Step 2: Rewrite `index.tsx`**

```tsx
import * as React from "react";
import { useRef, useEffect } from "react";
import { SciChartReact } from "scichart-react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { drawExample } from "./drawExample";
import { useSmithChart, computeReadouts, SmithState } from "./useSmithChart";
import { computeReadouts as calcReadouts } from "./smithChartMarkers";

// Re-export computeReadouts from smithChartMarkers for use in the panel
// (already exported — just import it below)

export default function SmithChartComponent() {
  const [state, dispatch] = useSmithChart();
  const updateRef = useRef<((s: SmithState) => void) | null>(null);

  // Sync state to SciChart adapters whenever state changes
  useEffect(() => {
    updateRef.current?.(state);
  }, [state]);

  const COLOURS = [
    "#FF4444",
    "#44AAFF",
    "#FFAA00",
    "#44FF88",
    "#FF44CC",
    "#88FF44",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      {/* Chart + readout panel */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SciChart surface */}
        <SciChartReact
          initChart={drawExample}
          onInit={(result) => {
            result.setDispatch(dispatch);
            updateRef.current = result.update;
            updateRef.current(state);
          }}
          style={{
            aspectRatio: "1 / 1",
            width: "min(calc(100% - 260px), 100vh)",
            height: "auto",
            position: "relative",
            overflow: "hidden",
            touchAction: "none",
            flexShrink: 0,
          }}
        />

        {/* Readout panel */}
        <Box
          sx={{
            width: 260,
            overflowY: "auto",
            p: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5 }}>
            MARKERS
          </Typography>
          {state.markers.length === 0 && (
            <Typography variant="caption" color="text.secondary">
              Click chart to place a marker
            </Typography>
          )}
          {state.markers.map((marker, i) => {
            const ro = calcReadouts(marker.gamma);
            const colour = COLOURS[i % COLOURS.length];
            const isActive = marker.id === state.activeMarkerId;
            return (
              <Accordion
                key={marker.id}
                expanded={isActive}
                onChange={() =>
                  dispatch({ type: "SET_ACTIVE_MARKER", id: marker.id })
                }
                disableGutters
                sx={{
                  border: `1px solid ${colour}`,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ minHeight: 32, py: 0 }}
                >
                  <Chip
                    label={marker.label}
                    size="small"
                    sx={{ bgcolor: colour, color: "#fff", mr: 1, fontSize: 11 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "monospace", lineHeight: 2 }}
                  >
                    Γ={marker.gamma.re.toFixed(3)}
                    {marker.gamma.im >= 0 ? "+" : ""}j{marker.gamma.im.toFixed(3)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                  <ReadoutTable ro={ro} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

function ReadoutTable({ ro }: { ro: ReturnType<typeof calcReadouts> }) {
  const rows: [string, string][] = [
    ["|Γ|", ro.gammaMag.toFixed(4)],
    ["∠Γ", `${ro.gammaAngleDeg.toFixed(2)}°`],
    ["Z", `${ro.zr.toFixed(3)} + j${ro.zx.toFixed(3)}`],
    ["Y", `${ro.gy.toFixed(3)} + j${ro.by.toFixed(3)}`],
    ["VSWR", isFinite(ro.vswr) ? ro.vswr.toFixed(3) : "∞"],
    ["RL", isFinite(ro.returnLoss) ? `${ro.returnLoss.toFixed(2)} dB` : "∞"],
    [
      "ML",
      isFinite(ro.mismatchLoss) ? `${ro.mismatchLoss.toFixed(3)} dB` : "∞",
    ],
    ["Q", isFinite(ro.q) ? ro.q.toFixed(3) : "∞"],
    ["WTG", ro.wtg.toFixed(4) + " λ"],
    ["WTL", ro.wtl.toFixed(4) + " λ"],
  ];
  return (
    <Box
      component="table"
      sx={{
        width: "100%",
        fontSize: 11,
        fontFamily: "monospace",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td
              style={{ color: "#888", paddingRight: 8, whiteSpace: "nowrap" }}
            >
              {label}
            </td>
            <td style={{ textAlign: "right" }}>{value}</td>
          </tr>
        ))}
      </tbody>
    </Box>
  );
}
```

- [ ] **Step 3: Start dev server and verify Tier 1 works end-to-end**

```bash
cd Examples && npm run dev
```

Verify:

- Chart renders with gridlines and rim ring
- Clicking inside unit circle places a marker with spoke to rim
- Readout panel shows collapsible cards with all values
- Dragging a marker updates the readout in real time
- Highlight arcs (R circle, X arc, Γ circle) update with active marker

- [ ] **Step 4: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/drawExample.ts src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/index.tsx && git commit -m "feat(smith-chart): wire Tier 1 — markers, readout panel, rim spokes"
```

---

## ✅ TIER 1 CHECKPOINT

At this point the Smith Chart has:

- Named markers (click to place, drag to move, clamped to unit circle)
- Full RF readout panel for each marker (all 10 values)
- Angle-of-Γ rim ring with tick marks and labels
- Spoke lines from each marker to the rim
- Highlight arcs following the active marker

**Validate before continuing to Tier 2.**

---

## ═══════════════ TIER 2 MATCHING TOOLS ═══════════════

---

## Task 7: Admittance overlay (`smithChartAdmittance.ts`)

**Files:**

- Create: `smithChartAdmittance.ts`

The admittance axes are 180°-rotated clones of the impedance axes. All circle centres are mapped through `cx → -cx`, `cy → -cy`. The simplest implementation subclasses the impedance axes and overrides `drawGridLines` with the rotated math.

- [ ] **Step 1: Create `smithChartAdmittance.ts`**

```ts
import { TSciChart } from "scichart";
import { NumericAxis, Rect, DpiHelper } from "scichart";
import { WebGlRenderContext2D } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import {
  getArcParams,
  getVectorArcVertex,
  getArcVertex,
} from "scichart/Charting/Visuals/Helpers/NativeObject";
import {
  SmithResistanceTickProvider,
  SmithReactanceTickProvider,
  rCircleParams,
  xArcAngles,
  xArcCircleCenter,
} from "./smithChartAxes";

// ── Admittance resistance axis: constant-G circles ───────────────────────────
// Same math as constant-R circles but mirrored: centre = (-g/(1+g), 0), radius = 1/(1+g)

export class SmithChartAdmittanceResistanceAxis extends NumericAxis {
  private sibling: SmithChartAdmittanceReactanceAxis | null = null;

  constructor(wasmContext: TSciChart, options?: object) {
    super(wasmContext, {
      drawLabels: false,
      drawMajorTickLines: false,
      drawMinorTickLines: false,
      drawMajorBands: false,
      zoomExtentsToInitialRange: true,
      ...options,
    });
    this.tickProvider = new SmithResistanceTickProvider(wasmContext) as any;
  }

  override measure(): void {
    super.measure();
    this.sibling =
      (this.parentSurface?.yAxes?.get(
        1
      ) as SmithChartAdmittanceReactanceAxis) ?? null;
  }

  protected override drawGridLines(
    renderContext: WebGlRenderContext2D,
    _tickCoords: number[],
    linesPen: SCRTPen,
    isMajor: boolean
  ): void {
    if (!this.sibling) return;
    const wasmContext = this.webAssemblyContext2D;
    const xCalc = this.getCurrentCoordinateCalculator();
    const yCalc = this.sibling.getCurrentCoordinateCalculator();
    const vpHeight = this.parentSurface.renderSurface.viewportSize.height;
    const clipRect = Rect.intersect(
      this.parentSurface.clipRect,
      this.parentSurface.seriesViewRect
    );
    const leftPad =
      (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
    const topPad =
      (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
    const aspectRatio =
      Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
    const tp = this.tickProvider as any;
    const vecArcs = getVectorArcVertex(wasmContext);
    const arc = getArcVertex(wasmContext);

    const drawGCircle = (g: number, gapDistance: number) => {
      // Mirror of constant-R: centre = (-g/(1+g), 0), radius = 1/(1+g)
      const cx = -(g / (1 + g));
      const rad = 1 / (1 + g);
      const sinHalfGap = gapDistance / (2 * rad);
      if (sinHalfGap >= 1) return;
      const arcGap = sinHalfGap > 0 ? 2 * Math.asin(sinHalfGap) : 0;
      const cx_px = xCalc.getCoordinate(cx);
      const cy_native = vpHeight - yCalc.getCoordinate(0);
      const radius_px = Math.abs(xCalc.getCoordWidth(rad));
      arc.MakeCircularArc(
        getArcParams(
          wasmContext,
          cx_px,
          cy_native,
          arcGap,
          2 * Math.PI - arcGap,
          radius_px,
          0,
          1,
          aspectRatio,
          linesPen.m_fThickness
        )
      );
      vecArcs.push_back(arc);
    };

    if (isMajor) {
      for (const g of tp.getMajorTicks(0, 0, null) as number[])
        drawGCircle(g, 0);
    } else {
      const minor = tp.getMinorTicks(0, 0, null) as number[];
      for (let i = 0; i + 1 < minor.length; i += 2) {
        const g = minor[i],
          bClip = minor[i + 1];
        drawGCircle(g, 2 / Math.sqrt((g + 1) * (g + 1) + bClip * bClip));
      }
    }

    if (vecArcs.size() > 0) {
      renderContext.drawArcs(
        vecArcs,
        0,
        0,
        0,
        clipRect,
        linesPen,
        undefined,
        leftPad,
        topPad
      );
    }
  }
}

// ── Admittance reactance axis: constant-B arcs ───────────────────────────────
// Mirror of constant-X arcs: centre = (-1, 1/b) for positive B

export class SmithChartAdmittanceReactanceAxis extends NumericAxis {
  private sibling: SmithChartAdmittanceResistanceAxis | null = null;

  constructor(wasmContext: TSciChart, options?: object) {
    super(wasmContext, {
      drawLabels: false,
      drawMajorTickLines: false,
      drawMinorTickLines: false,
      drawMajorBands: false,
      zoomExtentsToInitialRange: true,
      ...options,
    });
    this.tickProvider = new SmithReactanceTickProvider(wasmContext) as any;
  }

  override measure(): void {
    super.measure();
    this.sibling =
      (this.parentSurface?.xAxes?.get(
        1
      ) as SmithChartAdmittanceResistanceAxis) ?? null;
  }

  protected override drawGridLines(
    renderContext: WebGlRenderContext2D,
    _tickCoords: number[],
    linesPen: SCRTPen,
    isMajor: boolean
  ): void {
    if (!this.sibling) return;
    const wasmContext = this.webAssemblyContext2D;
    const xCalc = this.sibling.getCurrentCoordinateCalculator();
    const yCalc = this.getCurrentCoordinateCalculator();
    const vpHeight = this.parentSurface.renderSurface.viewportSize.height;
    const svr = this.parentSurface.seriesViewRect;
    const clipRect = Rect.intersect(this.parentSurface.clipRect, svr);
    const leftPad =
      (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
    const topPad =
      (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;
    const aspectRatio =
      Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
    const tp = this.tickProvider as any;
    const vecArcs = getVectorArcVertex(wasmContext);
    const arc = getArcVertex(wasmContext);

    // Constant-B arcs: mirror of constant-X arcs.
    // Centre = (-1, 1/b) [positive B], radius = 1/|b|
    // Start at (-1, 0) (left edge), end at unit-circle intersection
    // xInt = -(x²-1)/(1+x²) = (1-b²)/(1+b²), yInt = 2b/(1+b²)
    const drawBArc = (absB: number, gapDistance: number) => {
      const rad = 1 / absB;
      const cx_pos = -1;
      const cy_pos = rad; // positive B arc centre
      const cy_neg = -rad; // negative B arc centre

      const bv2 = absB * absB;
      const xInt = (1 - bv2) / (1 + bv2);
      const yInt_pos = (2 * absB) / (1 + bv2);
      const yInt_neg = -yInt_pos;

      // Angles from arc centre to endpoints
      // Positive B arc: from (-1,0) to (xInt, yInt_pos)
      const thetaStart_pos = Math.atan2(0 - cy_pos, -1 - cx_pos); // angle to (-1,0)
      const thetaEnd_pos = Math.atan2(yInt_pos - cy_pos, xInt - cx_pos); // angle to intersection
      // Negative B arc: mirrored
      const thetaStart_neg = Math.atan2(0 - cy_neg, -1 - cx_pos);
      const thetaEnd_neg = Math.atan2(yInt_neg - cy_neg, xInt - cx_pos);

      let posStart = thetaStart_pos,
        posEnd = thetaEnd_pos;
      while (posEnd <= posStart) posEnd += 2 * Math.PI;
      let negStart = thetaStart_neg,
        negEnd = thetaEnd_neg;
      while (negEnd <= negStart) negEnd += 2 * Math.PI;

      if (gapDistance > 0) {
        const sinHalfGap = gapDistance / (2 * rad);
        if (sinHalfGap >= 1) return;
        const arcGap = 2 * Math.asin(sinHalfGap);
        posStart += arcGap;
        negEnd -= arcGap;
        if (posEnd <= posStart || negEnd <= negStart) return;
      }

      const cx_px = xCalc.getCoordinate(cx_pos);
      const rad_px = Math.abs(xCalc.getCoordWidth(rad));

      arc.MakeCircularArc(
        getArcParams(
          wasmContext,
          cx_px,
          vpHeight - yCalc.getCoordinate(cy_pos),
          posStart,
          posEnd,
          rad_px,
          0,
          1,
          aspectRatio,
          linesPen.m_fThickness
        )
      );
      vecArcs.push_back(arc);
      arc.MakeCircularArc(
        getArcParams(
          wasmContext,
          cx_px,
          vpHeight - yCalc.getCoordinate(cy_neg),
          negStart,
          negEnd,
          rad_px,
          0,
          1,
          aspectRatio,
          linesPen.m_fThickness
        )
      );
      vecArcs.push_back(arc);
    };

    if (isMajor) {
      for (const b of tp.getMajorTicks(0, 0, null) as number[]) drawBArc(b, 0);
    } else {
      const minor = tp.getMinorTicks(0, 0, null) as number[];
      for (let i = 0; i + 1 < minor.length; i += 2) {
        const b = minor[i],
          gClip = minor[i + 1];
        drawBArc(b, 2 / Math.sqrt((gClip + 1) * (gClip + 1) + b * b));
      }
    }

    if (vecArcs.size() > 0) {
      renderContext.drawArcs(
        vecArcs,
        0,
        0,
        0,
        clipRect,
        linesPen,
        undefined,
        leftPad,
        topPad
      );
    }
  }
}
```

- [ ] **Step 2: Add admittance axes to `drawExample.ts`**

In `drawExample.ts`, after the existing axis setup, add:

```ts
import {
  SmithChartAdmittanceResistanceAxis,
  SmithChartAdmittanceReactanceAxis,
} from "./smithChartAdmittance";

// After existing axes:
const yAdmittanceColor = "#44AAFF";
const admittanceResistanceAxis = new SmithChartAdmittanceResistanceAxis(
  wasmContext,
  {
    visibleRange: new NumberRange(-1.15, 1.15),
    axisAlignment: EAxisAlignment.Bottom,
    isVisible: false,
    majorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 2 },
    minorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 1 },
  }
);
const admittanceReactanceAxis = new SmithChartAdmittanceReactanceAxis(
  wasmContext,
  {
    visibleRange: new NumberRange(-1.15, 1.15),
    axisAlignment: EAxisAlignment.Left,
    isVisible: false,
    majorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 2 },
    minorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 1 },
  }
);
sciChartSurface.xAxes.add(admittanceResistanceAxis);
sciChartSurface.yAxes.add(admittanceReactanceAxis);
```

- [ ] **Step 3: Add admittance opacity update to `update()` in `drawExample.ts`**

In the `update` function, add:

```ts
const update = (state: SmithState) => {
  markersAdapter.update(state);

  // Grid mode
  const zAxes = [sciChartSurface.xAxes.get(0), sciChartSurface.yAxes.get(0)];
  const yAxes = [admittanceResistanceAxis, admittanceReactanceAxis];
  const zVisible = state.gridMode === "Z" || state.gridMode === "ZY";
  const yVisible = state.gridMode === "Y" || state.gridMode === "ZY";
  zAxes.forEach((ax) => {
    ax.isVisible = zVisible;
    const alpha = Math.round(state.zOpacity * 255)
      .toString(16)
      .padStart(2, "0");
    (ax as any).majorGridLineStyle = {
      ...(ax as any).majorGridLineStyle,
      color: `#aaaaaa${alpha}`,
    };
  });
  yAxes.forEach((ax) => {
    ax.isVisible = yVisible;
    const alpha = Math.round(state.yOpacity * 255)
      .toString(16)
      .padStart(2, "0");
    (ax as any).majorGridLineStyle = {
      ...(ax as any).majorGridLineStyle,
      color: `#44aaff${alpha}`,
    };
  });
};
```

_(Note: the exact opacity API may vary — if `majorGridLineStyle` is read-only, use `axis.invalidateElement()` after setting. Verify at runtime.)_

- [ ] **Step 4: Verify admittance grid compiles and axes work**

```bash
cd Examples && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "admittance\|smith"
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartAdmittance.ts src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/drawExample.ts && git commit -m "feat(smith-chart): add admittance overlay axes"
```

---

## Task 8: Toolbar — Z/Y/ZY toggle + opacity sliders + VSWR circle

**Files:**

- Modify: `index.tsx`
- Create: `smithChartVswr.ts`

- [ ] **Step 1: Create `smithChartVswr.ts`**

```ts
import {
  SciChartSurface,
  ArcAnnotation,
  CustomAnnotation,
  ECoordinateMode,
} from "scichart";
import { SmithState, SmithAction } from "./useSmithChart";

export class SmithVswrAdapter {
  private surface: SciChartSurface;
  private vswrArc: ArcAnnotation;
  private handle: CustomAnnotation;
  private dispatch: (a: SmithAction) => void = () => {};

  constructor(surface: SciChartSurface) {
    this.surface = surface;

    // Full circle ArcAnnotation at |Γ| = (VSWR-1)/(VSWR+1)
    this.vswrArc = new ArcAnnotation({
      x1: -0.333,
      y1: 0, // diameter endpoints for VSWR=2: r=0.333
      x2: 0.333,
      y2: 0,
      height: 0, // full circle when height=0 and chord is diameter
      isLineMode: true,
      stroke: "#FFAA00",
      strokeThickness: 1.5,
      strokeDashArray: [8, 4],
    });
    surface.annotations.add(this.vswrArc);

    // Draggable handle on real axis at (r, 0)
    this.handle = new CustomAnnotation({
      x1: 0.333,
      y1: 0,
      isEditable: true,
      annotationLayer: 1,
    });
    surface.annotations.add(this.handle);
  }

  setDispatch(d: (a: SmithAction) => void) {
    this.dispatch = d;
  }

  update(state: SmithState): void {
    const r = (state.vswr - 1) / (state.vswr + 1);
    // ArcAnnotation full circle: x1=(cx-r,0), x2=(cx+r,0), height=0
    this.vswrArc.x1 = -r;
    this.vswrArc.x2 = r;
    this.vswrArc.height = 0;
    this.vswrArc.isHidden = false;

    this.handle.x1 = r;
    this.handle.y1 = 0;
  }
}
```

- [ ] **Step 2: Add VSWR adapter to `drawExample.ts`**

```ts
import { SmithVswrAdapter } from "./smithChartVswr";

// In drawExample body:
const vswrAdapter = new SmithVswrAdapter(sciChartSurface);

// In update():
vswrAdapter.update(state);

// In setDispatch():
vswrAdapter.setDispatch(dispatch);

// In return:
return { sciChartSurface, wasmContext, update, setDispatch };
```

- [ ] **Step 3: Add toolbar to `index.tsx`**

Below the chart + readout panel box, add a toolbar row:

```tsx
import {
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  Divider,
} from "@mui/material";

// In the JSX, after the main Box:
{
  /* Toolbar */
}
<Box
  sx={{
    p: 1,
    borderTop: "1px solid",
    borderColor: "divider",
    display: "flex",
    gap: 2,
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
  {/* Z/Y/ZY toggle */}
  <Stack direction="row" alignItems="center" gap={1}>
    <Typography variant="caption">Grid:</Typography>
    <ToggleButtonGroup
      size="small"
      value={state.gridMode}
      exclusive
      onChange={(_, v) => v && dispatch({ type: "SET_GRID_MODE", mode: v })}
    >
      <ToggleButton value="Z">Z</ToggleButton>
      <ToggleButton value="Y">Y</ToggleButton>
      <ToggleButton value="ZY">ZY</ToggleButton>
    </ToggleButtonGroup>
  </Stack>

  {/* Z opacity slider */}
  {(state.gridMode === "Z" || state.gridMode === "ZY") && (
    <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
      <Typography variant="caption">Z α:</Typography>
      <Slider
        size="small"
        value={state.zOpacity}
        min={0}
        max={1}
        step={0.05}
        onChange={(_, v) =>
          dispatch({ type: "SET_Z_OPACITY", opacity: v as number })
        }
        sx={{ width: 80 }}
      />
    </Stack>
  )}

  {/* Y opacity slider */}
  {(state.gridMode === "Y" || state.gridMode === "ZY") && (
    <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 120 }}>
      <Typography variant="caption">Y α:</Typography>
      <Slider
        size="small"
        value={state.yOpacity}
        min={0}
        max={1}
        step={0.05}
        onChange={(_, v) =>
          dispatch({ type: "SET_Y_OPACITY", opacity: v as number })
        }
        sx={{ width: 80 }}
      />
    </Stack>
  )}

  <Divider orientation="vertical" flexItem />

  {/* VSWR circle */}
  <Stack direction="row" alignItems="center" gap={1}>
    <Typography variant="caption">VSWR:</Typography>
    <TextField
      size="small"
      type="number"
      value={state.vswr.toFixed(2)}
      inputProps={{
        min: 1.01,
        max: 100,
        step: 0.1,
        style: { width: 60, fontSize: 12 },
      }}
      onChange={(e) => {
        const v = parseFloat(e.target.value);
        if (v > 1) dispatch({ type: "SET_VSWR", vswr: v });
      }}
    />
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={state.vswrShaded}
          onChange={(e) =>
            dispatch({ type: "SET_VSWR_SHADED", shaded: e.target.checked })
          }
        />
      }
      label={<Typography variant="caption">Shade</Typography>}
    />
  </Stack>
</Box>;
```

- [ ] **Step 4: Verify toolbar renders and Z/Y/ZY toggle works**

```bash
cd Examples && npm run dev
```

Verify: toggling Z/Y/ZY shows/hides the respective grids; VSWR circle appears and updates with numeric input.

- [ ] **Step 5: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartVswr.ts src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/drawExample.ts src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/index.tsx && git commit -m "feat(smith-chart): add Z/Y/ZY toolbar, opacity sliders, and VSWR circle"
```

---

## Task 9: Component chain math (`smithChartChain.ts`)

**Files:**

- Create: `smithChartChain.ts`
- Create: `Examples/testUnit/SmithChart/chain.test.ts`

All math here is normalized (Z₀ = 1). Values entered by users are normalized by dividing/multiplying by Z₀ = 50Ω before/after.

- [ ] **Step 1: Write failing chain math tests**

Create `Examples/testUnit/SmithChart/chain.test.ts`:

```ts
import { assert } from "chai";
import { computeChainStep } from "../../src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartChain";

const EPS = 1e-4;
const approx = (a: number, b: number) => Math.abs(a - b) < EPS;
const Z0 = 50;

describe("computeChainStep", () => {
  it("series L at Z=1+j0 (Γ=0) moves up constant-R=1 circle", () => {
    // At Γ=0, Z=1. Adding series jωL with ωL=50Ω → Δx_norm = 1.0
    // New z = 1 + j1; new Γ = (z-1)/(z+1) = j/(2+j) = ...
    const step = computeChainStep(
      { re: 0, im: 0 },
      "seriesL",
      50 / (2 * Math.PI * 1e9),
      1e9,
      Z0
    );
    // z_new = 1 + j(ωL/Z0) = 1 + j1
    const zr_new = 1,
      zx_new = 1;
    const denom = (1 + zr_new) ** 2 + zx_new ** 2;
    const expected_re = (zr_new ** 2 + zx_new ** 2 - 1) / denom;
    const expected_im = (2 * zx_new) / denom;
    assert.ok(
      approx(step.toGamma.re, expected_re),
      `re: ${step.toGamma.re} vs ${expected_re}`
    );
    assert.ok(
      approx(step.toGamma.im, expected_im),
      `im: ${step.toGamma.im} vs ${expected_im}`
    );
    assert.ok(step.arcPoints.length >= 10, "should have arc points");
  });

  it("TL section: |Γ| is preserved, angle decreases", () => {
    // 0.25λ section rotates by 4π×0.25 = π radians clockwise
    const gamma0 = { re: 0.5, im: 0 };
    const step = computeChainStep(gamma0, "TL", 0.25, 1e9, Z0); // value = wavelengths
    const mag0 = Math.sqrt(gamma0.re ** 2 + gamma0.im ** 2);
    const mag1 = Math.sqrt(step.toGamma.re ** 2 + step.toGamma.im ** 2);
    assert.ok(
      approx(mag0, mag1),
      `|Γ| should be preserved: ${mag0} vs ${mag1}`
    );
    // 0.25λ → rotate by π → Γ should be at angle π from start
    assert.ok(
      approx(step.toGamma.re, -0.5),
      `re should be -0.5, got ${step.toGamma.re}`
    );
    assert.ok(
      approx(step.toGamma.im, 0),
      `im should be 0, got ${step.toGamma.im}`
    );
  });

  it("series C at Z=1+j0 moves down constant-R=1 circle (negative reactance)", () => {
    // Adding series C with 1/(ωC) = 50Ω → Δx_norm = -1.0
    const step = computeChainStep(
      { re: 0, im: 0 },
      "seriesC",
      1 / (2 * Math.PI * 1e9 * 50),
      1e9,
      Z0
    );
    // z_new = 1 - j1; Γ = (z-1)/(z+1) = -j/(2-j)
    assert.ok(
      step.toGamma.im < 0,
      "series C should move to negative imaginary"
    );
  });
});
```

- [ ] **Step 2: Run — expect failure**

```bash
cd Examples && npm run testUnit 2>&1 | head -10
```

- [ ] **Step 3: Create `smithChartChain.ts` with `computeChainStep`**

```ts
import {
  SciChartSurface,
  TSciChart,
  XyDataSeries,
  FastLineRenderableSeries,
  CustomAnnotation,
  ECoordinateMode,
} from "scichart";
import {
  GammaPoint,
  ChainStep,
  ComponentType,
  SmithState,
  SmithAction,
} from "./useSmithChart";

const ARC_STEPS = 100;

/**
 * Computes toGamma and arcPoints for one chain step.
 * All component values are in SI units (H, F, Ω) except TL which is in wavelengths.
 * Z0 is the reference impedance (typically 50Ω).
 */
export function computeChainStep(
  fromGamma: GammaPoint,
  type: ComponentType,
  value: number,
  frequency: number,
  Z0: number
): { toGamma: GammaPoint; arcPoints: GammaPoint[] } {
  const omega = 2 * Math.PI * frequency;

  // Convert Γ → z
  const { re: gr, im: gi } = fromGamma;
  const denom = (1 - gr) ** 2 + gi ** 2;
  const zr = denom > 1e-12 ? (1 - gr ** 2 - gi ** 2) / denom : 1e6;
  const zx = denom > 1e-12 ? (2 * gi) / denom : 0;

  // Convert z → y = 1/z
  const zMagSq = zr ** 2 + zx ** 2;
  const gy = zMagSq > 1e-12 ? zr / zMagSq : 1e6;
  const by = zMagSq > 1e-12 ? -zx / zMagSq : 0;

  let toGamma: GammaPoint;
  let arcPoints: GammaPoint[] = [];

  if (type === "TL") {
    // Lossless TL: rotate clockwise by 4π·d/λ (where value = d/λ)
    const rotAngle = -4 * Math.PI * value; // negative = clockwise
    const mag = Math.sqrt(gr ** 2 + gi ** 2);
    const startAngle = Math.atan2(gi, gr);
    const endAngle = startAngle + rotAngle;
    toGamma = { re: mag * Math.cos(endAngle), im: mag * Math.sin(endAngle) };
    for (let i = 0; i <= ARC_STEPS; i++) {
      const a = startAngle + (i / ARC_STEPS) * rotAngle;
      arcPoints.push({ re: mag * Math.cos(a), im: mag * Math.sin(a) });
    }
    return { toGamma, arcPoints };
  }

  if (type === "seriesL" || type === "seriesC" || type === "seriesR") {
    // Series element: z_new = z + Δz_normalized
    let dzx = 0,
      dzr = 0;
    if (type === "seriesL") dzx = (omega * value) / Z0;
    else if (type === "seriesC") dzx = -1 / (omega * value * Z0);
    else dzr = value / Z0;

    const zr_end = zr + dzr;
    const zx_end = zx + dzx;

    // Arc: parametric from (zr, zx) to (zr_end, zx_end) along constant-R or constant-X curve
    if (type === "seriesR") {
      // Constant-X arc (x stays fixed, r changes)
      for (let i = 0; i <= ARC_STEPS; i++) {
        const ri = zr + (i / ARC_STEPS) * dzr;
        arcPoints.push(zToGamma(ri, zx));
      }
    } else {
      // Constant-R arc (r stays fixed, x changes)
      for (let i = 0; i <= ARC_STEPS; i++) {
        const xi = zx + (i / ARC_STEPS) * dzx;
        arcPoints.push(zToGamma(zr, xi));
      }
    }
    toGamma = zToGamma(zr_end, zx_end);
    return { toGamma, arcPoints };
  }

  // Shunt element: y_new = y + Δy_normalized
  let dby = 0,
    dgy = 0;
  if (type === "shuntL")
    dby = -Z0 / (omega * value); // Y_shuntL = 1/(jωL) normalized: -jZ0/(ωL)
  else if (type === "shuntC")
    dby = omega * value * Z0; // Y_shuntC = jωC normalized: jωCZ0
  else dgy = Z0 / value; // Y_shuntR = 1/R normalized: Z0/R

  const gy_end = gy + dgy;
  const by_end = by + dby;

  if (type === "shuntR") {
    // Constant-B arc (b stays fixed, g changes)
    for (let i = 0; i <= ARC_STEPS; i++) {
      const gi_y = gy + (i / ARC_STEPS) * dgy;
      arcPoints.push(yToGamma(gi_y, by));
    }
  } else {
    // Constant-G arc (g stays fixed, b changes)
    for (let i = 0; i <= ARC_STEPS; i++) {
      const bi_y = by + (i / ARC_STEPS) * dby;
      arcPoints.push(yToGamma(gy, bi_y));
    }
  }
  toGamma = yToGamma(gy_end, by_end);
  return { toGamma, arcPoints };
}

/** z → Γ: Γ = (z-1)/(z+1) */
function zToGamma(zr: number, zx: number): GammaPoint {
  const denom = (zr + 1) ** 2 + zx ** 2;
  if (denom < 1e-12) return { re: 1, im: 0 };
  return { re: (zr ** 2 + zx ** 2 - 1) / denom, im: (2 * zx) / denom };
}

/** y → Γ: Γ = (1-z)/(1+z), z = 1/y */
function yToGamma(gy: number, by: number): GammaPoint {
  const yMagSq = gy ** 2 + by ** 2;
  if (yMagSq < 1e-12) return { re: 1, im: 0 };
  const zr = gy / yMagSq;
  const zx = -by / yMagSq;
  return zToGamma(zr, zx);
}

// ── SmithChainAdapter ─────────────────────────────────────────────────────────

const CHAIN_COLOURS = [
  "#FF8800",
  "#FF4488",
  "#88FF00",
  "#00FFFF",
  "#FF0088",
  "#FFFF00",
];

export class SmithChainAdapter {
  private surface: SciChartSurface;
  private wasmContext: TSciChart;
  private stepSeries: Map<
    string,
    { ds: XyDataSeries; rs: FastLineRenderableSeries }
  > = new Map();
  private dispatch: (a: SmithAction) => void = () => {};
  readonly Z0 = 50;

  constructor(surface: SciChartSurface, wasmContext: TSciChart) {
    this.surface = surface;
    this.wasmContext = wasmContext;
  }

  setDispatch(d: (a: SmithAction) => void) {
    this.dispatch = d;
  }

  /** Add a step — call from toolbar "Add" button */
  addStep(
    fromGamma: GammaPoint,
    type: ComponentType,
    value: number,
    frequency: number
  ): void {
    const { toGamma, arcPoints } = computeChainStep(
      fromGamma,
      type,
      value,
      frequency,
      this.Z0
    );
    const step: ChainStep = {
      id: `step-${Date.now()}`,
      type,
      value,
      frequency,
      fromGamma,
      toGamma,
      arcPoints,
    };
    this.dispatch({ type: "ADD_CHAIN_STEP", step });
  }

  update(state: SmithState): void {
    // Remove series for removed steps
    for (const [id, { ds, rs }] of this.stepSeries) {
      if (!state.chain.find((s) => s.id === id)) {
        this.surface.renderableSeries.remove(rs);
        ds.delete();
        this.stepSeries.delete(id);
      }
    }

    // Add series for new steps
    state.chain.forEach((step, i) => {
      if (!this.stepSeries.has(step.id)) {
        const colour = CHAIN_COLOURS[i % CHAIN_COLOURS.length];
        const ds = new XyDataSeries(this.wasmContext);
        step.arcPoints.forEach((p) => ds.append(p.re, p.im));
        const rs = new FastLineRenderableSeries(this.wasmContext, {
          dataSeries: ds,
          stroke: colour,
          strokeThickness: 2.5,
        });
        this.surface.renderableSeries.add(rs);
        this.stepSeries.set(step.id, { ds, rs });
      }
    });
  }

  /** Returns the current "tip" of the chain (last toGamma, or chain start) */
  getChainTip(state: SmithState): GammaPoint | null {
    if (state.chain.length > 0)
      return state.chain[state.chain.length - 1].toGamma;
    const startMarker = state.markers.find((m) => m.isChainStart);
    if (startMarker) return startMarker.gamma;
    return state.chainStartGamma;
  }
}
```

- [ ] **Step 4: Run chain tests — expect pass**

```bash
cd Examples && npm run testUnit 2>&1 | head -30
```

Expected: all chain math tests passing.

- [ ] **Step 5: Commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/smithChartChain.ts testUnit/SmithChart/chain.test.ts && git commit -m "feat(smith-chart): add component chain math and rendering adapter with unit tests"
```

---

## Task 10: Chain toolbar + final wire-up

**Files:**

- Modify: `drawExample.ts` (add SmithChainAdapter)
- Modify: `index.tsx` (add chain toolbar section + chain step list in readout panel)

- [ ] **Step 1: Add `SmithChainAdapter` to `drawExample.ts`**

```ts
import { SmithChainAdapter } from "./smithChartChain";

// In drawExample body, after existing adapters:
const chainAdapter = new SmithChainAdapter(sciChartSurface, wasmContext);

// In update():
chainAdapter.update(state);

// In setDispatch():
chainAdapter.setDispatch(dispatch);

// Add getChainTip to return value:
return {
  sciChartSurface,
  wasmContext,
  update,
  setDispatch,
  getChainTip: (s: SmithState) => chainAdapter.getChainTip(s),
  addChainStep: chainAdapter.addStep.bind(chainAdapter),
};
```

- [ ] **Step 2: Expose `addChainStep` and `getChainTip` via ref in `index.tsx`**

In `index.tsx`, extend the ref type and `onInit`:

```tsx
const chartApiRef = useRef<{
    update: (s: SmithState) => void;
    getChainTip: (s: SmithState) => GammaPoint | null;
    addChainStep: (from: GammaPoint, type: ComponentType, value: number, freq: number) => void;
} | null>(null);

// In onInit:
onInit={(result) => {
    result.setDispatch(dispatch);
    updateRef.current = result.update;
    chartApiRef.current = result;
    updateRef.current(state);
}}
```

- [ ] **Step 3: Add chain toolbar section to `index.tsx`**

Below the VSWR section in the toolbar, add:

```tsx
<Divider orientation="vertical" flexItem />;

{
  /* Chain toolbar */
}
<Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
  <Typography variant="caption">Freq:</Typography>
  <TextField
    size="small"
    type="number"
    value={(state.frequency / 1e9).toFixed(3)}
    inputProps={{
      min: 0.001,
      max: 100,
      step: 0.1,
      style: { width: 60, fontSize: 12 },
    }}
    onChange={(e) =>
      dispatch({
        type: "SET_FREQUENCY",
        frequency: parseFloat(e.target.value) * 1e9,
      })
    }
  />
  <Typography variant="caption">GHz</Typography>

  <Select
    size="small"
    value={chainType}
    onChange={(e) => setChainType(e.target.value as ComponentType)}
    sx={{ fontSize: 12, minWidth: 100 }}
  >
    {[
      ["seriesL", "Series L"],
      ["seriesC", "Series C"],
      ["seriesR", "Series R"],
      ["shuntL", "Shunt L"],
      ["shuntC", "Shunt C"],
      ["shuntR", "Shunt R"],
      ["TL", "Trans. Line"],
    ].map(([v, l]) => (
      <MenuItem key={v} value={v} sx={{ fontSize: 12 }}>
        {l}
      </MenuItem>
    ))}
  </Select>

  <TextField
    size="small"
    type="number"
    value={chainValue}
    inputProps={{ style: { width: 70, fontSize: 12 } }}
    onChange={(e) => setChainValue(e.target.value)}
    placeholder={chainType === "TL" ? "λ" : "SI"}
  />

  <Button
    size="small"
    variant="outlined"
    onClick={() => {
      const tip = chartApiRef.current?.getChainTip(state);
      if (!tip) return;
      const parsed = parseFloat(chainValue);
      if (isNaN(parsed)) return;
      chartApiRef.current?.addChainStep(
        tip,
        chainType,
        parsed,
        state.frequency
      );
    }}
    disabled={!chartApiRef.current?.getChainTip(state)}
  >
    Add
  </Button>

  <Button
    size="small"
    variant="outlined"
    color="warning"
    onClick={() => dispatch({ type: "UNDO_CHAIN_STEP" })}
    disabled={state.chain.length === 0}
  >
    Undo
  </Button>
</Stack>;
```

Add local state for the toolbar inputs at the top of `SmithChartComponent`:

```tsx
const [chainType, setChainType] = React.useState<ComponentType>("seriesL");
const [chainValue, setChainValue] = React.useState("1e-9");
```

- [ ] **Step 4: Add chain step list to the readout panel**

Below the markers section in the sidebar, add:

```tsx
{
  state.chain.length > 0 && (
    <>
      <Divider sx={{ my: 0.5 }} />
      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        CHAIN ({state.chain.length} steps)
      </Typography>
      {state.chain.map((step, i) => (
        <Box
          key={step.id}
          sx={{ display: "flex", gap: 1, alignItems: "center" }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: CHAIN_COLOURS[i % CHAIN_COLOURS.length],
            }}
          />
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
            {step.type} {step.value.toExponential(2)}
            {" → "}Γ={step.toGamma.re.toFixed(3)}+j{step.toGamma.im.toFixed(3)}
          </Typography>
        </Box>
      ))}
      {/* Chain start indicator */}
      {(state.markers.find((m) => m.isChainStart) || state.chainStartGamma) && (
        <Typography variant="caption" color="text.secondary">
          Start:{" "}
          {(() => {
            const m = state.markers.find((m) => m.isChainStart);
            if (m) return m.label;
            const g = state.chainStartGamma!;
            return `Γ=(${g.re.toFixed(3)},${g.im.toFixed(3)})`;
          })()}
        </Typography>
      )}
    </>
  );
}
```

- [ ] **Step 5: Verify full feature end-to-end**

```bash
cd Examples && npm run dev
```

Verify:

- Placing markers shows readouts
- Z/Y/ZY toggle works with opacity sliders
- VSWR circle updates from input and (if draggable handle works) from drag
- Setting chain start via marker right-click → "Use as chain start"
- Adding series L/C/R / shunt L/C/R / TL draws arcs
- Undo removes the last arc
- Chain step list updates in readout panel

- [ ] **Step 6: Final cleanup — remove old dead code from `drawExample.ts`**

Remove from `drawExample.ts`:

- `createCircle()` function (no longer used)
- `populateRCircle()`, `populateXArc()`, `populateCircle()` functions (moved to `smithChartMarkers.ts`)
- Old `SmithChartDragModifier` class if still present
- Old `pointDS` / `XyScatterRenderableSeries` if still present
- Unused imports

- [ ] **Step 7: TypeScript type check**

```bash
cd Examples && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "smithChart\|error"
```

Expected: no errors.

- [ ] **Step 8: Run all tests**

```bash
cd Examples && npm run testUnit
```

Expected: all passing.

- [ ] **Step 9: Final commit**

```bash
cd Examples && git add src/components/Examples/Charts2D/ModifyAxisBehavior/SmithChart/ testUnit/SmithChart/ && git commit -m "feat(smith-chart): Tier 2 complete — admittance overlay, VSWR circle, component chain"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement                        | Covered by                                              |
| --------------------------------------- | ------------------------------------------------------- |
| Full readout panel (all 10 values)      | Task 2 (`computeReadouts`), Task 6 (`ReadoutTable`)     |
| Multiple named markers — click to place | Task 5 (`SmithClickModifier`)                           |
| Multiple named markers — drag to move   | Task 5 (`SmithClickModifier.modifierMouseMove`)         |
| Outer rim — simplified angle ring       | Task 3 (`drawRimTicks`), Task 4 (axis integration)      |
| Outer rim — dynamic spokes per marker   | Task 5 (`_syncMarkerAnnotations` spoke logic)           |
| Admittance overlay — Z/Y/ZY toggle      | Task 7 (`smithChartAdmittance.ts`), Task 8 (toolbar)    |
| Admittance — opacity controls           | Task 8 (`SET_Z_OPACITY` / `SET_Y_OPACITY` actions)      |
| VSWR target circle — numeric input      | Task 8 (`smithChartVswr.ts` + toolbar)                  |
| VSWR target circle — draggable handle   | Task 8 (`SmithVswrAdapter` handle annotation)           |
| VSWR — optional shading                 | Task 8 (`SET_VSWR_SHADED` action, `ArcAnnotation.fill`) |
| Component chain — series L/C/R          | Task 9 (`computeChainStep`)                             |
| Component chain — shunt L/C/R           | Task 9 (`computeChainStep`)                             |
| Component chain — TL section            | Task 9 (`computeChainStep`)                             |
| Chain toolbar                           | Task 10                                                 |
| Chain start from marker                 | Task 1 (`PROMOTE_TO_CHAIN_START` action), Task 10       |
| Undo last step                          | Task 1 (`UNDO_CHAIN_STEP`), Task 10                     |

**Open questions from spec that may need resolution during implementation:**

1. **`CustomAnnotation` drag API** — the plan uses `SmithClickModifier` for all drag (hit-testing markers by pixel distance). If `CustomAnnotation` exposes a native drag callback, use it instead. Check `WaveHeatmapInteractions` before Task 5.

2. **Axis opacity API** — `axis.majorGridLineStyle` may be immutable; may need `axis.invalidateElement()` or recreating the style object. Test during Task 7.

3. **ArcAnnotation full circle (`height=0`)** — the plan uses `x1=(-r,0)`, `x2=(r,0)`, `height=0`. If this renders as a semicircle, use `height` with a small ε or use two arcs. Verify during Task 8.

4. **Right-click context menu for markers** — not yet implemented. A follow-up task can add a React portal at mouse position for "Delete" and "Use as chain start".
