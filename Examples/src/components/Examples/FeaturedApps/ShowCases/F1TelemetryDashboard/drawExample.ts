import {
    EAxisAlignment,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    XyDataSeries,
    ZoomExtentsModifier,
    SciChartSurface,
    ENumericFormat,
    EColumnDataLabelPosition,
    StackedColumnRenderableSeries,
    Thickness,
    LegendModifier,
    StackedColumnCollection,
    IDataLabelLayoutManager,
    RenderPassInfo,
    IRenderableSeries,
    IStackedColumnSeriesDataLabelProviderOptions,
    BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
    ELegendPlacement,
    WaveAnimation,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    return { sciChartSurface, wasmContext };
};
