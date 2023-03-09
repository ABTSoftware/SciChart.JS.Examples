import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {appTheme} from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

import {
    EAxisAlignment,
    EAutoRange,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EAnnotationLayer,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";

export type TTimeSpan = {
    title: string;
    durationMs: number;
};

export const divElementId = "chart";

export const drawExample = async (updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "X Axis",
        visibleRange: new NumberRange(0, 1000000),
        autoRange: EAutoRange.Never
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Never,
        axisTitle: "Y Axis"
    }));

    const watermarkAnnotation = (text: string, offset: number = 0) => {
        return new TextAnnotation({
            text,
            fontSize: 42,
            fontWeight: "Bold",
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0.5,
            yCoordShift: offset,
            opacity: 0.33,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            annotationLayer: EAnnotationLayer.BelowChart,
        });
    }
    // add a title annotation
    sciChartSurface.annotations.add(watermarkAnnotation("SciChart.js Performance Demo"));
    sciChartSurface.annotations.add(watermarkAnnotation("1 Million Data-Points", 52));

    const dataSeries = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 2
    }));

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Buttons for chart
    const loadPoints = () => {
        console.log("load points");

        // Clear state
        dataSeries.clear();
        const newTimeSpans: TTimeSpan[] = [];

        // Start clouting Points generation time
        const generateTimestamp = Date.now();

        const POINTS = 1_000_000;
        const xValues = new Float64Array(POINTS);
        const yValues = new Float64Array(POINTS);
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

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1,
    }
}));

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
            autoStartTimerId = setTimeout(res.loadPoints, 0);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            clearTimeout(autoStartTimerId);
            scs?.delete();
        };
    }, []);

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.chartArea} id={divElementId}></div>
                <div className={localClasses.toolbarRow} style={{minHeight: "140px"}}>
                    <Button id="loadPoints" style={{color: appTheme.ForegroundColor}}>🗘 Reload Test</Button>
                    <div style={{width: "100%", marginLeft: "10px"}}>
                        {timeSpans.length > 0 && (
                            <Alert key="0" className={classes.Notification}
                                   style={{backgroundColor: appTheme.Indigo, color: appTheme.ForegroundColor}}>
                                <AlertTitle>Performance Results</AlertTitle>
                                {timeSpans.map((ts, index) => (
                                    <div key={index}>
                                        {ts.title}: {ts.durationMs.toFixed(0)} ms
                                    </div>
                                ))}
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
