import * as React from "react";

import { CloseIcon, ExpandMoreIcon } from "../../../icons";
import { FloatingPanel } from "../../../FloatingPanel";
import { drawExample } from "./drawExample";
import { useSmithChart, SmithState, GammaPoint, ComponentType, DragMode } from "./useSmithChart";
import { SmithChartResistanceAxis } from "./smithChartAxes";
import { computeReadouts } from "./smithChartMarkers";
import { CHAIN_COLOURS } from "./smithChartChain";
import { SCENARIOS, Scenario } from "./smithChartScenarios";
import { SciChartSurface } from "scichart";
import { smithGridConfig, updateSmithGridConfig } from "./smithChartGridCalculator";

const COLOURS = ["#FF4444", "#44AAFF", "#FFAA00", "#44FF88", "#FF44CC", "#88FF44"];

const ROW: React.CSSProperties = { display: "flex", flexDirection: "row", alignItems: "center", gap: 8 };
const WRAP_ROW: React.CSSProperties = { ...ROW, flexWrap: "wrap" };

export default function SmithChartComponent() {
    const [isMobile, setIsMobile] = React.useState(
        () => typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches
    );
    const [state, dispatch] = useSmithChart();
    const chartRef = React.useRef<HTMLDivElement>(null);
    const chartApiRef = React.useRef<{
        update: (s: SmithState) => void;
        getChainTip: (s: SmithState) => GammaPoint | null;
        addChainStep: (from: GammaPoint, type: ComponentType, value: number, freq: number) => void;
        setDispatch: (d: any) => void;
        sciChartSurface: SciChartSurface;
    } | null>(null);
    const stateRef = React.useRef(state);
    stateRef.current = state;

    const loadScenario = React.useCallback((scenario: Scenario) => {
        const api = chartApiRef.current;
        if (!api) return;
        dispatch({ type: "CLEAR" });
        for (const step of scenario.steps) {
            step.run(dispatch, api.addChainStep);
        }
        dispatch({
            type: "LOAD_SCENARIO",
            id: scenario.id,
            steps: scenario.steps.map((s) => s.description),
        });
    }, []);

    const [chainType, setChainType] = React.useState<ComponentType>("seriesL");
    const [chainValue, setChainValue] = React.useState("1e-9");

    const [chainOpen, setChainOpen] = React.useState(false);
    const [gridOpen, setGridOpen] = React.useState(false);
    const [examplesAnchor, setExamplesAnchor] = React.useState<null | HTMLElement>(null);
    const examplesMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const query = window.matchMedia("(max-width: 600px)");
        const update = () => setIsMobile(query.matches);
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    React.useEffect(() => {
        if (!examplesAnchor) return undefined;
        const closeOnOutsideClick = (event: PointerEvent) => {
            const target = event.target as Node;
            if (!examplesAnchor.contains(target) && !examplesMenuRef.current?.contains(target)) {
                setExamplesAnchor(null);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setExamplesAnchor(null);
        };
        document.addEventListener("pointerdown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [examplesAnchor]);

    // Grid config — mirrors smithGridConfig for controlled inputs
    const [gridCfg, setGridCfg] = React.useState({
        majorPxThreshold: smithGridConfig.majorPxThreshold,
        minorPxThreshold: smithGridConfig.minorPxThreshold,
        targetTicks: smithGridConfig.targetTicks,
        useCompactRange: smithGridConfig.useCompactRange,
        maxTiers: smithGridConfig.maxTiers,
        minGapPx: smithGridConfig.minGapPx,
    });
    const applyGridCfg = React.useCallback(
        (patch: Partial<typeof gridCfg>) => {
            const next = { ...gridCfg, ...patch };
            setGridCfg(next);
            updateSmithGridConfig(next);
            chartApiRef.current?.sciChartSurface?.invalidateElement();
        },
        [gridCfg]
    );

    // Rim config — angular spacing and label gap for the angle-of-Γ ring
    const [rimCfg, setRimCfg] = React.useState({
        majorTickStep: 30,
        minorTickStep: 10,
        labelOffset: 2,
    });
    const applyRimCfg = React.useCallback(
        (patch: Partial<typeof rimCfg>) => {
            const next = { ...rimCfg, ...patch };
            setRimCfg(next);
            const axis = chartApiRef.current?.sciChartSurface?.xAxes?.get(0) as SmithChartResistanceAxis | undefined;
            if (axis) {
                axis.rimConfig = { ...axis.rimConfig, ...patch };
                chartApiRef.current?.sciChartSurface?.invalidateElement();
            }
        },
        [rimCfg]
    );

    // Init chart once on mount
    React.useEffect(() => {
        let surface: SciChartSurface | undefined;
        drawExample(chartRef.current!).then((result) => {
            result.setDispatch(dispatch);
            chartApiRef.current = result;
            surface = result.sciChartSurface;
            chartApiRef.current.update(stateRef.current);
        });
        return () => {
            surface?.delete();
        };
    }, []);

    // Sync state changes to SciChart
    React.useEffect(() => {
        chartApiRef.current?.update(state);
    }, [state]);

    return (
        <div className="sc-chart-wrapper flex flex-col">
            {/* On desktop: row layout with container query sizing. On mobile: column layout. */}
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    overflow: "hidden",
                    flexDirection: isMobile ? "column" : "row",
                    ...(isMobile ? {} : ({ containerType: "size" } as React.CSSProperties)),
                }}
            >
                {/* Wrapper: positions the chart canvas + overlay buttons + floating panels */}
                <div
                    style={
                        isMobile
                            ? { position: "relative", width: "100%", aspectRatio: "1 / 1", flexShrink: 0 }
                            : {
                                  position: "relative",
                                  aspectRatio: "1 / 1",
                                  width: "min(calc(100cqw - 260px), 100cqh)",
                                  height: "auto",
                                  flexShrink: 0,
                                  alignSelf: "flex-start",
                              }
                    }
                >
                    {/* Chart canvas */}
                    <div
                        ref={chartRef}
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            overflow: "hidden",
                            touchAction: "none",
                        }}
                    />

                    {/* Overlay buttons — top-left of chart */}
                    <div
                        style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            zIndex: 10,
                        }}
                    >
                        <button
                            className="sc-button sc-button-secondary"
                            onClick={(e) => setExamplesAnchor(e.currentTarget)}
                            style={{ fontSize: 10, padding: "2px 8px", minWidth: 0 }}
                            type="button"
                        >
                            Examples
                        </button>
                        <button
                            className="sc-button"
                            onClick={() => setChainOpen((v) => !v)}
                            style={{ fontSize: 10, padding: "2px 8px", minWidth: 0 }}
                            type="button"
                        >
                            Chain
                        </button>
                        <button
                            className="sc-button"
                            onClick={() => setGridOpen((v) => !v)}
                            style={{ fontSize: 10, padding: "2px 8px", minWidth: 0 }}
                            type="button"
                        >
                            Grid
                        </button>
                    </div>

                    {/* Examples dropdown menu */}
                    {examplesAnchor && (
                        <div
                            ref={examplesMenuRef}
                            className="sc-menu-popup"
                            role="menu"
                            style={{
                                left: examplesAnchor.getBoundingClientRect().left,
                                top: examplesAnchor.getBoundingClientRect().bottom + 4,
                            }}
                        >
                            {SCENARIOS.map((scenario) => (
                                <button
                                    type="button"
                                    key={scenario.id}
                                    className={`sc-menu-item${
                                        state.activeScenarioId === scenario.id ? " is-selected" : ""
                                    }`}
                                    role="menuitemradio"
                                    aria-checked={state.activeScenarioId === scenario.id}
                                    onClick={() => {
                                        loadScenario(scenario);
                                        setExamplesAnchor(null);
                                    }}
                                >
                                    {scenario.title}
                                </button>
                            ))}
                            <hr className="sc-divider" />
                            <button
                                type="button"
                                className="sc-menu-item"
                                role="menuitem"
                                onClick={() => {
                                    dispatch({ type: "CLEAR" });
                                    setExamplesAnchor(null);
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Chain floating panel */}
                    <FloatingPanel
                        title="Chain"
                        open={chainOpen}
                        onClose={() => setChainOpen(false)}
                        defaultPosition={{ x: 8, y: 110 }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {/* VSWR */}
                            <div style={ROW}>
                                <span
                                    className="sc-tooltip"
                                    title="VSWR = (1+|Γ|)/(1−|Γ|) — drag the orange handle on the real axis to resize the circle"
                                >
                                    <span style={{ cursor: "default" }}>VSWR:</span>
                                </span>
                                <input
                                    className="sc-input"
                                    type="number"
                                    value={state.vswr.toFixed(2)}
                                    min={1.01}
                                    max={100}
                                    step={0.1}
                                    style={{ width: 76, fontSize: 12 }}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        if (v > 1) dispatch({ type: "SET_VSWR", vswr: v });
                                    }}
                                />
                                <span
                                    className="sc-tooltip"
                                    title="Fill the VSWR circle interior to mark the acceptable match region"
                                >
                                    <label className="sc-control">
                                        <input
                                            className="sc-checkbox"
                                            type="checkbox"
                                            checked={state.vswrShaded}
                                            onChange={(e) =>
                                                dispatch({ type: "SET_VSWR_SHADED", shaded: e.target.checked })
                                            }
                                        />
                                        <span>Shade</span>
                                    </label>
                                </span>
                                <span className="sc-tooltip" title="Show or hide the dashed VSWR circle outline">
                                    <label className="sc-control">
                                        <input
                                            className="sc-checkbox"
                                            type="checkbox"
                                            checked={state.vswrOutline}
                                            onChange={(e) =>
                                                dispatch({ type: "SET_VSWR_OUTLINE", outline: e.target.checked })
                                            }
                                        />
                                        <span>Outline</span>
                                    </label>
                                </span>
                            </div>

                            <hr className="sc-divider" />

                            {/* Chain builder */}
                            <div style={WRAP_ROW}>
                                <span
                                    className="sc-tooltip"
                                    title="Operating frequency for reactive components (L, C) and transmission lines"
                                >
                                    <span style={{ cursor: "default" }}>Freq:</span>
                                </span>
                                <input
                                    className="sc-input"
                                    type="number"
                                    value={(state.frequency / 1e9).toFixed(3)}
                                    min={0.001}
                                    max={100}
                                    step={0.1}
                                    style={{ width: 76, fontSize: 12 }}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        if (v > 0) dispatch({ type: "SET_FREQUENCY", frequency: v * 1e9 });
                                    }}
                                />
                                <span>GHz</span>
                                <span
                                    className="sc-tooltip"
                                    title="Component type: series elements move along constant-R or constant-X curves; shunt elements move along constant-G or constant-B curves; TL rotates clockwise at constant |Γ|"
                                >
                                    <select
                                        className="sc-select"
                                        value={chainType}
                                        onChange={(e) => setChainType(e.target.value as ComponentType)}
                                        style={{ fontSize: 12, minWidth: 100 }}
                                    >
                                        {(
                                            [
                                                ["seriesL", "Series L"],
                                                ["seriesC", "Series C"],
                                                ["seriesR", "Series R"],
                                                ["shuntL", "Shunt L"],
                                                ["shuntC", "Shunt C"],
                                                ["shuntR", "Shunt R"],
                                                ["TL", "Trans. Line"],
                                            ] as [ComponentType, string][]
                                        ).map(([v, l]) => (
                                            <option key={v} value={v}>
                                                {l}
                                            </option>
                                        ))}
                                    </select>
                                </span>
                                <span
                                    className="sc-tooltip"
                                    title={
                                        chainType === "TL"
                                            ? "Transmission line length in wavelengths (e.g. 0.25 = quarter-wave)"
                                            : "Component value — Henrys (L), Farads (C), or Ohms (R)"
                                    }
                                >
                                    <input
                                        className="sc-input"
                                        type="number"
                                        value={chainValue}
                                        style={{ width: 84, fontSize: 12 }}
                                        onChange={(e) => setChainValue(e.target.value)}
                                        placeholder={chainType === "TL" ? "λ" : "SI"}
                                    />
                                </span>
                                <span
                                    className="sc-tooltip"
                                    title="Append this component step from the current chain tip"
                                >
                                    <span>
                                        <button
                                            className="sc-button sc-button-secondary"
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
                                            type="button"
                                        >
                                            Add
                                        </button>
                                    </span>
                                </span>
                                <span className="sc-tooltip" title="Remove the last chain step">
                                    <span>
                                        <button
                                            className="sc-button sc-button-secondary"
                                            onClick={() => dispatch({ type: "UNDO_CHAIN_STEP" })}
                                            disabled={state.chain.length === 0}
                                            type="button"
                                        >
                                            Undo
                                        </button>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </FloatingPanel>

                    {/* Grid Config floating panel */}
                    <FloatingPanel
                        title="Grid Config"
                        open={gridOpen}
                        onClose={() => setGridOpen(false)}
                        defaultPosition={{ x: 280, y: 110 }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {/* Z/Y/ZY grid mode */}
                            <div style={ROW}>
                                <span>Grid:</span>
                                <div className="sc-button-group" role="group">
                                    <span
                                        className="sc-tooltip"
                                        title="Impedance grid — constant-R circles and constant-X arcs"
                                    >
                                        <button
                                            type="button"
                                            className="sc-button"
                                            aria-pressed={state.gridMode === "Z"}
                                            onClick={() => dispatch({ type: "SET_GRID_MODE", mode: "Z" })}
                                        >
                                            Z
                                        </button>
                                    </span>
                                    <span
                                        className="sc-tooltip"
                                        title="Admittance grid — constant-G circles and constant-B arcs"
                                    >
                                        <button
                                            type="button"
                                            className="sc-button"
                                            aria-pressed={state.gridMode === "Y"}
                                            onClick={() => dispatch({ type: "SET_GRID_MODE", mode: "Y" })}
                                        >
                                            Y
                                        </button>
                                    </span>
                                    <span className="sc-tooltip" title="Both impedance and admittance grids overlaid">
                                        <button
                                            type="button"
                                            className="sc-button"
                                            aria-pressed={state.gridMode === "ZY"}
                                            onClick={() => dispatch({ type: "SET_GRID_MODE", mode: "ZY" })}
                                        >
                                            ZY
                                        </button>
                                    </span>
                                </div>
                            </div>

                            {/* Z opacity */}
                            {(state.gridMode === "Z" || state.gridMode === "ZY") && (
                                <span className="sc-tooltip" title="Impedance grid opacity">
                                    <div style={{ ...ROW, minWidth: 200 }}>
                                        <span>Z α:</span>
                                        <input
                                            className="sc-range flex-1"
                                            type="range"
                                            value={state.zOpacity}
                                            min={0}
                                            max={1}
                                            step={0.05}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "SET_Z_OPACITY",
                                                    opacity: event.currentTarget.valueAsNumber,
                                                })
                                            }
                                        />
                                    </div>
                                </span>
                            )}

                            {/* Y opacity */}
                            {(state.gridMode === "Y" || state.gridMode === "ZY") && (
                                <span className="sc-tooltip" title="Admittance grid opacity">
                                    <div style={{ ...ROW, minWidth: 200 }}>
                                        <span>Y α:</span>
                                        <input
                                            className="sc-range flex-1"
                                            type="range"
                                            value={state.yOpacity}
                                            min={0}
                                            max={1}
                                            step={0.05}
                                            onChange={(event) =>
                                                dispatch({
                                                    type: "SET_Y_OPACITY",
                                                    opacity: event.currentTarget.valueAsNumber,
                                                })
                                            }
                                        />
                                    </div>
                                </span>
                            )}

                            <hr className="sc-divider" style={{ margin: "4px 0" }} />

                            <GridSlider
                                label="Major px"
                                min={5}
                                max={50}
                                step={1}
                                tooltip="Minimum pixel radius a circle/arc must have to qualify as a major gridline. Increase to show fewer, bolder major lines."
                                value={gridCfg.majorPxThreshold}
                                onChange={(v) => applyGridCfg({ majorPxThreshold: v })}
                            />
                            <GridSlider
                                label="Minor px"
                                min={1}
                                max={20}
                                step={1}
                                tooltip="Minimum pixel radius for a minor gridline. Circles smaller than this are hidden entirely. Increase to reduce clutter when zoomed out."
                                value={gridCfg.minorPxThreshold}
                                onChange={(v) => applyGridCfg({ minorPxThreshold: v })}
                            />
                            <GridSlider
                                label="Target ticks"
                                min={2}
                                max={16}
                                step={1}
                                tooltip="Desired number of major gridlines per family (R circles and X arcs). Values are chosen evenly-spaced in s-space (s = 1/(v+1)) to give perceptually uniform density."
                                value={gridCfg.targetTicks}
                                onChange={(v) => applyGridCfg({ targetTicks: v })}
                            />
                            <GridSlider
                                label="Max tiers (0=auto)"
                                min={0}
                                max={8}
                                step={1}
                                tooltip="Caps the number of binary subdivision passes used to fill minor ticks between majors. 0 = automatic (scales with the number of major ticks). More tiers = finer minor grid."
                                value={gridCfg.maxTiers}
                                onChange={(v) => applyGridCfg({ maxTiers: v })}
                            />
                            <GridSlider
                                label="Min gap (px)"
                                min={0.5}
                                max={10}
                                step={0.5}
                                tooltip="Target pixel gap between adjacent arc curves at the convergence point. Automatically scales with zoom (effectiveGap = minGapPx / pixPerUnit), so subdivision deepens as you zoom in. Higher = sparser grid; lower = denser."
                                value={gridCfg.minGapPx}
                                onChange={(v) => applyGridCfg({ minGapPx: v })}
                            />
                            <span
                                className="sc-tooltip"
                                title="When enabled, suppresses minor-tick subdivision in the large-arc sweep region (circles whose centres lie outside the viewport). Reduces clutter on the left side when zoomed into the right half of the chart."
                            >
                                <label className="sc-control" style={{ margin: 0 }}>
                                    <input
                                        className="sc-checkbox"
                                        type="checkbox"
                                        checked={gridCfg.useCompactRange}
                                        onChange={(e) => applyGridCfg({ useCompactRange: e.target.checked })}
                                    />
                                    <span>Compact range</span>
                                </label>
                            </span>
                            <hr className="sc-divider" style={{ margin: "4px 0" }} />
                            <span
                                style={{ fontWeight: 700, color: "color-mix(in srgb, var(--text) 55%, transparent)" }}
                            >
                                RIM
                            </span>
                            <GridSlider
                                label="Label gap"
                                min={1}
                                max={20}
                                step={1}
                                tooltip="Pixel gap between the outer tip of a major tick and the label anchor. Must be ≥ 1."
                                value={rimCfg.labelOffset}
                                onChange={(v) => applyRimCfg({ labelOffset: v })}
                            />
                            <GridSlider
                                label="Major °"
                                min={10}
                                max={90}
                                step={10}
                                tooltip="Angular spacing in degrees between major (labelled) rim ticks. Must be an integer multiple of the minor tick step."
                                value={rimCfg.majorTickStep}
                                onChange={(v) => applyRimCfg({ majorTickStep: v })}
                            />
                            <GridSlider
                                label="Minor °"
                                min={5}
                                max={30}
                                step={5}
                                tooltip="Angular spacing in degrees between minor rim ticks."
                                value={rimCfg.minorTickStep}
                                onChange={(v) => applyRimCfg({ minorTickStep: v })}
                            />
                        </div>
                    </FloatingPanel>
                </div>

                {/* Readout sidebar */}
                <div
                    style={{
                        width: isMobile ? "100%" : 260,
                        overflowY: "auto",
                        padding: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    {state.scenarioSteps.length > 0 && (
                        <>
                            <span style={{ fontWeight: 700, marginBottom: 4 }}>HOW IT WORKS</span>
                            {state.scenarioSteps.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                                    <span
                                        style={{
                                            color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                            flexShrink: 0,
                                            minWidth: 14,
                                        }}
                                    >
                                        {i + 1}.
                                    </span>
                                    <span style={{ lineHeight: 1.4 }}>{step}</span>
                                </div>
                            ))}
                            <hr className="sc-divider" style={{ margin: "6px 0" }} />
                        </>
                    )}
                    <span style={{ fontWeight: 700, marginBottom: 4 }}>MARKERS</span>
                    {state.markers.length === 0 && (
                        <span style={{ color: "color-mix(in srgb, var(--text) 55%, transparent)" }}>
                            Click chart to place a marker
                        </span>
                    )}
                    {state.markers.map((marker, i) => {
                        const ro = computeReadouts(marker.gamma);
                        const colour = COLOURS[i % COLOURS.length];
                        const isActive = marker.id === state.activeMarkerId;
                        return (
                            <details
                                className="sc-accordion sc-marker-accordion"
                                key={marker.id}
                                open={isActive}
                                style={{ borderColor: colour }}
                                onToggle={(event) => {
                                    if (event.currentTarget.open) {
                                        dispatch({ type: "SET_ACTIVE_MARKER", id: marker.id });
                                    } else if (state.activeMarkerId === marker.id) {
                                        dispatch({ type: "SET_ACTIVE_MARKER", id: null });
                                    }
                                }}
                            >
                                <summary className="sc-accordion-summary sc-marker-summary">
                                    <button
                                        type="button"
                                        className="sc-button sc-button-icon"
                                        title={`Remove ${marker.label}`}
                                        aria-label={`Remove ${marker.label}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({ type: "REMOVE_MARKER", id: marker.id });
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </button>
                                    <span className="sc-chip" style={{ backgroundColor: colour }}>
                                        {marker.label}
                                    </span>
                                    <span style={{ fontFamily: "monospace", lineHeight: 2 }}>
                                        Γ={marker.gamma.re.toFixed(3)}
                                        {marker.gamma.im >= 0 ? "+" : ""}j{marker.gamma.im.toFixed(3)}
                                    </span>
                                    <ExpandMoreIcon className="sc-accordion-chevron" />
                                </summary>
                                <div className="sc-accordion-details sc-marker-details">
                                    <div style={{ ...ROW, marginBottom: 6 }}>
                                        <span
                                            style={{
                                                color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                                minWidth: 36,
                                            }}
                                        >
                                            Drag:
                                        </span>
                                        <div className="sc-button-group" role="group">
                                            {(["free", "gamma", "R", "X", "G", "B"] as DragMode[]).map((m) => (
                                                <button
                                                    type="button"
                                                    className="sc-button"
                                                    aria-pressed={marker.dragMode === m}
                                                    key={m}
                                                    style={{ padding: "1px 5px", fontSize: 10, lineHeight: 1.4 }}
                                                    onClick={() =>
                                                        dispatch({ type: "SET_DRAG_MODE", id: marker.id, mode: m })
                                                    }
                                                >
                                                    {m === "free" ? "Free" : m === "gamma" ? "|Γ|" : m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <ReadoutTable ro={ro} />
                                </div>
                            </details>
                        );
                    })}

                    {/* Chain step list */}
                    {state.chain.length > 0 && (
                        <>
                            <hr className="sc-divider" style={{ margin: "4px 0" }} />
                            <span style={{ fontWeight: 700 }}>CHAIN ({state.chain.length} steps)</span>
                            {state.chain.map((step, i) => (
                                <div key={step.id} style={ROW}>
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: CHAIN_COLOURS[i % CHAIN_COLOURS.length],
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span style={{ fontFamily: "monospace" }}>
                                        {step.type} {step.value.toExponential(2)}
                                        {" → "}Γ={step.toGamma.re.toFixed(3)}
                                        {step.toGamma.im >= 0 ? "+" : ""}j{step.toGamma.im.toFixed(3)}
                                    </span>
                                </div>
                            ))}
                            {(state.markers.find((m) => m.isChainStart) || state.chainStartGamma) && (
                                <span style={{ color: "color-mix(in srgb, var(--text) 55%, transparent)" }}>
                                    Start:{" "}
                                    {(() => {
                                        const m = state.markers.find((m) => m.isChainStart);
                                        if (m) return m.label;
                                        const g = state.chainStartGamma!;
                                        return `Γ=(${g.re.toFixed(3)},${g.im.toFixed(3)})`;
                                    })()}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function GridSlider({
    label,
    tooltip,
    min,
    max,
    step,
    value,
    onChange,
    format,
}: {
    label: string;
    tooltip?: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (v: number) => void;
    format?: (v: number) => string;
}) {
    const inner = (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ minWidth: 76, flexShrink: 0 }}>{label}:</span>
            <input
                className="sc-range flex-1"
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            />
            <span style={{ minWidth: 36, textAlign: "right", fontFamily: "monospace" }}>
                {format ? format(value) : value}
            </span>
        </div>
    );
    return tooltip ? (
        <span className="sc-tooltip" title={tooltip}>
            {inner}
        </span>
    ) : (
        inner
    );
}

function ReadoutTable({ ro }: { ro: ReturnType<typeof computeReadouts> }) {
    const rows: [string, string][] = [
        ["|Γ|", ro.gammaMag.toFixed(4)],
        ["∠Γ", `${ro.gammaAngleDeg.toFixed(2)}°`],
        ["Z", `${ro.zr.toFixed(3)} ${ro.zx >= 0 ? "+" : "−"} j${Math.abs(ro.zx).toFixed(3)}`],
        ["Y", `${ro.gy.toFixed(3)} ${ro.by >= 0 ? "+" : "−"} j${Math.abs(ro.by).toFixed(3)}`],
        ["VSWR", isFinite(ro.vswr) ? ro.vswr.toFixed(3) : "∞"],
        ["RL", isFinite(ro.returnLoss) ? `${ro.returnLoss.toFixed(2)} dB` : "∞"],
        ["ML", isFinite(ro.mismatchLoss) ? `${ro.mismatchLoss.toFixed(3)} dB` : "∞"],
        ["Q", isFinite(ro.q) ? ro.q.toFixed(3) : "∞"],
        ["WTG", ro.wtg.toFixed(4) + " λ"],
        ["WTL", ro.wtl.toFixed(4) + " λ"],
    ];
    return (
        <table style={{ width: "100%", fontSize: 11, fontFamily: "monospace", borderCollapse: "collapse" }}>
            <tbody>
                {rows.map(([label, value]) => (
                    <tr key={label}>
                        <td
                            style={{
                                color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                paddingRight: 8,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {label}
                        </td>
                        <td style={{ textAlign: "right" }}>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
