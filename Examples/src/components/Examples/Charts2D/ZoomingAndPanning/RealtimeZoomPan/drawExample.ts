import {
    EExecuteOn,
    EllipsePointMarker,
    EZoomState,
    FastLineRenderableSeries,
    NumberRange,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";

import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, { labelPrecision: 0 });
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Create a Scatter series, and Line series and add to chart
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "White", stroke: "SteelBlue" }),
    });
    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#4083B7", strokeThickness: 2 });
    sciChartSurface.renderableSeries.add(lineSeries, scatterSeries);

    const initialDataPointsCount = 1000;

    // if a required size of data series is known or it is expected to grow,
    // setting a capacity value may give some efficiency boost
    const initialCapacity = 2000;

    // Create and populate some XyDataSeries with static data
    // Note: you can pass xValues, yValues arrays to constructors, and you can use appendRange for bigger datasets
    const scatterData = new XyDataSeries(wasmContext, { dataSeriesName: "Cos(x)", capacity: initialCapacity });
    const lineData = new XyDataSeries(wasmContext, { dataSeriesName: "Sin(x)", capacity: initialCapacity });

    for (let i = 0; i < initialDataPointsCount; i++) {
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
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } })
    );

    // Part 2: Appending data in realtime
    //
    let timerId: NodeJS.Timeout;

    const updateDataFunc = () => {
        // Append another data-point to the chart. We use dataSeries.count()
        // to determine the current length before appending
        // NOTE: sometimes appending data points in bulk with appendRange can be more efficient
        const i = lineData.count();
        lineData.append(i, Math.sin(i * 0.05));
        scatterData.append(i, Math.cos(i * 0.05));

        // If the zoomState is not UserZooming, then we are viewing the extents of the data
        // In this case, we want to scroll the chart by setting visibleRange = NumberRange(i-1000, i)
        if (sciChartSurface.zoomState !== EZoomState.UserZooming) {
            xAxis.visibleRange = new NumberRange(i - 1000, i);
        }
    };

    const startUpdate = () => {
        // Repeat at 60Hz
        timerId = setInterval(updateDataFunc, 16);
        // Warning, this will repeat forever, it's not best practice!
    };

    const stopUpdate = () => {
        clearTimeout(timerId);
    };

    return { sciChartSurface, controls: { startUpdate, stopUpdate } };
};
