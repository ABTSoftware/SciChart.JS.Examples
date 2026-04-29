# Smith Chart Research: Engineering Use Cases & Feature Roadmap

## What Problem the Smith Chart Solves

The Smith chart is a graphical calculator for RF/microwave engineers working with **complex impedance**.
At RF frequencies, components have complex impedances that vary with frequency, and mismatched impedances
cause reflections that waste power and damage equipment. Engineers need to:

1. Visualise how impedance changes along transmission lines
2. Design networks that transform one impedance to another (matching)
3. Trade off competing objectives (gain vs. noise vs. stability) in amplifier design

The chart works by mapping the complex impedance plane `z = R + jX` through a Möbius transformation
onto the unit disk, where position = reflection coefficient Γ = (Z_L − Z_0) / (Z_L + Z_0).

---

## Key Curve Families

| Family                      | Shape                                  | Centre / Radius                              |
| --------------------------- | -------------------------------------- | -------------------------------------------- |
| Constant resistance circles | Circles tangent to right edge at (1,0) | Centre (r/(1+r), 0), radius 1/(1+r)          |
| Constant reactance arcs     | Arcs tangent to right edge             | Centre (1, 1/x), radius 1/\|x\|              |
| Constant \|Γ\| circles      | Concentric circles at origin           | = constant VSWR = constant return loss       |
| Constant angle lines        | Radial spokes from centre              | Phase angle of Γ                             |
| Q circles                   | Circles through origin                 | Constant Q = \|x\|/r — used in filter design |

---

## Outer Rim Scales

A traditional paper Smith chart has three concentric scales around the outer rim:

1. **Wavelengths Toward Generator (WTG)** — 0 to 0.5λ, running clockwise.
   Moving clockwise by a value here = moving that electrical distance toward the source along a transmission line.
2. **Wavelengths Toward Load (WTL)** — 0 to 0.5λ, counter-clockwise.
3. **Angle of reflection coefficient** — degrees (±180°). The phase of Γ at that point.

The WTG/WTL scales are critical: a lossless transmission line of length `d` rotates the impedance
point **clockwise** by `2d/λ` turns (0.5λ = one full revolution = back to start).

---

## Component Movements on the Chart

This is the heart of matching network design. Each component type traces a specific arc:

| Component added                       | Movement on Z-chart                                                 |
| ------------------------------------- | ------------------------------------------------------------------- |
| Series inductor (+jωL)                | Moves **up** along constant-R circle (increasing reactance)         |
| Series capacitor (−j/ωC)              | Moves **down** along constant-R circle                              |
| Series resistor (+R)                  | Moves **right** along constant-X arc                                |
| Shunt inductor                        | Moves along constant-G circle (easier on Y-chart)                   |
| Shunt capacitor                       | Moves along constant-G circle (easier on Y-chart)                   |
| Shunt resistor                        | Moves along constant-B arc (easier on Y-chart)                      |
| Lossless transmission line (length d) | Rotates **clockwise** around origin at constant \|Γ\| by 2d/λ turns |
| Lossy transmission line               | Spirals inward clockwise toward centre                              |

**Key rule:** Series components are easiest to work with on the Z (impedance) chart;
shunt/parallel components are easiest on the Y (admittance) chart.
Switching between Z and Y is a 180° rotation about the centre.

---

## Core Engineering Workflows

### 1. Transmission Line Analysis

-   Plot the load impedance point Z_L
-   The impedance seen at distance `d` from the load = rotate clockwise by `2d/λ` on a constant-|Γ| circle
-   Read the resulting Z, VSWR, return loss at any distance using the WTG outer scale

### 2. Single-Stub Matching

-   From the load point, rotate along a constant-|Γ| circle until hitting the unit conductance circle (g=1 on Y-chart)
-   Add a shunt stub (open or short-circuit stub) of the right length to cancel the susceptance → reach centre (Γ=0)

### 3. L-Network Matching

-   Goal: move the load impedance to the chart centre (Γ=0, Z=Z₀, perfect match)
-   Choose a series component to move along a constant-R circle until hitting a desired constant-|Γ| circle
-   Then choose a shunt component to arc into the centre
-   (Or shunt first, then series — two solutions exist)

### 4. Amplifier Design (Advanced)

-   Plot **input stability circle** and **output stability circle** from transistor S-parameters
-   Plot **available gain circles** (constant transducer gain G_T, concentric but not centred at origin)
-   Plot **noise figure circles** (constant F, centred at Γ_opt)
-   Find the source impedance Γ_S that trades off gain vs. noise
-   Design input/output matching networks to hit those targets

---

## Key Readouts Needed at Any Point

When an engineer places a marker or hovers over a point, they want to see:

| Value                        | Formula / Source                                |
| ---------------------------- | ----------------------------------------------- |
| Γ (complex)                  | x + jy directly from position                   |
| \|Γ\|                        | Distance from chart centre                      |
| ∠Γ (degrees)                 | Angle from positive real axis                   |
| Normalised impedance z       | r + jx (read from resistance/reactance circles) |
| Normalised admittance y      | g + jb (rotate 180° or read Y overlay)          |
| VSWR                         | (1 + \|Γ\|) / (1 − \|Γ\|)                       |
| Return loss                  | −20 log₁₀(\|Γ\|) dB                             |
| Mismatch loss                | −10 log₁₀(1 − \|Γ\|²) dB                        |
| Wavelengths toward generator | WTG outer scale                                 |
| Wavelengths toward load      | WTL outer scale                                 |
| Q factor                     | \|x\| / r                                       |

---

## Advanced Overlays

These circles are drawn on top of the base chart for specific use cases:

-   **Stability circles** — for amplifier design; circles bounding stable source/load regions.
    Can be centred anywhere, including outside the unit circle.
-   **Available gain circles** — loci of constant transducer gain G_T. Concentric circles whose
    centre moves toward the optimal Γ_opt.
-   **Noise figure circles** — loci of constant noise figure F. Centre at Γ_opt (optimal noise
    match), expanding outward as F increases.
-   **VSWR target circle** — user-defined VSWR limit (e.g. VSWR=2.0); the region inside this
    circle represents "acceptable" match. Often shaded.
-   **Frequency locus** — the path traced by a load as frequency sweeps. Shows how impedance
    changes with frequency; often a curved arc or spiral.

---

## Features of Existing Interactive Smith Chart Tools

Tools like SimSmith, Smith V3 (web), Keysight ADS, and RF Tools provide:

-   **Click/drag** to place or move an impedance point
-   **Component palette** — click "add series L", "add shunt C", "add TL section"; the arc from
    current point to new point is drawn and the new position shown
-   **Frequency sweep** — input component values and see the full frequency locus over a band
-   **Z / Y / ZY toggle** — switch between impedance grid, admittance grid, or combined "immittance" view
-   **Multiple numbered markers** — pin multiple points, display full readout table for each
-   **WTG/WTL cursor** — snap to outer scale, show current electrical position on transmission line
-   **VSWR goal circle** — shade the region inside a target VSWR circle
-   **Stability / gain / noise circles** — input transistor S-parameters (Touchstone .s2p) and draw design circles
-   **Touchstone file import** — read a measured .s1p or .s2p file and plot the frequency locus directly

---

## Proposed Feature Roadmap for SciChart Smith Chart

Ordered by engineering value:

### Tier 1 — Core Usefulness

1. **Full readout panel** — show |Γ|, ∠Γ, Z (r+jx), Y (g+jb), VSWR, return loss, mismatch loss, Q, WTG, WTL simultaneously when hovering or at a placed marker
2. **Outer rim scales** — WTG, WTL, and angle of Γ rendered as tick marks / labels around the perimeter
3. **Multiple named markers** — pin points on the chart, label them (M1, M2…), compare values

### Tier 2 — Matching Design

4. **Admittance (Y) overlay** — toggle a second grid rotated 180° (constant-G circles, constant-B arcs drawn in a different colour)
5. **VSWR target circle** — user sets a VSWR limit (e.g. 2.0), draw and optionally shade that circle
6. **Component trace** — select a component type (series L/C/R, shunt L/C/R, TL section), enter its value, draw the arc from the current point to the new impedance point

### Tier 3 — RF Engineering / VNA Data

7. **Frequency locus** — import a Touchstone .s1p file and plot impedance vs. frequency as a trace on the chart; markers snap to specific frequencies
8. **Frequency sweep animation** — animate the point moving along the frequency locus

### Tier 4 — Amplifier Design (Advanced)

9. **Stability circles** — input S-parameters, compute and draw source/load stability circles
10. **Available gain circles** — compute and draw constant-G_T circles
11. **Noise figure circles** — compute and draw constant-F circles

---

## Note on Coordinate System (Cartesian vs Polar)

The current Cartesian SciChartSurface implementation is the correct approach.
The Γ plane IS a Cartesian plane (real/imaginary axes). The Smith chart's "polar feel"
comes from data living within the unit disk, not from the gridlines being polar curves.
The constant-R circles and constant-X arcs are offset circles (not centred at the origin)
and do not simplify in polar coordinates — they would become more complex curves.
The Cartesian approach used here matches how every professional Smith chart renderer works.
