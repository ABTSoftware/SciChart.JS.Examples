import { useRef, useState } from "react";
import { PlayArrowIcon, StopIcon } from "../../../icons";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

export default function RealtimeGhostedTraces() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const [isStarted, setIsStarted] = useState(false);
    const [stats, setStats] = useState({ numberSeries: 0, numberPoints: 0, fps: 0 });

    return (
        <div className="sc-chart-wrapper">
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
                <div># DataPoints: {stats.numberPoints.toLocaleString()}</div>
                <div>FPS: {stats.fps.toFixed(0).padStart(2, "0")}</div>
                <div># Series: {stats.numberSeries}&nbsp;</div>
            </header>

            <SciChartReact
                initChart={drawExample}
                onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;

                    let lastRendered = Date.now();
                    sciChartSurface.rendered.subscribe(() => {
                        const currentTime = Date.now();
                        const timeDiffSeconds = new Date(currentTime - lastRendered).getTime() / 1000;
                        lastRendered = currentTime;
                        const fps = 1 / timeDiffSeconds;
                        setStats({
                            numberSeries: sciChartSurface.renderableSeries.size(),
                            numberPoints:
                                sciChartSurface.renderableSeries.size() *
                                sciChartSurface.renderableSeries.get(0).dataSeries.count(),
                            fps,
                        });
                    });

                    controls.startUpdate();
                    setIsStarted(true);
                }}
                onDelete={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controls.stopUpdate();
                }}
            />
        </div>
    );
}
