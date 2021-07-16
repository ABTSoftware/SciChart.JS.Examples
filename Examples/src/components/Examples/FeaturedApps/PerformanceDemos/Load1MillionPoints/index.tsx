import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as React from "react";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartJSDarkTheme } from "scichart/Charting/Themes/SciChartJSDarkTheme";
import { EAutoRange } from "scichart/types/AutoRange";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartSurface } from "scichart";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";

export type TTimeSpan = {
    title: string;
    durationMs: number;
};

export const divElementId = "chart";

export const drawExample = async (updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        widthAspect: 3,
        heightAspect: 2,
    });
    sciChartSurface.applyTheme(new SciChartJSDarkTheme());
    const xAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 1000000),
        autoRange: EAutoRange.Never
    });
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Never
    });
    yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    const rendSeries = new FastLineRenderableSeries(wasmContext, { dataSeries, strokeThickness: 2 });
    sciChartSurface.renderableSeries.add(rendSeries);
    rendSeries.stroke = "#99EE99FF";

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Buttons for chart
    const loadPoints = () => {
        console.log("load points");

        // Clear state
        dataSeries.clear();
        const newTimeSpans: TTimeSpan[] = [];

        // Start clouting Points generation time
        const generateTimestamp = Date.now();

        const POINTS = 1000000;
        const xValues = new Array(POINTS);
        const yValues = new Array(POINTS);
        let prevYValue = 0;
        for (let i = 0; i < POINTS; i++) {
            const curYValue = Math.random() * 10 - 5;

            xValues[i] = i;
            yValues[i] = prevYValue + curYValue;

            prevYValue += curYValue;
        }

        // Add the first time span: Generating 1M data points
        newTimeSpans.push({
            title: "Generate 1M Data Points",
            durationMs: Date.now() - generateTimestamp
        });

        // Start counting batch append time
        const appendTimestamp = Date.now();
        dataSeries.appendRange(xValues, yValues);

        // Add the second time span: Generation of data point
        newTimeSpans.push({
            title: "Append 1M Data Points",
            durationMs: Date.now() - appendTimestamp
        });

        // Subscribe to sciChartSurface.rendered event,
        // and calculate time duration between the append and
        // the first frame after it
        const firstFrameTimestamp = Date.now();
        let frameIndex: number = 0;
        let nextFramesTimestamp: number;
        const handler = () => {
            if (frameIndex === 0) {
                // Add the third time span: Render the first frame
                newTimeSpans.push({
                    title: "Render the frame",
                    durationMs: Date.now() - firstFrameTimestamp
                });
                nextFramesTimestamp = Date.now();
            } else {
                // Unsubscribe from sciChartSurface.rendered
                updateTimeSpans(newTimeSpans);
                sciChartSurface.rendered.unsubscribe(handler);

                // Zoom extents at the end of performance measurement
                sciChartSurface.zoomExtents(250);
            }
            setTimeout(sciChartSurface.invalidateElement, 0);
            // Increment frame index
            frameIndex++;
        };
        sciChartSurface.rendered.subscribe(handler);
    };

    document.getElementById("loadPoints").addEventListener("click", loadPoints);

    return { wasmContext, sciChartSurface, loadPoints };
};

let scs: SciChartSurface;
let autoStartTimerId: NodeJS.Timeout;

export default function Load1MillionPointsChart() {
    const [timeSpans, setTimeSpans] = React.useState<TTimeSpan[]>([]);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample((newTimeSpans: TTimeSpan[]) => {
                setTimeSpans([...newTimeSpans]);
            });
            scs = res.sciChartSurface;
            autoStartTimerId = setTimeout(res.loadPoints, 3000);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            clearTimeout(autoStartTimerId);
            scs?.delete();
        };
    }, []);

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div>
                <div className={classes.FormControl}>
                    <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                        <Button id="loadPoints">Load</Button>
                    </ButtonGroup>
                </div>
            </div>

            {timeSpans.length > 0 && (
                <Alert key="0" severity="info" className={classes.Notification}>
                    {timeSpans.map((ts, index) => (
                        <div key={index}>
                            <AlertTitle>{ts.title}</AlertTitle>
                            Time: {ts.durationMs.toFixed(0)} ms
                        </div>
                    ))}
                </Alert>
            )}
        </div>
    );
}
