import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { makeStyles } from "tss-react/mui";
import { SciChartSurface, StackedMountainCollection } from "scichart";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedMountainChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);
    const stackedMountainCollectionRef = React.useRef<StackedMountainCollection>(undefined);
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            // Toggle 100% mode on click
            stackedMountainCollectionRef.current.isOneHundredPercent = value;
            sciChartSurfaceRef.current.zoomExtents(200);
        }
    };

    const { classes } = useStyles();
    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                {/* <ToggleButtonGroup
                    className={commonClasses.ToolbarRow}
                    exclusive
                    value={use100PercentStackedMode}
                    onChange={handleUsePercentage}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                        Stacked mode
                    </ToggleButton>
                    <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                        100% Stacked mode
                    </ToggleButton>
                </ToggleButtonGroup> */}
                <div className={commonClasses.ToolbarRow}>
                    <FormControlLabel
                        control={<Switch value={use100PercentStackedMode} onChange={handleUsePercentage} />}
                        label="100%&nbsp;Mode"
                        style={{ margin: 0, padding: "1em" }}
                    />
                </div>
                <SciChartReact
                    initChart={drawExample}
                    className={classes.chartArea}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { sciChartSurface, stackedMountainCollection } = initResult;
                        stackedMountainCollectionRef.current = stackedMountainCollection;
                        sciChartSurfaceRef.current = sciChartSurface;
                    }}
                />
            </div>
        </div>
    );
}
