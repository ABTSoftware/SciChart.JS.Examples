import * as React from "react";
import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
    CentralAxesLayoutManager,
    EInnerAxisPlacementCoordinateMode,
    EAxisAlignment,
    GlowEffect,
    FastLineRenderableSeries,
    ICentralAxesLayoutManagerOptions,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    XyDataSeries
} from "scichart";

const AMPLITUDE = 200;

const divElementId = "chart";

let timerId: NodeJS.Timeout;

const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Optional parameters to control exact placement of the axis
    // Below: These are defaults, but we specify them for completeness of the example
    // Relative coordinate mode and 0.5 means 'place half way'
    const options: ICentralAxesLayoutManagerOptions = {
        horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        horizontalAxisPosition: 0.5,
        verticalAxisPosition: 0.5
    };

    // Configure x,y axis with central layout - oscilloscope style
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 900),
            isInnerAxis: true,
            axisAlignment: EAxisAlignment.Top,
            labelStyle: {
                color: appTheme.PaleSkyBlue
            },
            axisBorder: {
                borderTop: 1,
                color: appTheme.VividSkyBlue
            }
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-300, 300),
            isInnerAxis: true,
            axisAlignment: EAxisAlignment.Left,
            labelStyle: {
                color: appTheme.PaleSkyBlue
            },
            axisBorder: {
                borderLeft: 1,
                color: appTheme.VividSkyBlue
            }
        })
    );

    // Control the placement of the axis by specifying CentralAxesLayoutManager
    // and isInnerAxis property
    sciChartSurface.layoutManager = new CentralAxesLayoutManager(options);

    const addSeries = (stroke: string, opacity: number) => {
        const amplitude = Math.random() * AMPLITUDE;
        const effect = new GlowEffect(wasmContext, {
            range: 0,
            intensity: 0.5
        });
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke, effect });
        lineSeries.strokeThickness = 3;
        lineSeries.opacity = opacity;
        sciChartSurface.renderableSeries.add(lineSeries);
        const { xValues, yValues } = ExampleDataProvider.getNoisySinewave(500, 900, 7, amplitude, 30);
        lineSeries.dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
        return lineSeries;
    };

    const seriesColor = appTheme.VividTeal;
    const series1 = addSeries(seriesColor, 1);
    const series2 = addSeries(seriesColor, 0.9);
    const series3 = addSeries(seriesColor, 0.8);
    const series4 = addSeries(seriesColor, 0.7);
    const series5 = addSeries(seriesColor, 0.6);
    const series6 = addSeries(seriesColor, 0.5);
    const series7 = addSeries(seriesColor, 0.4);
    const series8 = addSeries(seriesColor, 0.3);
    const series9 = addSeries(seriesColor, 0.2);
    const series10 = addSeries(seriesColor, 0.1);

    const reassignRenderableSeries = () => {
        const oldSeries = series10.dataSeries;
        series10.dataSeries = series9.dataSeries;
        series9.dataSeries = series8.dataSeries;
        series8.dataSeries = series7.dataSeries;
        series7.dataSeries = series6.dataSeries;
        series6.dataSeries = series5.dataSeries;
        series5.dataSeries = series4.dataSeries;
        series4.dataSeries = series3.dataSeries;
        series3.dataSeries = series2.dataSeries;
        series2.dataSeries = series1.dataSeries;

        const amplitude = Math.random() * AMPLITUDE;
        const dataSeries = new XyDataSeries(wasmContext);
        ExampleDataProvider.fillNoisySinewave(500, 900, 7, amplitude, 30, dataSeries);
        series1.dataSeries = dataSeries;
        // To prevent memory leak we should delete
        oldSeries.delete();

        timerId = setTimeout(reassignRenderableSeries, 20);
    };

    const stopAnimation = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };
    document.getElementById("stopAnimation").addEventListener("click", stopAnimation);

    // Buttons for chart
    const startAnimation = () => {
        if (timerId) {
            stopAnimation();
        }
        reassignRenderableSeries();
    };
    document.getElementById("startAnimation").addEventListener("click", startAnimation);

    return { wasmContext, sciChartSurface, controls: { startAnimation, stopAnimation } };
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
        flex: 1
    }
}));

export default function RealtimeGhostedTraces() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const controlsRef = React.useRef<{
        startAnimation: () => void;
        stopAnimation: () => void;
    }>();

    const [stats, setStats] = React.useState({ numberSeries: 0, numberPoints: 0, fps: 0 });

    React.useEffect(() => {
        let autoStartTimerId: NodeJS.Timeout;

        const chartInitializationPromise = drawExample().then(res => {
            sciChartSurfaceRef.current = res.sciChartSurface;
            controlsRef.current = res.controls;
            let lastRendered = Date.now();
            res.sciChartSurface.rendered.subscribe(() => {
                const currentTime = Date.now();
                const timeDiffSeconds = new Date(currentTime - lastRendered).getTime() / 1000;
                lastRendered = currentTime;
                const fps = 1 / timeDiffSeconds;
                setStats({
                    numberSeries: res.sciChartSurface.renderableSeries.size(),
                    numberPoints:
                        res.sciChartSurface.renderableSeries.size() *
                        res.sciChartSurface.renderableSeries.get(0).dataSeries.count(),
                    fps
                });
            });

            autoStartTimerId = setTimeout(res.controls.startAnimation, 0);
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                clearTimeout(autoStartTimerId);
                controlsRef.current.stopAnimation();
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                clearTimeout(autoStartTimerId);
                controlsRef.current.stopAnimation();
                sciChartSurfaceRef.current.delete();
            });
        };
    }, []);

    const localClasses = useStyles();

    return (
        <React.Fragment>
            <div className={classes.ChartWrapper}>
                <div className={localClasses.flexOuterContainer}>
                    <div className={localClasses.toolbarRow}>
                        <Button
                            id="startAnimation"
                            style={{ color: appTheme.ForegroundColor }}
                            onClick={() => controlsRef.current.startAnimation()}
                        >
                            Start
                        </Button>
                        <Button
                            id="stopAnimation"
                            style={{ color: appTheme.ForegroundColor }}
                            onClick={() => controlsRef.current.stopAnimation()}
                        >
                            Stop
                        </Button>
                        <span style={{ margin: 12 }}># Series: {stats.numberSeries}</span>
                        <span
                            style={{
                                margin: 12,
                                minWidth: "200px"
                            }}
                        >
                            # DataPoints: {stats.numberPoints.toLocaleString()}
                        </span>
                        <span style={{ margin: 12 }}>FPS: {stats.fps.toFixed(0)}</span>
                    </div>
                    <div className={localClasses.chartArea} id={divElementId}></div>
                </div>
            </div>
        </React.Fragment>
    );
}
