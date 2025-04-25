import {
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    Thickness,
    ETextAlignment,
    ETitlePosition,
    ENumericFormat,
    EAxisAlignment,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnYMode,
    EColumnMode,
    EDataPointWidthMode,
    EResamplingMode,
    NumberRange,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    LegendModifier,
    ELegendPlacement,
    ELegendOrientation,
    SeriesInfo,
    TextLabelProvider,
    parseColorToTArgb,
    RolloverModifier,
    EXyDirection,
    RectangleSeriesDataLabelProvider,
    BasePaletteProvider,
    DateTimeNumericAxis,
    CategoryAxis,
    FastErrorBarsRenderableSeries,
    FastBoxPlotRenderableSeries,
    BoxPlotDataSeries,
    HlcDataSeries,
} from "scichart";
import { appTheme } from "../../../theme";

export enum EGanttChartTypeBaseSeries {
    rectangle = "rectangle",
    boxPlot = "boxPlot",
    errorBars = "errorBars"
}

const PROJECT_STAGES = [
    "Project Planning",
    "Requirements",
    "System Design",
    "Database Design",
    "Front-end dev",
    "Back-end dev",
    "Integration",
    "Unit Testing",
    "System Testing",
    "Deployment"
]

const PROJECT_TASKS = [
    { 
        namename: PROJECT_STAGES[0],
        startDate: new Date(2025, 0, 1), 
        endDate: new Date(2025, 0, 15), 
        percentComplete: 100 
    },
    { 
        name: PROJECT_STAGES[1],
        startDate: new Date(2025, 0, 10), 
        endDate: new Date(2025, 0, 25), 
        percentComplete: 100 
    },
    { 
        name: PROJECT_STAGES[2],
        startDate: new Date(2025, 0, 20), 
        endDate: new Date(2025, 1, 15), 
        percentComplete: 90 
    },
    { 
        name: PROJECT_STAGES[3],
        startDate: new Date(2025, 1, 5), 
        endDate: new Date(2025, 1, 20), 
        percentComplete: 85 
    },
    { 
        name: PROJECT_STAGES[4],
        startDate: new Date(2025, 1, 15), 
        endDate: new Date(2025, 2, 25), 
        percentComplete: 70 
    },
    { 
        name: PROJECT_STAGES[5],
        startDate: new Date(2025, 1, 15), 
        endDate: new Date(2025, 3, 5), 
        percentComplete: 60 
    },
    { 
        name: PROJECT_STAGES[6],
        startDate: new Date(2025, 2, 25), 
        endDate: new Date(2025, 3, 15), 
        percentComplete: 30 
    },
    { 
        name: PROJECT_STAGES[7],
        startDate: new Date(2025, 3, 1), 
        endDate: new Date(2025, 3, 20), 
        percentComplete: 20 
    },
    { 
        name: PROJECT_STAGES[8],
        startDate: new Date(2025, 3, 15), 
        endDate: new Date(2025, 4, 5), 
        percentComplete: 0 
    },
    { 
        name: PROJECT_STAGES[9],
        startDate: new Date(2025, 4, 1), 
        endDate: new Date(2025, 4, 15), 
        percentComplete: 0 
    }
];

function prepareGanttData() {    
    // Prepare data for rect series
    const xValues: number[] = []; // Start dates
    const yValues: number[] = []; // Task positions (rows)
    const x1Values: number[] = []; // End dates
    const y1Values: number[] = []; // Task heights
    
    // Task metadata for coloring and labels
    const metaData: { name: string; percentComplete: number }[] = [];
    
    // Convert Date objects to timestamps for rendering
    PROJECT_TASKS.forEach((task, index) => {
        const rowPosition = PROJECT_TASKS.length - index - 1; // Reverse order for display
        const rowHeight = 0.9; // Height of each task bar
        
        yValues.push(task.startDate.getTime() / 1000);
        xValues.push(rowPosition);
        y1Values.push(task.endDate.getTime() / 1000);
        x1Values.push(rowPosition + rowHeight);
        
        metaData.push({
            name: task.name,
            percentComplete: task.percentComplete
        });
    });
    
    return { xValues, yValues, x1Values, y1Values, metaData, taskCount: PROJECT_TASKS.length };
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme
    });

    // Make a vertical chart
    const xAxis = new CategoryAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.02, 0.02),
        autoTicks: false,
        majorDelta: 1,
        labels: PROJECT_STAGES
    });
    sciChartSurface.xAxes.add(xAxis);
    
    // Create Y-axis (Tasks)
    const yAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.05, 0.05),
        flippedCoordinates: true,
        axisTitleStyle: {
            fontSize: 14,
            fontFamily: "Arial",
            color: "#FFFFFF",
            fontStyle: "italic",
        },
        labelFormat: ENumericFormat.Date_DDMM
    });
    sciChartSurface.yAxes.add(yAxis);

    const { xValues, yValues, x1Values, y1Values, metaData, taskCount } = prepareGanttData();

    // Method #1 of doing a Gantt chart - FastRectangleRenderableSeries
    const rectangleGanttSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            y1Values,
            x1Values,
            dataSeriesName: "Project Tasks",
        }),
        columnXMode: EColumnMode.Mid,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: "red",
        strokeThickness: 2,
        fill: appTheme.DarkIndigo,
        dataPointWidth: 0.9,
        topCornerRadius: 8,
        bottomCornerRadius: 8,
        dataLabels: {
            color: "#FFFFFF",
            style: {
                fontSize: 10,
            },
            numericFormat: ENumericFormat.Engineering,
            verticalTextPosition: EVerticalTextPosition.Center,
            horizontalTextPosition: EHorizontalTextPosition.Center,
        },
    });

    // Method #2 of doing a Gantt chart - FastBoxPlotRenderableSeries
    const boxPlotGanttSeries = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues,

            minimumValues: yValues.map(val => val - 60 * 60 * 24 * 5),
            lowerQuartileValues: yValues,
            medianValues: yValues.map((val, i) => val + (y1Values[i] - val) / 2),
            upperQuartileValues: y1Values,
            maximumValues: y1Values.map(val => val + 60 * 60 * 24 * 5),
        }),
        stroke: appTheme.VividTeal,
        strokeThickness: 2,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.5,
        fill: appTheme.MutedOrange,
        strokeDashArray: [5, 7], // support for the box does not work ???
        whiskers: {
            stroke: appTheme.VividTeal,
            strokeThickness: 2,
            strokeDashArray: [3, 2]
        },
        cap: {
            stroke: appTheme.VividTeal,
            strokeThickness: 2,
            dataPointWidth: 0.5
        },
        medianLine: {
            strokeThickness: 0,
            stroke: appTheme.VividTeal,
        },
    })
    // boxPlotGanttSeries.rolloverModifierProps.tooltipDataTemplate = (seriesInfo: SeriesInfo, tooltipTitle: string, tooltipLabelX: string, tooltipLabelY: string) => {
    //     console.log(seriesInfo.renderableSeries.dataSeries);
    //     return [
    //         "Start - " + new Date(seriesInfo.formattedYValue).toLocaleDateString(),
    //         "End - " + new Date(seriesInfo.point2yValue).toLocaleDateString(),
    //     ]
    // };

    const errorBarGanttSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, {
            xValues,
            yValues,
            highValues: yValues,
            lowValues: y1Values,

            dataSeriesName: "Project Tasks",
        }),
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: "red",
        strokeThickness: 1,
    });

    sciChartSurface.renderableSeries.add(
        boxPlotGanttSeries,
    );
    
    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({
            enableZoom: true,
            xyDirection: EXyDirection.YDirection, // Only zoom horizontally
        }),
        new ZoomExtentsModifier(),
        new RolloverModifier({
            rolloverLineStroke: "white",
        })
    );
    
    return { 
        sciChartSurface, 
        wasmContext, 
        controls: {
            changeSeriesType: (type: EGanttChartTypeBaseSeries) => {                
                sciChartSurface.renderableSeries.asArray().forEach((series) => {
                    sciChartSurface.renderableSeries.remove(series);
                });


                switch (type) {
                    case EGanttChartTypeBaseSeries.rectangle:
                        sciChartSurface.renderableSeries.add(rectangleGanttSeries);
                        break;
                    case EGanttChartTypeBaseSeries.boxPlot:
                        sciChartSurface.renderableSeries.add(boxPlotGanttSeries);
                        break;
                    case EGanttChartTypeBaseSeries.errorBars:
                        sciChartSurface.renderableSeries.add(errorBarGanttSeries);
                        break;
                    default:
                }
            }
        }
    };
};