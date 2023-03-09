import * as React from "react";

import {appTheme} from "scichart-example-dependencies";
import classes from "scichart-example-dependencies/styles/Examples.module.scss";
import { Subject, debounceTime } from "rxjs";

import {
    easing,
    EAutoRange,
    EAxisAlignment, EHorizontalAnchorPoint, EVerticalAnchorPoint, EWrapTo, EXyDirection,
    FastLineRenderableSeries, MouseWheelZoomModifier, NativeTextAnnotation,
    NumberRange,
    NumericAxis, SciChartOverview,
    SciChartSurface, XAxisDragModifier,
    XyDataSeries, YAxisDragModifier, ZoomExtentsModifier, ZoomPanModifier,
    ECoordinateMode
} from "scichart";


export const divElementId = "chart";
export const divOverviewId = "overview";

export const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});
    const xAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        visibleRange: new NumberRange(4000000, 5000000),
        autoRange: EAutoRange.Never,
        labelPrecision: 0,
        useNativeText: true
    });

    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Never,
        labelPrecision: 0,
        useNativeText: true
    });
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true });
    const rendSeries = new FastLineRenderableSeries(wasmContext, { dataSeries, strokeThickness: 2, stroke: appTheme.VividOrange });
    sciChartSurface.renderableSeries.add(rendSeries);
    rendSeries.rolloverModifierProps.tooltipTextColor = "black";
    rendSeries.rolloverModifierProps.showRollover = true;

    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier({ xyDirection: EXyDirection.YDirection }),
        new XAxisDragModifier(),
        new YAxisDragModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier()
    );

    // Create an observable stream
    const subject = new Subject<NumberRange>();

    // Push visible range changes into the observable
    xAxis.visibleRangeChanged.subscribe(async args => {
        subject.next(args.visibleRange);
    });

    // subscribe to the observable with a debounce
    subject.pipe(debounceTime(250)).subscribe((r: NumberRange) => {
        // Fetch data and update the dataSeries
        loadPoints(r.min, r.max, sciChartSurface.domCanvas2D.width, dataSeries).then(() => {
            // Update the y axis
            const yRange = yAxis.getWindowedYRange(null);
            yAxis.animateVisibleRange(yRange, 250, easing.outExpo);
        }).catch(err => showError(sciChartSurface, "Server data is unavailable.  Please do npm run build, then npm start and access the site at localhost:3000"));
    });

    const overview = await SciChartOverview.create(sciChartSurface, divOverviewId, {theme: appTheme.SciChartJsTheme});
    const overviewData = new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true });
    // Load the full dataSet
    loadPoints(0, 10000000, overview.overviewSciChartSurface.domCanvas2D.width, overviewData).catch(err => {});
    overview.overviewSciChartSurface.renderableSeries.get(0).dataSeries = overviewData;
    overview.overviewSciChartSurface.zoomExtents();

    // Load initial data
    loadPoints(xAxis.visibleRange.min, xAxis.visibleRange.max, sciChartSurface.domCanvas2D.width, dataSeries).then(
        () => {
            sciChartSurface.zoomExtents();
        }
    ).catch(err => showError(sciChartSurface, "Server data is unavailable.  Please do npm run build, then npm start and access the site at localhost:3000"));

    return [sciChartSurface, overview.overviewSciChartSurface];
};

const loadPoints = async (xFrom: number, xTo: number, chartWidth: number, dataSeries: XyDataSeries) => {
    chartWidth = Math.floor(chartWidth);

    const response = await fetch(`api/data/${xFrom}-${xTo}/${chartWidth}`);
    const data: { x: number[]; y: number[] } = await response.json();
    console.log(`Loaded ${data.x.length} points`);
    dataSeries.clear();
    dataSeries.appendRange(data.x, data.y);
};

const showError = (sciChartSurface: SciChartSurface, message: string) => {
    if (!sciChartSurface.annotations.getById("error")) {
        sciChartSurface.annotations.add(new NativeTextAnnotation({
            id: "error",
            text: message,
            x1: 0.5,
            y1: 0.5,
            textColor: "red",
            fontSize: 24,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            lineSpacing: 5,
            wrapTo: EWrapTo.ViewRect,
        }));
    }
}

export default function VirtualizedDataOverview() {
    let charts: SciChartSurface[];

    React.useEffect(() => {
        (async () => {
            charts = await drawExample();
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            charts.forEach(chart => chart?.delete());
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div id={divElementId} style={{ flexBasis: 600, flexGrow: 1, flexShrink: 1 }} />
                <div id={divOverviewId} style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }} />
            </div>
        </div>
    )
}
