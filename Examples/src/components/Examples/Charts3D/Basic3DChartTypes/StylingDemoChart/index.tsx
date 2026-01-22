import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import {
    ButtonGroup,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Typography,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";

import { Dialog, DialogTitle, IconButton } from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Button from "@mui/material/Button";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { appTheme } from "../../../theme";
import { useRef, useState } from "react";
import { useViewType } from "./containerSizeHooks";
import { E3DLabelOrientationMode } from "scichart/types/TextStyle3D";
import { EAxisPlaneDrawLabelsMode } from "scichart";

const styles = {
    combobox: {
        color: "black",
        backgroundColor: appTheme.Background,
        margin: "10px 20px 10px 10px",
    },
};

const configButtonWrapperStyle: React.CSSProperties = {
    gridArea: "1 / 1 / 2 / 2",
    pointerEvents: "none",
    touchAction: "none",
    zIndex: 2,
};

// REACT COMPONENT
export default function StylingDemoChart() {
    const controlsRef = useRef(null);
    const sizeRef = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(sizeRef);
    const { isLargeView, isMobileView } = viewInfo ?? {};

    const [selectedAxis, setSelectedAxis] = useState<"x" | "y" | "z">("x");
    const [xAxisTitleOffset, setXAxisTitleOffset] = useState(10);
    const [tickLabelsOffset, setTickLabelsOffset] = useState(10);
    const [labelFontSize, setLabelFontSize] = useState(20);
    const [labelOrientationMode, setLabelOrientationMode] = useState<E3DLabelOrientationMode>(
        E3DLabelOrientationMode.Auto
    );
    const [enableMajorGridLines, setEnableMajorGridLines] = useState("false");

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const [selectedPlane, setSelectedPlane] = useState<"xy" | "zy" | "zx">("zx");
    const [visabilityMode, setVisabilityMode] = useState("auto");
    const [planeDrawTitlesMode, setPlaneDrawTitlesMode] = useState<EAxisPlaneDrawLabelsMode>(
        EAxisPlaneDrawLabelsMode.Both
    );
    const [planeDrawLabelsMode, setPlaneDrawLabelsMode] = useState<EAxisPlaneDrawLabelsMode>(
        EAxisPlaneDrawLabelsMode.Both
    );
    const [planeIsVisible, setPlaneIsVisible] = useState("true");

    const [expanded, setExpanded] = React.useState<string | false>("panel1");

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    const handleLabelFontSize = (_: any, newValue: any) => {
        setLabelFontSize(newValue);
        controlsRef.current.setAxisLabelFontSize(newValue, selectedAxis);
    };

    const handleXAxisTitleOffset = (_: any, newValue: any) => {
        setXAxisTitleOffset(newValue);
        controlsRef.current.setTitleOffset(newValue, selectedAxis);
    };

    const handleTickLabelsOffset = (_: any, newValue: any) => {
        setTickLabelsOffset(newValue);
        controlsRef.current.setTickLabelsOffset(newValue, selectedAxis);
    };

    const handlePlaneChange = (e: { target: { value: string } }) => {
        const newValue = e.target.value as "xy" | "zy" | "zx";

        controlsRef.current.setPlaneBackground(newValue);

        setSelectedPlane(newValue);
    };

    const handleVisabilityMode = (e: { target: { value: string } }) => {
        const newValue = e.target.value as string;
        setVisabilityMode(newValue);

        controlsRef.current.setVisabilityMode(selectedPlane, newValue);
    };

    const handlePlaneDrawTitlesMode = (e: { target: { value: EAxisPlaneDrawLabelsMode } }) => {
        const newValue = e.target.value;
        setPlaneDrawTitlesMode(newValue);

        controlsRef.current.setDrawTitlesMode(selectedPlane, newValue);
    };

    const handlePlaneDrawLabelsMode = (e: { target: { value: EAxisPlaneDrawLabelsMode } }) => {
        const newValue = e.target.value;
        setPlaneDrawLabelsMode(newValue);

        controlsRef.current.setDrawLabelsMode(selectedPlane, newValue);
    };

    const handlePlaneIsVisible = (e: { target: { value: string } }) => {
        const newValue = e.target.value as string;
        setPlaneIsVisible(newValue);

        controlsRef.current.setIsVisible(selectedPlane, newValue);
    };

    const handleAxisChange = (e: { target: { value: string } }) => {
        const selectedAxis = e.target.value as "x" | "y" | "z";

        setSelectedAxis(selectedAxis);
        controlsRef.current.updateAxisTitleColor(selectedAxis);

        // controlsRef.current.enableMajorGridLines(true, selectedAxis)
    };

    const handleLabelOrientationModeChange = (e: { target: { value: string } }) => {
        const newMode = e.target.value as E3DLabelOrientationMode;
        setLabelOrientationMode(newMode);
        controlsRef.current.setLabelOrientationMode(newMode, selectedAxis);
    };

    const handleEnableMajorGridLines = (e: { target: { value: string } }) => {
        const newMode = e.target.value;
        const newModeBool = e.target.value === "true";
        console.log(newMode);

        setEnableMajorGridLines(newMode);
        controlsRef.current.enableMajorGridLines(newModeBool, selectedAxis);
    };

    const controlPanel = (
        <>
            <Accordion
                defaultExpanded
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                sx={{
                    backgroundColor: appTheme.DarkIndigo,
                    color: appTheme.ForegroundColor,
                    border: `1px solid ${appTheme.Indigo}`,
                    "&:before": { display: "none" },
                    "& .MuiAccordionSummary-root": {
                        backgroundColor: appTheme.Indigo,
                        borderBottom: `1px solid ${appTheme.VividSkyBlue}22`,
                    },
                    "& .MuiAccordionDetails-root": {
                        backgroundColor: appTheme.DarkIndigo,
                    },
                }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Axis Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                            Select Axis
                        </Typography>
                        <FormControl fullWidth className={commonClasses.formControl}>
                            <Select
                                labelId="axis-label"
                                id="axis"
                                variant="standard"
                                inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                                sx={{
                                    margin: "0.5em 0em",
                                    color: "inherit",
                                    "& .MuiSvgIcon-root": { color: "inherit" },
                                }}
                                value={selectedAxis}
                                onChange={handleAxisChange}
                            >
                                <MenuItem value="x">X Axis</MenuItem>
                                <MenuItem value="y">Y Axis</MenuItem>
                                <MenuItem value="z">Z Axis</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                            Axis Font Size: {labelFontSize}
                        </Typography>
                        <Slider
                            id="labelFontSize"
                            onChange={handleLabelFontSize}
                            step={1}
                            min={10}
                            max={30}
                            value={labelFontSize}
                            valueLabelDisplay="off"
                        />

                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                            Axis Title Offset: {xAxisTitleOffset}
                        </Typography>
                        <Slider
                            id="xAxisTitleOffset"
                            onChange={handleXAxisTitleOffset}
                            step={1}
                            min={0}
                            max={100}
                            value={xAxisTitleOffset}
                            valueLabelDisplay="off"
                        />

                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                            Tick Labels Offset: {tickLabelsOffset}
                        </Typography>
                        <Slider
                            id="tickLabelsOffset"
                            onChange={handleTickLabelsOffset}
                            step={1}
                            min={0}
                            max={100}
                            value={tickLabelsOffset}
                            valueLabelDisplay="off"
                        />

                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                            Label Orientation Mode
                        </Typography>
                        <FormControl fullWidth className={commonClasses.formControl}>
                            <Select
                                labelId="label-orientation-label"
                                id="label-orientation"
                                variant="standard"
                                inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                                sx={{
                                    margin: "0.5em 0em",
                                    color: "inherit",
                                    "& .MuiSvgIcon-root": { color: "inherit" },
                                }}
                                value={labelOrientationMode}
                                onChange={handleLabelOrientationModeChange}
                            >
                                <MenuItem value={E3DLabelOrientationMode.Auto}>Auto</MenuItem>
                                <MenuItem value={E3DLabelOrientationMode.Horizontal}>Horizontal</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                            Enable Major Grid Lines
                        </Typography>
                        <FormControl fullWidth className={commonClasses.formControl}>
                            <Select
                                labelId="label-orientation-label"
                                id="label-orientation"
                                variant="standard"
                                inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                                sx={{
                                    margin: "0.5em 0em",
                                    color: "inherit",
                                    "& .MuiSvgIcon-root": { color: "inherit" },
                                }}
                                value={enableMajorGridLines}
                                onChange={handleEnableMajorGridLines}
                            >
                                <MenuItem value={"true"}>Enable</MenuItem>
                                <MenuItem value={"false"}>Disable</MenuItem>
                            </Select>
                        </FormControl>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                sx={{
                    backgroundColor: appTheme.DarkIndigo,
                    color: appTheme.ForegroundColor,
                    border: `1px solid ${appTheme.Indigo}`,
                    "&:before": { display: "none" },
                    "& .MuiAccordionSummary-root": {
                        backgroundColor: appTheme.Indigo,
                        borderBottom: `1px solid ${appTheme.VividSkyBlue}22`,
                    },
                    "& .MuiAccordionDetails-root": {
                        backgroundColor: appTheme.DarkIndigo,
                    },
                }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Plane Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                        Select Plane
                    </Typography>
                    <FormControl fullWidth className={commonClasses.formControl}>
                        <Select
                            labelId="plane-label"
                            id="plane"
                            variant="standard"
                            inputProps={{ MenuProps: { disableScrollLock: true }, "aria-label": "Without label" }}
                            sx={{
                                margin: "0.5em 0em",
                                color: "inherit",
                                "& .MuiSvgIcon-root": { color: "inherit" },
                            }}
                            value={selectedPlane}
                            onChange={handlePlaneChange}
                        >
                            <MenuItem value="xy">XY Plane</MenuItem>
                            <MenuItem value="zy">ZY Plane</MenuItem>
                            <MenuItem value="zx">ZX Plane</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="inherit" className={commonClasses.FormControlLabel}>
                        Visability Mode
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
                            value={visabilityMode}
                            onChange={handleVisabilityMode}
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

    const configurationDialog = isMobileView ? (
        <Dialog
            onClose={handleClose}
            open={isDialogOpen}
            sx={{ "& .MuiDialog-paper": { background: appTheme.DarkIndigo } }}
        >
            <DialogTitle flexDirection="row" noWrap>
                <span style={{ color: appTheme.ForegroundColor }}>Configuration</span>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        flex: "none",
                        justifySelf: "flex-end",
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <div
                style={{
                    width: "100%",
                    padding: "0px 10px 0px 10px",
                    color: appTheme.ForegroundColor,
                    fontSize: "0.8em",
                }}
            >
                {controlPanel}
            </div>
        </Dialog>
    ) : null;

    return (
        <Stack
            ref={sizeRef}
            sx={{
                width: "100%",
                height: "100%",
                background: appTheme.DarkIndigo,
            }}
            direction={isMobileView ? "column" : "row"}
        >
            <SciChartReact
                style={{ flexBasis: 600, flexGrow: 1, flexShrink: 1, display: "flex", flexDirection: "column" }}
                innerContainerProps={{ style: { flex: "auto" } }}
                initChart={drawExample}
                onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls; // Set controls object to ref
                }}
            />

            {isMobileView ? (
                <div
                    style={{ position: "absolute", pointerEvents: "none", touchAction: "none", zIndex: 2 }}
                    title="Chart Configurations"
                >
                    <IconButton
                        sx={{ color: appTheme.ForegroundColor, pointerEvents: "all", touchAction: "all" }}
                        onClick={handleClickOpen}
                    >
                        <SettingsIcon fontSize="large" />
                    </IconButton>

                    {configurationDialog}
                </div>
            ) : (
                <div
                    style={{
                        flex: "none",
                        width: "300px",
                        padding: "0px 10px 0px 10px",
                        color: appTheme.ForegroundColor,
                        fontSize: "0.8em",
                        overflowY: "auto",
                    }}
                >
                    {controlPanel}
                </div>
            )}
        </Stack>
    );
}
