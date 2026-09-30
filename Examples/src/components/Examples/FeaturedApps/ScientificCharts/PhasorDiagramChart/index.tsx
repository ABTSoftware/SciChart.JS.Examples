import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState } from "react";
import { PauseIcon, PlayArrowIcon } from "../../../icons";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [controls, setControls] = useState<{
        startAnimation: () => void;
        stopAnimation: () => void;
    }>();
    const [isChartAnimating, setIsChartAnimating] = useState(true);

    function handleToggleAnimation() {
        if (controls) {
            if (isChartAnimating) {
                controls.stopAnimation();
            } else {
                controls.startAnimation();
            }
            setIsChartAnimating(!isChartAnimating);
        }
    }

    return (
        <div className="sc-chart-wrapper">
            <header style={{ position: "absolute", inset: "12px 12px auto", zIndex: 1 }}>
                <button
                    type="button"
                    className="sc-button sc-button-icon"
                    aria-pressed={isChartAnimating}
                    aria-label={isChartAnimating ? "Stop rotation" : "Start rotation"}
                    title={isChartAnimating ? "Stop rotation" : "Start rotation"}
                    onClick={handleToggleAnimation}
                >
                    {isChartAnimating ? <PauseIcon /> : <PlayArrowIcon />}
                </button>
            </header>

            <SciChartReact
                className="w-full h-full"
                initChart={(rootElementId: string | HTMLDivElement) => drawExample(rootElementId)}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
            />
        </div>
    );
}
