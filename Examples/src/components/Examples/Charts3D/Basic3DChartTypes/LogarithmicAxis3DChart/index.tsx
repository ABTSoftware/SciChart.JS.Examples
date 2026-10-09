import { useRef, useState } from "react";

import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { LogarithmicAxis3D, NumericAxis3D } from "scichart";
import { drawExample, X_RANGE_LINEAR, X_RANGE_LOG, Y_RANGE_LINEAR, Y_RANGE_LOG } from "./drawExample";

export default function LogarithmicAxis3DChart() {
    const chartRef = useRef<TResolvedReturnType<typeof drawExample> | null>(null);
    const [xIsLog, setXIsLog] = useState(true);
    const [yIsLog, setYIsLog] = useState(true);

    const setXAxisScale = (useLog: boolean) => {
        if (!chartRef.current || useLog === xIsLog) return;
        const { sciChartSurface, wasmContext } = chartRef.current;
        sciChartSurface.xAxis = useLog
            ? new LogarithmicAxis3D(wasmContext, {
                  axisTitle: "Frequency (Hz)",
                  logBase: 10,
                  visibleRange: X_RANGE_LOG,
              })
            : new NumericAxis3D(wasmContext, { axisTitle: "Frequency (Hz)", visibleRange: X_RANGE_LINEAR });
        setXIsLog(useLog);
    };

    const setYAxisScale = (useLog: boolean) => {
        if (!chartRef.current || useLog === yIsLog) return;
        const { sciChartSurface, wasmContext } = chartRef.current;
        sciChartSurface.yAxis = useLog
            ? new LogarithmicAxis3D(wasmContext, { axisTitle: "PSD (V²/Hz)", logBase: 10, visibleRange: Y_RANGE_LOG })
            : new NumericAxis3D(wasmContext, { axisTitle: "PSD (V²/Hz)", visibleRange: Y_RANGE_LINEAR });
        setYIsLog(useLog);
    };

    return (
        <div className="sc-chart-wrapper">
            <div className="sc-toolbar-row">
                <div className="flex items-center gap-2">
                    <strong>X axis:</strong>
                    <div className="sc-button-group" role="group" aria-label="X axis scale">
                        <button
                            type="button"
                            className="sc-button"
                            aria-pressed={xIsLog}
                            onClick={() => setXAxisScale(true)}
                        >
                            Log
                        </button>
                        <button
                            type="button"
                            className="sc-button"
                            aria-pressed={!xIsLog}
                            onClick={() => setXAxisScale(false)}
                        >
                            Linear
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <strong>Y axis:</strong>
                    <div className="sc-button-group" role="group" aria-label="Y axis scale">
                        <button
                            type="button"
                            className="sc-button"
                            aria-pressed={yIsLog}
                            onClick={() => setYAxisScale(true)}
                        >
                            Log
                        </button>
                        <button
                            type="button"
                            className="sc-button"
                            aria-pressed={!yIsLog}
                            onClick={() => setYAxisScale(false)}
                        >
                            Linear
                        </button>
                    </div>
                </div>
            </div>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    chartRef.current = initResult;
                }}
                className="w-full h-full"
            />
        </div>
    );
}
