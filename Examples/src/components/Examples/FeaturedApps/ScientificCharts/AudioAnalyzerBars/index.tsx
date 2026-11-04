import { useState, useRef } from "react";
import { SciChartGroup, SciChartReact } from "scichart-react";
import { getChartsInitializationApi } from "./drawExample";

export default function AudioAnalyzer() {
    const [chartsInitializationAPI] = useState(getChartsInitializationApi);
    const controlsRef = useRef<ReturnType<typeof chartsInitializationAPI.onAllChartsInit>>(undefined);

    return (
        <div className="sc-chart-wrapper flex flex-col">
            <SciChartGroup
                onInit={() => {
                    controlsRef.current = chartsInitializationAPI.onAllChartsInit();
                    controlsRef.current.startUpdate();
                }}
                onDelete={() => {
                    controlsRef.current.stopUpdate();
                    controlsRef.current.cleanup();
                }}
            >
                <SciChartReact
                    style={{ flexBasis: "15%" }}
                    initChart={chartsInitializationAPI.initAudioChart}
                />

                <div className="flex flex-1">
                    <SciChartReact
                        className="flex-1"
                        initChart={chartsInitializationAPI.initFftChart}
                    />
                </div>
            </SciChartGroup>
        </div>
    );
}
