import * as React from "react";
import { makeStyles } from "tss-react/mui";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChart3DSurface, TSciChart3D, ColumnRenderableSeries3D } from "scichart";
import { drawExample, EColumn3DType, createPointMarker3D, EColumnColorMode } from "./drawExample";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Typography,
} from "@mui/material";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

const column3DTypeSelect = Object.values(EColumn3DType);
const colorModeSelect = Object.values(EColumnColorMode);

const useStyles = makeStyles()(() => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    toolbarRow: {
        display: "flex",
        justifyContent: "space-evenly",
        padding: 10,
        width: "100%",
        height: 70,
        color: appTheme.ForegroundColor,
    },
    combobox: {
        color: "black",
        backgroundColor: appTheme.Background,
        margin: "10px 20px 10px 10px",
    },
    chartArea: {
        flex: 1,
    },
}));

// REACT COMPONENT
export default function Column3DChart() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>();
    const controlsRef = React.useRef<{
        updateColors: (colorMode: EColumnColorMode) => void;
        updatePointMarker: (type: EColumn3DType) => void;
    }>();

    const [column3DType, setColumn3DType] = React.useState<EColumn3DType>(EColumn3DType.CylinderPointMarker3D);
    const [renderableSeries, setRenderableSeries] = React.useState<ColumnRenderableSeries3D>();
    const [dataPointWidth, setDataPointWidth] = React.useState<number>(1);
    const [colorMode, setColorMode] = React.useState<EColumnColorMode>(EColumnColorMode.X);

    const handleColumn3DTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = e.target.value as EColumn3DType;
        if (newValue !== column3DType) {
            setColumn3DType(newValue);
            controlsRef.current.updatePointMarker(newValue);
        }
    };

    const handleColorChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = e.target.value as EColumnColorMode;
        if (newValue !== colorMode) {
            setColorMode(newValue);
            controlsRef.current.updateColors(newValue);
        }
    };

    const handleDataPointWidthChange = (_: any, newValue: any) => {
        const newDataPointWidth = Number(newValue);
        setDataPointWidth(newDataPointWidth);
        renderableSeries.dataPointWidthX = newDataPointWidth;
        renderableSeries.dataPointWidthZ = newDataPointWidth;
    };

    const { classes } = useStyles();

    return (
        <React.Fragment>
            <div className={commonClasses.ChartWrapper}>
                <div className={classes.flexOuterContainer}>
                    <div className={classes.toolbarRow}>
                        <FormControlLabel
                            control={
                                <select
                                    className={classes.combobox}
                                    value={column3DType}
                                    onChange={handleColumn3DTypeChange}
                                >
                                    {column3DTypeSelect.map((el) => (
                                        <option key={el} value={el}>
                                            {el}
                                        </option>
                                    ))}
                                </select>
                            }
                            labelPlacement="start"
                            label="Column Shape"
                        />
                        <FormControlLabel
                            control={
                                <select className={classes.combobox} value={colorMode} onChange={handleColorChange}>
                                    {colorModeSelect.map((el) => (
                                        <option key={el} value={el}>
                                            {el}
                                        </option>
                                    ))}
                                </select>
                            }
                            labelPlacement="start"
                            label="Color Mode"
                        />
                        <div style={{ width: 200 }}>
                            <Typography variant="body1">Data-point width {dataPointWidth}</Typography>
                            <Slider
                                id="seriesCount"
                                onChange={handleDataPointWidthChange}
                                step={0.05}
                                min={0}
                                max={1}
                                value={dataPointWidth}
                                valueLabelDisplay="off"
                            />
                        </div>
                    </div>
                    <SciChartReact
                        className={classes.chartArea}
                        initChart={drawExample}
                        onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                            sciChartSurfaceRef.current = sciChartSurface;
                            controlsRef.current = controls;
                            setRenderableSeries(sciChartSurface.renderableSeries.get(0) as ColumnRenderableSeries3D);
                        }}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}
