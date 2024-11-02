import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import * as React from "react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationApi, IChartControls } from "./drawExample";
import { SciChartGroup, SciChartReact } from "scichart-react";

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
        color: appTheme.ForegroundColor,
    },
    chartArea: {
        flex: 1,
    },
}));

export default function HeatmapInteractions() {
    const localClasses = useStyles();
    const [chartsInitializationAPI] = React.useState(getChartsInitializationApi);
    const controlsRef = React.useRef<IChartControls>();

    return (
        <React.Fragment>
            <div className={commonClasses.ChartWrapper}>
                <div className={localClasses.flexOuterContainer}>
                    <div className={localClasses.toolbarRow}>
                        <Button
                            disabled
                            id="startAnimation"
                            onClick={() => {
                                controlsRef.current.stopAnimation();
                            }}
                            style={{ color: appTheme.ForegroundColor }}
                        >
                            Start
                        </Button>
                        <Button
                            onClick={() => {
                                controlsRef.current.stopAnimation();
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
