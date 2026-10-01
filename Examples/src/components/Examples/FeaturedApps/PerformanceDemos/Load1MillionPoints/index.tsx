import { RefreshIcon, PlayArrowIcon, PauseIcon } from "../../../icons";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, TTimeSpan } from "./drawExample";
import { useRef, useState } from "react";

export default function Load1MillionPointsChart() {
    const [timeSpans, setTimeSpans] = useState<TTimeSpan[]>([
        { title: "Generate 1M Data Points", durationMs: 0 },
        { title: "Append 1M Data Points", durationMs: 0 },
        { title: "Render the frame", durationMs: 0 },
    ]);
    const [isStarted, setIsStarted] = useState(false);
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(null);

    const updateTimeSpans = (newTimeSpans: TTimeSpan[]) => {
        setTimeSpans([...newTimeSpans]);
    };

    return (
        <div className="sc-chart-wrapper">
            <SciChartReact
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                    controls.subscribeToInfo(updateTimeSpans);
                    controls.startUpdate();
                    setIsStarted(true);

                    return controls.stopUpdate;
                }}
            />
            <header className="sc-toolbar-row">
                <div className="flex flex-col gap-2" role="group" aria-label="Data reload controls">
                    <button
                        className="sc-button sc-button-icon"
                        aria-label={isStarted ? "Pause updates" : "Start updates"}
                        onClick={() => {
                            if (isStarted) {
                                controlsRef.current.stopUpdate();
                            } else {
                                controlsRef.current.startUpdate();
                            }
                            setIsStarted(!isStarted);
                        }}
                        title="Toggle reload every 200 milliseconds"
                        type="button"
                    >
                        {isStarted ? <PauseIcon /> : <PlayArrowIcon />}
                    </button>
                    <button
                        className="sc-button sc-button-icon"
                        aria-label="Reload once"
                        onClick={() => {
                            controlsRef.current.reloadOnce();
                        }}
                        disabled={isStarted}
                        title="Reload Test"
                        type="button"
                    >
                        <RefreshIcon />
                    </button>
                </div>

                <div className="flex-1">
                    <h4>Performance Results</h4>
                    {timeSpans.map((ts, index) => (
                        <div key={index}>
                            {ts.title}: {ts.durationMs.toFixed(0)} ms
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
}
