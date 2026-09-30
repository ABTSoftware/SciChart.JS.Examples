import * as React from "react";
import { Checkbox, FormControlLabel, MenuItem, MenuList } from "@mui/material";
import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
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
        label: `Single-Series (${(SINGLE_SERIES_RECORD_COUNT/1000).toLocaleString("en-US")}K records)`,
        selectionLabel: "Record selection (click)",
    },
];

const leftDragTools: { value: Exclude<TLeftDragTool, "none">; label: string }[] = [
    { value: "pan", label: "Pan" },
    { value: "zoom", label: "Rubber-band zoom" },
    { value: "reorder", label: "Reorder axes" },
    { value: "highlight", label: "Range highlight (over a Y axis)" },
];

const sidebarWidth = 240;

// A dense MenuItem indents its content by 16px, plus the 3px selection bar, so the menu labels start 19px in.
// The checkboxes below carry 9px of their own padding, which the list padding makes up the difference for.
const contentIndent = 19;
const checkboxPadding = 9;

const headerStyle: React.CSSProperties = {
    flexShrink: 0,
    padding: "10px 16px",
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    background: "var(--bg-toolbars)",
};

const captionStyle: React.CSSProperties = {
    // Sits inside the checkbox list, so it only needs to make up the checkbox's own padding to line up.
    padding: `12px 8px 2px ${checkboxPadding}px`,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
};

type TCheckboxRowProps = {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
};

const CheckboxRow = ({ checked, label, onChange }: TCheckboxRowProps) => (
    <FormControlLabel
        control={
            <Checkbox
                size="small"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                sx={{
                    padding: `4px ${checkboxPadding}px`,
                    color: "rgba(255,255,255,0.55)",
                    "&.Mui-checked": { color: "#2D7FF9" },
                }}
            />
        }
        label={label}
        sx={{
            margin: 0,
            borderRadius: 1,
            paddingRight: 1,
            transition: "background-color 120ms",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.07)" },
        }}
        slotProps={{ typography: { fontSize: 13, lineHeight: 1.35 } }}
    />
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
                controlsRef.current = { ...result, selectionModifier: result.recordSelectionModifier };
                return result;
            }
            const result = await drawMultiSeriesExample(rootElement, interpolate);
            controlsRef.current = { ...result, selectionModifier: result.seriesSelectionModifier };
            return result;
        },
        [mode, interpolate]
    );

    const currentMode = modes.find((m) => m.value === mode);

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <div
                    style={{
                        width: sidebarWidth,
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        background: "var(--bg-toolbars)",
                        color: "#ffffff",
                    }}
                >
                    <div style={headerStyle}>Chart Variant</div>
                    <MenuList
                        dense
                        sx={{
                            flexShrink: 0,
                            padding: "4px 0",
                            "& .MuiMenuItem-root": {
                                color: "#ffffff",
                                borderLeft: "3px solid transparent",
                                transition: "background-color 120ms, border-color 120ms",
                                whiteSpace: "normal",
                            },
                            "& .MuiMenuItem-root.Mui-selected, & .MuiMenuItem-root.Mui-selected:hover, & .MuiMenuItem-root.Mui-selected:focus":
                                {
                                    backgroundColor: "#2D7FF9",
                                    borderLeftColor: "#FFFFFF",
                                    color: "#FFFFFF",
                                    fontWeight: 700,
                                },
                        }}
                    >
                        {modes.map((item) => (
                            <MenuItem
                                key={item.value}
                                selected={item.value === mode}
                                onClick={() => setMode(item.value)}
                                title={item.label}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </MenuList>

                    <div style={headerStyle}>Interactions</div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: `6px ${contentIndent - checkboxPadding}px 14px`,
                        }}
                    >
                        <CheckboxRow checked={interpolate} onChange={setInterpolate} label="Spline interpolation" />
                        <CheckboxRow
                            checked={selectionEnabled}
                            onChange={setSelectionEnabled}
                            label={currentMode.selectionLabel}
                        />
                        <CheckboxRow checked={cursorEnabled} onChange={setCursorEnabled} label="Cursor tooltip" />

                        <div style={captionStyle}>Left-drag &mdash; one at a time</div>
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
