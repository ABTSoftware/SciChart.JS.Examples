import {
    StackedColumnRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    DateTimeNumericAxis,
    ENumericFormat,
    DateLabelProvider,
    IPointMetadata,
    IStackedColumnSeriesDataLabelProviderOptions,
    Thickness,
    EColumnDataLabelPosition,
    EVerticalTextPosition,
    LegendModifier,
    EAxisAlignment,
    TextLabelProvider,
    EMultiLineAlignment,
    XyNDataSeries,
    CategoryAxis,
    DataPointSelectionModifier,
} from "scichart";

import { IBatchMetadata, WaferLotData } from "./waferData";
import { appTheme } from "../../../theme";

export const drawColumnChart = async (
    rootElement: string | HTMLDivElement,
    waferData: WaferLotData[] = [],
    onBatchSelected?: (point: IBatchMetadata) => void
) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        titleStyle: {
            fontSize: 16,
        },
    });

    const growByX = new NumberRange(0.05, 0.05);
    const growByY = new NumberRange(0.01, 0.3);

    // Create a labelProvider which uses multiline text when the chart is narrower
    const labelProvider = new TextLabelProvider({
        labels: waferData.map((d, i) =>
            sciChartSurface.domCanvas2D.width < 1024 ? ["Batch", `${d.Batch}`] : `Batch ${d.Batch}`
        ),
    });

    // Create the X,Y Axis
    sciChartSurface.xAxes.add(
        new CategoryAxis(wasmContext, {
            labelProvider,
            growBy: growByX,
            maxAutoTicks: 20,
            drawMinorTickLines: false,
            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMajorGridLines: false,
            labelStyle: {
                fontSize: 10,
                multilineAlignment: EMultiLineAlignment.Center,
            },
            axisTitleStyle: {
                fontSize: 12,
            },
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: growByY,
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

    const updateData = (batchData: WaferLotData[]) => {
        const xValues: number[] = [];
        const y1Values: number[] = [];
        const y2Values: number[] = [];
        const y3Values: number[] = [];
        const metadata: IBatchMetadata[] = [];
        for (const batch of batchData) {
            xValues.push(batch.Batch);
            y1Values.push(batch.Measure1);
            y2Values.push(batch.Measure2);
            y3Values.push(batch.Measure3);
            metadata.push({ isSelected: false, Batch: batch.Batch, Date: batch.Date, Input: batch.Input2 });
        }
        dataSeries.clear();
        dataSeries.appendRangeN(xValues, [y1Values, y2Values, y3Values], metadata);
        sciChartSurface.title = batchData[0].Date;
    };

    updateData(waferData);

    const dataLabels: IStackedColumnSeriesDataLabelProviderOptions = {
        color: "#FFfFFF",
        style: {
            fontSize: sciChartSurface.domCanvas2D.width < 500 ? 0 : 12,
            fontFamily: "Arial",
            padding: new Thickness(0, 0, 2, 0),
        },
        precision: 0,
        positionMode: EColumnDataLabelPosition.Outside,
        verticalTextPosition: EVerticalTextPosition.Center,
    };

    const measure1Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PaleSkyBlue,
        stroke: appTheme.MutedSkyBlue,
        strokeThickness: 1,
        stackedGroupId: "measures",
        dataLabels,
    });
    measure1Series_stacked.seriesName = "Measure 1";
    measure1Series_stacked.yArrayFilter = "y1";

    const measure2Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PaleTeal,
        stroke: appTheme.MutedTeal,
        strokeThickness: 1,
        stackedGroupId: "measures",
        dataLabels,
    });
    measure2Series_stacked.seriesName = "Measure 2";
    measure2Series_stacked.yArrayFilter = "y2";

    const measure3Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: appTheme.PalePink,
        stroke: appTheme.MutedPink,
        strokeThickness: 1,
        stackedGroupId: "measures",
        dataLabels,
    });
    measure3Series_stacked.seriesName = "Measure 3";
    measure3Series_stacked.yArrayFilter = "y3";

    // Add all series to the chart
    sciChartSurface.renderableSeries.add(measure1Series_stacked);
    sciChartSurface.renderableSeries.add(measure2Series_stacked);
    sciChartSurface.renderableSeries.add(measure3Series_stacked);

    const selectionModifier = new DataPointSelectionModifier({
        allowClickSelect: true, // Enables single-click selection
        allowDragSelect: false, // Optional: Disable drag for simple clicks
    });

    selectionModifier.selectionChanged.subscribe((args) => {
        const selectedPoints = args.selectedDataPoints;
        if (selectedPoints.length > 0) {
            // Call the callback function if provided
            if (onBatchSelected && selectedPoints[0].index !== undefined) {
                onBatchSelected(selectedPoints[0].metadata as IBatchMetadata);
            }
        }
    });

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

    return { sciChartSurface, updateData };
};
