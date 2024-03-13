import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { appTheme } from "scichart-example-dependencies";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { HIT_TEST, HIT_TEST_DATAPOINT, HIT_TEST_X_SLICE, drawExample } from "./drawExample";

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

export default function ChartComponent() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>();

    const [preset, setPreset] = React.useState<string>(HIT_TEST_DATAPOINT);

    const handlePreset = (event: any, value: string) => {
        // When user clicks a togglebutton, update state
        if (value) {
            console.log("ToggleButton changed " + value);
            setPreset(value);
            controlsRef.current.updateHitTestMethod(value);
        }
    };

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
                    exclusive
                    value={preset}
                    onChange={handlePreset}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={HIT_TEST_DATAPOINT} style={{ color: appTheme.ForegroundColor }}>
                        Hit-Test Datapoint
                    </ToggleButton>
                    <ToggleButton value={HIT_TEST_X_SLICE} style={{ color: appTheme.ForegroundColor }}>
                        Hit-Test X-Slice
                    </ToggleButton>
                    <ToggleButton value={HIT_TEST} style={{ color: appTheme.ForegroundColor }}>
                        Hit-Test Series Body
                    </ToggleButton>
                </ToggleButtonGroup>
                <SciChartReact
                    className={localClasses.chartArea}
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = initResult.controls;
                    }}
                />
            </div>
        </div>
    );
}
