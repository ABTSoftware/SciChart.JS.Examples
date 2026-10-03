import { useRef, useState } from "react";
import { PlayArrowIcon, StopIcon } from "../../../icons";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function RealtimePerformanceDemo() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const [isStarted, setIsStarted] = useState(false);
    const [stats, setStats] = useState({ numberPoints: 0, fps: 0 });

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
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

                <span className="monospace"># DataPoints: {stats.numberPoints.toLocaleString()}</span>

                <span className="monospace">FPS:&nbsp;{stats.fps.toFixed(0).padStart(2, "0")}&nbsp;</span>
            </header>

            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = initResult.controls;
                    initResult.controls.setStatsChangedCallback((stats) => setStats(stats));
                    initResult.controls.startUpdate();
                    setIsStarted(true);
                }}
                onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.stopUpdate();
                }}
            />
        </div>
    );
}
