import { useRef, useState } from "react";
import { PlayArrowIcon, StopIcon } from "../../../icons";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import { drawExample, drawHeatmapLegend } from "./drawExample";
import { ChartGroupLoader } from "scichart-react";

// Styles for layout of the toolbar / chart area

export default function HeatmapChart() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [isStarted, setIsStarted] = useState(false);
    const [stats, setStats] = useState({ xSize: 0, ySize: 0, fps: 0 });

    return (
        <ChartGroupLoader className="sc-chart-wrapper">
            <header className="sc-toolbar-row monospace">
                <button
                    className="sc-button sc-button-icon"
                    aria-label={isStarted ? "Pause updates" : "Start updates"}
                    title={isStarted ? "Pause updates" : "Start updates"}
                    onClick={() => {
                        if (isStarted) {
                            controlsRef.current.stopUpdate();
                        } else {
                            controlsRef.current.startUpdate();
                        }
                        setIsStarted(!isStarted);
                    }}
                    type="button"
                >
                    {isStarted ? <StopIcon /> : <PlayArrowIcon />}
                </button>

                <div># Heatmap Size: {stats.xSize} x {stats.ySize}</div>

                <div>FPS: {stats.fps.toFixed(0).padStart(2, "0")}&nbsp;</div>
            </header>
            <div style={{ position: "relative" }}>
                <SciChartReact
                    initChart={drawExample}
                    style={{ width: "100%", height: "100%" }}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { subscribeToRenderStats, controls } = initResult;
                        controlsRef.current = controls;

                        subscribeToRenderStats((stats) => setStats(stats));

                        // Start the demo
                        controls.startUpdate();
                        setIsStarted(true);

                        // Cleanup function
                        return () => {
                            controls.stopUpdate();
                        };
                    }}
                />
                <SciChartReact
                    initChart={drawHeatmapLegend}
                    style={{
                        position: "absolute",
                        height: "100%",
                        width: "65px",
                        top: "0px",
                        right: "0px",
                    }}
                />
            </div>
        </ChartGroupLoader>
    );
}
