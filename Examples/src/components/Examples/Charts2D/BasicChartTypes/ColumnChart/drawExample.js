import { appTheme } from "scichart-example-dependencies";
import {
    NumericAxis,
    FastColumnRenderableSeries,
    XyDataSeries,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    NumberRange,
    WaveAnimation,
    GradientParams,
    Point,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    PaletteFactory,
    Thickness,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Add an X, Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = [1, 2, 4, 8, 11, 15, 24, 46, 81, 117, 144, 160, 137, 101, 64, 35, 25, 14, 4, 1];
    // Create an add a column series
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            // Fill & stroke support Hex strings and rgba()
            fill: appTheme.PaleSkyBlue + "77",
            stroke: appTheme.PaleSkyBlue,
            strokeThickness: 3,
            dataPointWidth: 0.7,
            cornerRadius: 10,
            // Optional datalabels on series. To enable set a style and position
            dataLabels: {
                horizontalTextPosition: EHorizontalTextPosition.Center,
                verticalTextPosition: EVerticalTextPosition.Above,
                style: { fontFamily: "Arial", fontSize: 16, padding: new Thickness(0, 0, 20, 0) },
                color: appTheme.ForegroundColor,
            },
            // Optional series animation executed when series shows
            animation: new WaveAnimation({ duration: 1000 }),
            // Horizontal gradient in X. For Y gradient choose fillLinearGradient property
            paletteProvider: PaletteFactory.createGradient(
                wasmContext,
                new GradientParams(new Point(0, 0), new Point(1, 1), [
                    { offset: 0, color: appTheme.VividOrange },
                    { offset: 0.67, color: appTheme.VividSkyBlue },
                    { offset: 1.0, color: appTheme.VividTeal },
                ]),
                { enableFill: true }
            ),
        })
    );
    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
