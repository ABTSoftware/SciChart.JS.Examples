import {
    XyScatterRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    ScaleAnimation,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    EllipsePointMarker,
    IPointMetadata,
    DataLabelProvider,
} from "scichart";

import { WaferLotData } from "./waferData";
import { appTheme } from "../../../theme";

// Define a custom metadata interface for scatter data
interface IScatterPointMetadata extends IPointMetadata {
    measure2: number;
    measure3: number;
}

export const drawScatterChart = async (rootElement: string | HTMLDivElement, waferData: WaferLotData[] = []) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.1, 0.1);

    // Create the X,Y Axis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Width (nm)",
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
            axisTitle: "Resistance (Ω/□)",
            labelStyle: {
                fontSize: 10,
            },
            axisTitleStyle: {
                fontSize: 12,
            },
        })
    );

    // Use Measure2 for X and Measure3 for Y
    const xValues = waferData.map((item) => item.Measure2);
    const yValues = waferData.map((item) => item.Measure3);

    // Create metadata for each point
    const metadata = waferData.map(
        (item) =>
            ({
                isSelected: false,
                measure2: item.Measure2,
                measure3: item.Measure3,
            } as IScatterPointMetadata)
    );

    // Create a data series with all values and metadata
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        metadata,
    });

    // Create and add a scatter series to the chart
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 15,
            height: 15,
            fill: appTheme.PaleSkyBlue,
            stroke: appTheme.MutedPurple,
            strokeThickness:2,
        }),
        animation: new ScaleAnimation({ zeroLine: 0, duration: 500, fadeEffect: true }),
    });

    sciChartSurface.renderableSeries.add(scatterSeries);

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    // Zoom to fit
    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};
