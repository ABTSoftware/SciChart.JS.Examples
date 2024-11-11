import Button from "@mui/material/Button";
import { makeStyles } from "tss-react/mui";
import * as React from "react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationApi } from "./drawExample";
import { SciChartGroup, SciChartReact, TResolvedReturnType } from "scichart-react";

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

export default function HeatmapInteractions() {
    const { classes } = useStyles();
    const [chartsInitializationAPI] = React.useState(getChartsInitializationApi);
    const controlsRef = React.useRef<TResolvedReturnType<typeof chartsInitializationAPI.onAllChartsInit>>();

    return (
        <React.Fragment>
            <div className={commonClasses.ChartWrapper}>
                <div className={classes.flexOuterContainer}>
                    <div className={commonClasses.ToolbarRow}>
                        <Button
                            disabled
                            onClick={() => {
                                controlsRef.current.stopUpdate();
                            }}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Start
                        </Button>
                        <Button
                            onClick={() => {
                                controlsRef.current.stopUpdate();
                            }}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Stop
                        </Button>
                        <Button
                            onClick={() => {
                                controlsRef.current.twoPoint();
                            }}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Load basic example
                        </Button>
                        <Button
                            onClick={() => {
                                controlsRef.current.interference();
                            }}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Load double slit example
                        </Button>
                        <Button
                            id="showHelp"
                            onClick={() => {
                                controlsRef.current.showHelp();
                            }}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Show Help
                        </Button>
                    </div>
                    <SciChartGroup
                        onInit={() => {
                            controlsRef.current = chartsInitializationAPI.onAllChartsInit();
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "row", flexBasis: 500 }}>
                            <SciChartReact
                                initChart={chartsInitializationAPI.initMainChart}
                                style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }}
                            />
                            <SciChartReact
                                initChart={chartsInitializationAPI.initCrossSectionChart}
                                style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", flexBasis: 500 }}>
                            <SciChartReact
                                initChart={chartsInitializationAPI.inputChart}
                                style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }}
                            />
                            <SciChartReact
                                initChart={chartsInitializationAPI.initHistoryChart}
                                style={{ flexBasis: 500, flexGrow: 1, flexShrink: 1 }}
                            />
                        </div>
                    </SciChartGroup>
                </div>
            </div>
        </React.Fragment>
    );
}
