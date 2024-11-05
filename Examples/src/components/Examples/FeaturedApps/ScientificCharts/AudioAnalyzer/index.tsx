import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { SciChartGroup, SciChartReact } from "scichart-react";
import { getChartsInitializationApi } from "./drawExample";
import { appTheme } from "../../../theme";

export default function AudioAnalyzer() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationApi);
    const controlsRef = React.useRef<ReturnType<typeof chartsInitializationAPI.onAllChartsInit>>();

    return (
        <div style={{ background: appTheme.Background }} className={commonClasses.ChartWrapper}>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: appTheme.DarkIndigo,
                }}
            >
                <SciChartGroup
                    onInit={() => {
                        controlsRef.current = chartsInitializationAPI.onAllChartsInit();
                        controlsRef.current.handleStart();
                    }}
                    onDelete={() => {
                        controlsRef.current.handleStop();
                        controlsRef.current.cleanup();
                    }}
                >
                    <SciChartReact style={{ flexBasis: "50%" }} initChart={chartsInitializationAPI.initAudioChart} />
                    <div style={{ display: "flex", flex: 1 }}>
                        <SciChartReact style={{ flex: 1 }} initChart={chartsInitializationAPI.initFftChart} />
                        <SciChartReact style={{ flex: 1 }} initChart={chartsInitializationAPI.initSpectogramChart} />
                    </div>
                </SciChartGroup>
            </div>
        </div>
    );
}
