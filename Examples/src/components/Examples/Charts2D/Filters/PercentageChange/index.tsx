import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material";
import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

export default function PercentageChange() {
    const [usePercentage, setUsePercentage] = React.useState(true);
    const [chartKey, setChartKey] = React.useState(0);
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);

    const handleUsePercentage = (event: React.MouseEvent<HTMLElement>, newValue: ToggleButtonGroupProps["value"]) => {
        if (newValue !== null) {
            setUsePercentage(newValue);
            // Force reinitialization of the chart by updating the key
            setChartKey((prevKey) => prevKey + 1);
        }
    };

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <ToggleButtonGroup
                className={commonClasses.ToolbarRow}
                exclusive
                value={usePercentage}
                onChange={handleUsePercentage}
                size="small"
                color="primary"
                aria-label="small outlined button group"
            >
                <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                    Percentage Change
                </ToggleButton>
                <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                    Original Data
                </ToggleButton>
            </ToggleButtonGroup>
            {/* // Usage in SciChartReact */}
            <SciChartReact
                key={chartKey} // Change the key to force re-render
                initChart={(rootElement) => drawExample(rootElement, usePercentage)}
                className={commonClasses.ChartWrapper}
            />
        </div>
    );
}
