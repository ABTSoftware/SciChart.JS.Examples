import { useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";

export default function RealtimePerformanceDemo() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const [isStarted, setIsStarted] = useState(false);
    const [stats, setStats] = useState({ numberPoints: 0, fps: 0 });

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow}>
                <Button
                    onClick={() => {
                        if (isStarted) {
                            controlsRef.current.stopUpdate();
                        } else {
                            controlsRef.current.startUpdate();
                        }
                        setIsStarted(!isStarted);
                    }}
                >
                    {isStarted ? <PauseIcon /> : <PlayArrowIcon />}
                </Button>
                <div style={{ flex: "none", flexBasis: "13em", textAlign: "left" }}>
                    # DataPoints: {stats.numberPoints.toLocaleString()}
                </div>
                <div style={{ flex: "none", flexBasis: "4em", textAlign: "left" }}>
                    FPS: {stats.fps.toFixed(0).padStart(2, "0")}
                </div>
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = initResult.controls;
                    initResult.controls.setStatsChangedCallback((stats) => setStats(stats));
                    initResult.controls.startUpdate();
                    setIsStarted(true);
                }}
                onDelete={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.controls.stopUpdate();
                }}
            />
        </div>
    );
}
