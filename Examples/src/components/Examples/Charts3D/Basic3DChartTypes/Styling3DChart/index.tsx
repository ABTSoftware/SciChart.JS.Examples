import { useRef, useState } from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, TAxis, TSelectedAxisPlane } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import {
    FormControl,
    MenuItem,
    Select,
    Slider,
    Typography,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    IconButton,
    FormControlLabel,
    Switch,
    SelectChangeEvent,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { appTheme } from "../../../theme";
import { useViewType } from "./containerSizeHooks";
import { EAxisPlaneDrawLabelsMode, EThemeProviderType, E3DLabelOrientationMode } from "scichart";

const selectStyle = {
    margin: "0.5em 0em",
    color: "inherit",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    paddingLeft: "10px",
    "& .MuiSvgIcon-root": { color: "inherit" },
    "&:before": { display: "none" },
    "&:after": { display: "none" },
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
};

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

    const [themeName, setThemeName] = useState<EThemeProviderType>(EThemeProviderType.Navy);
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

    // Helper to ensure color strings are valid for <input type="color">
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

    const handleChange = (panel: string) => (_: any, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClickOpen = () => setIsDialogOpen(true);
    const handleClose = () => setIsDialogOpen(false);

    // 2. Fixed: Added optional chaining (?.current) to all control calls
    const handleLabelFontSize = (_: any, newValue: number | number[]) => {
        updateAxisSetting("fontSize", newValue);
        controlsRef.current?.setAxisLabelFontSize(newValue, selectedAxis);
    };

    const handleTitleOffset = (_: any, newValue: number | number[]) => {
        updateAxisSetting("titleOffset", newValue);
        controlsRef.current?.setTitleOffset(newValue, selectedAxis);
    };

    const handleTickLabelsOffset = (_: any, newValue: number | number[]) => {
        updateAxisSetting("tickLabelsOffset", newValue);
        controlsRef.current?.setTickLabelsOffset(newValue, selectedAxis);
    };

    const handleLabelOrientationModeChange = (e: SelectChangeEvent<E3DLabelOrientationMode>) => {
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

    const handleAxisChange = (e: SelectChangeEvent<TAxis>) => {
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
    const handlePlaneChange = (e: SelectChangeEvent<TSelectedAxisPlane>) => {
        const newValue = e.target.value as TSelectedAxisPlane;
        setSelectedPlane(newValue);
        controlsRef.current?.setPlaneBackground(newValue);
    };

    const handleVisibilityMode = (e: SelectChangeEvent<string>) => {
        const newValue = e.target.value;
        setVisibilityMode(newValue);
        controlsRef.current?.setVisibilityMode(selectedPlane, newValue);
    };

    const handlePlaneDrawTitlesMode = (e: SelectChangeEvent<EAxisPlaneDrawLabelsMode>) => {
        const newValue = e.target.value as EAxisPlaneDrawLabelsMode;
        setPlaneDrawTitlesMode(newValue);
        controlsRef.current?.setDrawTitlesMode(selectedPlane, newValue);
    };

    const handlePlaneDrawLabelsMode = (e: SelectChangeEvent<EAxisPlaneDrawLabelsMode>) => {
        const newValue = e.target.value as EAxisPlaneDrawLabelsMode;
        setPlaneDrawLabelsMode(newValue);
        controlsRef.current?.setDrawLabelsMode(selectedPlane, newValue);
    };

    const handlePlaneIsVisible = (e: SelectChangeEvent<string>) => {
        const newValue = e.target.value;
        setPlaneIsVisible(newValue);
        controlsRef.current?.setIsPlaneVisible(selectedPlane, newValue);
    };

    const handleThemeChange = (e: SelectChangeEvent<EThemeProviderType>) => {
        const newTheme = e.target.value as EThemeProviderType;
        setThemeName(newTheme);
        controlsRef.current?.setTheme(newTheme);
    };

    const currentSettings = axisSettings[selectedAxis];

    const controlPanel = (
        <>
            {/* Theme Section */}
            {/* <Accordion expanded={expanded === "panel0"} onChange={handleChange("panel0")} sx={accordionStyle}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Surface Config</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>Select Theme</Typography>
                        <Select variant="standard" sx={selectStyle} value={themeName} onChange={handleThemeChange}>
                            <MenuItem value={EThemeProviderType.Navy}>Navy</MenuItem>
                            <MenuItem value={EThemeProviderType.Light}>Light</MenuItem>
                            <MenuItem value={EThemeProviderType.Dark}>Dark</MenuItem>
                            <MenuItem value={EThemeProviderType.DarkV2}>DarkV2</MenuItem>
                        </Select>
                    </FormControl>
                </AccordionDetails>
            </Accordion> */}

            {/* Axis Section */}
            <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")} sx={accordionStyle}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Axis Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                            Select Axis
                        </Typography>
                        <Select variant="standard" sx={selectStyle} value={selectedAxis} onChange={handleAxisChange}>
                            <MenuItem value="x">X Axis</MenuItem>
                            <MenuItem value="y">Y Axis</MenuItem>
                            <MenuItem value="z">Z Axis</MenuItem>
                        </Select>

                        <Typography variant="inherit" sx={{ mt: 2 }}>
                            Axis Font Size: {currentSettings.fontSize}
                        </Typography>
                        <Slider
                            step={1}
                            min={10}
                            max={30}
                            value={currentSettings.fontSize}
                            onChange={handleLabelFontSize}
                        />

                        <Typography variant="inherit">Axis Title Offset: {currentSettings.titleOffset}</Typography>
                        <Slider
                            step={1}
                            min={0}
                            max={100}
                            value={currentSettings.titleOffset}
                            onChange={handleTitleOffset}
                        />

                        <Typography variant="inherit">
                            Tick Labels Offset: {currentSettings.tickLabelsOffset}
                        </Typography>
                        <Slider
                            step={1}
                            min={0}
                            max={100}
                            value={currentSettings.tickLabelsOffset}
                            onChange={handleTickLabelsOffset}
                        />

                        <Typography variant="inherit">Label Orientation Mode</Typography>
                        <Select
                            variant="standard"
                            sx={selectStyle}
                            value={currentSettings.labelOrientation}
                            onChange={handleLabelOrientationModeChange}
                        >
                            <MenuItem value={E3DLabelOrientationMode.Auto}>Auto</MenuItem>
                            <MenuItem value={E3DLabelOrientationMode.Horizontal}>Horizontal</MenuItem>
                        </Select>

                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentSettings.majorGridLines}
                                        onChange={handleEnableMajorGridLines}
                                    />
                                }
                                label="Major Grid"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentSettings.minorGridLines}
                                        onChange={handleEnableMinorGridLines}
                                    />
                                }
                                label="Minor Grid"
                            />
                        </Stack>

                        <Typography variant="inherit" sx={{ mt: 2 }}>
                            Colors (Bands, Major, Minor)
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <input
                                type="color"
                                value={formatHexForInput(currentSettings.bandsFill)}
                                onChange={handleBandsFillChange}
                                style={colorInputStyle}
                            />
                            <input
                                type="color"
                                value={formatHexForInput(currentSettings.majorGridColor)}
                                onChange={handleMajorGridLineColorChange}
                                style={colorInputStyle}
                            />
                            <input
                                type="color"
                                value={formatHexForInput(currentSettings.minorGridColor)}
                                onChange={handleMinorGridLineColorChange}
                                style={colorInputStyle}
                            />
                        </Stack>
                    </FormControl>
                </AccordionDetails>
            </Accordion>

            {/* Plane Section */}
            <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")} sx={accordionStyle}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Plane Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="inherit">Select Plane</Typography>
                    <Select
                        fullWidth
                        variant="standard"
                        sx={selectStyle}
                        value={selectedPlane}
                        onChange={handlePlaneChange}
                    >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="xy">XY Plane</MenuItem>
                        <MenuItem value="zy">ZY Plane</MenuItem>
                        <MenuItem value="zx">ZX Plane</MenuItem>
                    </Select>
                    <Typography variant="inherit">Visability Mode</Typography>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Select
                            labelId="font-label"
                            id="font"
                            variant="standard"
                            inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                            sx={{
                                margin: "0.5em 0em",
                                color: "inherit",
                                "& .MuiSvgIcon-root": { color: "inherit" },
                            }}
                            value={visibilityMode}
                            onChange={handleVisibilityMode}
                        >
                            <MenuItem value="auto">Auto</MenuItem>
                            <MenuItem value="negativeSide">Negative Side</MenuItem>
                            <MenuItem value="positiveSide">Positive Side</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                        Draw Titles Mode
                    </Typography>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Select
                            labelId="font-label"
                            id="font"
                            variant="standard"
                            inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                            sx={{
                                margin: "0.5em 0em",
                                color: "inherit",
                                "& .MuiSvgIcon-root": { color: "inherit" },
                            }}
                            value={planeDrawTitlesMode}
                            onChange={handlePlaneDrawTitlesMode}
                        >
                            <MenuItem value={EAxisPlaneDrawLabelsMode.Both}>Both</MenuItem>
                            <MenuItem value={EAxisPlaneDrawLabelsMode.Hidden}>Hidden</MenuItem>
                            <MenuItem value={EAxisPlaneDrawLabelsMode.LocalX}>LocalX</MenuItem>
                            <MenuItem value={EAxisPlaneDrawLabelsMode.LocalY}>LocalY </MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                        Draw Lables Mode
                    </Typography>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Select
                            labelId="font-label"
                            id="font"
                            variant="standard"
                            inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                            sx={{
                                margin: "0.5em 0em",
                                color: "inherit",
                                "& .MuiSvgIcon-root": { color: "inherit" },
                            }}
                            value={planeDrawLabelsMode}
                            onChange={handlePlaneDrawLabelsMode}
                        >
                            <MenuItem value={EAxisPlaneDrawLabelsMode.Both}>Both</MenuItem>
                            <MenuItem value={EAxisPlaneDrawLabelsMode.Hidden}>Hidden</MenuItem>
                            <MenuItem value={EAxisPlaneDrawLabelsMode.LocalX}>LocalX</MenuItem>
                            <MenuItem value={EAxisPlaneDrawLabelsMode.LocalY}>LocalY </MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                        Is Visible
                    </Typography>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Select
                            labelId="font-label"
                            id="font"
                            variant="standard"
                            inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                            sx={{
                                margin: "0.5em 0em",
                                color: "inherit",
                                "& .MuiSvgIcon-root": { color: "inherit" },
                            }}
                            value={planeIsVisible}
                            onChange={handlePlaneIsVisible}
                        >
                            <MenuItem value="true">True</MenuItem>
                            <MenuItem value="false">False</MenuItem>
                        </Select>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </>
    );

    return (
        <Stack
            ref={sizeRef}
            sx={{ width: "100%", height: "100%", background: appTheme.DarkIndigo }}
            direction={isMobileView ? "column" : "row"}
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
                    <IconButton onClick={handleClickOpen} sx={{ color: appTheme.ForegroundColor }}>
                        <SettingsIcon fontSize="large" />
                    </IconButton>
                )}
                {!isMobileView && controlPanel}
                {isMobileView && (
                    <Dialog
                        open={isDialogOpen}
                        onClose={handleClose}
                        sx={{ "& .MuiDialog-paper": { background: appTheme.DarkIndigo } }}
                    >
                        <DialogTitle
                            sx={{
                                color: appTheme.ForegroundColor,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            Configuration
                            <IconButton onClick={handleClose} sx={{ color: "grey.500" }}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <div style={{ padding: "10px", color: appTheme.ForegroundColor }}>{controlPanel}</div>
                    </Dialog>
                )}
            </div>
        </Stack>
    );
}

const accordionStyle = {
    backgroundColor: appTheme.DarkIndigo,
    color: appTheme.ForegroundColor,
    border: `1px solid ${appTheme.Indigo}`,
    "&:before": { display: "none" },
    "& .MuiAccordionSummary-root": {
        backgroundColor: appTheme.Indigo,
        borderBottom: `1px solid ${appTheme.VividSkyBlue}22`,
    },
    "& .MuiAccordionDetails-root": { backgroundColor: appTheme.DarkIndigo },
};

const colorInputStyle = { flex: 1, height: "30px", border: "none", borderRadius: "4px", cursor: "pointer" };
const desktopContainerStyle: React.CSSProperties = {
    flex: "none",
    width: "300px",
    padding: "0 10px",
    overflowY: "auto",
    color: appTheme.ForegroundColor,
    fontSize: "0.8em",
};
const mobileContainerStyle: React.CSSProperties = { position: "absolute", zIndex: 2 };
