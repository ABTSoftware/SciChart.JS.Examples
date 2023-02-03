import * as React from "react";

import {
    EExecuteOn,
    EllipsePointMarker, EZoomState,
    FastLineRenderableSeries, NumberRange,
    NumericAxis, RubberBandXyZoomModifier,
    SciChartSurface, XyDataSeries,
    XyScatterRenderableSeries, ZoomExtentsModifier, ZoomPanModifier
} from "scichart";

import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {makeStyles} from "@material-ui/core/styles";

export const divElementId = "chart";

let timerId: NodeJS.Timeout;

export const drawExample = async () => {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, { labelPrecision: 0 });
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Create a Scatter series, and Line series and add to chart
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "White", stroke: "SteelBlue" })
    });
    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#4083B7", strokeThickness: 2 });
    sciChartSurface.renderableSeries.add(lineSeries, scatterSeries);

    // Create and populate some XyDataSeries with static data
    // Note: you can pass xValues, yValues arrays to constructors, and you can use appendRange for bigger datasets
    const scatterData = new XyDataSeries(wasmContext, { dataSeriesName: "Cos(x)" });
    const lineData = new XyDataSeries(wasmContext, { dataSeriesName: "Sin(x)" });

    for (let i = 0; i < 1000; i++) {
        lineData.append(i, Math.sin(i * 0.05));
        scatterData.append(i, Math.cos(i * 0.05));
    }

    // Assign these dataseries to the line/scatter renderableseries
    scatterSeries.dataSeries = scatterData;
    lineSeries.dataSeries = lineData;

    //  We disable ZoomExtends animation
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ isAnimated: false }));
    // Realtime zooming example
    sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier());
    // Realtime panning example
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ executeOn: EExecuteOn.MouseRightButton }));

    // Part 2: Appending data in realtime
    //
    const updateDataFunc = () => {
        // Append another data-point to the chart. We use dataSeries.count()
        // to determine the current length before appending
        const i = lineData.count();
        lineData.append(i, Math.sin(i * 0.05));
        scatterData.append(i, Math.cos(i * 0.05));

        // If the zoomState is not UserZooming, then we are viewing the extents of the data
        // In this case, we want to scroll the chart by setting visibleRange = NumberRange(i-1000, i)
        if (sciChartSurface.zoomState !== EZoomState.UserZooming) {
            xAxis.visibleRange = new NumberRange(i - 1000, i);
        }

        // Repeat at 60Hz
        timerId = setTimeout(updateDataFunc, 1 / 60);

        // Warning, this will repeat forever, it's not best practice!
    };

    updateDataFunc();
    return sciChartSurface;
};

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    chartArea: {
        flex: 1,
    }
}));


let scs: SciChartSurface;

export default function RealtimeZoomPan() {
    React.useEffect(() => {
        (async () => {
            scs = await drawExample();
        })();
        // IMPORTANT to cancel all subscriptions on component unmount!
        return () => {
            clearTimeout(timerId);
            scs?.delete();
        };
    }, []);

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.chartArea} id={divElementId}></div>
            </div>
        </div>
    );
}
