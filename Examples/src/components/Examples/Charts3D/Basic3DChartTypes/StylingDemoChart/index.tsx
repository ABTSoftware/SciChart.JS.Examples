import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, drawHeatmapLegend } from "./drawExample";
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

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Button from "@mui/material/Button";

import CloseIcon from "@mui/icons-material/Close";

import { appTheme } from "../../../theme";
import { useRef, useState } from "react";

const styles = {
    combobox: {
        color: "black",
        backgroundColor: appTheme.Background,
        margin: "10px 20px 10px 10px",
    },
};

// REACT COMPONENT
export default function StylingDemoChart() {
    const controlsRef = useRef(null);

    const [cameraPositionX, setCameraPositionX] = useState(-141.6);
    const [xAxisTitleOffset, setXAxisTitleOffset] = useState(0);
    const [enableGridBands, setEnableGridBands] = useState(true);
    const [enableGridLines, setEnableGridLines] = useState(false);
    const [labelFontSize, setLabelFontSize] = useState(20);
    const [font, setFont] = useState("arial");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };
    
    const fonts = ["arial", "braahone", "allura"];

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


    // const configurationDialog = (
    //     <Dialog
    //         onClose={handleClose}
    //         open={isDialogOpen}
    //         sx={{ color: appTheme.ForegroundColor, "& .MuiDialog-paper": { background: appTheme.DarkIndigo } }}
    //     >
    //         <DialogTitle>
    //             <span style={{ color: appTheme.ForegroundColor }}>Chart Configurations</span>
    //             <IconButton
    //                 aria-label="close"
    //                 onClick={handleClose}
    //                 sx={(theme) => ({
    //                     position: "absolute",
    //                     right: 8,
    //                     top: 8,
    //                     color: theme.palette.grey[500],
    //                 })}
    //             >
    //                 <CloseIcon />
    //             </IconButton>
    //         </DialogTitle>
    //         <List>
    //             <Typography
    //                 variant="subtitle2"
    //                 fontWeight={"bold"}
    //                 sx={{ color: appTheme.ForegroundColor, padding: "0em 1em" }}
    //             >
    //                 Main Chart
    //             </Typography>

    //             <ListItem disablePadding>
    //                 <FormControlLabel
    //                     control={<Switch checked={isVisibleRangeSynced} onChange={handleSyncVisibleRangeChange} />}
    //                     label="Sync&nbsp;X-Axis&nbsp;visible&nbsp;range"
    //                     sx={switchStyleOverrides}
    //                 />
    //             </ListItem>
    //             <Typography
    //                 variant="subtitle2"
    //                 fontWeight={"bold"}
    //                 sx={{ color: appTheme.ForegroundColor, padding: "0em 1em" }}
    //             >
    //                 URL Statistics Chart
    //             </Typography>
    //             <ListItem disablePadding>
    //                 <FormControlLabel
    //                     control={<Switch checked={isHundredPercentCollection} onChange={handleUsePercentage} />}
    //                     label="is&nbsp;100%&nbsp;collection"
    //                     sx={switchStyleOverrides}
    //                 />
    //             </ListItem>
    //             <Typography
    //                 variant="subtitle2"
    //                 fontWeight={"bold"}
    //                 sx={{ color: appTheme.ForegroundColor, padding: "0em 1em" }}
    //             >
    //                 Server Load Statistics Chart
    //             </Typography>
    //             <ListItem disablePadding>
    //                 <FormControlLabel
    //                     control={<Switch checked={isGridLayout} onChange={handleUseGridLayout} />}
    //                     label="is&nbsp;Grid&nbsp;Layout"
    //                     sx={switchStyleOverrides}
    //                 />
    //             </ListItem>
    //         </List>
    //     </Dialog>
    // );


    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow} style={{ padding: "0 8px" }}>
                {/* <FormControlLabel
                    control={
                        <select style={styles.combobox} value={font} onChange={handleFontChange}>
                            {fonts.map((el) => (
                                <option key={el} value={el}>
                                    {el}
                                </option>
                            ))}
                        </select>
                    }
                    labelPlacement="top"
                    label="Change Font"
                /> */}

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
                            <MenuItem key={el} value={el}>
                                {el.toUpperCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* <Button size="small" variant="text" onClick={handleEnableGridBands}>
                    {enableGridBands ? "Hide grid bands" : "Show grid bands"}
                </Button> */}

                <FormControlLabel
                    control={<Checkbox checked={enableGridBands} onChange={handleEnableGridBands} size="small" />}
                    label="Show grid bands"
                    labelPlacement="start"
                />

                <FormControlLabel
                    control={<Checkbox checked={enableGridLines} onChange={handleEnableGridLines} size="small" />}
                    label="Show grid lines"
                    labelPlacement="start"
                />

                <div style={{ width: 150 }}>
                    <Typography variant="body1">Axis Font Size</Typography>
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
                <div style={{ width: 150, padding: "10px 0" }}>
                    <Typography variant="body1">Axis Title Offset</Typography>
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
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls; // Call controls function if needed
                    // sciChartSurfaceRef.current = sciChartSurface;
                    // controlsRef.current = controls;
                    // setRenderableSeries(sciChartSurface.renderableSeries.get(0) as ColumnRenderableSeries3D);
                }}
            />
        </div>
    );
}
