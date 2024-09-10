import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import { SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

export default function DrawBehindAxes() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    const [preset, setPreset] = React.useState<number>(0);

    const handleToggleButtonChanged = (event: any, value: number) => {
        setPreset(value);
        sciChartSurfaceRef.current.drawSeriesBehindAxis = value === 0;
        sciChartSurfaceRef.current.title =
            value === 0
                ? "SciChartSurface with Series Drawn Behind Axis"
                : "SciChartSurface with Series clipped to Viewport";
        sciChartSurfaceRef.current.yAxes.get(0).axisBorder.borderLeft = value;
        sciChartSurfaceRef.current.xAxes.get(0).axisBorder.borderTop = value;
    };

    return (
        <div className={classes.ChartWrapper} style={{ background: appTheme.DarkIndigo }}>
            <SciChartReact
                initChart={drawExample}
                style={{ height: "calc(100% - 100px)", width: "100%" }}
                className={classes.ChartWrapper}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { sciChartSurface } = initResult;
                    sciChartSurfaceRef.current = sciChartSurface;
                }}
            />
            <ToggleButtonGroup
                style={{ height: "100px", padding: "10" }}
                exclusive
                value={preset}
                onChange={handleToggleButtonChanged}
                size="medium"
                color="primary"
                aria-label="small outlined button group"
            >
                <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                    Draw Series behind Axis
                </ToggleButton>
                <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                    Clip series at Viewport Edge
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
