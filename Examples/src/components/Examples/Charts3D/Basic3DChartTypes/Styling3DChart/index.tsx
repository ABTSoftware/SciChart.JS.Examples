import "./styles.css";
import { useRef, useState } from "react";
import { drawExample, TAxis, TSelectedAxisPlane } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { SettingsIcon, CloseIcon, ExpandMoreIcon } from "../../../icons";
import { BodyPortal } from "../../../Portal";

import { appTheme } from "../../../theme";
import { useViewType } from "./containerSizeHooks";
import { EAxisPlaneDrawLabelsMode, E3DLabelOrientationMode } from "scichart";

const PANEL_TEXT_COLOR = "var(--sc-text)";

type AxisDemoConfig = {
    fontSize: number;
    titleOffset: number;
    tickLabelsOffset: number;
    labelOrientation: E3DLabelOrientationMode;
    majorGridLines: boolean;
    minorGridLines: boolean;
    bandsFill: string;
    majorGridColor: string;
    minorGridColor: string;
};

const defaultAxisConfig: AxisDemoConfig = {
    fontSize: 20,
    titleOffset: 10,
    tickLabelsOffset: 10,
    labelOrientation: E3DLabelOrientationMode.Auto,
    majorGridLines: false,
    minorGridLines: false,
    bandsFill: appTheme.DarkIndigo + "44",
    majorGridColor: "#5588AA",
    minorGridColor: "#225588",
};

export default function Styling3DChart() {
    // 1. Fixed: Added type to useRef for better DX
    const controlsRef = useRef<any>(null);
    const sizeRef = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(sizeRef);
    const { isMobileView } = viewInfo ?? {};

    const [selectedAxis, setSelectedAxis] = useState<TAxis>("x");
    const [axisSettings, setAxisSettings] = useState<Record<TAxis, AxisDemoConfig>>({
        x: { ...defaultAxisConfig },
        y: { ...defaultAxisConfig },
        z: { ...defaultAxisConfig },
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPlane, setSelectedPlane] = useState<TSelectedAxisPlane>("none");
    const [visibilityMode, setVisibilityMode] = useState("auto");
    const [planeDrawTitlesMode, setPlaneDrawTitlesMode] = useState<EAxisPlaneDrawLabelsMode>(
        EAxisPlaneDrawLabelsMode.Both
    );
    const [planeDrawLabelsMode, setPlaneDrawLabelsMode] = useState<EAxisPlaneDrawLabelsMode>(
        EAxisPlaneDrawLabelsMode.Both
    );
    const [planeIsVisible, setPlaneIsVisible] = useState("true");
    const [expanded, setExpanded] = useState<string | false>("panel1");

    // Helper to ensure color strings are valid for <input type="color" className="sc-input">
    const formatHexForInput = (color: string) => {
        if (!color || !color.startsWith("#")) return "#000000";
        return color.substring(0, 7);
    };

    const updateAxisSetting = (key: keyof AxisDemoConfig, value: any) => {
        setAxisSettings((prev) => ({
            ...prev,
            [selectedAxis]: { ...prev[selectedAxis], [key]: value },
        }));
    };

    const handlePanelToggle = (panel: string) => (event: React.SyntheticEvent<HTMLDetailsElement>) => {
        if (event.currentTarget.open) setExpanded(panel);
        else setExpanded((current) => (current === panel ? false : current));
    };

    const handleClickOpen = () => setIsDialogOpen(true);
    const handleClose = () => setIsDialogOpen(false);

    // 2. Fixed: Added optional chaining (?.current) to all control calls
    const handleLabelFontSize = (_: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
        updateAxisSetting("fontSize", newValue);
        controlsRef.current?.setAxisLabelFontSize(newValue, selectedAxis);
    };

    const handleTitleOffset = (_: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
        updateAxisSetting("titleOffset", newValue);
        controlsRef.current?.setTitleOffset(newValue, selectedAxis);
    };

    const handleTickLabelsOffset = (_: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
        updateAxisSetting("tickLabelsOffset", newValue);
        controlsRef.current?.setTickLabelsOffset(newValue, selectedAxis);
    };

    const handleLabelOrientationModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMode = e.target.value as E3DLabelOrientationMode;
        updateAxisSetting("labelOrientation", newMode);
        controlsRef.current?.setLabelOrientationMode(newMode, selectedAxis);
    };

    const handleEnableMajorGridLines = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        updateAxisSetting("majorGridLines", checked);
        controlsRef.current?.enableMajorGridLines(checked, selectedAxis);
    };

    const handleEnableMinorGridLines = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        updateAxisSetting("minorGridLines", checked);
        controlsRef.current?.enableMinorGridLines(checked, selectedAxis);
    };

    const handleAxisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAxis = e.target.value as TAxis;
        setSelectedAxis(newAxis);
        controlsRef.current?.updateAxisTitleColor(newAxis);
    };

    const handleBandsFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        updateAxisSetting("bandsFill", color);
        controlsRef.current?.setAxisBandsFill(color, selectedAxis);
    };

    const handleMajorGridLineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        updateAxisSetting("majorGridColor", color);
        controlsRef.current?.setMajorGridLineColor(color, selectedAxis);
    };

    const handleMinorGridLineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        updateAxisSetting("minorGridColor", color);
        controlsRef.current?.setMinorGridLineColor(color, selectedAxis);
    };

    // Plane handlers
    const handlePlaneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as TSelectedAxisPlane;
        setSelectedPlane(newValue);
        controlsRef.current?.setPlaneBackground(newValue);
    };

    const handleVisibilityMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setVisibilityMode(newValue);
        controlsRef.current?.setVisibilityMode(selectedPlane, newValue);
    };

    const handlePlaneDrawTitlesMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as EAxisPlaneDrawLabelsMode;
        setPlaneDrawTitlesMode(newValue);
        controlsRef.current?.setDrawTitlesMode(selectedPlane, newValue);
    };

    const handlePlaneDrawLabelsMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as EAxisPlaneDrawLabelsMode;
        setPlaneDrawLabelsMode(newValue);
        controlsRef.current?.setDrawLabelsMode(selectedPlane, newValue);
    };

    const handlePlaneIsVisible = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setPlaneIsVisible(newValue);
        controlsRef.current?.setIsPlaneVisible(selectedPlane, newValue);
    };

    const currentSettings = axisSettings[selectedAxis];

    const controlPanel = (
        <>
            {/* Axis Section */}
            <details className="sc-accordion" open={expanded === "panel1"} onToggle={handlePanelToggle("panel1")}>
                <summary className="sc-accordion-summary">
                    <span>Axis Configuration</span>
                    <ExpandMoreIcon />
                </summary>
                <div className="sc-accordion-details">
                    <div className="flex flex-col gap-2">
                        <span>Select Axis</span>
                        <select className="sc-select" value={selectedAxis} onChange={handleAxisChange}>
                            <option value="x">X Axis</option>
                            <option value="y">Y Axis</option>
                            <option value="z">Z Axis</option>
                        </select>

                        <span>Axis Font Size: {currentSettings.fontSize}</span>
                        <input
                            type="range"
                            className="sc-range"
                            step={1}
                            min={10}
                            max={30}
                            value={currentSettings.fontSize}
                            onChange={(event) => handleLabelFontSize(event, event.currentTarget.valueAsNumber)}
                        />

                        <span>Axis Title Offset: {currentSettings.titleOffset}</span>
                        <input
                            type="range"
                            className="sc-range"
                            step={1}
                            min={0}
                            max={100}
                            value={currentSettings.titleOffset}
                            onChange={(event) => handleTitleOffset(event, event.currentTarget.valueAsNumber)}
                        />

                        <span>Tick Labels Offset: {currentSettings.tickLabelsOffset}</span>
                        <input
                            type="range"
                            className="sc-range"
                            step={1}
                            min={0}
                            max={100}
                            value={currentSettings.tickLabelsOffset}
                            onChange={(event) => handleTickLabelsOffset(event, event.currentTarget.valueAsNumber)}
                        />

                        <span>Label Orientation Mode</span>
                        <select
                            className="sc-select"
                            value={currentSettings.labelOrientation}
                            onChange={handleLabelOrientationModeChange}
                        >
                            <option value={E3DLabelOrientationMode.Auto}>Auto</option>
                            <option value={E3DLabelOrientationMode.Horizontal}>Horizontal</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <label className="sc-switch">
                                <input
                                    type="checkbox"
                                    checked={currentSettings.majorGridLines}
                                    onChange={handleEnableMajorGridLines}
                                />
                                Major Grid
                            </label>
                            <label className="sc-switch">
                                <input
                                    type="checkbox"
                                    checked={currentSettings.minorGridLines}
                                    onChange={handleEnableMinorGridLines}
                                />
                                Minor Grid
                            </label>
                        </div>

                        <span>Colors (Bands, Major, Minor)</span>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={formatHexForInput(currentSettings.bandsFill)}
                                onChange={handleBandsFillChange}
                                style={colorInputStyle}
                                className="sc-input"
                            />
                            <input
                                type="color"
                                value={formatHexForInput(currentSettings.majorGridColor)}
                                onChange={handleMajorGridLineColorChange}
                                style={colorInputStyle}
                                className="sc-input"
                            />
                            <input
                                type="color"
                                value={formatHexForInput(currentSettings.minorGridColor)}
                                onChange={handleMinorGridLineColorChange}
                                style={colorInputStyle}
                                className="sc-input"
                            />
                        </div>
                    </div>
                </div>
            </details>

            {/* Plane Section */}
            <details className="sc-accordion" open={expanded === "panel2"} onToggle={handlePanelToggle("panel2")}>
                <summary className="sc-accordion-summary">
                    <span>Plane Configuration</span>
                    <ExpandMoreIcon />
                </summary>
                <div className="sc-accordion-details">
                    <span>Select Plane</span>
                    <select className="sc-select" value={selectedPlane} onChange={handlePlaneChange}>
                        <option value="none">None</option>
                        <option value="xy">XY Plane</option>
                        <option value="zy">ZY Plane</option>
                        <option value="zx">ZX Plane</option>
                    </select>
                    <span>Visibility Mode</span>
                    <div className="flex flex-col gap-2">
                        <select className="sc-select" value={visibilityMode} onChange={handleVisibilityMode}>
                            <option value="auto">Auto</option>
                            <option value="negativeSide">Negative Side</option>
                            <option value="positiveSide">Positive Side</option>
                        </select>
                    </div>

                    <span className="flex flex-col">Draw Titles Mode</span>
                    <div className="flex flex-col gap-2">
                        <select className="sc-select" value={planeDrawTitlesMode} onChange={handlePlaneDrawTitlesMode}>
                            <option value={EAxisPlaneDrawLabelsMode.Both}>Both</option>
                            <option value={EAxisPlaneDrawLabelsMode.Hidden}>Hidden</option>
                            <option value={EAxisPlaneDrawLabelsMode.LocalX}>LocalX</option>
                            <option value={EAxisPlaneDrawLabelsMode.LocalY}>LocalY </option>
                        </select>
                    </div>

                    <span className="flex flex-col">Draw Labels Mode</span>
                    <div className="flex flex-col gap-2">
                        <select className="sc-select" value={planeDrawLabelsMode} onChange={handlePlaneDrawLabelsMode}>
                            <option value={EAxisPlaneDrawLabelsMode.Both}>Both</option>
                            <option value={EAxisPlaneDrawLabelsMode.Hidden}>Hidden</option>
                            <option value={EAxisPlaneDrawLabelsMode.LocalX}>LocalX</option>
                            <option value={EAxisPlaneDrawLabelsMode.LocalY}>LocalY </option>
                        </select>
                    </div>

                    <span className="flex flex-col">Is Visible</span>
                    <div className="flex flex-col gap-2">
                        <select className="sc-select" value={planeIsVisible} onChange={handlePlaneIsVisible}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                </div>
            </details>
        </>
    );

    return (
        <div
            ref={sizeRef}
            className="sc-chart-wrapper flex w-full h-full"
            style={{ flexDirection: isMobileView ? "column" : "row" }}
        >
            <SciChartReact
                style={{ flexBasis: 600, flexGrow: 1, flexShrink: 1, display: "flex", flexDirection: "column" }}
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                }}
            />
            <div style={isMobileView ? mobileContainerStyle : desktopContainerStyle}>
                {isMobileView && (
                    <button
                        className="sc-button sc-button-icon"
                        aria-label="Chart configurations"
                        title="Chart configurations"
                        onClick={handleClickOpen}
                        type="button"
                    >
                        <SettingsIcon fontSize="large" />
                    </button>
                )}
                {!isMobileView && controlPanel}
                {isMobileView && isDialogOpen && (
                    <BodyPortal>
                        <div
                            className="sc-modal-backdrop"
                            onClick={(event) => event.target === event.currentTarget && handleClose()}
                            onKeyDown={(event) => event.key === "Escape" && handleClose()}
                        >
                            <section
                                className="sc-modal"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="axis-config-title"
                            >
                                <header className="sc-modal-header">
                                    <strong id="axis-config-title">Configuration</strong>
                                    <button
                                        className="sc-button sc-button-icon"
                                        aria-label="Close configuration"
                                        onClick={handleClose}
                                        autoFocus
                                        type="button"
                                    >
                                        <CloseIcon />
                                    </button>
                                </header>
                                <div className="sc-modal-body">{controlPanel}</div>
                            </section>
                        </div>
                    </BodyPortal>
                )}
            </div>
        </div>
    );
}

const colorInputStyle = { flex: 1 };
const desktopContainerStyle: React.CSSProperties = {
    flex: "none",
    width: "300px",
    padding: "10px",
    overflowY: "auto",
    color: PANEL_TEXT_COLOR,
    fontSize: "0.8em",
};
const mobileContainerStyle: React.CSSProperties = { position: "absolute", zIndex: 2 };
