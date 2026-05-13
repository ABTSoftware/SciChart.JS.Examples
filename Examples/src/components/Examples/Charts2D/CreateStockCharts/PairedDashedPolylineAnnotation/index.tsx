import * as React from "react";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

export default function PairedDashedPolylineAnnotation() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample> | undefined>(undefined);
    const [pointCount, setPointCount] = React.useState(6);
    const promptForPointCount = React.useCallback(() => {
        const value = window.prompt("How many points should the custom polyline have?", `${pointCount}`);
        if (!value) return;
        const nextPointCount = Math.max(4, Math.min(12, Math.floor(Number(value))));
        if (!Number.isFinite(nextPointCount)) return;
        setPointCount(nextPointCount);
        controlsRef.current?.startPlacement(nextPointCount);
    }, [pointCount]);

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                <FormControl size="small" sx={{ width: 112 }}>
                    <Select
                        value={pointCount}
                        onChange={(event) => setPointCount(Number(event.target.value))}
                        sx={{ color: "inherit", "& .MuiSvgIcon-root": { color: "inherit" } }}
                        inputProps={{ MenuProps: { disableScrollLock: true } }}
                    >
                        {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                            <MenuItem key={count} value={count}>
                                {count} points
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={promptForPointCount}>
                    Place Custom Polyline
                </Button>
                <Button variant="outlined" onClick={() => controlsRef.current?.stopPlacement()}>
                    Cancel
                </Button>
                <Button variant="outlined" onClick={() => controlsRef.current?.togglePairConnectors()}>
                    Toggle Pair Connectors
                </Button>
                <Button variant="outlined" onClick={() => controlsRef.current?.reset()}>
                    Reset
                </Button>
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={(result: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = result;
                }}
            />
        </div>
    );
}
