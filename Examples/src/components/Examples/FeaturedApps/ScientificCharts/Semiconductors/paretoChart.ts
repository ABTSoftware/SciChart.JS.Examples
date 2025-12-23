import {
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    ZoomPanModifier,
    ENumericFormat,
    LegendModifier,
    EAxisAlignment,
    ELineDrawMode,
    EllipsePointMarker,
    CategoryAxis,
    Thickness,
    EVerticalTextPosition,
    EHorizontalTextPosition,
    DataPointSelectionModifier,
    DataPointSelectionPaletteProvider,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    DataPointSelectionChangedArgs,
    DataPointInfo,
    BaseDataSeries,
    XyFilterBase,
    vectorToArrayViewF64,
    EAutoRange,
    ESelectionMode,
} from "scichart";

import { WaferLotData } from "./waferData";
import { appTheme } from "../../../theme";

// A custom filter which calculates the cumulative percentage of the original data
class CumulativePercentageFilter extends XyFilterBase {
    constructor(originalSeries: BaseDataSeries, dataSeriesName: string) {
        super(originalSeries, { dataSeriesName });
        this.filterAll();
    }

    protected filterAll() {
        this.clear();
        this.filter(0, this.getOriginalCount());
    }

    protected override filterOnAppend(count: number): void {
        // Recalculate total when new data is appended
        this.filterAll();
    }

    protected filter(start: number, count: number): void {
        const xValues = vectorToArrayViewF64(this.getOriginalXValues(), this.webAssemblyContext);
        const yValues = vectorToArrayViewF64(this.getOriginalYValues(), this.webAssemblyContext);
        let totalSum = 0;
        // First pass: calculate total sum
        for (let i = 0; i < this.getOriginalCount(); i++) {
            totalSum += yValues[i];
        }

        const cumulativeXValues: number[] = [];
        const cumulativePercentages: number[] = [];

        let cumulativeSum = 0;

        for (let i = start; i < start + count; i++) {
            cumulativeSum += yValues[i];
            const cumulativePercentage = totalSum > 0 ? (cumulativeSum / totalSum) * 100 : 0;

            cumulativeXValues.push(xValues[i]);
            cumulativePercentages.push(cumulativePercentage);
        }

        this.appendRange(cumulativeXValues, cumulativePercentages);
    }
}

export const drawParetoChart = async (
    rootElement: string | HTMLDivElement,
    waferData: WaferLotData[] = [],
    onBatchSelected?: (point: WaferLotData, isColumnChart: boolean) => void
) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        titleStyle: {
            fontSize: 16,
            placeWithinChart: true,
            padding: new Thickness(5, 5, 5, 5),
        },
        freezeWhenOutOfView: true,
    });

    // X Axis for Batch
    const xAxis = new CategoryAxis(wasmContext, {
        axisTitle: "Batch",
        growBy: new NumberRange(0.01, 0.01),
        // Reduce padding so all labels show
        labelStyle: { fontSize: 10, padding: new Thickness(2, 0, 0, 0) },
        axisTitleStyle: { fontSize: 12 },
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        maxAutoTicks: 20,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Primary Y Axis for Input2 values
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.01, 0.1),
            axisTitle: "Quality",
            labelStyle: { fontSize: 10 },
            axisTitleStyle: { fontSize: 12 },
            labelPrecision: 0,
            drawMinorTickLines: false,
            drawMinorGridLines: false,
            autoRange: EAutoRange.Always,
        })
    );

    // Secondary Y Axis for cumulative percentage
    const yAxis2 = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        axisTitle: "Cumulative %",
        labelFormat: ENumericFormat.Decimal,
        visibleRange: new NumberRange(0, 105),
        labelStyle: { fontSize: 10 },
        axisTitleStyle: { fontSize: 12 },
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(yAxis2);

    // Data series for bars
    const columnData = new XyDataSeries(wasmContext, {
        dataSeriesName: "Quality",
    });

    // Create cumulative percentage filter from columnData
    const cumulativePercentageData = new CumulativePercentageFilter(columnData, "Cumulative %");

    // Column series for Input2 values
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: columnData,
        fill: appTheme.MutedSkyBlue,
        stroke: appTheme.MutedSkyBlue,
        strokeThickness: 1,
        opacity: 0.8,
        cornerRadius: 0,
        dataLabels: {
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Above,
            style: { fontFamily: "Arial", fontSize: 10, padding: new Thickness(0, 0, 8, 0) },
            color: appTheme.ForegroundColor,
            precision: 0,
        },
        paletteProvider: new DataPointSelectionPaletteProvider({ stroke: "white", fill: "#ffff00aa" }),
    });

    // Line series for cumulative percentage
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: cumulativePercentageData,
        yAxisId: yAxis2.id,
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

    const selectionModifier = new DataPointSelectionModifier({
        allowClickSelect: true, // Enables single-click selection
        allowDragSelect: false, // Optional: Disable drag for simple clicks
    });

    selectionModifier.selectionChanged.subscribe((args) => {
        const selectedPoints = args.selectedDataPoints;
        if (selectedPoints.length > 0) {
            // Call the callback function if provided
            if (onBatchSelected && selectedPoints[0].index !== undefined) {
                onBatchSelected(selectedPoints[0].metadata as WaferLotData, false);
            }
        }
    });

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        selectionModifier
    );

    const updateData = (waferData: WaferLotData[], fireSelectionChanged: boolean) => {
        if (!waferData || waferData.length === 0) return;
        columnData.clear();
        // Clone the data so sorting does not affect the column chart
        const data = waferData.slice();
        data.sort((a, b) => b.Input2 - a.Input2);
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (const batch of data) {
            xValues.push(batch.Batch);
            yValues.push(batch.Input2);
        }
        columnData.clear();
        columnData.appendRange(xValues, yValues, data);
        sciChartSurface.title = data[0].Date;
        const selectedIndex = data.findIndex((b) => b.isSelected);
        // We need to manually clear and reset the selectionModifier
        // These methods are currently private but will be exposed in next version
        //@ts-ignore
        selectionModifier.clearSelectedDataPoints();
        //@ts-ignore
        selectionModifier.addSelectedDataPoint(
            columnSeries,
            selectedIndex,
            new DataPointInfo(columnSeries, data[selectedIndex], selectedIndex)
        );
        if (fireSelectionChanged) {
            //@ts-ignore
            selectionModifier.raiseSelectionChanged(false);
        }
    };
    updateData(waferData, true);

    await sciChartSurface.nextStateRender();
    return { sciChartSurface, updateData, selectionModifier };
};
