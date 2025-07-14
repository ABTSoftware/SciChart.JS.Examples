import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
[]
// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [controls, setControls] = useState<{
        startAnimation: () => void,
        stopAnimation: () => void,
    }>();

    const [ isChartAnimating, setIsChartAnimating ] = useState(true);

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
        <div>
            <header style={{
                width: "100%",
                position: "absolute",
                margin: 12,
                zIndex: 1,
            }}>
                <ToggleButton
                    value="start"
                    onClick={handleToggleAnimation}
                    sx={{
                        color: "#d5d5d5",
                        borderColor: "#d5d5d5",
                    }}
                >
                    {isChartAnimating ? "Stop Rotation" : "Start Rotation"}
                </ToggleButton>
            </header>

            <SciChartReact
                initChart={(rootElementId: string | HTMLDivElement) =>
                    drawExample(rootElementId)
                }
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setControls(initResult.controls);
                }}
            />
        </div>
    );
}
