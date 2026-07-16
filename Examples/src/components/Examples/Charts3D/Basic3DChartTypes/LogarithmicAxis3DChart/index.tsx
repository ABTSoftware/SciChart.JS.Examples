import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { LogarithmicAxis3D, NumericAxis3D } from "scichart";
import commonClasses from "../../../styles/Examples.module.scss";
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
            ? new LogarithmicAxis3D(wasmContext, { axisTitle: "Frequency (Hz)", logBase: 10, visibleRange: X_RANGE_LOG })
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
        <div className={commonClasses.ChartWrapper}>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    chartRef.current = initResult;
                }}
                style={{ height: "100%", width: "100%" }}
            />
            <ButtonGroup
                size="small"
                style={{ position: "absolute", top: 8, left: 8 }}
            >
                <Button variant={xIsLog ? "contained" : "outlined"} onClick={toggleXAxis}>
                    X: {xIsLog ? "Log" : "Linear"}
                </Button>
                <Button variant={yIsLog ? "contained" : "outlined"} onClick={toggleYAxis}>
                    Y: {yIsLog ? "Log" : "Linear"}
                </Button>
            </ButtonGroup>
        </div>
    );
}
