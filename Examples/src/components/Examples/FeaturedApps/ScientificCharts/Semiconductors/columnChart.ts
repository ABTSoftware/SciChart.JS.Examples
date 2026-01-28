import {
    StackedColumnRenderableSeries,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    LegendModifier,
    EAxisAlignment,
    XyNDataSeries,
    CategoryAxis,
    DataPointSelectionModifier,
    BoxAnnotation,
    StackedColumnCollection,
    ECoordinateMode,
    ENumericFormat,
    DataPointInfo,
    Thickness,
    ESelectionMode,
    DataPointSelectionPaletteProvider,
} from "scichart";

import { WaferLotData } from "./waferData";
import { appTheme } from "../../../theme";

export const drawColumnChart = async (
    rootElement: string | HTMLDivElement,
    waferData: WaferLotData[] = [],
    onBatchSelected?: (point: WaferLotData, isColumnChart: boolean) => void
) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        titleStyle: {
            fontSize: 16,
            padding: new Thickness(5, 5, 5, 5),
            placeWithinChart: true,
        },
        freezeWhenOutOfView: true,
    });

    // Create the X,Y Axis
    const xAxis = new CategoryAxis(wasmContext, {
        labelFormat: ENumericFormat.NoFormat,
        maxAutoTicks: 20,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMajorGridLines: false,
        labelStyle: {
            fontSize: 10,
        },
        axisTitleStyle: {
            fontSize: 12,
        },
    });
    sciChartSurface.xAxes.add(xAxis);

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.01, 0.3),
            axisAlignment: EAxisAlignment.Left,
            labelPrecision: 0,
            drawMinorTickLines: false,
            drawMinorGridLines: false,
            labelStyle: {
                fontSize: 10,
            },
            axisTitleStyle: {
                fontSize: 12,
            },
        })
    );

    const dataSeries = new XyNDataSeries(wasmContext, { arrayCount: 3 });

    const columnCollection = new StackedColumnCollection(wasmContext, { dataPointWidth: 0.7 });

    const paletteProvider = new DataPointSelectionPaletteProvider({ stroke: "white", fill: "#ffff00aa" });

    const measure1Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PaleSkyBlue,
        stroke: appTheme.MutedSkyBlue,
        strokeThickness: 1,
        stackedGroupId: "measures",
        seriesName: "Measure 1",
        yArrayFilter: "y1",
        paletteProvider,
    });

    const measure2Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PaleTeal,
        stroke: appTheme.MutedTeal,
        strokeThickness: 1,
        stackedGroupId: "measures",
        seriesName: "Measure 2",
        yArrayFilter: "y2",
        paletteProvider,
    });

    const measure3Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PalePink,
        stroke: appTheme.MutedPink,
        strokeThickness: 1,
        stackedGroupId: "measures",
        seriesName: "Measure 3",
        yArrayFilter: "y3",
        paletteProvider,
    });

    // Add all series to the chart
    columnCollection.add(measure1Series_stacked, measure2Series_stacked, measure3Series_stacked);
    sciChartSurface.renderableSeries.add(columnCollection);

    const selectionModifier = new DataPointSelectionModifier({
        allowClickSelect: true, // Enables single-click selection
        allowDragSelect: false, // Optional: Disable drag for simple clicks
    });

    selectionModifier.selectionChanged.subscribe((args) => {
        const selectedPoints = args.selectedDataPoints;
        if (selectedPoints.length > 0) {
            // Call the callback function if provided
            if (onBatchSelected && selectedPoints[0].index !== undefined) {
                onBatchSelected(selectedPoints[0].metadata as WaferLotData, true);
            }
        }
    });

    const updateSelection = (point: WaferLotData) => {
        selectionModifier.clearSelectedDataPoints();
        const index = point.Batch - 1;
        selectionModifier.addSelectedDataPoint(
            measure1Series_stacked,
            index,
            new DataPointInfo(measure1Series_stacked, point, index)
        );
    };

    const updateData = (batchData: WaferLotData[], fireSelectionChanged: boolean) => {
        const xValues: number[] = [];
        const y1Values: number[] = [];
        const y2Values: number[] = [];
        const y3Values: number[] = [];
        for (const batch of batchData) {
            xValues.push(batch.Batch);
            y1Values.push(batch.Measure1);
            y2Values.push(batch.Measure2);
            y3Values.push(batch.Measure3);
        }
        dataSeries.clear();
        dataSeries.appendRangeN(xValues, [y1Values, y2Values, y3Values], batchData);
        sciChartSurface.title = batchData[0].Date;
        // We need to manually clear and reset the selectionModifier
        selectionModifier.clearSelectedDataPoints();
        selectionModifier.addSelectedDataPoint(
            measure1Series_stacked,
            0,
            new DataPointInfo(measure1Series_stacked, batchData[0], 0)
        );
        if (fireSelectionChanged) {
            selectionModifier.raiseSelectionChanged(false);
        }
    };

    updateData(waferData, false);

    // Add interactivity modifiers
    // sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    // sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    // sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(selectionModifier);

    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            showCheckboxes: true,
            showSeriesMarkers: true,
            showLegend: true,
        })
    );

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, updateData, updateSelection };
};
