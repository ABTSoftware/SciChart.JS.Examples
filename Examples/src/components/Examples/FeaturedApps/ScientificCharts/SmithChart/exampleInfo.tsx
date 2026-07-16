import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "SmithChart",
        id: "featuredApps_scientificCharts_SmithChart",
        imagePath: "smith-chart.jpg",
        description:
            "Demonstrates how to create a **JavaScript Chart with Smith Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Smith Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart with Smith Chart",
                pageTitle: "JavaScript Chart with Smith Chart",
                metaDescription:
                    "Interactive JavaScript Smith chart for RF impedance matching — place markers, build matching networks step by step with the component chain, and switch between impedance and admittance grids.",
                markdownContent: `### What is a Smith Chart?

RF and microwave engineers face a recurring problem: getting maximum power from a source into a load when both have complex, frequency-dependent impedances. A mismatch causes reflections that waste power, distort signals, and can damage amplifiers. Fixing it means choosing the right combination of inductors, capacitors, and transmission-line sections — but the interactions are non-linear and hard to reason about algebraically.

The **Smith chart** makes this tractable by turning the matching problem into a geometry problem. Every possible impedance maps to a point inside a circle, and adding each type of component moves that point along a predictable curve. Series inductors and capacitors arc along circles; shunt components arc along a different family; a length of transmission line rotates the point around the chart centre. The goal — a perfect impedance match — is the centre of the chart.

This demo lets you explore those mechanics interactively. Place a marker to read the full impedance, admittance, VSWR and return-loss figures at any point. Load one of the built-in examples to see a complete matching problem worked through step by step. Or build your own network in the Chain panel, adding components one at a time and watching the operating point move to its destination.

### SciChart.js Implementation

This example is built entirely on \`SciChartSurface\` with custom \`NumericAxis\` subclasses — no specialised polar surface is required because the Γ plane is Cartesian.

**Custom axes** override \`drawGridLines\` and \`drawLabels\` to render the characteristic Smith chart curves using WebGL arc primitives via the SciChart WASM context:
- \`SmithChartResistanceAxis\` (X-axis) draws constant-R circles and the outer rim ring, and hosts a custom \`SmithChartAxisRenderer\` that places R labels at each circle’s left tangent point.
- \`SmithChartReactanceAxis\` (Y-axis) draws constant-X arcs clipped to the unit circle with X labels at each arc’s unit-circle intersection.
- \`SmithChartAdmittanceResistanceAxis\` / \`SmithChartAdmittanceReactanceAxis\` mirror these for the Y-overlay, registered as secondary axes. Labels are shown only in Y-only mode to avoid clutter in ZY mode.

Grid density is dynamically computed by \`SmithGridCalculator\`, which selects major and minor tick values in s-space (s = 1/(v+1)) to give perceptually uniform coverage and automatically clips minor arcs near the (1, 0) singularity.

Three adapters add interactivity on top of the chart surface:
- **\`SmithMarkersAdapter\`** — click-to-place markers with constrained drag modes (free, constant |Γ|, R, X, G or B curve), implemented as custom \`ChartModifierBase\` subclasses.
- **\`SmithVswrAdapter\`** — draggable VSWR circle with optional fill shading rendered as an \`EllipsePointMarker\` annotation.
- **\`SmithChainAdapter\`** — component chain that moves a starting point along the correct Smith chart curve for each component type, computing the new Γ analytically for series L/C/R, shunt L/C/R and transmission line sections.

### Using the Demo

**Chart navigation:** mouse wheel to zoom, right-click drag to pan, double-click to zoom to extents.

**Markers:** click anywhere on the chart to place a numbered marker. The right-hand sidebar shows a full readout for each marker — Γ (complex), |Γ|, ∠Γ, normalised Z and Y, VSWR, return loss, mismatch loss, Q factor, WTG and WTL. Each marker can be dragged freely or constrained to a constant-R, X, |Γ|, G or B curve via the Drag selector in its accordion.

**Examples menu** (top-left overlay button) loads pre-built RF scenarios demonstrating typical Smith chart workflows such as L-network matching and stub tuning.

**Chain panel** builds a component matching network step by step: select a component type (Series L/C/R, Shunt L/C/R, Transmission Line), enter a value and click Add. Each step draws the arc from the current point to the next impedance. The **VSWR circle** can be resized by dragging its handle on the real axis; Shade fills the acceptable-match region.

**Grid Config panel** controls the chart appearance: the **Z / Y / ZY** toggle switches between the impedance grid (grey), admittance grid (blue) or both overlaid. Independent opacity sliders fade each grid. Advanced controls adjust grid density and the outer rim tick spacing.`,
            },
            react: {
                subtitle:
                    "Demonstrates how to create a React Smith Chart using SciChart.js, a high-performance rendering engine and fully customizable layouts, behaviors and design elements.",
                title: "React Smith Chart",
                pageTitle: "React Smith Chart | Try Demo | SciChart",
                metaDescription:
                    "Build interactive React Smith Chart components for RF impedance matching with zero data lag. No specialised polar surface required. Give the demo a try.",
                markdownContent: `### What is a Smith Chart?

RF and microwave engineers face a recurring problem: getting maximum power from a source into a load when both have complex, frequency-dependent impedances. A mismatch causes reflections that waste power, distort signals, and can damage amplifiers. Fixing it means choosing the right combination of inductors, capacitors, and transmission-line sections — but the interactions are non-linear and hard to reason about algebraically.

The **Smith chart** makes this tractable by turning the matching problem into a geometry problem. Every possible impedance maps to a point inside a circle, and adding each type of component moves that point along a predictable curve. Series inductors and capacitors arc along circles; shunt components arc along a different family; a length of transmission line rotates the point around the chart centre. The goal — a perfect impedance match — is the centre of the chart.

This demo lets you explore those mechanics interactively. Place a marker to read the full impedance, admittance, VSWR and return-loss figures at any point. Load one of the built-in examples to see a complete matching problem worked through step by step. Or build your own network in the Chain panel, adding components one at a time and watching the operating point move to its destination.

### SciChart.js Implementation

This example is built entirely on \`SciChartSurface\` with custom \`NumericAxis\` subclasses — no specialised polar surface is required because the Γ plane is Cartesian.

**Custom axes** override \`drawGridLines\` and \`drawLabels\` to render the characteristic Smith chart curves using WebGL arc primitives via the SciChart WASM context:
- \`SmithChartResistanceAxis\` (X-axis) draws constant-R circles and the outer rim ring, and hosts a custom \`SmithChartAxisRenderer\` that places R labels at each circle's left tangent point.
- \`SmithChartReactanceAxis\` (Y-axis) draws constant-X arcs clipped to the unit circle with X labels at each arc's unit-circle intersection.
- \`SmithChartAdmittanceResistanceAxis\` / \`SmithChartAdmittanceReactanceAxis\` mirror these for the Y-overlay, registered as secondary axes. Labels are shown only in Y-only mode to avoid clutter in ZY mode.

Grid density is dynamically computed by \`SmithGridCalculator\`, which selects major and minor tick values in s-space (s = 1/(v+1)) to give perceptually uniform coverage and automatically clips minor arcs near the (1, 0) singularity.

Three adapters add interactivity on top of the chart surface:
- **\`SmithMarkersAdapter\`** — click-to-place markers with constrained drag modes (free, constant |Γ|, R, X, G or B curve), implemented as custom \`ChartModifierBase\` subclasses.
- **\`SmithVswrAdapter\`** — draggable VSWR circle with optional fill shading rendered as an \`EllipsePointMarker\` annotation.
- **\`SmithChainAdapter\`** — component chain that moves a starting point along the correct Smith chart curve for each component type, computing the new Γ analytically for series L/C/R, shunt L/C/R and transmission line sections.

### Using the Demo

**Chart navigation:** mouse wheel to zoom, right-click drag to pan, double-click to zoom to extents.

**Markers:** click anywhere on the chart to place a numbered marker. The right-hand sidebar shows a full readout for each marker — Γ (complex), |Γ|, ∠Γ, normalised Z and Y, VSWR, return loss, mismatch loss, Q factor, WTG and WTL. Each marker can be dragged freely or constrained to a constant-R, X, |Γ|, G or B curve via the Drag selector in its accordion.

**Examples menu** (top-left overlay button) loads pre-built RF scenarios demonstrating typical Smith chart workflows such as L-network matching and stub tuning.

**Chain panel** builds a component matching network step by step: select a component type (Series L/C/R, Shunt L/C/R, Transmission Line), enter a value and click Add. Each step draws the arc from the current point to the next impedance. The **VSWR circle** can be resized by dragging its handle on the real axis; Shade fills the acceptable-match region.

**Grid Config panel** controls the chart appearance: the **Z / Y / ZY** toggle switches between the impedance grid (grey), admittance grid (blue) or both overlaid. Independent opacity sliders fade each grid. Advanced controls adjust grid density and the outer rim tick spacing.

### React Integration

All chart state lives in a single \`useReducer\` hook (\`useSmithChart\`). Every UI control — grid mode toggle, opacity slider, chain builder, marker drag — dispatches a typed action, and a second \`useEffect\` calls \`chartApiRef.current.update(state)\` whenever state changes. This keeps the React tree and the SciChart surface in sync without the chart ever knowing about React.

The chart API reference itself is stored in a \`useRef\` rather than \`useState\` so that the surface initialising asynchronously on mount doesn't trigger a re-render of the whole component.

Layout responsiveness is handled with MUI's \`useMediaQuery\`: below the \`sm\` breakpoint the flex direction switches from row to column so the chart fills the full screen width with the sidebar stacked below. The **FloatingPanel** component used for the Chain and Grid Config panels is itself responsive — it renders as a draggable \`react-draggable\` window on desktop and as an MUI \`SwipeableDrawer\` bottom sheet on mobile.`,
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Smith Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Smith Chart",
                pageTitle: "Angular Smith Chart",
                metaDescription:
                    "Interactive Angular Smith chart for RF impedance matching — place markers, build matching networks step by step with the component chain, and switch between impedance and admittance grids.",
                markdownContent: `### What is a Smith Chart?

RF and microwave engineers face a recurring problem: getting maximum power from a source into a load when both have complex, frequency-dependent impedances. A mismatch causes reflections that waste power, distort signals, and can damage amplifiers. Fixing it means choosing the right combination of inductors, capacitors, and transmission-line sections — but the interactions are non-linear and hard to reason about algebraically.

The **Smith chart** makes this tractable by turning the matching problem into a geometry problem. Every possible impedance maps to a point inside a circle, and adding each type of component moves that point along a predictable curve. Series inductors and capacitors arc along circles; shunt components arc along a different family; a length of transmission line rotates the point around the chart centre. The goal — a perfect impedance match — is the centre of the chart.

This demo lets you explore those mechanics interactively. Place a marker to read the full impedance, admittance, VSWR and return-loss figures at any point. Load one of the built-in examples to see a complete matching problem worked through step by step. Or build your own network in the Chain panel, adding components one at a time and watching the operating point move to its destination.

### SciChart.js Implementation

This example is built entirely on \`SciChartSurface\` with custom \`NumericAxis\` subclasses — no specialised polar surface is required because the Γ plane is Cartesian.

**Custom axes** override \`drawGridLines\` and \`drawLabels\` to render the characteristic Smith chart curves using WebGL arc primitives via the SciChart WASM context:
- \`SmithChartResistanceAxis\` (X-axis) draws constant-R circles and the outer rim ring, and hosts a custom \`SmithChartAxisRenderer\` that places R labels at each circle's left tangent point.
- \`SmithChartReactanceAxis\` (Y-axis) draws constant-X arcs clipped to the unit circle with X labels at each arc's unit-circle intersection.
- \`SmithChartAdmittanceResistanceAxis\` / \`SmithChartAdmittanceReactanceAxis\` mirror these for the Y-overlay, registered as secondary axes. Labels are shown only in Y-only mode to avoid clutter in ZY mode.

Grid density is dynamically computed by \`SmithGridCalculator\`, which selects major and minor tick values in s-space (s = 1/(v+1)) to give perceptually uniform coverage and automatically clips minor arcs near the (1, 0) singularity.

Three adapters add interactivity on top of the chart surface:
- **\`SmithMarkersAdapter\`** — click-to-place markers with constrained drag modes (free, constant |Γ|, R, X, G or B curve), implemented as custom \`ChartModifierBase\` subclasses.
- **\`SmithVswrAdapter\`** — draggable VSWR circle with optional fill shading rendered as an \`EllipsePointMarker\` annotation.
- **\`SmithChainAdapter\`** — component chain that moves a starting point along the correct Smith chart curve for each component type, computing the new Γ analytically for series L/C/R, shunt L/C/R and transmission line sections.

### Using the Demo

**Chart navigation:** mouse wheel to zoom, right-click drag to pan, double-click to zoom to extents.

**Markers:** click anywhere on the chart to place a numbered marker. The right-hand sidebar shows a full readout for each marker — Γ (complex), |Γ|, ∠Γ, normalised Z and Y, VSWR, return loss, mismatch loss, Q factor, WTG and WTL. Each marker can be dragged freely or constrained to a constant-R, X, |Γ|, G or B curve via the Drag selector in its accordion.

**Examples menu** (top-left overlay button) loads pre-built RF scenarios demonstrating typical Smith chart workflows such as L-network matching and stub tuning.

**Chain panel** builds a component matching network step by step: select a component type (Series L/C/R, Shunt L/C/R, Transmission Line), enter a value and click Add. Each step draws the arc from the current point to the next impedance. The **VSWR circle** can be resized by dragging its handle on the real axis; Shade fills the acceptable-match region.

**Grid Config panel** controls the chart appearance: the **Z / Y / ZY** toggle switches between the impedance grid (grey), admittance grid (blue) or both overlaid. Independent opacity sliders fade each grid. Advanced controls adjust grid density and the outer rim tick spacing.`,
            },
        },
        documentationLinks: [],
        path: "smith-chart",
        metaKeywords: "React smith chart",
        onWebsite: true,
        filepath: "FeaturedApps/ScientificCharts/SmithChart",
        thumbnailImage: "smith-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const SmithChartExampleInfo = createExampleInfo(metaData);
export default SmithChartExampleInfo;
