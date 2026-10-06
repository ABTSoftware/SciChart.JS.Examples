import "./styles.css";
import { useState, useRef } from "react";
import { getChartsInitializationApi } from "./drawExample";
import { SciChartGroup, SciChartReact, TResolvedReturnType } from "scichart-react";
import { InfoIcon, PlayArrowIcon, StopIcon } from "../../../icons";

export default function HeatmapInteractions() {
    const [chartsInitializationAPI] = useState(getChartsInitializationApi);
    const controlsRef = useRef<TResolvedReturnType<typeof chartsInitializationAPI.onAllChartsInit>>(undefined);
    const [isRunning, setIsRunning] = useState(true);
    const [selectedExample, setSelectedExample] = useState("basic");

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
                <div className="flex sc-heatmap-interaction-row" >
                    <SciChartReact
                        initChart={chartsInitializationAPI.initMainChart}
                        className="sc-heatmap-interaction-pane"
                    />
                    <SciChartReact
                        initChart={chartsInitializationAPI.initCrossSectionChart}
                        className="sc-heatmap-interaction-pane"
                    />
                </div>
                <div className="flex sc-heatmap-interaction-row" >
                    <SciChartReact
                        initChart={chartsInitializationAPI.inputChart}
                        className="sc-heatmap-interaction-pane"
                    />
                    <SciChartReact
                        initChart={chartsInitializationAPI.initHistoryChart}
                        className="sc-heatmap-interaction-pane"
                    />
                </div>
            </SciChartGroup>
        </div>
    );
}
