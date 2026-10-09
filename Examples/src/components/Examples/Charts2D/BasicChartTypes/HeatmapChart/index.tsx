import { useRef, useState } from "react";
import { PlayArrowIcon, StopIcon } from "../../../icons";

import { SciChartReact, TResolvedReturnType, ChartGroupLoader } from "scichart-react";
import { drawExample, drawHeatmapLegend } from "./drawExample";

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
            <div className="relative">
                <SciChartReact
                    initChart={drawExample}
                    className="w-full h-full"
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
                    className="sc-color-legend"
                />
            </div>
        </ChartGroupLoader>
    );
}
