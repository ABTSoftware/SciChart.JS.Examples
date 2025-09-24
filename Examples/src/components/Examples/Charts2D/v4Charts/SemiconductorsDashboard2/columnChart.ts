import {
    StackedColumnRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    ScaleAnimation,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    DateTimeNumericAxis,
    ENumericFormat,
    DateLabelProvider,
    IPointMetadata,
    DataLabelProvider,
} from "scichart";

import { WaferLotData } from "./waferData";
import { appTheme } from "../../../theme";

// Define a custom metadata interface for column data
interface IColumnPointMetadata extends IPointMetadata {
    measure1: number;
    measure2: number;
    measure3: number;
}

export const drawColumnChart = async (rootElement: string | HTMLDivElement, waferData: WaferLotData[] = []) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.1, 0.1);

    // Create the X,Y Axis
    sciChartSurface.xAxes.add(
        new DateTimeNumericAxis(wasmContext, {
            axisTitle: "Date",
            labelProvider: new DateLabelProvider({ labelFormat: ENumericFormat.Date_DDMMYYYY }),
            growBy,
            labelStyle: {
                fontSize: 10,
            },
            axisTitleStyle: {
                fontSize: 12,
            },
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy,
            axisTitle: "Thickness (nm)",
            minorDelta: 5,
            majorDelta: 10,
            labelStyle: {
                fontSize: 10,
            },
            axisTitleStyle: {
                fontSize: 12,
            },
        })
    );



    // Convert dates to timestamps
    const xValues = waferData.map((item) => new Date(item.Date).getTime() / 1000);
    
    // Create metadata for each point to store all measure values
    const metadata = waferData.map(
        (item) =>
            ({
                isSelected: false,
                measure1: item.Measure1,
                measure2: item.Measure2,
                measure3: item.Measure3,
            } as IColumnPointMetadata)
    );

    // Create data series for each measure
    const measure1Series = new XyDataSeries(wasmContext, {
        xValues,
        yValues: waferData.map((item) => item.Measure1),
        metadata,
    });

    const measure2Series = new XyDataSeries(wasmContext, {
        xValues,
        yValues: waferData.map((item) => item.Measure2),
        metadata,
    });

    const measure3Series = new XyDataSeries(wasmContext, {
        xValues,
        yValues: waferData.map((item) => item.Measure3),
        metadata,
    });

    // Create and add stacked column series for Measure1
    const measure1Series_stacked = new StackedColumnRenderableSeries(wasmContext);
    measure1Series_stacked.dataSeries = measure1Series;
    measure1Series_stacked.fill = appTheme.PaleSkyBlue;
    measure1Series_stacked.stroke = appTheme.MutedBlue;
    measure1Series_stacked.strokeThickness = 1;
    measure1Series_stacked.stackedGroupId = "measures";
    
    // Create and add stacked column series for Measure2
    const measure2Series_stacked = new StackedColumnRenderableSeries(wasmContext);
    measure2Series_stacked.dataSeries = measure2Series;
    measure2Series_stacked.fill = appTheme.PaleTeal;
    measure2Series_stacked.stroke = appTheme.MutedTeal;
    measure2Series_stacked.strokeThickness = 1;
    measure2Series_stacked.stackedGroupId = "measures";
    
    // Create and add stacked column series for Measure3
    const measure3Series_stacked = new StackedColumnRenderableSeries(wasmContext);
    measure3Series_stacked.dataSeries = measure3Series;
    measure3Series_stacked.fill = appTheme.PalePink;
    measure3Series_stacked.stroke = appTheme.MutedPink;
    measure3Series_stacked.strokeThickness = 1;
    measure3Series_stacked.stackedGroupId = "measures";
    
    // Add all series to the chart
    sciChartSurface.renderableSeries.add(measure1Series_stacked);
    sciChartSurface.renderableSeries.add(measure2Series_stacked);
    sciChartSurface.renderableSeries.add(measure3Series_stacked);

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};
