import { useRef, useState } from "react";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { LogarithmicAxis3D, NumericAxis3D } from "scichart";
import { drawExample, X_RANGE_LINEAR, X_RANGE_LOG, Y_RANGE_LINEAR, Y_RANGE_LOG } from "./drawExample";

export default function LogarithmicAxis3DChart() {
    const chartRef = useRef<TResolvedReturnType<typeof drawExample> | null>(null);
    const [xIsLog, setXIsLog] = useState(true);
    const [yIsLog, setYIsLog] = useState(true);

    const toggleXAxis = () => {
        if (!chartRef.current) return;
        const { sciChartSurface, wasmContext } = chartRef.current;
        const useLog = !xIsLog;
        sciChartSurface.xAxis = useLog
            ? new LogarithmicAxis3D(wasmContext, {
                  axisTitle: "Frequency (Hz)",
                  logBase: 10,
                  visibleRange: X_RANGE_LOG,
              })
            : new NumericAxis3D(wasmContext, { axisTitle: "Frequency (Hz)", visibleRange: X_RANGE_LINEAR });
        setXIsLog(useLog);
    };

    const toggleYAxis = () => {
        if (!chartRef.current) return;
        const { sciChartSurface, wasmContext } = chartRef.current;
        const useLog = !yIsLog;
        sciChartSurface.yAxis = useLog
            ? new LogarithmicAxis3D(wasmContext, { axisTitle: "PSD (V²/Hz)", logBase: 10, visibleRange: Y_RANGE_LOG })
            : new NumericAxis3D(wasmContext, { axisTitle: "PSD (V²/Hz)", visibleRange: Y_RANGE_LINEAR });
        setYIsLog(useLog);
    };

    return (
        <div className="sc-chart-wrapper">
            <div className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="Axis scale">
                    <button type="button" className="sc-button" aria-pressed={xIsLog} onClick={toggleXAxis}>
                        X: {xIsLog ? "Log" : "Linear"}
                    </button>
                    <button type="button" className="sc-button" aria-pressed={yIsLog} onClick={toggleYAxis}>
                        Y: {yIsLog ? "Log" : "Linear"}
                    </button>
                </div>
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    chartRef.current = initResult;
                }}
                style={{ height: "100%", width: "100%" }}
            />
        </div>
    );
}
