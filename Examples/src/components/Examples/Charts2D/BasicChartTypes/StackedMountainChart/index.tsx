import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { SciChartSurface, StackedMountainCollection } from "scichart";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

const useStyles = makeStyles((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedMountainChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const stackedMountainCollectionRef = React.useRef<StackedMountainCollection>();
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

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
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
                </ToggleButtonGroup>
                <SciChartReact
                    initChart={drawExample}
                    className={localClasses.chartArea}
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
