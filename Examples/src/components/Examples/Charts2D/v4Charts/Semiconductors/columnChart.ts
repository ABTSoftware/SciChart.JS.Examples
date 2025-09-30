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
    IStackedColumnSeriesDataLabelProviderOptions,
    Thickness,
    EColumnDataLabelPosition,
    EVerticalTextPosition,
    LegendModifier,
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

    const growByX = new NumberRange(0.1, 0.1);
    const growByY = new NumberRange(0.1, 0.3);

    // Create the X,Y Axis
    sciChartSurface.xAxes.add(
        new DateTimeNumericAxis(wasmContext, {
            axisTitle: "Date",
            labelProvider: new DateLabelProvider({ labelFormat: ENumericFormat.Date_DDMMYYYY }),
            growBy: growByX,
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
            growBy: growByY,
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
        dataSeriesName: "Film thickness in nm",
        xValues,
        yValues: waferData.map((item) => item.Measure1),
        metadata,
    });

    const measure2Series = new XyDataSeries(wasmContext, {
        dataSeriesName: "Line width in nm",
        xValues,
        yValues: waferData.map((item) => item.Measure2),
        metadata,
    });

    const measure3Series = new XyDataSeries(wasmContext, {
        dataSeriesName: "Sheet resistance in Ω/sq",
        xValues,
        yValues: waferData.map((item) => item.Measure3),
        metadata,
    });

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
        dataSeries: measure1Series,
        fill: appTheme.PaleSkyBlue,
        stroke: appTheme.MutedSkyBlue,
        strokeThickness: 1,
        opacity: 0.6,
        stackedGroupId: "measures",
        dataLabels,
    });

    const measure2Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: measure2Series,
        fill: appTheme.PaleTeal,
        stroke: appTheme.MutedTeal,
        strokeThickness: 1,
        opacity: 0.6,
        stackedGroupId: "measures",
        dataLabels,
    });

    const measure3Series_stacked = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: measure3Series,
        fill: appTheme.PalePink,
        stroke: appTheme.MutedPink,
        strokeThickness: 1,
        opacity: 0.6,
        stackedGroupId: "measures",
        dataLabels,
    });

    // Add all series to the chart
    sciChartSurface.renderableSeries.add(measure1Series_stacked);
    sciChartSurface.renderableSeries.add(measure2Series_stacked);
    sciChartSurface.renderableSeries.add(measure3Series_stacked);

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            showCheckboxes: true,
            showSeriesMarkers: true,
            showLegend: true,
        })
    );

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};
