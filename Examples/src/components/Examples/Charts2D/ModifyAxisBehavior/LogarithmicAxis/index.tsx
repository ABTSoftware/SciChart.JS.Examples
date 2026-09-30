import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { AxisBase2D, LogarithmicAxis, NumericAxis, SciChartSurface } from "scichart";
import { drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function LogarithmicAxisExample() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);

    const [linearXAxis, setLinearXAxis] = React.useState<NumericAxis>();
    const [logXAxis, setLogXAxis] = React.useState<LogarithmicAxis>();
    const [linearYAxis, setLinearYAxis] = React.useState<NumericAxis>();
    const [logYAxis, setLogYAxis] = React.useState<LogarithmicAxis>();
    const [preset, setPreset] = React.useState<number>(0);

    const handleToggleButtonChanged = (event: any, state: number) => {
        const sciChartSurface = sciChartSurfaceRef.current;
        const toggleAxis = (axis: AxisBase2D, isEnabled: boolean) => {
            axis.isVisible = isEnabled; // toggle this axis as visible/invisible
            axis.isPrimaryAxis = isEnabled; // Only the primary axis shows gridlines
        };
        setPreset(state);
        switch (state) {
            case 0:
                console.log(`Setting state to Logarithmic X & Y Axis`);
                toggleAxis(logXAxis, true);
                toggleAxis(logYAxis, true);
                toggleAxis(linearXAxis, false);
                toggleAxis(linearYAxis, false);
                sciChartSurface.title = "Logarithmic X & Y Axis";
                break;
            case 1:
                console.log(`Setting state to Logarithmic X, Linear Y Axis`);
                toggleAxis(logXAxis, true);
                toggleAxis(logYAxis, false);
                toggleAxis(linearXAxis, false);
                toggleAxis(linearYAxis, true);
                sciChartSurface.title = "Logarithmic X Axis, Linear Y Axis";
                break;
            case 2:
                console.log(`Setting state to Linear X & Y Axis`);
                toggleAxis(logXAxis, false);
                toggleAxis(logYAxis, false);
                toggleAxis(linearXAxis, true);
                toggleAxis(linearYAxis, true);
                sciChartSurface.title = "Linear X & Y Axis";
                break;
        }

        const activeXAxisId = logXAxis.isVisible ? logXAxis.id : linearXAxis.id;
        const activeYAxisId = logYAxis.isVisible ? logYAxis.id : linearYAxis.id;

        // After switching visibility of axis - we need to set the X/Y AxisId on series
        sciChartSurface.renderableSeries.asArray().forEach((rs) => {
            rs.xAxisId = activeXAxisId;
            rs.yAxisId = activeYAxisId;
        });
        // Zoom to fit
        sciChartSurface.zoomExtents();
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <div className="sc-button-group" role="group" aria-label="small outlined button group">
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 0}
                        onClick={(event) => handleToggleButtonChanged(event, 0)}
                    >
                        Logarithmic X &amp; Y Axis
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 1}
                        onClick={(event) => handleToggleButtonChanged(event, 1)}
                    >
                        Log X Axis, Linear Y Axis
                    </button>
                    <button
                        type="button"
                        className="sc-button"
                        aria-pressed={preset === 2}
                        onClick={(event) => handleToggleButtonChanged(event, 2)}
                    >
                        Linear X &amp; Y Axis
                    </button>
                </div>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { sciChartSurface } = initResult;
                    sciChartSurfaceRef.current = sciChartSurface;
                    setLogXAxis(initResult.xAxisLogarithmic);
                    setLogYAxis(initResult.yAxisLogarithmic);
                    setLinearXAxis(initResult.xAxisLinear);
                    setLinearYAxis(initResult.yAxisLinear);
                }}
            />
        </div>
    );
}
