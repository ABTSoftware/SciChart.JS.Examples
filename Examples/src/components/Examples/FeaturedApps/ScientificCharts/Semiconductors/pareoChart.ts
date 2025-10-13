import {
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    ENumericFormat,
    LegendModifier,
    EAxisAlignment,
    ELineDrawMode,
    EllipsePointMarker,
    CategoryAxis,
    TextLabelProvider,
    Thickness,
    EVerticalTextPosition,
    EHorizontalTextPosition,
} from "scichart";

import { WaferLotData } from "./waferData";
import { appTheme } from "../../../theme";

interface IParetoBatchData {
    batch: number;
    input2Sum: number;
    input2Average: number;
    count: number;
    cumulativePercentage: number;
}

export const drawPareoChart = async (rootElement: string | HTMLDivElement, waferData: WaferLotData[] = []) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        // padding: { left: 20, top: 20, right: 20, bottom: 20 },
    });

    const growByX = new NumberRange(0.01, 0.01);
    const growByY = new NumberRange(0.01, 0.3);

    // Process data for Pareto chart
    const batchData = processDataForPareto(waferData);

    //console.log({ batchData });

    // X Axis for Batch
    sciChartSurface.xAxes.add(
        new CategoryAxis(wasmContext, {
            axisTitle: "Batch",
            growBy: growByX,
            labelStyle: { fontSize: 10 },
            axisTitleStyle: { fontSize: 12 },
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
            minorDelta: 1,
            majorDelta: 1,
            maxAutoTicks: 15,
        })
    );

    // Primary Y Axis for Input2 values
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: "primaryYAxis",
            axisAlignment: EAxisAlignment.Left,
            growBy: growByY,
            axisTitle: "Quality",
            labelStyle: { fontSize: 10 },
            axisTitleStyle: { fontSize: 12 },
        })
    );

    // Secondary Y Axis for cumulative percentage
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: "secondaryYAxis",
            axisAlignment: EAxisAlignment.Right,
            growBy: growByY,
            axisTitle: "Cumulative %",
            labelFormat: ENumericFormat.Decimal,
            visibleRange: new NumberRange(0, 110),
            labelStyle: { fontSize: 10 },
            axisTitleStyle: { fontSize: 12 },
        })
    );

    // Data series for Input2 bars
    const input2BarSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Quality",
        xValues: batchData.map((item) => item.batch),
        yValues: batchData.map((item) => item.input2Sum),
    });

    // Data series for cumulative percentage line
    const cumulativePercentageSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Cumulative %",
        xValues: batchData.map((item) => item.batch),
        yValues: batchData.map((item) => item.cumulativePercentage),
    });

    // Column series for Input2 values
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: input2BarSeries,
        yAxisId: "primaryYAxis",
        fill: appTheme.MutedSkyBlue,
        stroke: appTheme.MutedSkyBlue,
        strokeThickness: 1,
        opacity: 0.8,
        cornerRadius: 3,
        dataLabels: {
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Above,
            style: { fontFamily: "Arial", fontSize: 10, padding: new Thickness(0, 0, 8, 0) },
            color: appTheme.ForegroundColor,
            precision: 0,
        },
    });

    // Line series for cumulative percentage
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: cumulativePercentageSeries,
        yAxisId: "secondaryYAxis",
        stroke: appTheme.MutedOrange,
        strokeThickness: 3,
        drawNaNAs: ELineDrawMode.DiscontinuousLine,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 8,
            height: 8,
            fill: appTheme.MutedOrange,
            stroke: "white", //appTheme.White,
            strokeThickness: 2,
        }),
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 10,
                padding: new Thickness(5, 5, 5, 5),
            },
            color: "white",
            verticalTextPosition: EVerticalTextPosition.Above,
        },
    });

    // Add series to chart
    sciChartSurface.renderableSeries.add(columnSeries);
    sciChartSurface.renderableSeries.add(lineSeries);

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    // sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    // sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            showCheckboxes: true,
            showSeriesMarkers: true,
            showLegend: true,
        })
    );

    // sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

function processDataForPareto(waferData: WaferLotData[]): IParetoBatchData[] {
    if (!waferData || waferData.length === 0) return [];

    // Group data by batch
    const batchGroups = new Map<number, WaferLotData[]>();
    [...waferData]
        .sort((a, b) => a.Input2 - b.Input2)
        .forEach((item) => {
            const batch = item.Batch;
            if (!batchGroups.has(batch)) {
                batchGroups.set(batch, []);
            }
            batchGroups.get(batch)!.push(item);
        });

    // Calculate Input2 sum for each batch
    const batchSummary: IParetoBatchData[] = [];
    batchGroups.forEach((items, batch) => {
        const input2Sum = items.reduce((sum, item) => sum + item.Input2, 0);
        const input2Average = input2Sum / items.length;

        batchSummary.push({
            batch,
            input2Sum,
            input2Average,
            count: items.length,
            cumulativePercentage: 0,
        });
    });

    // Sort by Input2 sum descending (Pareto principle)
    batchSummary.sort((a, b) => b.input2Sum - a.input2Sum);

    // Calculate cumulative percentages
    const totalInput2 = batchSummary.reduce((sum, item) => sum + item.input2Sum, 0);
    let cumulativeSum = 0;
    batchSummary.forEach((item) => {
        cumulativeSum += item.input2Sum;
        item.cumulativePercentage = (cumulativeSum / totalInput2) * 100;
    });

    return batchSummary;
}

// import {
//     StackedColumnRenderableSeries,
//     MouseWheelZoomModifier,
//     NumberRange,
//     NumericAxis,
//     SciChartSurface,
//     XyDataSeries,
//     ZoomExtentsModifier,
//     ZoomPanModifier,
//     DateTimeNumericAxis,
//     ENumericFormat,
//     DateLabelProvider,
//     IPointMetadata,
//     IStackedColumnSeriesDataLabelProviderOptions,
//     Thickness,
//     EColumnDataLabelPosition,
//     EVerticalTextPosition,
//     LegendModifier,
// } from "scichart";

// import { WaferLotData } from "./waferData";
// import { appTheme } from "../../../theme";

// // Define a custom metadata interface for column data
// interface IColumnPointMetadata extends IPointMetadata {
//     measure1: number;
//     measure2: number;
//     measure3: number;
// }

// export const drawPareoChart = async (rootElement: string | HTMLDivElement, waferData: WaferLotData[] = []) => {
//     // Create a SciChartSurface
//     const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
//         theme: appTheme.SciChartJsTheme,
//     });

//     console.log({ waferData });

//     const growByX = new NumberRange(0.1, 0.1);
//     const growByY = new NumberRange(0.1, 0.3);

//     // Create the X,Y Axis
//     sciChartSurface.xAxes.add(
//         new DateTimeNumericAxis(wasmContext, {
//             axisTitle: "Date",
//             labelProvider: new DateLabelProvider({ labelFormat: ENumericFormat.Date_DDMMYYYY }),
//             growBy: growByX,
//             labelStyle: {
//                 fontSize: 10,
//             },
//             axisTitleStyle: {
//                 fontSize: 12,
//             },
//         })
//     );

//     sciChartSurface.yAxes.add(
//         new NumericAxis(wasmContext, {
//             growBy: growByY,
//             axisTitle: "Thickness (nm)",
//             minorDelta: 5,
//             majorDelta: 10,
//             labelStyle: {
//                 fontSize: 10,
//             },
//             axisTitleStyle: {
//                 fontSize: 12,
//             },
//         })
//     );

//     // Convert dates to timestamps
//     const xValues = waferData.map((item) => new Date(item.Date).getTime() / 1000);

//     // Create metadata for each point to store all measure values
//     const metadata = waferData.map(
//         (item) =>
//             ({
//                 isSelected: false,
//                 measure1: item.Measure1,
//                 measure2: item.Measure2,
//                 measure3: item.Measure3,
//             } as IColumnPointMetadata)
//     );

//     // Create data series for each measure
//     const measure1Series = new XyDataSeries(wasmContext, {
//         dataSeriesName: "Film thickness in nm",
//         xValues,
//         yValues: waferData.map((item) => item.Measure1),
//         metadata,
//     });

//     const measure2Series = new XyDataSeries(wasmContext, {
//         dataSeriesName: "Line width in nm",
//         xValues,
//         yValues: waferData.map((item) => item.Measure2),
//         metadata,
//     });

//     const measure3Series = new XyDataSeries(wasmContext, {
//         dataSeriesName: "Sheet resistance in Ω/sq",
//         xValues,
//         yValues: waferData.map((item) => item.Measure3),
//         metadata,
//     });

//     const dataLabels: IStackedColumnSeriesDataLabelProviderOptions = {
//         color: "#FFfFFF",
//         style: {
//             fontSize: sciChartSurface.domCanvas2D.width < 500 ? 0 : 12,
//             fontFamily: "Arial",
//             padding: new Thickness(0, 0, 2, 0),
//         },
//         precision: 0,
//         positionMode: EColumnDataLabelPosition.Outside,
//         verticalTextPosition: EVerticalTextPosition.Center,
//     };

//     const measure1Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
//         dataSeries: measure1Series,
//         fill: appTheme.PaleSkyBlue,
//         stroke: appTheme.MutedSkyBlue,
//         strokeThickness: 1,
//         opacity: 0.6,
//         stackedGroupId: "measures",
//         dataLabels,
//     });

//     const measure2Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
//         dataSeries: measure2Series,
//         fill: appTheme.PaleTeal,
//         stroke: appTheme.MutedTeal,
//         strokeThickness: 1,
//         opacity: 0.6,
//         stackedGroupId: "measures",
//         dataLabels,
//     });

//     const measure3Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
//         dataSeries: measure3Series,
//         fill: appTheme.PalePink,
//         stroke: appTheme.MutedPink,
//         strokeThickness: 1,
//         opacity: 0.6,
//         stackedGroupId: "measures",
//         dataLabels,
//     });

//     // Add all series to the chart
//     sciChartSurface.renderableSeries.add(measure1Series_stacked);
//     sciChartSurface.renderableSeries.add(measure2Series_stacked);
//     sciChartSurface.renderableSeries.add(measure3Series_stacked);

//     // Add interactivity modifiers
//     sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
//     sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
//     sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

//     sciChartSurface.chartModifiers.add(
//         new LegendModifier({
//             showCheckboxes: true,
//             showSeriesMarkers: true,
//             showLegend: true,
//         })
//     );

//     // Zoom to fit
//     sciChartSurface.zoomExtents();

//     return { sciChartSurface, wasmContext };
// };
