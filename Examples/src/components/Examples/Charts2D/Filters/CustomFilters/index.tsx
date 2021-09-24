import { ButtonGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { SciChartSurface } from "scichart";
import { CursorModifier } from "scichart/Charting/ChartModifiers/CursorModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { BaseDataSeries } from "scichart/Charting/Model/BaseDataSeries";
import { SeriesInfo } from "scichart/Charting/Model/ChartData/SeriesInfo";
import { XySeriesInfo } from "scichart/Charting/Model/ChartData/XySeriesInfo";
import { XyCustomFilter } from "scichart/Charting/Model/Filters/XyCustomFilter";
import { XyFilterBase } from "scichart/Charting/Model/Filters/XyFilterBase";
import { XyScaleOffsetFilter } from "scichart/Charting/Model/Filters/XyScaleOffsetFilter";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { LogarithmicAxis } from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { formatNumber } from "scichart/utils/number";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import classes from "../../../Examples.module.scss";

export const divElementId = "chart";
let timerId: NodeJS.Timeout;

// A custom filter which calculates the frequency distribution of the original data
class AggregationFilter extends XyFilterBase {
    private bins: Map<number, number> = new Map<number, number>();
    private binWidthProperty = 1;

    constructor(originalSeries: BaseDataSeries, binWidth: number) {
        super(originalSeries);
        this.binWidthProperty = binWidth;
        this.filterAll();
    }

    public get binWidth() {
        return this.binWidthProperty;
    }

    public set binWidth(value: number) {
        this.binWidthProperty = value;
        this.filterAll();
    }

    protected filterAll() {
        this.clear();
        this.bins.clear();
        this.filter(0, this.getOriginalCount());
    }
    protected filterOnAppend(count: number): void {
        // Overriding this so we do not have to reprocess the entire series on append
        this.filter(this.getOriginalCount() - count, count);
    }

    protected filter(start: number, count: number): void {
        const numUtil = this.originalSeries.webAssemblyContext.NumberUtil;
        for (let i = start; i < start + count; i++) {
            const bin = numUtil.RoundDown(this.getOriginalYValues().get(i), this.binWidth);
            if (this.bins.has(bin)) {
                const newVal = this.bins.get(bin) + 1;
                this.bins.set(bin, newVal);
            } else {
                this.bins.set(bin, 1);
            }
        }
        // Map data is unsorted, so we must sort it before recreating the output series
        const keys = Array.from(this.bins.keys()).sort((a, b) => a - b);
        this.clear();
        const yValues: number[] = [];
        for (const key of keys) {
            yValues.push(this.bins.get(key));
        }
        this.appendRange(keys, yValues);
    }

    protected onClear() {
        this.clear();
        this.bins.clear();
    }
}

let lastX = 0;
// Straight line data
const getData = (n: number) => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let i = 0; i < n; i++) {
        xValues.push(lastX);
        yValues.push(50 + lastX/1000);
        lastX++;
    }
    return { xValues, yValues };
};

export const drawExample = async () => {
    // Define some constants
    const numberOfPointsPerTimerTick = 500; // 1,000 points every timer tick
    const timerInterval = 10; // timer tick every 10 milliseconds
    const maxPoints = 100000; // max points for a single series before the demo stops

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.applyTheme(new SciChartJSLightTheme());
    const rawXAxis = new NumericAxis(wasmContext, { id: "rawX", isVisible: false, autoRange: EAutoRange.Always });
    const aggXAxis = new NumericAxis(wasmContext, { 
        id: "aggX", 
        axisTitle: "Value",
        autoRange: EAutoRange.Always 
    });
    sciChartSurface.xAxes.add(rawXAxis, aggXAxis);

    const rawYAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        id: "rawY"
    });
    const aggYAxis = new NumericAxis(wasmContext, {
        axisTitle: "Frequency",
        id: "aggY",
        autoRange: EAutoRange.Always,
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0, 0.5)
    });
    sciChartSurface.yAxes.add(aggYAxis, rawYAxis);

    const dataSeries = new XyDataSeries(wasmContext);

    // Create a simple custom filter.  We just have to specify the filter function and this will be applied efficiently to data changes
    const gaussFilter = new XyCustomFilter(dataSeries);
    // This function exploits the central limit theorem to approximate a normal distribution
    const gaussianRand = () => {
        let rand = 0;
        for (let i = 0; i < 6; i += 1) {
            rand += Math.random();
        }
        return rand / 6;
    };
    gaussFilter.filterFunction = ((i, y) => y * gaussianRand());

    // Create a scatter series to show the randomised data
    const pointSeries = new XyScatterRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 1,
            height: 1,
            strokeThickness: 0,
            fill: "#5555ff"
        }),
        opacity: 0.2,
        dataSeries: gaussFilter,
        xAxisId: "rawX",
        yAxisId: "rawY"
    });

    // Pass the randomised data into the aggregation filter.
    const aggFilter = new AggregationFilter(gaussFilter, 5);
    const colSeries = new FastColumnRenderableSeries(wasmContext, {
        id: "col",
        fill: "#cc6600",
        stroke: "#cc9933",
        opacity: 0.5,
        dataSeries: aggFilter,
        xAxisId: "aggX",
        yAxisId: "aggY"
    });

    sciChartSurface.renderableSeries.add(pointSeries, colSeries);

    // Function called when the user clicks stopDemo button
    const stopDemo = () => {
        clearTimeout(timerId);
        timerId = undefined;
        lastX = 0;
    };

    // Function called when the user clicks startDemo button
    const startDemo = () => {
        if (timerId) {
            stopDemo();
            dataSeries.clear();
        }
        const updateFunc = () => {
            if (dataSeries.count() >= maxPoints) {
                stopDemo();
                return;
            }

            // Get the next N random walk x,y values
            const { xValues, yValues } = getData(numberOfPointsPerTimerTick);
            // Append these to the dataSeries. This will cause the chart to redraw
            dataSeries.appendRange(xValues, yValues);

            timerId = setTimeout(updateFunc, timerInterval);
        };

        dataSeries.clear();

        timerId = setTimeout(updateFunc, timerInterval);
    };

    return { wasmContext, sciChartSurface, controls: { startDemo, stopDemo } };
};

let scs: SciChartSurface;
let autoStartTimerId: NodeJS.Timeout;

export default function CustomFilters() {
    const [controls, setControls] = React.useState({ startDemo: () => {}, stopDemo: () => {} });

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
            setControls(res.controls);
            autoStartTimerId = setTimeout(res.controls.startDemo, 1000);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            controls.stopDemo();
            clearTimeout(timerId);
            clearTimeout(autoStartTimerId);
            scs?.delete();
        };
    }, []);

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div className={classes.ButtonsWrapper}>
                <Button onClick={controls.startDemo}>Start</Button>

                <Button onClick={controls.stopDemo}>Stop</Button>
            </div>
        </div>
    );
}
