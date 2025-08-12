import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import { useContext } from "react";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function DynamicLayout() {
    return (
        <SciChartReact className={commonClasses.ChartWithNestedToolbar} initChart={drawExample}>
            <ChartToolbar />
        </SciChartReact>
    );
}

const ChartToolbar = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [isGrid, setIsGrid] = React.useState<boolean>(false);

    const handleToggleButtonChanged = (event: any, value: boolean) => {
        initResult.setIsGridLayoutMode(value);
        setIsGrid(value);
    };
    return (
        <ToggleButtonGroup
            className={commonClasses.ToolbarRow}
            style={{ order: 1 }}
            exclusive
            value={isGrid}
            onChange={handleToggleButtonChanged}
            size="medium"
            color="primary"
            aria-label="small outlined button group"
        >
            <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                Single Chart
            </ToggleButton>
            <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                Chart Per Series
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
