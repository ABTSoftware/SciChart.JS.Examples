import Button from "@mui/material/Button";
import * as React from "react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { getChartsInitializationApi } from "./drawExample";
import { SciChartGroup, SciChartReact, TResolvedReturnType } from "scichart-react";

export default function HeatmapInteractions() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationApi);
    const controlsRef = React.useRef<TResolvedReturnType<typeof chartsInitializationAPI.onAllChartsInit>>(undefined);

    return (
        <div className={commonClasses.ChartWithToolbar}>
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
    );
}
