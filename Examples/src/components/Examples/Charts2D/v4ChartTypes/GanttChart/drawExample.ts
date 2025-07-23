import {
    ZoomPanModifier,
    ZoomExtentsModifier,
    SciChartSurface,
    ENumericFormat,
    EAxisAlignment,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnYMode,
    EColumnMode,
    EDataPointWidthMode,
    NumberRange,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    SeriesInfo,
    EXyDirection,
    DateTimeNumericAxis,
    CategoryAxis,
    ELabelAlignment,
    CursorModifier,
    TCursorTooltipDataTemplate,
} from "scichart";
import { appTheme } from "../../../theme";

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
    "Deployment",
];

const PROJECT_TASKS = [
    {
        name: PROJECT_STAGES[0],
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 0, 15),
        percentComplete: 100,
    },
    {
        name: PROJECT_STAGES[1],
        startDate: new Date(2025, 0, 10),
        endDate: new Date(2025, 0, 25),
        percentComplete: 100,
    },
    {
        name: PROJECT_STAGES[2],
        startDate: new Date(2025, 0, 20),
        endDate: new Date(2025, 1, 15),
        percentComplete: 90,
    },
    {
        name: PROJECT_STAGES[3],
        startDate: new Date(2025, 1, 5),
        endDate: new Date(2025, 1, 20),
        percentComplete: 85,
    },
    {
        name: PROJECT_STAGES[4],
        startDate: new Date(2025, 1, 15),
        endDate: new Date(2025, 2, 25),
        percentComplete: 70,
    },
    {
        name: PROJECT_STAGES[5],
        startDate: new Date(2025, 1, 15),
        endDate: new Date(2025, 3, 5),
        percentComplete: 60,
    },
    {
        name: PROJECT_STAGES[6],
        startDate: new Date(2025, 2, 25),
        endDate: new Date(2025, 3, 15),
        percentComplete: 30,
    },
    {
        name: PROJECT_STAGES[7],
        startDate: new Date(2025, 3, 1),
        endDate: new Date(2025, 3, 20),
        percentComplete: 20,
    },
    {
        name: PROJECT_STAGES[8],
        startDate: new Date(2025, 3, 15),
        endDate: new Date(2025, 4, 5),
        percentComplete: 0,
    },
    {
        name: PROJECT_STAGES[9],
        startDate: new Date(2025, 4, 1),
        endDate: new Date(2025, 4, 15),
        percentComplete: 0,
    },
];

function prepareGanttData() {
    // Prepare data for rect series
    const xValues: number[] = []; // Start dates
    const yValues: number[] = []; // Task positions (rows)
    const x1Values: number[] = []; // End dates
    const y1Values: number[] = []; // Task heights

    // Task metadata for coloring and labels
    const metaData: { name: string; percentComplete: number; isSelected: boolean; startDate: Date; endDate: Date }[] =
        [];

    // Convert Date objects to timestamps for rendering
    PROJECT_TASKS.forEach((task, index) => {
        const rowPosition = PROJECT_TASKS.length - index - 1; // Reverse order for display
        const rowHeight = 0.8; // Height of each task bar

        xValues.push(task.startDate.getTime() / 1000);
        yValues.push(rowPosition);
        x1Values.push(task.endDate.getTime() / 1000);
        y1Values.push(rowPosition + rowHeight);

        metaData.push({
            name: task.name,
            percentComplete: task.percentComplete,
            isSelected: false,
            startDate: task.startDate,
            endDate: task.endDate,
        });
    });

    return { xValues, yValues, x1Values, y1Values, metaData, taskCount: PROJECT_TASKS.length };
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const yAxis = new CategoryAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        drawMajorBands: false,
        drawLabels: true,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        keepLabelsWithinAxis: false,
        autoTicks: false,
        majorDelta: 1,
        growBy: new NumberRange(0.02, 0.02),
        labels: PROJECT_STAGES.reverse(),
        labelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            color: appTheme.MutedOrange,
            alignment: ELabelAlignment.Right,
            padding: { top: 0, right: 0, bottom: 40, left: 0 },
        },
    });

    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Bottom,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.02, 0.02),
        // axisTitleStyle: {
        //     fontSize: 14,
        //     fontFamily: "Arial",
        //     color: appTheme.MutedOrange,
        //     // fontStyle: "italic",
        // },
        labelFormat: ENumericFormat.Date_DDMM,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.yAxes.get(0).axisRenderer.hideOverlappingLabels = false;

    const { xValues, yValues, x1Values, y1Values, metaData, taskCount } = prepareGanttData();

    const rectangleGanttSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            y1Values,
            x1Values,
            dataSeriesName: "Project Tasks",
            metadata: metaData,
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: appTheme.MutedRed,
        strokeThickness: 2,
        fill: appTheme.MutedBlue,
        dataPointWidth: 0.9,
        topCornerRadius: 4,
        opacity: 0.5,
        bottomCornerRadius: 4,
        dataLabels: {
            color: appTheme.ForegroundColor,
            style: {
                fontSize: 14,
            },
            numericFormat: ENumericFormat.Engineering,
            verticalTextPosition: EVerticalTextPosition.Center,
            horizontalTextPosition: EHorizontalTextPosition.Center,
            metaDataSelector: (md) => {
                const metadata = md as { name: string; percentComplete: number; isSelected: boolean };
                return `${metadata.percentComplete.toString()} %`;
            },
        },
    });

    sciChartSurface.renderableSeries.add(rectangleGanttSeries);

    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[]) => {
        const valuesWithLabels: string[] = [];

        seriesInfos.forEach((si) => {
            const xySI = si;
            if (xySI.isWithinDataBounds) {
                if (!isNaN(xySI.yValue) && xySI.isHit) {
                    valuesWithLabels.push(
                        `Start: ${new Date(
                            (xySI.pointMetadata as { startDate: number }).startDate
                        ).toLocaleDateString()}, End: ${new Date(
                            (xySI.pointMetadata as { endDate: number }).endDate
                        ).toLocaleDateString()}`
                    );
                }
            }
        });
        return valuesWithLabels;
    };

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({
            enableZoom: true,
            xyDirection: EXyDirection.XDirection, // Only zoom horizontally
        }),
        new ZoomExtentsModifier(),
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate,
            showXLine: false,
            showYLine: false,
            tooltipContainerBackground: appTheme.MutedRed + 55,
        })
    );

    return {
        sciChartSurface,
        wasmContext,
    };
};
