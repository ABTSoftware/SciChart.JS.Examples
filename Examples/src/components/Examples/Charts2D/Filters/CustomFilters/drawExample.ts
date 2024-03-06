import { appTheme } from "scichart-example-dependencies";

import {
    BaseDataSeries,
    NumericAxis,
    EAutoRange,
    EAxisAlignment,
    ELabelAlignment,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    EllipsePointMarker,
    LegendModifier,
    NumberRange,
    SciChartSurface,
    XyCustomFilter,
    XyDataSeries,
    XyFilterBase,
    XyScatterRenderableSeries,
} from "scichart";

// A custom filter which calculates the frequency distribution of the original data
class AggregationFilter extends XyFilterBase {
    private bins: Map<number, number> = new Map<number, number>();
    private binWidthProperty = 1;

    constructor(originalSeries: BaseDataSeries, binWidth: number, dataSeriesName: string) {
        super(originalSeries, { dataSeriesName });
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
        yValues.push(50 + lastX / 1000);
        lastX++;
    }
    return { xValues, yValues };
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Define some constants
    const numberOfPointsPerTimerTick = 500; // 1,000 points every timer tick
    const timerInterval = 10; // timer tick every 10 milliseconds
    const maxPoints = 100_000; // max points for a single series before the demo stops

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const rawXAxis = new NumericAxis(wasmContext, { id: "rawX", isVisible: false, autoRange: EAutoRange.Always });
    const aggXAxis = new NumericAxis(wasmContext, {
        id: "aggX",
        axisTitle: "Value",
        autoRange: EAutoRange.Always,
        labelPrecision: 0,
    });
    sciChartSurface.xAxes.add(rawXAxis, aggXAxis);

    const rawYAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        axisTitle: "Raw Data",
        id: "rawY",
        labelPrecision: 0,
        labelStyle: { alignment: ELabelAlignment.Right },
    });
    const aggYAxis = new NumericAxis(wasmContext, {
        axisTitle: "Frequency (Aggregated)",
        id: "aggY",
        autoRange: EAutoRange.Always,
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0, 0.5),
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(aggYAxis, rawYAxis);

    const dataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Original Data" });

    // Create a simple custom filter.  We just have to specify the filter function and this will be applied efficiently to data changes
    const gaussFilter = new XyCustomFilter(dataSeries, { dataSeriesName: "Custom Filter: Original x Gaussian Random" });
    // This function exploits the central limit theorem to approximate a normal distribution
    const gaussianRand = () => {
        let rand = 0;
        for (let i = 0; i < 6; i += 1) {
            rand += Math.random() + 0.5;
        }
        return rand / 6;
    };
    gaussFilter.filterFunction = (i, y) => y * gaussianRand();

    // Add the randomised data using a custom filter which takes original data * random value
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 3,
                height: 3,
                strokeThickness: 0,
                fill: appTheme.VividOrange,
                opacity: 0.77,
            }),
            stroke: appTheme.VividOrange,
            dataSeries: gaussFilter,
            xAxisId: "rawX",
            yAxisId: "rawY",
        })
    );

    // Add the original data to the chart
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: appTheme.VividTeal,
            strokeThickness: 3,
            xAxisId: "rawX",
            yAxisId: "rawY",
        })
    );

    // Pass the randomised data into the aggregation filter.
    const aggFilter = new AggregationFilter(gaussFilter, 5, "Custom Filter: Aggregation");

    // Plot the aggregation filter as a column chart
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            id: "col",
            fill: appTheme.VividSkyBlue + "33",
            stroke: appTheme.MutedSkyBlue,
            dataSeries: aggFilter,
            xAxisId: "aggX",
            yAxisId: "aggY",
            cornerRadius: 10,
        })
    );

    let timerId: NodeJS.Timeout;

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

    sciChartSurface.chartModifiers.add(new LegendModifier());

    return { wasmContext, sciChartSurface, controls: { startDemo, stopDemo } };
};
