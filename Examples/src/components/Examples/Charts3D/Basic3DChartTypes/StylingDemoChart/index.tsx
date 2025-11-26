import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, fonts } from "./drawExample";
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
} from "@mui/material";

import { Dialog, DialogTitle, IconButton } from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Button from "@mui/material/Button";

import CloseIcon from "@mui/icons-material/Close";

import { appTheme } from "../../../theme";
import { useRef, useState } from "react";
import { useViewType } from "./containerSizeHooks";

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

const pointMarkers = ["CylinderPointMarker3D", "CubePointMarker3D", "PyramidPointMarker3D", "SpherePointMarker3D"];

// REACT COMPONENT
export default function StylingDemoChart() {
    const controlsRef = useRef(null);
    const sizeRef = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(sizeRef);
    const { isLargeView, isMobileView } = viewInfo ?? {};

    const [xAxisTitleOffset, setXAxisTitleOffset] = useState(0);
    const [enableGridBands, setEnableGridBands] = useState(true);
    const [enableGridLines, setEnableGridLines] = useState(false);
    const [labelFontSize, setLabelFontSize] = useState(20);
    const [font, setFont] = useState("arial");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [pointMarker, setPointMarker] = useState("SpherePointMarker3D");

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    // const fonts = ["arial", "braahone", "allura", "antic", "coda", "forum", "kenia", "metal"];

    const handleLabelFontSize = (_: any, newValue: any) => {
        setLabelFontSize(newValue);
        controlsRef.current.setAxisLabelFontSize(newValue);
    };

    const handleXAxisTitleOffset = (_: any, newValue: any) => {
        setXAxisTitleOffset(newValue);
        controlsRef.current.setTitleOffset(newValue);
    };

    const handleFontChange = (e: { target: { value: string } }) => {
        const newValue = e.target.value as string;
        if (newValue !== font) {
            setFont(newValue);
            controlsRef.current.updateFont(newValue);
        }
    };

    const handlePointMarkerChange = (e: { target: { value: string } }) => {
        const newValue = e.target.value as string;
        if (newValue !== pointMarker) {
            setPointMarker(newValue);
            controlsRef.current.setPointMarker(newValue);
        }
    };

    const handleEnableGridBands = () => {
        controlsRef.current.enableGridBands(!enableGridBands);

        setEnableGridBands((oldValue) => {
            return !oldValue;
        });
    };

    const handleEnableGridLines = () => {
        controlsRef.current.enableMajorGridLines(!enableGridLines);

        setEnableGridLines((oldValue) => {
            return !oldValue;
        });
    };

    const configurationDialog = (
        <Dialog
            onClose={handleClose}
            open={isDialogOpen}
            sx={{ color: appTheme.ForegroundColor, "& .MuiDialog-paper": { background: appTheme.DarkIndigo } }}
        >
            <DialogTitle>
                <span style={{ color: appTheme.ForegroundColor }}>Configuration</span>
            </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: "absolute",
                    right: 0,
                    top: 0,
                    color: theme.palette.grey[500],
                })}
                size="small"
            >
                <CloseIcon />
            </IconButton>
            <List>
                <ListItem>
                    <FormControl variant="filled" sx={{ width: "250px", color: "gray" }}>
                        <InputLabel id="font-label" color="primary" sx={{ color: "#FFFFFF" }}>
                            Change Font
                        </InputLabel>
                        <Select
                            labelId="font-label"
                            id="font"
                            value={font}
                            onChange={handleFontChange}
                            sx={{ color: "#FFFFFF" }}
                            size="small"
                        >
                            {fonts.map((el) => (
                                <MenuItem key={el.name} value={el.name}>
                                    {el.name.toUpperCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl variant="filled" sx={{ width: "250px", color: "gray" }}>
                        <InputLabel id="pointMarker-label" color="primary" sx={{ color: "#FFFFFF" }}>
                            Change Point Marker
                        </InputLabel>
                        <Select
                            labelId="pointMarker-label"
                            id="pointMarker"
                            value={pointMarker}
                            onChange={handlePointMarkerChange}
                            sx={{ color: "#FFFFFF" }}
                            size="small"
                        >
                            {pointMarkers.map((el) => (
                                <MenuItem key={el} value={el}>
                                    {el}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ListItem>

                <ListItem>
                    <FormControlLabel
                        sx={{ color: "white" }}
                        control={<Checkbox checked={enableGridBands} onChange={handleEnableGridBands} size="small" />}
                        label="Show grid bands"
                        labelPlacement="start"
                    />
                </ListItem>
                <ListItem>
                    <FormControlLabel
                        sx={{ color: "white" }}
                        control={<Checkbox checked={enableGridLines} onChange={handleEnableGridLines} size="small" />}
                        label="Show grid lines"
                        labelPlacement="start"
                    />
                </ListItem>
                <ListItem sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" sx={{ color: "white" }}>
                        Axis Font Size: {labelFontSize}
                    </Typography>
                    <Slider
                        sx={{ width: "200px" }}
                        id="labelFontSize"
                        onChange={handleLabelFontSize}
                        step={1}
                        min={10}
                        max={30}
                        value={labelFontSize}
                        valueLabelDisplay="off"
                    />
                </ListItem>
                <ListItem sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" sx={{ color: "white" }}>
                        Axis Title Offset: {xAxisTitleOffset}
                    </Typography>
                    <Slider
                        sx={{ width: "200px" }}
                        id="xAxisTitleOffset"
                        onChange={handleXAxisTitleOffset}
                        step={1}
                        min={0}
                        max={100}
                        value={xAxisTitleOffset}
                        valueLabelDisplay="off"
                    />
                </ListItem>
                <ListItem disablePadding></ListItem>
            </List>
        </Dialog>
    );

    return (
        <div className={commonClasses.ChartWithToolbar} ref={sizeRef}>
            <div className={commonClasses.ToolbarRow} style={{ padding: "0 8px" }}>
                {isMobileView ? (
                    <div style={configButtonWrapperStyle} title="Chart Configurations">
                        <IconButton
                            sx={{ color: appTheme.ForegroundColor, pointerEvents: "all", touchAction: "all" }}
                            onClick={handleClickOpen}
                        >
                            <SettingsIcon fontSize="medium" />
                        </IconButton>
                        {configurationDialog}
                    </div>
                ) : (
                    <>
                        <FormControl variant="filled" sx={{ minWidth: 120, color: "gray" }}>
                            <InputLabel id="font-label" color="primary" sx={{ color: "#FFFFFF" }}>
                                Change Font
                            </InputLabel>
                            <Select
                                labelId="font-label"
                                id="font"
                                value={font}
                                onChange={handleFontChange}
                                sx={{ color: "#FFFFFF" }}
                                size="small"
                            >
                                {fonts.map((el) => (
                                    <MenuItem key={el.name} value={el.name}>
                                        {el.name.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl variant="filled" sx={{ width: "100px", color: "gray" }}>
                            <InputLabel id="pointMarker-label" color="primary" sx={{ color: "#FFFFFF" }}>
                                Change Point Marker
                            </InputLabel>
                            <Select
                                labelId="pointMarker-label"
                                id="pointMarker"
                                value={pointMarker}
                                onChange={handlePointMarkerChange}
                                sx={{ color: "#FFFFFF" }}
                                size="small"
                            >
                                {pointMarkers.map((el) => (
                                    <MenuItem key={el} value={el}>
                                        {el}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Checkbox checked={enableGridBands} onChange={handleEnableGridBands} size="small" />
                            }
                            label="Show grid bands"
                            labelPlacement="start"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox checked={enableGridLines} onChange={handleEnableGridLines} size="small" />
                            }
                            label="Show grid lines"
                            labelPlacement="start"
                        />

                        <div style={{ minWidth: 150 }}>
                            <Typography variant="body1">Axis Font Size: {labelFontSize}</Typography>
                            <Slider
                                id="labelFontSize"
                                onChange={handleLabelFontSize}
                                step={1}
                                min={10}
                                max={30}
                                value={labelFontSize}
                                valueLabelDisplay="off"
                            />
                        </div>
                        <div style={{ minWidth: 150, padding: "10px 0" }}>
                            <Typography variant="body1">Axis Title Offset: {xAxisTitleOffset}</Typography>
                            <Slider
                                id="xAxisTitleOffset"
                                onChange={handleXAxisTitleOffset}
                                step={1}
                                min={0}
                                max={100}
                                value={xAxisTitleOffset}
                                valueLabelDisplay="off"
                            />
                        </div>
                    </>
                )}
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls; // Set controlls object to ref
                }}
            />
        </div>
    );
}
