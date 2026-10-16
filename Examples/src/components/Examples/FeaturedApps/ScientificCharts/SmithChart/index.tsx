import "./styles.css";
import { useRef, useCallback, useState, useEffect } from "react";

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

export default function SmithChartComponent() {
    const [state, dispatch] = useSmithChart();
    const chartRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<{
        update: (s: SmithState) => void;
        getChainTip: (s: SmithState) => GammaPoint | null;
        addChainStep: (from: GammaPoint, type: ComponentType, value: number, freq: number) => void;
        setDispatch: (d: any) => void;
        sciChartSurface: SciChartSurface;
    } | null>(null);
    const stateRef = useRef(state);
    stateRef.current = state;

    const loadScenario = useCallback((scenario: Scenario) => {
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

    const [chainType, setChainType] = useState<ComponentType>("seriesL");
    const [chainValue, setChainValue] = useState("1e-9");

    const [chainOpen, setChainOpen] = useState(false);
    const [gridOpen, setGridOpen] = useState(false);
    const [examplesAnchor, setExamplesAnchor] = useState<null | HTMLElement>(null);
    const examplesMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
    const [gridCfg, setGridCfg] = useState({
        majorPxThreshold: smithGridConfig.majorPxThreshold,
        minorPxThreshold: smithGridConfig.minorPxThreshold,
        targetTicks: smithGridConfig.targetTicks,
        useCompactRange: smithGridConfig.useCompactRange,
        maxTiers: smithGridConfig.maxTiers,
        minGapPx: smithGridConfig.minGapPx,
    });
    const applyGridCfg = useCallback(
        (patch: Partial<typeof gridCfg>) => {
            const next = { ...gridCfg, ...patch };
            setGridCfg(next);
            updateSmithGridConfig(next);
            chartApiRef.current?.sciChartSurface?.invalidateElement();
        },
        [gridCfg]
    );

    // Rim config — angular spacing and label gap for the angle-of-Γ ring
    const [rimCfg, setRimCfg] = useState({
        majorTickStep: 30,
        minorTickStep: 10,
        labelOffset: 2,
    });
    const applyRimCfg = useCallback(
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
    useEffect(() => {
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
    useEffect(() => {
        chartApiRef.current?.update(state);
    }, [state]);

    return (
        <div className="sc-chart-wrapper flex flex-col">
            {/* Keep the plot square; CSS places the readouts beside it or underneath. */}
            <div className="sc-smith-layout">
                {/* Wrapper: positions the chart canvas + overlay buttons + floating panels */}
                <div className="sc-smith-canvas">
                    {/* Chart canvas */}
                    <div ref={chartRef} className="w-full h-full relative overflow-hidden sc-smith-plot" />

                    {/* Examples dropdown menu */}
                    {examplesAnchor && (
                        <div
                            ref={examplesMenuRef}
                            className="sc-smith-menu"
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
                                    className="sc-button sc-button-outline justify-start"
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
                            <hr className="sc-smith-divider" />
                            <button
                                type="button"
                                className="sc-button sc-button-outline justify-start"
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
                        <div className="flex flex-col gap-2">
                            {/* VSWR */}
                            <div className="flex items-center gap-2">
                                <span
                                    className="contents"
                                    title="VSWR = (1+|Γ|)/(1−|Γ|) — drag the orange handle on the real axis to resize the circle"
                                >
                                    <span>VSWR:</span>
                                </span>
                                <input
                                    className="sc-input sc-smith-number-input"
                                    type="number"
                                    value={state.vswr.toFixed(2)}
                                    min={1.01}
                                    max={100}
                                    step={0.1}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        if (v > 1) dispatch({ type: "SET_VSWR", vswr: v });
                                    }}
                                />
                                <span
                                    className="contents"
                                    title="Fill the VSWR circle interior to mark the acceptable match region"
                                >
                                    <label className="sc-control">
                                        <input
                                            className="sc-checkbox"
                                            type="checkbox"
                                            checked={state.vswrShaded}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "SET_VSWR_SHADED",
                                                    shaded: e.target.checked,
                                                })
                                            }
                                        />
                                        <span>Shade</span>
                                    </label>
                                </span>
                                <span className="contents" title="Show or hide the dashed VSWR circle outline">
                                    <label className="sc-control">
                                        <input
                                            className="sc-checkbox"
                                            type="checkbox"
                                            checked={state.vswrOutline}
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "SET_VSWR_OUTLINE",
                                                    outline: e.target.checked,
                                                })
                                            }
                                        />
                                        <span>Outline</span>
                                    </label>
                                </span>
                            </div>

                            <hr className="sc-smith-divider" />

                            {/* Chain builder */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className="contents"
                                    title="Operating frequency for reactive components (L, C) and transmission lines"
                                >
                                    <span>Freq:</span>
                                </span>
                                <input
                                    className="sc-input sc-smith-number-input"
                                    type="number"
                                    value={(state.frequency / 1e9).toFixed(3)}
                                    min={0.001}
                                    max={100}
                                    step={0.1}
                                    onChange={(e) => {
                                        const v = parseFloat(e.target.value);
                                        if (v > 0) dispatch({ type: "SET_FREQUENCY", frequency: v * 1e9 });
                                    }}
                                />
                                <span>GHz</span>
                                <span
                                    className="contents"
                                    title="Component type: series elements move along constant-R or constant-X curves; shunt elements move along constant-G or constant-B curves; TL rotates clockwise at constant |Γ|"
                                >
                                    <select
                                        className="sc-select"
                                        value={chainType}
                                        onChange={(e) => setChainType(e.target.value as ComponentType)}
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
                                    className="contents"
                                    title={
                                        chainType === "TL"
                                            ? "Transmission line length in wavelengths (e.g. 0.25 = quarter-wave)"
                                            : "Component value — Henrys (L), Farads (C), or Ohms (R)"
                                    }
                                >
                                    <input
                                        className="sc-input"
                                        style={{ width: 84 }}
                                        type="number"
                                        value={chainValue}
                                        onChange={(e) => setChainValue(e.target.value)}
                                        placeholder={chainType === "TL" ? "λ" : "SI"}
                                    />
                                </span>
                                <button
                                    title="Append this component step from the current chain tip"
                                    className="sc-button sc-button-outline"
                                    onClick={() => {
                                        const tip = chartApiRef.current?.getChainTip(state);
                                        if (!tip) return;
                                        const parsed = parseFloat(chainValue);
                                        if (isNaN(parsed)) return;
                                        chartApiRef.current?.addChainStep(tip, chainType, parsed, state.frequency);
                                    }}
                                    disabled={!chartApiRef.current?.getChainTip(state)}
                                    type="button"
                                >
                                    Add
                                </button>
                                <button
                                    title="Remove the last chain step"
                                    className="sc-button sc-button-outline"
                                    onClick={() => dispatch({ type: "UNDO_CHAIN_STEP" })}
                                    disabled={state.chain.length === 0}
                                    type="button"
                                >
                                    Undo
                                </button>
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
                        <div className="flex flex-col gap-2">
                            {/* Z/Y/ZY grid mode */}
                            <div className="flex items-center gap-2">
                                <span>Grid:</span>
                                <div className="sc-button-group" role="group">
                                    <button
                                        title="Impedance grid — constant-R circles and constant-X arcs"
                                        type="button"
                                        className="sc-button"
                                        aria-pressed={state.gridMode === "Z"}
                                        onClick={() => dispatch({ type: "SET_GRID_MODE", mode: "Z" })}
                                    >
                                        Z
                                    </button>
                                    <button
                                        title="Admittance grid — constant-G circles and constant-B arcs"
                                        type="button"
                                        className="sc-button"
                                        aria-pressed={state.gridMode === "Y"}
                                        onClick={() => dispatch({ type: "SET_GRID_MODE", mode: "Y" })}
                                    >
                                        Y
                                    </button>
                                    <button
                                        title="Both impedance and admittance grids overlaid"
                                        type="button"
                                        className="sc-button"
                                        aria-pressed={state.gridMode === "ZY"}
                                        onClick={() => dispatch({ type: "SET_GRID_MODE", mode: "ZY" })}
                                    >
                                        ZY
                                    </button>
                                </div>
                            </div>

                            {/* Z opacity */}
                            {(state.gridMode === "Z" || state.gridMode === "ZY") && (
                                <span className="contents" title="Impedance grid opacity">
                                    <div className="flex items-center gap-2 sc-smith-opacity-control">
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
                                <span className="contents" title="Admittance grid opacity">
                                    <div className="flex items-center gap-2 sc-smith-opacity-control">
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

                            <hr className="sc-smith-divider sc-smith-readout-divider" />

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
                                className="contents"
                                title="When enabled, suppresses minor-tick subdivision in the large-arc sweep region (circles whose centres lie outside the viewport). Reduces clutter on the left side when zoomed into the right half of the chart."
                            >
                                <label className="sc-control m-0">
                                    <input
                                        className="sc-checkbox"
                                        type="checkbox"
                                        checked={gridCfg.useCompactRange}
                                        onChange={(e) => applyGridCfg({ useCompactRange: e.target.checked })}
                                    />
                                    <span>Compact range</span>
                                </label>
                            </span>
                            <hr className="sc-smith-divider sc-smith-readout-divider" />
                            <span
                                className="font-bold"
                                style={{ color: "color-mix(in srgb, var(--text) 55%, transparent)" }}
                            >RIM</span>
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
                    
                    {/* Overlay buttons — top-left of chart */}
                    <div className="absolute flex flex-col gap-1 top-2 left-2 z-10">
                        <button
                            className="sc-button sc-button-outline"
                            onClick={(e) => setExamplesAnchor(e.currentTarget)}
                            type="button"
                        >
                            Examples
                        </button>
                        <button className="sc-button" onClick={() => setChainOpen((v) => !v)} type="button">
                            Chain
                        </button>
                        <button className="sc-button" onClick={() => setGridOpen((v) => !v)} type="button">
                            Grid
                        </button>
                    </div>

                </div>

                {/* Readout sidebar */}
                <div className="sc-smith-readouts">
                    {state.scenarioSteps.length > 0 && (
                        <>
                            <span className="sc-smith-explanation-heading">HOW IT WORKS</span>
                            {state.scenarioSteps.map((step, i) => (
                                <div key={i} className="flex" style={{ gap: 6, marginBottom: 6 }}>
                                    <span
                                        className="shrink-0"
                                        style={{
                                            color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                            minWidth: 14,
                                        }}
                                    >{i + 1}.</span>
                                    <span style={{ lineHeight: 1.4 }}>{step}</span>
                                </div>
                            ))}
                            <hr className="sc-smith-divider" style={{ margin: "6px 0" }} />
                        </>
                    )}
                    <span className="sc-smith-explanation-heading">MARKERS</span>
                    {state.markers.length === 0 && (
                        <span className="sc-smith-placement-hint">Click chart to place a marker</span>
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
                                    <span className="sc-smith-chip" style={{ backgroundColor: colour }}>
                                        {marker.label}
                                    </span>
                                    <span className="monospace" style={{ lineHeight: 2 }}>
                                        Γ={marker.gamma.re.toFixed(3)}
                                        {marker.gamma.im >= 0 ? "+" : ""}j{marker.gamma.im.toFixed(3)}
                                    </span>
                                    <ExpandMoreIcon className="sc-accordion-chevron" />
                                </summary>
                                <div className="sc-accordion-details sc-marker-details">
                                    <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                                        <span
                                            style={{
                                                color: "color-mix(in srgb, var(--text) 55%, transparent)",
                                                minWidth: 36,
                                            }}
                                        >Drag:</span>
                                        <div className="sc-button-group" role="group">
                                            {(["free", "gamma", "R", "X", "G", "B"] as DragMode[]).map((m) => (
                                                <button
                                                    type="button"
                                                    className="sc-button"
                                                    aria-pressed={marker.dragMode === m}
                                                    key={m}
                                                    onClick={() =>
                                                        dispatch({
                                                            type: "SET_DRAG_MODE",
                                                            id: marker.id,
                                                            mode: m,
                                                        })
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
                            <hr className="sc-smith-divider sc-smith-readout-divider" />
                            <span className="font-bold">CHAIN ({state.chain.length} steps)</span>
                            {state.chain.map((step, i) => (
                                <div key={step.id} className="flex items-center gap-2">
                                    <div
                                        className="shrink-0"
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: CHAIN_COLOURS[i % CHAIN_COLOURS.length],
                                        }}
                                    />
                                    <span className="monospace">
                                        {step.type} {step.value.toExponential(2)}
                                        {" → "}Γ={step.toGamma.re.toFixed(3)}
                                        {step.toGamma.im >= 0 ? "+" : ""}j{step.toGamma.im.toFixed(3)}
                                    </span>
                                </div>
                            ))}
                            {(state.markers.find((m) => m.isChainStart) || state.chainStartGamma) && (
                                <span className="sc-smith-placement-hint">
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
        <div className="flex items-center sc-smith-grid-slider">
            <span className="shrink-0 sc-smith-slider-label">{label}:</span>
            <input
                className="sc-range flex-1"
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            />
            <span className="monospace sc-smith-slider-value">{format ? format(value) : value}</span>
        </div>
    );
    return tooltip ? (
        <span className="contents" title={tooltip}>
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
        <table className="w-full monospace sc-smith-readout-table">
            <tbody>
                {rows.map(([label, value]) => (
                    <tr key={label}>
                        <td className="sc-smith-readout-label">{label}</td>
                        <td className="sc-smith-readout-value">{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
