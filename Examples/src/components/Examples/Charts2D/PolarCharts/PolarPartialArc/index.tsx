import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useCallback, useRef, useState } from "react";
import { PlayArrowIcon, StopIcon } from "../../../icons";
import { appTheme } from "../../../theme";
export default function ChartComponent() {
    const [totalAngle, setTotalAngle] = useState<number>(0.004);
    const [isAnimating, setIsAnimating] = useState(false);
    const [innerRadius, setInnerRadius] = useState<number>(0.9977);

    const isUpdatingFromAnimation = useRef<boolean>(false);

    const [controls, setControls] = useState<TResolvedReturnType<typeof drawExample>["controls"]>();

    const handleAnimationUpdate = useCallback((values: { innerRadius: number; totalAngle: number }) => {
        isUpdatingFromAnimation.current = true;
        setInnerRadius(values.innerRadius);
        setTotalAngle(values.totalAngle);
        // Reset the flag after state updates are processed
        setTimeout(() => {
            isUpdatingFromAnimation.current = false;
        }, 0);
    }, []);

    function changeInnerRadius(value: number) {
        if (!isUpdatingFromAnimation.current) {
            setInnerRadius(value);
            controls?.changeInnerRadiusInternal(value);
        }
    }

    function changeTotalAngle(value: number) {
        if (!isUpdatingFromAnimation.current) {
            setTotalAngle(value);
            controls?.changeTotalAngleInternal(value);
        }
    }

    return (
        <div className="sc-chart-wrapper" style={{ background: appTheme.DarkIndigo }}>
            <header className="sc-toolbar-row">
                <button
                    type="button"
                    className="sc-button sc-button-icon"
                    aria-label={isAnimating ? "Stop animation" : "Start animation"}
                    title={isAnimating ? "Stop animation" : "Start animation"}
                    disabled={!controls}
                    onClick={() => {
                        if (isAnimating) controls.endAnimation();
                        else controls.startAnimation();
                        setIsAnimating(!isAnimating);
                    }}
                >
                    {isAnimating ? <StopIcon /> : <PlayArrowIcon />}
                </button>

                <label className="sc-control flex-col flex-1 gap-0">
                    <span>
                        Inner Radius: <strong>{innerRadius.toFixed(3)}</strong>
                    </span>

                    <input
                        type="range"
                        min={0.001}
                        max={0.999}
                        step={0.001}
                        value={innerRadius}
                        onChange={(e) => changeInnerRadius(parseFloat(e.target.value))}
                        className="sc-range -mt-1"
                    />
                </label>

                <label className="sc-control flex-col flex-1 gap-0">
                    <span>
                        Total Angle: <strong>{(totalAngle / Math.PI).toFixed(3)} * π</strong> or{" "}
                        <strong>{totalAngle.toFixed(3)}</strong>
                    </span>

                    <input
                        type="range"
                        min={0}
                        max={Math.PI * 2}
                        step={0.001}
                        value={totalAngle}
                        onChange={(e) => changeTotalAngle(parseFloat(e.target.value))}
                        className="sc-range -mt-1"
                    />
                </label>
            </header>

            <SciChartReact
                initChart={(rootElementId: string | HTMLDivElement) =>
                    drawExample(rootElementId, innerRadius, totalAngle, handleAnimationUpdate)
                }
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
            />
        </div>
    );
}
