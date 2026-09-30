import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useCallback, useRef, useState } from "react";
import { PlayArrowIcon, StopIcon } from "../../../icons";
import { appTheme } from "../../../theme";
export default function ChartComponent() {
    const [totalAngle, setTotalAngle] = useState<number>(0.004);
    const [innerRadius, setInnerRadius] = useState<number>(0.9977);

    const isUpdatingFromAnimation = useRef<boolean>(false);

    const [controls, setControls] = useState({
        startAnimation: () => {},
        endAnimation: () => {},
        changeInnerRadiusInternal: (value: number) => {},
        changeTotalAngleInternal: (value: number) => {},
    });

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
            controls.changeInnerRadiusInternal(value);
        }
    }

    function changeTotalAngle(value: number) {
        if (!isUpdatingFromAnimation.current) {
            setTotalAngle(value);
            controls.changeTotalAngleInternal(value);
        }
    }

    return (
        <div className="sc-chart-wrapper" style={{ background: appTheme.DarkIndigo }}>
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="button group">
                    <button
                        type="button"
                        className="sc-button sc-button-icon"
                        aria-label="Start animation"
                        onClick={() => controls.startAnimation()}
                    >
                        <PlayArrowIcon />
                    </button>

                    <button
                        type="button"
                        className="sc-button sc-button-icon"
                        aria-label="Stop animation"
                        onClick={() => controls.endAnimation()}
                    >
                        <StopIcon />
                    </button>
                </div>

                <div style={{ flex: 1, paddingInline: 20 }}>
                    <span>
                        Inner Radius: <strong>{innerRadius.toFixed(3)}</strong>
                    </span>

                    <input
                        style={{ width: "100%" }}
                        type="range"
                        min={0.001}
                        max={0.999}
                        step={0.001}
                        value={innerRadius}
                        onChange={(e) => changeInnerRadius(parseFloat(e.target.value))}
                        className="sc-range"
                    />
                </div>

                <div style={{ flex: 1, paddingInline: 20 }}>
                    <span>
                        Total Angle: <strong>{(totalAngle / Math.PI).toFixed(3)} * π</strong> or{" "}
                        <strong>{totalAngle.toFixed(3)}</strong>
                    </span>

                    <input
                        style={{ width: "100%" }}
                        type="range"
                        min={0}
                        max={Math.PI * 2}
                        step={0.001}
                        value={totalAngle}
                        onChange={(e) => changeTotalAngle(parseFloat(e.target.value))}
                        className="sc-range"
                    />
                </div>
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
