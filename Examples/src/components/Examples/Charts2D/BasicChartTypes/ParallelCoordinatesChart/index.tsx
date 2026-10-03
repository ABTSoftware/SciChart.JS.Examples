import * as React from "react";
import { SciChartReact } from "scichart-react";
import {
    drawMultiSeriesExample,
    drawSingleSeriesExample,
    MULTI_SERIES_RECORD_COUNT,
    SINGLE_SERIES_RECORD_COUNT,
} from "./drawExample";

type TChartMode = "multi" | "single";

/** Pan / rubber-band / reorder / range-highlight all use the left-drag gesture, so at most one may be active. */
type TLeftDragTool = "none" | "pan" | "zoom" | "reorder" | "highlight";

type TModifier = { isEnabled: boolean };

type TControls = {
    selectionModifier: TModifier;
    cursorModifier: TModifier;
    panModifier: TModifier;
    rubberBandZoomModifier: TModifier;
    axisReorderModifier: TModifier;
    highlightModifier: TModifier;
};

const modes: { value: TChartMode; label: string; selectionLabel: string }[] = [
    {
        value: "multi",
        label: `Multi-Series (${MULTI_SERIES_RECORD_COUNT.toLocaleString("en-US")} records)`,
        selectionLabel: "Series selection (hover)",
    },
    {
        value: "single",
        label: `Single-Series (${(SINGLE_SERIES_RECORD_COUNT / 1000).toLocaleString("en-US")}K records)`,
        selectionLabel: "Record selection (click)",
    },
];

const leftDragTools: {
    value: Exclude<TLeftDragTool, "none">;
    label: string;
}[] = [
    { value: "pan", label: "Pan" },
    { value: "zoom", label: "Rubber-band zoom" },
    { value: "reorder", label: "Reorder axes" },
    { value: "highlight", label: "Range highlight (over a Y axis)" },
];

const sidebarWidth = 240;

type TCheckboxRowProps = {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
};

const CheckboxRow = ({ checked, label, onChange }: TCheckboxRowProps) => (
    <label className="sc-control">
        <input className="sc-checkbox" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
    </label>
);

export default function ParallelCoordinatesChart() {
    const [mode, setMode] = React.useState<TChartMode>("multi");
    const [interpolate, setInterpolate] = React.useState(false);
    const [selectionEnabled, setSelectionEnabled] = React.useState(false);
    const [cursorEnabled, setCursorEnabled] = React.useState(false);
    const [leftDragTool, setLeftDragTool] = React.useState<TLeftDragTool>("none");

    const controlsRef = React.useRef<TControls | undefined>(undefined);

    // Applies every toggle to the live surface. Called on init and whenever a toggle changes.
    const applyControls = React.useCallback(() => {
        const controls = controlsRef.current;
        if (!controls) return;
        controls.selectionModifier.isEnabled = selectionEnabled;
        controls.cursorModifier.isEnabled = cursorEnabled;
        controls.panModifier.isEnabled = leftDragTool === "pan";
        controls.rubberBandZoomModifier.isEnabled = leftDragTool === "zoom";
        controls.axisReorderModifier.isEnabled = leftDragTool === "reorder";
        controls.highlightModifier.isEnabled = leftDragTool === "highlight";
    }, [selectionEnabled, cursorEnabled, leftDragTool]);

    React.useEffect(applyControls, [applyControls]);

    // Both mode and interpolation swap the renderable-series setup, so the surface is recreated (see the key below).
    const initChart = React.useCallback(
        async (rootElement: string | HTMLDivElement) => {
            controlsRef.current = undefined;
            if (mode === "single") {
                const result = await drawSingleSeriesExample(rootElement, interpolate);
                controlsRef.current = {
                    ...result,
                    selectionModifier: result.recordSelectionModifier,
                };
                return result;
            }
            const result = await drawMultiSeriesExample(rootElement, interpolate);
            controlsRef.current = {
                ...result,
                selectionModifier: result.seriesSelectionModifier,
            };
            return result;
        },
        [mode, interpolate]
    );

    const currentMode = modes.find((m) => m.value === mode);

    return (
        <div className="sc-chart-wrapper">
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div
                    style={{
                        width: sidebarWidth,
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        background: "var(--sc-background)",
                        color: "var(--sc-text)",
                    }}
                >
                    <div
                        style={{
                            flexShrink: 0,
                            padding: "10px 16px",
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                            background: "var(--sc-background)",
                        }}
                    >
                        Chart Variant
                    </div>
                    <div className="sc-button-group flex-col">
                        {modes.map((item) => (
                            <button
                                type="button"
                                key={item.value}
                                className="sc-button sc-button-outline justify-start"
                                aria-pressed={item.value === mode}
                                onClick={() => setMode(item.value)}
                                title={item.label}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div
                        style={{
                            flexShrink: 0,
                            padding: "10px 16px",
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                            background: "var(--sc-background)",
                        }}
                    >
                        Interactions
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            padding: "8px",
                        }}
                    >
                        <CheckboxRow checked={interpolate} onChange={setInterpolate} label="Spline interpolation" />
                        <CheckboxRow
                            checked={selectionEnabled}
                            onChange={setSelectionEnabled}
                            label={currentMode.selectionLabel}
                        />
                        <CheckboxRow checked={cursorEnabled} onChange={setCursorEnabled} label="Cursor tooltip" />

                        <div
                            style={{
                                // Sits inside the checkbox list, so it only needs to make up the checkbox's own padding to line up.
                                padding: "12px 0 2px",
                                fontSize: 11,
                                letterSpacing: 0.4,
                                textTransform: "uppercase",
                                color: "var(--sc-text)",
                            }}
                        >
                            Left-drag &mdash; one at a time
                        </div>
                        {leftDragTools.map((tool) => (
                            <CheckboxRow
                                key={tool.value}
                                checked={leftDragTool === tool.value}
                                onChange={(checked) => setLeftDragTool(checked ? tool.value : "none")}
                                label={tool.label}
                            />
                        ))}
                    </div>
                </div>

                <SciChartReact
                    key={`${mode}-${interpolate}`}
                    style={{ flex: 1, minWidth: 0 }}
                    initChart={initChart}
                    onInit={applyControls}
                />
            </div>
        </div>
    );
}
