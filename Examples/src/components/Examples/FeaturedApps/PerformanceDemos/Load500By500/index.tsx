import * as React from "react";
import { useRef } from "react";
import { RefreshIcon, PlayArrowIcon, PauseIcon } from "../../../icons";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample, TTimeSpan } from "./drawExample";
import { useViewType } from "../../../containerSizeHooks";

export default function Load500By500() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(null);
    const [timeSpans, setTimeSpans] = React.useState<TTimeSpan[]>([
        { title: "Generate Data Points", durationMs: 0 },
        { title: "Append Data Points", durationMs: 0 },
        { title: "Render the frame", durationMs: 0 },
    ]);
    const [isStarted, setIsStarted] = React.useState(false);

    const viewRef = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(viewRef);
    const { isMobileView } = viewInfo ?? {};

    return (
        <div ref={viewRef} className="sc-chart-wrapper">
            {viewInfo ? (
                <>
                    <SciChartReact
                        style={{ flex: 1 }}
                        initChart={(rootElement: string | HTMLDivElement) =>
                            drawExample(
                                rootElement,
                                (newTimeSpans: TTimeSpan[]) => {
                                    setTimeSpans([...newTimeSpans]);
                                },
                                isMobileView
                            )
                        }
                        onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                            controls.startUpdate();
                            controlsRef.current = controls;
                            setIsStarted(true);
                        }}
                        onDelete={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                            controls.stopUpdate();
                        }}
                    />

                    <header className="sc-toolbar-row">
                        <div 
                            className="flex flex-col gap-2" 
                            role="group" 
                            aria-label="Data reload controls"
                        >
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
                </>
            ) : null}
        </div>
    );
}
