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

    const measure1Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PaleSkyBlue,
        stroke: appTheme.MutedSkyBlue,
        strokeThickness: 1,
        stackedGroupId: "measures",
        seriesName: "Measure 1",
        yArrayFilter: "y1",
    });

    const measure2Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PaleTeal,
        stroke: appTheme.MutedTeal,
        strokeThickness: 1,
        stackedGroupId: "measures",
        seriesName: "Measure 2",
        yArrayFilter: "y2",
    });

    const measure3Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PalePink,
        stroke: appTheme.MutedPink,
        strokeThickness: 1,
        stackedGroupId: "measures",
        seriesName: "Measure 3",
        yArrayFilter: "y3",
    });

    // Add all series to the chart
    columnCollection.add(measure1Series_stacked, measure2Series_stacked, measure3Series_stacked);
    sciChartSurface.renderableSeries.add(columnCollection);

    const selectionAnnotation = new BoxAnnotation({
        stroke: "white",
        fill: "#ffff00AA",
        isHidden: true,
        xCoordinateMode: ECoordinateMode.Pixel,
    });
    sciChartSurface.annotations.add(selectionAnnotation);

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
        } else {
            selectionAnnotation.isHidden = true;
        }
    });

    sciChartSurface.layoutMeasured.subscribe(() => {
        if (selectionModifier.selectedDataPoints.length > 0) {
            const index = selectionModifier.selectedDataPoints[0].index;
            const xCC = xAxis.getCurrentCoordinateCalculator();
            const dpw = columnCollection.getColumnWidth(xCC) / 2;
            const xCoord = xCC.getCoordinate(index); // Use index here because of category x axis
            selectionAnnotation.x1 = xCoord - dpw;
            selectionAnnotation.x2 = xCoord + dpw;
            selectionAnnotation.y1 = 0;
            selectionAnnotation.y2 = measure3Series_stacked.accumulatedValues.get(index);
            selectionAnnotation.isHidden = false;
        } else {
            selectionAnnotation.isHidden = true;
        }
    });

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
        // These methods are currently private but will be exposed in next version
        //@ts-ignore
        selectionModifier.clearSelectedDataPoints();
        //@ts-ignore
        selectionModifier.addSelectedDataPoint(
            measure1Series_stacked,
            0,
            new DataPointInfo(measure1Series_stacked, batchData[0], 0)
        );
        if (fireSelectionChanged) {
            //@ts-ignore
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

    return { sciChartSurface, updateData, selectionModifier };
};
