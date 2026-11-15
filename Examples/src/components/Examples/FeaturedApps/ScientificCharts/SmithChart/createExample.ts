import "./styles.css";
import { CloseIcon, ExpandMoreIcon } from "../../../icons/native";
import { Demo, h } from "../../../demoHelpers";
import { drawExample } from "./drawExample";
import { initialSmithState, smithReducer, SmithAction, ComponentType, DragMode, SmithState } from "./smithState";
import { floatingPanel } from "../../../FloatingPanel/native";
import { SmithChartResistanceAxis } from "./smithChartAxes";
import { smithGridConfig, updateSmithGridConfig } from "./smithChartGridCalculator";
import { computeReadouts } from "./smithChartMarkers";
import { CHAIN_COLOURS } from "./smithChartChain";
import { SCENARIOS, Scenario } from "./smithChartScenarios";

const COLOURS = ["#FF4444", "#44AAFF", "#FFAA00", "#44FF88", "#FF44CC", "#88FF44"];
const MUTED = "color-mix(in srgb, var(--text) 55%, transparent)";
const COMPONENT_TYPES: [ComponentType, string][] = [
    ["seriesL", "Series L"],
    ["seriesC", "Series C"],
    ["seriesR", "Series R"],
    ["shuntL", "Shunt L"],
    ["shuntC", "Shunt C"],
    ["shuntR", "Shunt R"],
    ["TL", "Trans. Line"],
];

/** Wraps a control in a layout-neutral element that carries its tooltip. */
const withTooltip = (title: string, child: HTMLElement) => h("span", { class: "contents", title }, child);

const gridSlider = (options: {
    label: string;
    tooltip: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
}) => {
    const output = h("span", { class: "monospace sc-smith-slider-value" }, options.value);
    return withTooltip(
        options.tooltip,
        h(
            "div",
            { class: "flex items-center sc-smith-grid-slider" },
            h("span", { class: "shrink-0 sc-smith-slider-label" }, `${options.label}:`),
            h("input", {
                class: "sc-range flex-1",
                type: "range",
                min: options.min,
                max: options.max,
                step: options.step,
                value: String(options.value),
                oninput: (event: Event) => {
                    const value = (event.currentTarget as HTMLInputElement).valueAsNumber;
                    output.textContent = String(value);
                    options.onChange(value);
                },
            }),
            output
        )
    );
};

const readoutTable = (ro: ReturnType<typeof computeReadouts>) => {
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
    return h(
        "table",
        { class: "w-full monospace sc-smith-readout-table" },
        h(
            "tbody",
            {},
            ...rows.map(([label, value]) =>
                h(
                    "tr",
                    {},
                    h("td", { class: "sc-smith-readout-label" }, label),
                    h("td", { class: "sc-smith-readout-value" }, value)
                )
            )
        )
    );
};

export const createExample = (root: HTMLDivElement) =>
    new Demo(root, async (demo) => {
        root.classList.add("flex", "flex-col");

        let api: Awaited<ReturnType<typeof drawExample>> | undefined;
        let state: SmithState = initialSmithState();
        const dispatch = (action: SmithAction) => {
            state = smithReducer(state, action);
            api?.update(state);
            renderState();
        };
        const invalidateChart = () => api?.sciChartSurface.invalidateElement();

        // Layout: square plot with overlay buttons, readout sidebar beside or underneath it.
        const plot = h("div", { class: "w-full h-full relative overflow-hidden sc-smith-plot" });
        const examplesButton = h(
            "button",
            { class: "sc-button sc-button-outline", type: "button", onclick: () => openExamplesMenu() },
            "Examples"
        );
        const overlay = h(
            "div",
            { class: "absolute flex flex-col gap-1 top-2 left-2 z-10" },
            examplesButton,
            h("button", { class: "sc-button", type: "button", onclick: () => chainPanel.toggle() }, "Chain"),
            h("button", { class: "sc-button", type: "button", onclick: () => gridPanel.toggle() }, "Grid")
        );
        const canvas = h("div", { class: "sc-smith-canvas" }, plot, overlay);
        const readouts = h("div", { class: "sc-smith-readouts" });
        root.append(h("div", { class: "sc-smith-layout" }, canvas, readouts));

        // Examples dropdown menu: exists only while open, right after the plot.
        let examplesMenu: HTMLDivElement | undefined;
        const closeExamplesMenu = () => {
            examplesMenu?.remove();
            examplesMenu = undefined;
            document.removeEventListener("pointerdown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
        const closeOnOutsideClick = (event: PointerEvent) => {
            const target = event.target as Node;
            if (!examplesButton.contains(target) && !examplesMenu?.contains(target)) closeExamplesMenu();
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeExamplesMenu();
        };
        const loadScenario = (scenario: Scenario) => {
            if (!api) return;
            dispatch({ type: "CLEAR" });
            for (const step of scenario.steps) step.run(dispatch, api.addChainStep);
            dispatch({
                type: "LOAD_SCENARIO",
                id: scenario.id,
                steps: scenario.steps.map((step) => step.description),
            });
        };
        const openExamplesMenu = () => {
            closeExamplesMenu();
            const anchor = examplesButton.getBoundingClientRect();
            examplesMenu = h(
                "div",
                {
                    class: "sc-smith-menu",
                    role: "menu",
                    style: { left: `${anchor.left}px`, top: `${anchor.bottom + 4}px` },
                },
                ...SCENARIOS.map((scenario) =>
                    h(
                        "button",
                        {
                            type: "button",
                            class: "sc-button sc-button-outline justify-start",
                            role: "menuitemradio",
                            "aria-checked": String(state.activeScenarioId === scenario.id),
                            onclick: () => {
                                loadScenario(scenario);
                                closeExamplesMenu();
                            },
                        },
                        scenario.title
                    )
                ),
                h("hr", { class: "sc-smith-divider" }),
                h(
                    "button",
                    {
                        type: "button",
                        class: "sc-button sc-button-outline justify-start",
                        role: "menuitem",
                        onclick: () => {
                            dispatch({ type: "CLEAR" });
                            closeExamplesMenu();
                        },
                    },
                    "Clear"
                )
            );
            plot.after(examplesMenu);
            document.addEventListener("pointerdown", closeOnOutsideClick);
            document.addEventListener("keydown", closeOnEscape);
        };
        demo.cleanup(closeExamplesMenu);

        // Chain floating panel
        const chainPanel = floatingPanel("Chain", { x: 8, y: 110 });
        demo.cleanup(chainPanel.dispose);
        const vswrInput = h("input", {
            class: "sc-input sc-smith-number-input",
            type: "number",
            min: 1.01,
            max: 100,
            step: 0.1,
            value: state.vswr.toFixed(2),
            oninput: () => {
                const value = parseFloat(vswrInput.value);
                if (value > 1) dispatch({ type: "SET_VSWR", vswr: value });
            },
        });
        const shadeCheckbox = h("input", {
            class: "sc-checkbox",
            type: "checkbox",
            checked: state.vswrShaded,
            onchange: () => dispatch({ type: "SET_VSWR_SHADED", shaded: shadeCheckbox.checked }),
        });
        const outlineCheckbox = h("input", {
            class: "sc-checkbox",
            type: "checkbox",
            checked: state.vswrOutline,
            onchange: () => dispatch({ type: "SET_VSWR_OUTLINE", outline: outlineCheckbox.checked }),
        });
        const frequencyInput = h("input", {
            class: "sc-input sc-smith-number-input",
            type: "number",
            min: 0.001,
            max: 100,
            step: 0.1,
            value: (state.frequency / 1e9).toFixed(3),
            oninput: () => {
                const value = parseFloat(frequencyInput.value);
                if (value > 0) dispatch({ type: "SET_FREQUENCY", frequency: value * 1e9 });
            },
        });
        const chainValueInput = h("input", {
            class: "sc-input",
            style: { width: "5.25rem" },
            type: "number",
            placeholder: "SI",
            value: "1e-9",
        });
        const chainValueTooltip = withTooltip("Component value — Henrys (L), Farads (C), or Ohms (R)", chainValueInput);
        const chainTypeSelect = h(
            "select",
            {
                class: "sc-select",
                value: "seriesL",
                onchange: () => {
                    const isLine = chainTypeSelect.value === "TL";
                    chainValueInput.placeholder = isLine ? "λ" : "SI";
                    chainValueTooltip.title = isLine
                        ? "Transmission line length in wavelengths (e.g. 0.25 = quarter-wave)"
                        : "Component value — Henrys (L), Farads (C), or Ohms (R)";
                },
            },
            ...COMPONENT_TYPES.map(([value, label]) => h("option", { value }, label))
        );
        const addButton = h(
            "button",
            {
                title: "Append this component step from the current chain tip",
                class: "sc-button sc-button-outline",
                disabled: true,
                type: "button",
                onclick: () => {
                    const tip = api?.getChainTip(state);
                    if (!tip) return;
                    const parsed = parseFloat(chainValueInput.value);
                    if (isNaN(parsed)) return;
                    api.addChainStep(tip, chainTypeSelect.value as ComponentType, parsed, state.frequency);
                },
            },
            "Add"
        );
        const undoButton = h(
            "button",
            {
                title: "Remove the last chain step",
                class: "sc-button sc-button-outline",
                disabled: true,
                type: "button",
                onclick: () => dispatch({ type: "UNDO_CHAIN_STEP" }),
            },
            "Undo"
        );
        chainPanel.body.append(
            h(
                "div",
                { class: "flex flex-col gap-2" },
                // VSWR
                h(
                    "div",
                    { class: "flex items-center gap-2" },
                    withTooltip(
                        "VSWR = (1+|Γ|)/(1−|Γ|) — drag the orange handle on the real axis to resize the circle",
                        h("span", {}, "VSWR:")
                    ),
                    vswrInput,
                    withTooltip(
                        "Fill the VSWR circle interior to mark the acceptable match region",
                        h("label", { class: "sc-control" }, shadeCheckbox, h("span", {}, "Shade"))
                    ),
                    withTooltip(
                        "Show or hide the dashed VSWR circle outline",
                        h("label", { class: "sc-control" }, outlineCheckbox, h("span", {}, "Outline"))
                    )
                ),
                h("hr", { class: "sc-smith-divider" }),
                // Chain builder
                h(
                    "div",
                    { class: "flex items-center gap-2 flex-wrap" },
                    withTooltip(
                        "Operating frequency for reactive components (L, C) and transmission lines",
                        h("span", {}, "Freq:")
                    ),
                    frequencyInput,
                    h("span", {}, "GHz"),
                    withTooltip(
                        "Component type: series elements move along constant-R or constant-X curves; shunt elements move along constant-G or constant-B curves; TL rotates clockwise at constant |Γ|",
                        chainTypeSelect
                    ),
                    chainValueTooltip,
                    addButton,
                    undoButton
                )
            )
        );

        // Grid Config floating panel
        const gridPanel = floatingPanel("Grid Config", { x: 280, y: 110 });
        demo.cleanup(gridPanel.dispose);
        const gridModes = [
            { mode: "Z", title: "Impedance grid — constant-R circles and constant-X arcs" },
            { mode: "Y", title: "Admittance grid — constant-G circles and constant-B arcs" },
            { mode: "ZY", title: "Both impedance and admittance grids overlaid" },
        ] as const;
        const gridModeButtons = gridModes.map(({ mode, title }) =>
            h(
                "button",
                {
                    title,
                    type: "button",
                    class: "sc-button",
                    "aria-pressed": String(state.gridMode === mode),
                    onclick: () => dispatch({ type: "SET_GRID_MODE", mode }),
                },
                mode
            )
        );
        const gridModeRow = h(
            "div",
            { class: "flex items-center gap-2" },
            h("span", {}, "Grid:"),
            h("div", { class: "sc-button-group", role: "group" }, ...gridModeButtons)
        );
        const opacityControl = (label: string, title: string, value: number, change: (opacity: number) => void) => {
            const slider = h("input", {
                class: "sc-range flex-1",
                type: "range",
                min: 0,
                max: 1,
                step: 0.05,
                value: String(value),
                oninput: () => change(slider.valueAsNumber),
            });
            const control = withTooltip(
                title,
                h("div", { class: "flex items-center gap-2 sc-smith-opacity-control" }, h("span", {}, label), slider)
            );
            return { slider, control };
        };
        const zOpacity = opacityControl("Z α:", "Impedance grid opacity", state.zOpacity, (opacity) =>
            dispatch({ type: "SET_Z_OPACITY", opacity })
        );
        const yOpacity = opacityControl("Y α:", "Admittance grid opacity", state.yOpacity, (opacity) =>
            dispatch({ type: "SET_Y_OPACITY", opacity })
        );
        const applyGridConfig = (patch: Parameters<typeof updateSmithGridConfig>[0]) => {
            updateSmithGridConfig(patch);
            invalidateChart();
        };
        const applyRimConfig = (patch: Partial<SmithChartResistanceAxis["rimConfig"]>) => {
            const axis = api?.sciChartSurface.xAxes.get(0) as SmithChartResistanceAxis | undefined;
            if (!axis) return;
            axis.rimConfig = { ...axis.rimConfig, ...patch };
            invalidateChart();
        };
        const compactRangeCheckbox = h("input", {
            class: "sc-checkbox",
            type: "checkbox",
            checked: smithGridConfig.useCompactRange,
            onchange: () => applyGridConfig({ useCompactRange: compactRangeCheckbox.checked }),
        });
        gridPanel.body.append(
            h(
                "div",
                { class: "flex flex-col gap-2" },
                // Z/Y/ZY grid mode; the opacity sliders of the visible grids are inserted after it
                gridModeRow,
                h("hr", { class: "sc-smith-divider sc-smith-readout-divider" }),
                gridSlider({
                    label: "Major px",
                    min: 5,
                    max: 50,
                    step: 1,
                    tooltip:
                        "Minimum pixel radius a circle/arc must have to qualify as a major gridline. Increase to show fewer, bolder major lines.",
                    value: smithGridConfig.majorPxThreshold,
                    onChange: (value) => applyGridConfig({ majorPxThreshold: value }),
                }),
                gridSlider({
                    label: "Minor px",
                    min: 1,
                    max: 20,
                    step: 1,
                    tooltip:
                        "Minimum pixel radius for a minor gridline. Circles smaller than this are hidden entirely. Increase to reduce clutter when zoomed out.",
                    value: smithGridConfig.minorPxThreshold,
                    onChange: (value) => applyGridConfig({ minorPxThreshold: value }),
                }),
                gridSlider({
                    label: "Target ticks",
                    min: 2,
                    max: 16,
                    step: 1,
                    tooltip:
                        "Desired number of major gridlines per family (R circles and X arcs). Values are chosen evenly-spaced in s-space (s = 1/(v+1)) to give perceptually uniform density.",
                    value: smithGridConfig.targetTicks,
                    onChange: (value) => applyGridConfig({ targetTicks: value }),
                }),
                gridSlider({
                    label: "Max tiers (0=auto)",
                    min: 0,
                    max: 8,
                    step: 1,
                    tooltip:
                        "Caps the number of binary subdivision passes used to fill minor ticks between majors. 0 = automatic (scales with the number of major ticks). More tiers = finer minor grid.",
                    value: smithGridConfig.maxTiers,
                    onChange: (value) => applyGridConfig({ maxTiers: value }),
                }),
                gridSlider({
                    label: "Min gap (px)",
                    min: 0.5,
                    max: 10,
                    step: 0.5,
                    tooltip:
                        "Target pixel gap between adjacent arc curves at the convergence point. Automatically scales with zoom (effectiveGap = minGapPx / pixPerUnit), so subdivision deepens as you zoom in. Higher = sparser grid; lower = denser.",
                    value: smithGridConfig.minGapPx,
                    onChange: (value) => applyGridConfig({ minGapPx: value }),
                }),
                withTooltip(
                    "When enabled, suppresses minor-tick subdivision in the large-arc sweep region (circles whose centres lie outside the viewport). Reduces clutter on the left side when zoomed into the right half of the chart.",
                    h("label", { class: "sc-control m-0" }, compactRangeCheckbox, h("span", {}, "Compact range"))
                ),
                h("hr", { class: "sc-smith-divider sc-smith-readout-divider" }),
                h("span", { class: "font-bold", style: { color: MUTED } }, "RIM"),
                gridSlider({
                    label: "Label gap",
                    min: 1,
                    max: 20,
                    step: 1,
                    tooltip: "Pixel gap between the outer tip of a major tick and the label anchor. Must be ≥ 1.",
                    value: 2,
                    onChange: (value) => applyRimConfig({ labelOffset: value }),
                }),
                gridSlider({
                    label: "Major °",
                    min: 10,
                    max: 90,
                    step: 10,
                    tooltip:
                        "Angular spacing in degrees between major (labelled) rim ticks. Must be an integer multiple of the minor tick step.",
                    value: 30,
                    onChange: (value) => applyRimConfig({ majorTickStep: value }),
                }),
                gridSlider({
                    label: "Minor °",
                    min: 5,
                    max: 30,
                    step: 5,
                    tooltip: "Angular spacing in degrees between minor rim ticks.",
                    value: 10,
                    onChange: (value) => applyRimConfig({ minorTickStep: value }),
                })
            )
        );

        // Readout sidebar
        const formatGamma = (gamma: { re: number; im: number }) =>
            `Γ=${gamma.re.toFixed(3)}${gamma.im >= 0 ? "+" : ""}j${gamma.im.toFixed(3)}`;
        const markerReadout = (marker: SmithState["markers"][number], index: number) => {
            const colour = COLOURS[index % COLOURS.length];
            const details = h(
                "details",
                {
                    class: "sc-accordion sc-marker-accordion",
                    open: marker.id === state.activeMarkerId,
                    style: { borderColor: colour },
                    ontoggle: () => {
                        // The sidebar is rebuilt on every state change; ignore events of replaced nodes.
                        if (!details.isConnected) return;
                        if (details.open && state.activeMarkerId !== marker.id)
                            dispatch({ type: "SET_ACTIVE_MARKER", id: marker.id });
                        else if (!details.open && state.activeMarkerId === marker.id)
                            dispatch({ type: "SET_ACTIVE_MARKER", id: null });
                    },
                },
                h(
                    "summary",
                    { class: "sc-accordion-summary sc-marker-summary" },
                    h(
                        "button",
                        {
                            type: "button",
                            class: "sc-button sc-button-icon",
                            title: `Remove ${marker.label}`,
                            "aria-label": `Remove ${marker.label}`,
                            onclick: (event: Event) => {
                                event.stopPropagation();
                                dispatch({ type: "REMOVE_MARKER", id: marker.id });
                            },
                        },
                        CloseIcon()
                    ),
                    h("span", { class: "sc-smith-chip", style: { backgroundColor: colour } }, marker.label),
                    h("span", { class: "monospace", style: { lineHeight: "2" } }, formatGamma(marker.gamma)),
                    ExpandMoreIcon("sc-accordion-chevron")
                ),
                h(
                    "div",
                    { class: "sc-accordion-details sc-marker-details" },
                    h(
                        "div",
                        { class: "flex items-center gap-2", style: { marginBottom: "0.375rem" } },
                        h("span", { style: { color: MUTED, minWidth: "2.25rem" } }, "Drag:"),
                        h(
                            "div",
                            { class: "sc-button-group", role: "group" },
                            ...(["free", "gamma", "R", "X", "G", "B"] as DragMode[]).map((mode) =>
                                h(
                                    "button",
                                    {
                                        type: "button",
                                        class: "sc-button",
                                        "aria-pressed": String(marker.dragMode === mode),
                                        onclick: () => dispatch({ type: "SET_DRAG_MODE", id: marker.id, mode }),
                                    },
                                    mode === "free" ? "Free" : mode === "gamma" ? "|Γ|" : mode
                                )
                            )
                        )
                    ),
                    readoutTable(computeReadouts(marker.gamma))
                )
            );
            return details;
        };
        const renderReadouts = () => {
            const chainStart = state.markers.find((marker) => marker.isChainStart);
            readouts.replaceChildren(
                ...(state.scenarioSteps.length > 0
                    ? [
                          h("span", { class: "sc-smith-explanation-heading" }, "HOW IT WORKS"),
                          ...state.scenarioSteps.map((step, index) =>
                              h(
                                  "div",
                                  { class: "flex", style: { gap: "0.375rem", marginBottom: "0.375rem" } },
                                  h(
                                      "span",
                                      { class: "shrink-0", style: { color: MUTED, minWidth: "0.875rem" } },
                                      `${index + 1}.`
                                  ),
                                  h("span", { style: { lineHeight: "1.4" } }, step)
                              )
                          ),
                          h("hr", { class: "sc-smith-divider", style: { margin: "0.375rem 0" } }),
                      ]
                    : []),
                h("span", { class: "sc-smith-explanation-heading" }, "MARKERS"),
                ...(state.markers.length === 0
                    ? [h("span", { class: "sc-smith-placement-hint" }, "Click chart to place a marker")]
                    : []),
                ...state.markers.map(markerReadout),
                // Chain step list
                ...(state.chain.length > 0
                    ? [
                          h("hr", { class: "sc-smith-divider sc-smith-readout-divider" }),
                          h("span", { class: "font-bold" }, `CHAIN (${state.chain.length} steps)`),
                          ...state.chain.map((step, index) =>
                              h(
                                  "div",
                                  { class: "flex items-center gap-2" },
                                  h("div", {
                                      class: "shrink-0",
                                      style: {
                                          width: "0.5rem",
                                          height: "0.5rem",
                                          borderRadius: "50%",
                                          backgroundColor: CHAIN_COLOURS[index % CHAIN_COLOURS.length],
                                      },
                                  }),
                                  h(
                                      "span",
                                      { class: "monospace" },
                                      `${step.type} ${step.value.toExponential(2)} → ${formatGamma(step.toGamma)}`
                                  )
                              )
                          ),
                          ...(chainStart || state.chainStartGamma
                              ? [
                                    h(
                                        "span",
                                        { class: "sc-smith-placement-hint" },
                                        `Start: ${
                                            chainStart
                                                ? chainStart.label
                                                : `Γ=(${state.chainStartGamma.re.toFixed(
                                                      3
                                                  )},${state.chainStartGamma.im.toFixed(3)})`
                                        }`
                                    ),
                                ]
                              : []),
                      ]
                    : [])
            );
        };

        // Reflect the current state in the controls and the sidebar.
        const setValue = (node: HTMLInputElement, value: string) => {
            if (node.value !== value) node.value = value;
        };
        let shownGridMode: SmithState["gridMode"] | undefined;
        const renderState = () => {
            setValue(vswrInput, state.vswr.toFixed(2));
            setValue(frequencyInput, (state.frequency / 1e9).toFixed(3));
            shadeCheckbox.checked = state.vswrShaded;
            outlineCheckbox.checked = state.vswrOutline;
            addButton.disabled = !api?.getChainTip(state);
            undoButton.disabled = state.chain.length === 0;
            gridModeButtons.forEach((node, index) =>
                node.setAttribute("aria-pressed", String(gridModes[index].mode === state.gridMode))
            );
            setValue(zOpacity.slider, String(state.zOpacity));
            setValue(yOpacity.slider, String(state.yOpacity));
            if (shownGridMode !== state.gridMode) {
                shownGridMode = state.gridMode;
                zOpacity.control.remove();
                yOpacity.control.remove();
                gridModeRow.after(
                    ...[state.gridMode !== "Y" && zOpacity.control, state.gridMode !== "Z" && yOpacity.control].filter(
                        (node): node is HTMLSpanElement => !!node
                    )
                );
            }
            examplesMenu
                ?.querySelectorAll('[role="menuitemradio"]')
                .forEach((node, index) =>
                    node.setAttribute("aria-checked", String(SCENARIOS[index].id === state.activeScenarioId))
                );
            renderReadouts();
        };
        renderState();

        api = await demo.mount(drawExample, plot);
        api.setDispatch(dispatch);
        api.update(state);
    });
