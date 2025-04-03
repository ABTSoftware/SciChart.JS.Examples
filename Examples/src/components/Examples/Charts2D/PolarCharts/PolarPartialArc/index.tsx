import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useCallback, useRef, useState } from "react";
import { ToggleButton, ToggleButtonGroup, Slider, Typography } from "@mui/material";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";

export default function ChartComponent() {
    const [totalAngle, setTotalAngle] = useState<number>(0.004);
    const [innerRadius, setInnerRadius] = useState<number>(0.998);

    const isUpdatingFromAnimation = useRef<boolean>(false);
    
    const [controls, setControls] = useState({
        startAnimation: () => {},
        endAnimation: () => {},
        changeInnerRadiusInternal: (value: number) => {},
        changeTotalAngleInternal: (value: number) => {},
    });

    const handleAnimationUpdate = useCallback((values: { innerRadius: number, totalAngle: number }) => {
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
        <div className={commonClasses.ChartWrapper}>
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: appTheme.DarkIndigo,
            }}>
                <div className={commonClasses.ToolbarRow}>
                    <ToggleButtonGroup
                        exclusive
                        size="medium"
                        color="primary"
                        aria-label="button group"
                    >   
                        <ToggleButton
                            value="start"
                            onClick={() => controls.startAnimation()}
                        >
                            Start
                        </ToggleButton>

                        <ToggleButton
                            value="end"
                            onClick={() => controls.endAnimation()}
                        >
                            End
                        </ToggleButton>
                    </ToggleButtonGroup>
                    
                    <div style={{ flex: 1, paddingInline: 20 }}>
                        <Typography variant="body1" color="white">
                            Inner Radius: <strong>{innerRadius.toFixed(3)}</strong>
                        </Typography>

                        <input
                            style={{ width: "100%" }}
                            type="range"
                            min={0.001}
                            max={0.999}
                            step={0.001}
                            value={innerRadius}
                            onChange={(e) => changeInnerRadius(
                                parseFloat(e.target.value)
                            )}
                        />
                    </div>

                    <div style={{ flex: 1, paddingInline: 20 }}>
                        <Typography variant="body1" color="white">
                            Total Angle: <strong>{(totalAngle / Math.PI).toFixed(3)} * π</strong>
                        </Typography>

                        <input
                            style={{ width: "100%" }}
                            type="range"
                            min={0}
                            max={Math.PI * 2}
                            step={0.001}
                            value={totalAngle}
                            onChange={(e) => changeTotalAngle(
                                parseFloat(e.target.value)
                            )}
                        />
                    </div>
                </div>

                <SciChartReact
                    initChart={(rootElementId: string | HTMLDivElement) =>
                        drawExample(rootElementId, innerRadius, totalAngle, handleAnimationUpdate)
                    }
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        setControls(initResult.controls);
                    }}
                    style={{ flex: 1 }}
                />
            </div>
        </div>
    )
}