import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState } from "react";
import { PlayArrowIcon, StopIcon, RefreshIcon } from "../../../icons";

export default function ChartComponent() {
    const [chart, setChart] = useState<TResolvedReturnType<typeof drawExample>>();
    const [originalOrder, setOriginalOrder] = useState(true);
    const [paused, setPaused] = useState(false);

    const changeOrder = (original: boolean) => {
        chart.changeOrder(original);
        setOriginalOrder(original);
    };

    return (
        <div className="sc-chart-wrapper">
            <div className="sc-toolbar-row">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="sc-button sc-button-icon"
                        aria-label={paused ? "Resume animation" : "Pause animation"}
                        title={paused ? "Resume animation" : "Pause animation"}
                        disabled={!chart}
                        onClick={() => {
                            chart.setAnimationPaused(!paused);
                            setPaused(!paused);
                        }}
                    >
                        {paused ? <PlayArrowIcon /> : <StopIcon />}
                    </button>
                    <button
                        type="button"
                        className="sc-button sc-button-icon"
                        aria-label="Reset demo"
                        title="Reset demo"
                        disabled={!chart}
                        onClick={() => {
                            chart.resetDemo();
                            setOriginalOrder(true);
                            setPaused(false);
                        }}
                    >
                        <RefreshIcon />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span>Band order:</span>
                    <div className="sc-button-group" role="group" aria-label="Band order">
                        <button
                            type="button"
                            className="sc-button sc-button-outline"
                            aria-pressed={originalOrder}
                            disabled={!chart}
                            onClick={() => changeOrder(true)}
                        >
                            Original
                        </button>
                        <button
                            type="button"
                            className="sc-button sc-button-outline"
                            aria-pressed={!originalOrder}
                            disabled={!chart}
                            onClick={() => changeOrder(false)}
                        >
                            Reversed
                        </button>
                    </div>
                </div>
            </div>
            <SciChartReact initChart={drawExample} className="w-full h-full" onInit={setChart} />
        </div>
    );
}
