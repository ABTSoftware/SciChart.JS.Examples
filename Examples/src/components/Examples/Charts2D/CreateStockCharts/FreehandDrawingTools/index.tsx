import * as React from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Slider, ToggleButton } from "@mui/material";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { drawExample, TFreehandVariant } from "./drawExample";

const variants: Array<{ value: TFreehandVariant; label: string }> = [
    { value: "editableOutline", label: "Editable outline" },
    { value: "nonEditableLine", label: "Noneditable line" },
    { value: "thickHighlight", label: "Thick highlight" },
    { value: "locked", label: "Locked 1:1" },
];

export default function FreehandDrawingTools() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const [variant, setVariant] = React.useState<TFreehandVariant>("editableOutline");
    const [keepDrawing, setKeepDrawing] = React.useState(true);
    const [pointSamplingDistancePx, setPointSamplingDistancePx] = React.useState(1.2);
    const [simplifyTolerancePx, setSimplifyTolerancePx] = React.useState(0.8);

    React.useEffect(() => {
        controlsRef.current?.setKeepDrawingAfterComplete(keepDrawing);
    }, [keepDrawing]);

    React.useEffect(() => {
        controlsRef.current?.setSampling(pointSamplingDistancePx, simplifyTolerancePx, 6000);
    }, [pointSamplingDistancePx, simplifyTolerancePx]);

    const startDrawing = (nextVariant = variant) => controlsRef.current?.startDrawing(nextVariant);

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow} style={{ gap: 8, alignItems: "center" }}>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="freehand-variant-label" sx={{ color: appTheme.VividGreen }}>
                        Variant
                    </InputLabel>
                    <Select
                        labelId="freehand-variant-label"
                        label="Variant"
                        value={variant}
                        onChange={(event) => {
                            const nextVariant = event.target.value as TFreehandVariant;
                            setVariant(nextVariant);
                            startDrawing(nextVariant);
                        }}
                        sx={{ color: "inherit", "& .MuiSvgIcon-root": { color: "inherit" } }}
                        inputProps={{ MenuProps: { disableScrollLock: true } }}
                    >
                        {variants.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                                {item.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={() => startDrawing()}>
                    Draw
                </Button>
                <Button variant="outlined" onClick={() => controlsRef.current?.stopDrawing()}>
                    Cancel
                </Button>

                <div style={{ width: 150, display: "grid", gap: 2 }}>
                    <span style={{ fontSize: 12, color: appTheme.ForegroundColor }}>
                        Point spacing: {pointSamplingDistancePx.toFixed(1)} px
                    </span>
                    <Slider
                        size="small"
                        min={0.2}
                        max={5}
                        step={0.1}
                        value={pointSamplingDistancePx}
                        onChange={(event, value) => setPointSamplingDistancePx(value as number)}
                    />
                </div>

                <div style={{ width: 150, display: "grid", gap: 2 }}>
                    <span style={{ fontSize: 12, color: appTheme.ForegroundColor }}>
                        Simplify: {simplifyTolerancePx.toFixed(1)} px
                    </span>
                    <Slider
                        size="small"
                        min={0}
                        max={4}
                        step={0.1}
                        value={simplifyTolerancePx}
                        onChange={(event, value) => setSimplifyTolerancePx(value as number)}
                    />
                </div>

                <ToggleButton
                    size="small"
                    color="primary"
                    value="keep"
                    selected={keepDrawing}
                    onClick={() => setKeepDrawing((value) => !value)}
                >
                    Keep Drawing
                </ToggleButton>

                <Button variant="outlined" onClick={() => controlsRef.current?.clear()}>
                    Clear
                </Button>
            </div>

            <SciChartReact
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                    result.setKeepDrawingAfterComplete(keepDrawing);
                    result.setSampling(pointSamplingDistancePx, simplifyTolerancePx, 6000);
                }}
            />
        </div>
    );
}
