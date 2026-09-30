import * as React from "react";
import { appTheme } from "../../../theme";
import { getChartsInitializationApi } from "./drawExample";
import { SciChartGroup, SciChartReact, TResolvedReturnType } from "scichart-react";
import { InfoIcon, PlayArrowIcon, StopIcon } from "../../../icons";

export default function HeatmapInteractions() {
    const [chartsInitializationAPI] = React.useState(getChartsInitializationApi);
    const controlsRef = React.useRef<TResolvedReturnType<typeof chartsInitializationAPI.onAllChartsInit>>(undefined);
    const [isRunning, setIsRunning] = React.useState(true);
    const [selectedExample, setSelectedExample] = React.useState("basic");

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <button
                    className="sc-button sc-button-icon"
                    aria-label={isRunning ? "Stop updates" : "Start updates"}
                    title={isRunning ? "Stop updates" : "Start updates"}
                    onClick={() => {
                        if (isRunning) {
                            controlsRef.current.stopUpdate();
                        } else {
                            controlsRef.current.startUpdate();
                        }
                        setIsRunning(!isRunning);
                    }}
                    type="button"
                >
                    {isRunning ? <StopIcon /> : <PlayArrowIcon />}
                </button>

                <div 
                    className="sc-button-group" 
                    role="radiogroup"
                    aria-label="Load example"
                >
                    <button
                        className="sc-button"
                        role="radio"
                        aria-checked={selectedExample === "basic"}
                        onClick={() => {
                            controlsRef.current.twoPoint();
                            setIsRunning(true);
                            setSelectedExample("basic");
                        }}
                        type="button"
                    >
                        Basic example
                    </button>
                    <button
                        className="sc-button"
                        role="radio"
                        aria-checked={selectedExample === "doubleSlit"}
                        onClick={() => {
                            controlsRef.current.interference();
                            setIsRunning(true);
                            setSelectedExample("doubleSlit");
                        }}
                        type="button"
                    >
                        Double slit example
                    </button>
                </div>
                <button
                    className="sc-button sc-button-icon"
                    id="showHelp"
                    aria-label="Show help"
                    title="Show help"
                    onClick={() => {
                        controlsRef.current.showHelp();
                    }}
                    type="button"
                >
                    <InfoIcon />
                </button>
            </header>
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
