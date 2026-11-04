import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState } from "react";
import { StopIcon, PlayArrowIcon } from "../../../icons";

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
            <SciChartReact
                className="w-full h-full"
                initChart={(rootElementId: string | HTMLDivElement) => drawExample(rootElementId)}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
            />

            <header className="absolute top-2 left-2">
                <button
                    type="button"
                    className="sc-button sc-button-icon"
                    aria-pressed={isChartAnimating}
                    aria-label={isChartAnimating ? "Stop rotation" : "Start rotation"}
                    title={isChartAnimating ? "Stop rotation" : "Start rotation"}
                    onClick={handleToggleAnimation}
                >
                    {isChartAnimating ? <StopIcon /> : <PlayArrowIcon />}
                </button>
            </header>
        </div>
    );
}
