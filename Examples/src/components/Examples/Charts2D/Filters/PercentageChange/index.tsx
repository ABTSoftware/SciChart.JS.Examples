import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@material-ui/lab";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import classes from "../../../styles/Examples.module.scss";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
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

export default function PercentageChange() {
    const [usePercentage, setUsePercentage] = React.useState(true);
    const [chartKey, setChartKey] = React.useState(0);
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    const handleUsePercentage = (event: React.MouseEvent<HTMLElement>, newValue: ToggleButtonGroupProps["value"]) => {
        if (newValue !== null) {
            setUsePercentage(newValue);
            // Force reinitialization of the chart by updating the key
            setChartKey((prevKey) => prevKey + 1);
        }
    };

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
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
                    className={classes.ChartWrapper}
                    onInit={(initResult: { sciChartSurface: SciChartSurface; wasmContext: any }) => {
                        const { sciChartSurface } = initResult;
                        sciChartSurfaceRef.current = sciChartSurface;

                        // Cleanup on unmount
                        return () => {
                            if (sciChartSurfaceRef.current) {
                                sciChartSurfaceRef.current.delete();
                            }
                        };
                    }}
                />
            </div>
        </div>
    );
}
