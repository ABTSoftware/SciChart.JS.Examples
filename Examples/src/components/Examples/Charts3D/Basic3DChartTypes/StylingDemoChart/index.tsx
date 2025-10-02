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

import Button from "@mui/material/Button";

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
