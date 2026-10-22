import { useState, useRef, useCallback, useEffect } from "react";
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
    const [mode, setMode] = useState<TChartMode>("multi");
    const [interpolate, setInterpolate] = useState(false);
    const [selectionEnabled, setSelectionEnabled] = useState(false);
    const [cursorEnabled, setCursorEnabled] = useState(false);
    const [leftDragTool, setLeftDragTool] = useState<TLeftDragTool>("none");

    const controlsRef = useRef<TControls | undefined>(undefined);

    // Applies every toggle to the live surface. Called on init and whenever a toggle changes.
    const applyControls = useCallback(() => {
        const controls = controlsRef.current;
        if (!controls) return;
        controls.selectionModifier.isEnabled = selectionEnabled;
        controls.cursorModifier.isEnabled = cursorEnabled;
        controls.panModifier.isEnabled = leftDragTool === "pan";
        controls.rubberBandZoomModifier.isEnabled = leftDragTool === "zoom";
        controls.axisReorderModifier.isEnabled = leftDragTool === "reorder";
        controls.highlightModifier.isEnabled = leftDragTool === "highlight";
    }, [selectionEnabled, cursorEnabled, leftDragTool]);

    useEffect(applyControls, [applyControls]);

    // Both mode and interpolation swap the renderable-series setup, so the surface is recreated (see the key below).
    const initChart = useCallback(
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
        <div className="sc-chart-wrapper sc-responsive-chart-wrapper">
            <SciChartReact
                key={`${mode}-${interpolate}`}
                initChart={initChart}
                onInit={applyControls}
            />

            <aside className="sc-responsive-controls">
                <h2 className="px-2">Variant:</h2>
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

                <hr />

                <h2 className="px-2">Interactions:</h2>
                <div className="flex flex-col gap-1 px-2">
                    <h4>General</h4>

                    <CheckboxRow 
                        checked={interpolate} 
                        onChange={setInterpolate} 
                        label="Spline interpolation" 
                    />
                    <CheckboxRow
                        checked={selectionEnabled}
                        onChange={setSelectionEnabled}
                        label={currentMode.selectionLabel}
                    />
                    <CheckboxRow 
                        checked={cursorEnabled} 
                        onChange={setCursorEnabled} 
                        label="Cursor tooltip" 
                    />

                    <hr />
                    <h4>Left drag tool</h4>

                    <CheckboxRow
                        checked={leftDragTool === "pan"}
                        onChange={(checked) => setLeftDragTool(checked ? "pan" : "none")}
                        label="Pan"
                    />
                    <CheckboxRow
                        checked={leftDragTool === "zoom"}
                        onChange={(checked) => setLeftDragTool(checked ? "zoom" : "none")}
                        label="Rubber-band zoom"
                    />
                    <CheckboxRow
                        checked={leftDragTool === "reorder"}
                        onChange={(checked) => setLeftDragTool(checked ? "reorder" : "none")}
                        label="Reorder axes (drag 1 at a time)"
                    />
                    <CheckboxRow
                        checked={leftDragTool === "highlight"}
                        onChange={(checked) => setLeftDragTool(checked ? "highlight" : "none")}
                        label="Range highlight (over a Y axis)"
                    />
                </div>
            </aside>
        </div>
    );
}
