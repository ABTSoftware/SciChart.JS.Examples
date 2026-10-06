import { useRef, useState } from "react";
import { SciChartSurface } from "scichart";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

export default function DrawBehindAxes() {
    const sciChartSurfaceRef = useRef<SciChartSurface>(undefined);

    const [preset, setPreset] = useState<number>(0);

    const handleToggleButtonChanged = (value: number) => {
        setPreset(value);
        sciChartSurfaceRef.current.drawSeriesBehindAxis = value === 0;
        sciChartSurfaceRef.current.title =
            value === 0
                ? "SciChartSurface with Series Drawn Behind Axis"
                : "SciChartSurface with Series clipped to Viewport";
        sciChartSurfaceRef.current.yAxes.get(0).axisBorder.borderLeft = value;
        sciChartSurfaceRef.current.xAxes.get(0).axisBorder.borderTop = value;
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Series rendering mode">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 0}
                        onClick={() => handleToggleButtonChanged(0)}
                    >
                        Draw Series behind Axis
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 1}
                        onClick={() => handleToggleButtonChanged(1)}
                    >
                        Clip series at Viewport Edge
                    </button>
                </div>
            </header>

            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { sciChartSurface } = initResult;
                    sciChartSurfaceRef.current = sciChartSurface;
                }}
            />
        </div>
    );
}
