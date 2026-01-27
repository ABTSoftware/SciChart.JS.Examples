import {
    SciChartSurface,
    NumericAxis,
    EAxisAlignment,
    NumberRange,
    FastLineRenderableSeries,
    XyDataSeries,
    AUTO_COLOR,
    SweepAnimation,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    RolloverModifier,
    ESubSurfacePositionCoordinateMode,
    Rect,
    NumericLabelProvider,
    IRenderableSeries,
    EPerformanceMarkType,
    buildSeries,
    ECoordinateMode,
    SciChartSubSurface,
    I2DSubSurfaceOptions,
    EAutoRange,
    OverviewRangeSelectionModifier,
} from "scichart";

import { OverviewSubSurfaceModifier } from "./OverviewSubSurfaceModifier";

export type TMarkType = EPerformanceMarkType | string;

const formatUnixDateToHumanStringHHMMSSms = (timestamp: DOMHighResTimeStamp): string => {
    const date = new Date(timestamp); // notice there's no multiplication by 1000 here. The data is expected to be in ms
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
        return "";
    }
    const hoursString = hours <= 9 ? `0${hours}` : hours.toString(10);
    const minutesString = minutes <= 9 ? `0${minutes}` : minutes.toString(10);
    const secondsString = seconds <= 9 ? `0${seconds}` : seconds.toString(10);
    const millisecondsString = milliseconds <= 9 ? `0${milliseconds}` : milliseconds.toString(10);
    return `${hoursString}:${minutesString}:${secondsString}:${millisecondsString}`;
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    // Add main axes to the surface for the overview to reference
    const mainXAxis = new NumericAxis(wasmContext, {
        id: "mainXAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always,
    });
    const mainYAxis = new NumericAxis(wasmContext, {
        id: "mainYAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always,
    });

    sciChartSurface.xAxes.add(mainXAxis);
    sciChartSurface.yAxes.add(mainYAxis);

    // Helper to create some sample data
    const createLineData = (phase: number) => {
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let i = 0; i < 100; i++) {
            const x = i;
            const y = Math.sin(i * 0.1 + phase);
            xValues.push(x);
            yValues.push(y);
        }
        return { xValues, yValues };
    };

    // Config for N vertically stacked subcharts (panes)
    const subChartCount = 3;

    // Store all data series for the overview
    const allDataSeries: XyDataSeries[] = [];
    let lastSubChart: any = null; // Store reference to the last subchart

    for (let i = 0; i < subChartCount; i++) {
        // Define where this subchart sits in parent surface coords
        // Here: split parent viewport into equal-height rows, leaving space for overview
        const rect = new Rect(0, (i / subChartCount) * 0.8, 1, (1 / subChartCount) * 0.8);

        const subChartOptions: I2DSubSurfaceOptions = {
            id: `subChart-${i}`,
            position: rect,
            coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        };

        const subChart = SciChartSubSurface.createSubSurface(sciChartSurface, subChartOptions);

        // Each subchart gets its own axes
        const subXAxis = new NumericAxis(wasmContext);
        const subYAxis = new NumericAxis(wasmContext, { axisTitle: `Pane ${i + 1}` });

        subChart.xAxes.add(subXAxis);
        subChart.yAxes.add(subYAxis);

        const data = createLineData(i * 0.7);

        const dataSeries = new XyDataSeries(wasmContext, {
            xValues: data.xValues,
            yValues: data.yValues,
        });

        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 2,
        });

        subChart.renderableSeries.add(lineSeries);

        subChart.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier(), new ZoomExtentsModifier());

        // Fit each subchart to its data
        subChart.zoomExtents();

        // Store data series for overview
        allDataSeries.push(dataSeries);

        // Store reference to the last subchart
        if (i === subChartCount - 1) {
            lastSubChart = subChart;
        }

        // Only add series to main surface for the last chart (for overview)
        if (i === subChartCount - 1) {
            const mainSeries = new FastLineRenderableSeries(wasmContext, {
                dataSeries,
                strokeThickness: 1,
                opacity: 0, // Make it invisible on main surface
                xAxisId: "mainXAxis",
                yAxisId: "mainYAxis",
            });
            sciChartSurface.renderableSeries.add(mainSeries);
        }
    }

    // Create a simple overview subsurface that controls only the last chart
    const overviewRect = new Rect(0, 0.8, 1, 0.2);
    const overviewOptions: I2DSubSurfaceOptions = {
        id: "overviewSubSurface",
        position: overviewRect,
        coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        isTransparent: true,
    };

    const overviewSubSurface = SciChartSubSurface.createSubSurface(sciChartSurface, overviewOptions);

    // Create axes for the overview
    const overviewXAxis = new NumericAxis(wasmContext, {
        id: "overviewXAxis",
        isVisible: true,
        autoRange: EAutoRange.Always,
        axisTitle: "Overview - Controls Pane 3",
        labelStyle: {
            color: "#ffffff", // "#50C7E3"
            fontSize: 10,
        },
        majorTickLineStyle: {
            color: "#ffffff",
            tickSize: 6,
            strokeThickness: 1,
        },
    });

    const overviewYAxis = new NumericAxis(wasmContext, {
        id: "overviewYAxis",
        isVisible: true,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.1, 0.1),
        labelStyle: {
            color: "#ffffff",
            fontSize: 8,
        },
    });

    overviewSubSurface.xAxes.add(overviewXAxis);
    overviewSubSurface.yAxes.add(overviewYAxis);

    // Add the last chart's data to the overview
    const lastChartData = allDataSeries[subChartCount - 1];
    const overviewSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: lastChartData,
        strokeThickness: 2,
        opacity: 0.8,
    });
    overviewSubSurface.renderableSeries.add(overviewSeries);

    // Add range selection modifier to control the last subchart
    const rangeSelectionModifier = new OverviewRangeSelectionModifier();
    rangeSelectionModifier.xAxisId = overviewXAxis.id;
    rangeSelectionModifier.yAxisId = overviewYAxis.id;

    // Get the last subchart's X axis
    const lastSubChartXAxis = lastSubChart.xAxes.get(0);

    // When overview selection changes, update the last subchart
    rangeSelectionModifier.onSelectedAreaChanged = (selectedRange: NumberRange) => {
        if (!selectedRange.equals(lastSubChartXAxis.visibleRange)) {
            lastSubChartXAxis.setVisibleRangeWithLimits(selectedRange);
        }
    };

    // When last subchart zoom changes, update the overview selection
    lastSubChartXAxis.visibleRangeChanged.subscribe(({ visibleRange }: { visibleRange: NumberRange }) => {
        const updatedSelectedRange = visibleRange.clip(overviewXAxis.visibleRange);
        const shouldUpdateSelectedRange = !updatedSelectedRange.equals(rangeSelectionModifier.selectedArea);
        if (shouldUpdateSelectedRange) {
            rangeSelectionModifier.selectedArea = updatedSelectedRange;
        }
    });

    // Set initial selection
    rangeSelectionModifier.selectedArea = lastSubChartXAxis.visibleRange;

    overviewSubSurface.chartModifiers.add(rangeSelectionModifier);
    overviewSubSurface.zoomExtents();

    return { wasmContext, sciChartSurface };
};
