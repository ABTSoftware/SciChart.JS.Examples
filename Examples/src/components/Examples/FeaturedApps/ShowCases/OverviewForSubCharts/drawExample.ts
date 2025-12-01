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
} from "scichart";

import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { OverviewSubSurfaceModifier } from "./OverviewSubSurfaceModifier";
import { summaryMarkTypes } from "./markTypeCategories";

export type TMarkType = EPerformanceMarkType | string;
const getIsEventMarkType = (markType: TMarkType) => !markType.endsWith("End") && !markType.endsWith("Start");

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

class CustomLabelProvider extends NumericLabelProvider {
    // protected customFormatLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);
    // protected customFormatCursorLabelProperty: TFormatLabelFn = (dataValueInSeconds: number) =>
    //     this.formatCursorLabelProperty(dataValueInSeconds / 1000);

    public override get formatLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
    public override get formatCursorLabel() {
        return formatUnixDateToHumanStringHHMMSSms;
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    // Add main axes to the surface for the overview to reference
    const mainXAxis = new NumericAxis(wasmContext, {
        id: "mainXAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always
    });
    const mainYAxis = new NumericAxis(wasmContext, {
        id: "mainYAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always
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

    for (let i = 0; i < subChartCount; i++) {
        // Define where this subchart sits in parent surface coords
        // Here: split parent viewport into equal-height rows, leaving space for overview
        const rect = new Rect(0, (i / subChartCount) * 0.9, 1, (1 / subChartCount) * 0.9);

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

        // Also add a series to the main surface for the overview to pick up
        const mainSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 1,
            opacity: 0, // Make it invisible on main surface
            xAxisId: "mainXAxis",
            yAxisId: "mainYAxis"
        });
        sciChartSurface.renderableSeries.add(mainSeries);
    }

    // Add overview modifier with proper axis configuration
    sciChartSurface.chartModifiers.add(
        new OverviewSubSurfaceModifier({
            id: "overviewSubSurface",
            mainAxisId: "mainXAxis", // Reference the main X axis
            secondaryAxisId: "mainYAxis", // Reference the main Y axis
            coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
            position: new Rect(0, 0.9, 1, 0.1),
            isTransparent: false,
            overviewXAxisOptions: {
                id: "overviewXAxis",
                isVisible: true,
                isInnerAxis: false,
                drawMajorBands: false,
                drawMajorGridLines: false,
                drawMinorGridLines: false,
                majorTickLineStyle: {
                    color: "white",
                    tickSize: 8,
                    strokeThickness: 1,
                },
                labelStyle: {
                    color: "white",
                    fontSize: 8,
                },
            },
            overviewYAxisOptions: {
                id: "overviewYAxis",
                isVisible: false,
                growBy: new NumberRange(0.1, 0.1),
            },
            transformRenderableSeries: (rendSeries: IRenderableSeries) => {
                // Only transform series that are on the main axes (our invisible overview series)
                if (rendSeries.xAxisId !== "mainXAxis" || rendSeries.yAxisId !== "mainYAxis") {
                    return undefined;
                }
                
                // Clone the series for the overview
                const [overviewSeries] = buildSeries(wasmContext, rendSeries.toJSON(true));
                overviewSeries.dataSeries.delete();
                overviewSeries.dataSeries = rendSeries.dataSeries;
                overviewSeries.xAxisId = "overviewXAxis";
                overviewSeries.yAxisId = "overviewYAxis";
                overviewSeries.strokeThickness = 2;
                overviewSeries.opacity = 0.8;
                return overviewSeries;
            },
        })
    );

    return { wasmContext, sciChartSurface };
};
