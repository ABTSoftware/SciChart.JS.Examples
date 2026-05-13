import React, { useContext, useState } from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { FormControlLabel, Switch } from "@mui/material";
import { appTheme } from "../../../theme";

export default function Overview() {
    return (
        <div className={commonClasses.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <SciChartReact className={commonClasses.ChartWithNestedToolbar} initChart={drawExample}>
                    <ChartHeader />
                </SciChartReact>
            </div>
        </div>
    );
}

const ChartHeader = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [useDateFns, setUseDateFns] = useState(true);

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setUseDateFns(newValue);
        initResult?.controls.setUseDateFns(newValue);
    };

    return (
        <div className={commonClasses.ToolbarRow} style={{ justifyContent: "flex-start", padding: "10px 20px" }}>
            <FormControlLabel
                control={
                    <Switch
                        checked={useDateFns}
                        onChange={handleToggle}
                        sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#FFFFFF",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                },
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#FFFFFF",
                                opacity: 0.5,
                            },
                        }}
                    />
                }
                label='Use "date-fns" for X-Axis format'
                sx={{
                    color: "#FFFFFF",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                }}
            />
        </div>
    );
};
