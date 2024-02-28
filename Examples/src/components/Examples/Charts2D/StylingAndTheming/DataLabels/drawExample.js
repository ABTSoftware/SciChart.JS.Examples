import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
import {
    EllipsePointMarker,
    ENumericFormat,
    EVerticalTextPosition,
    EWrapTo,
    EXyDirection,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    formatNumber,
    MouseWheelZoomModifier,
    NativeTextAnnotation,
    NumberRange,
    NumericAxis,
    parseColorToUIntArgb,
    SciChartSurface,
    SplineLineRenderableSeries,
    Thickness,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Add an X, Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRangeLimit: new NumberRange(0, 20) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    // normal labels
    const data1 = ExampleDataProvider.getSpectrumData(0, 20, 5, 1, 0.01);
    const colSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, data1),
        fill: appTheme.VividOrange + "33",
        stroke: appTheme.VividOrange,
        dataPointWidth: 0.7,
        strokeThickness: 1,
        dataLabels: {
            // To enable datalabels, set fontFamily and size
            style: { fontFamily: "Arial", fontSize: 16, padding: new Thickness(5, 0, 5, 0) },
            color: appTheme.VividOrange,
            // Normal label format and precision options are supported
            precision: 2,
        },
    });
    const highCol = parseColorToUIntArgb(appTheme.VividGreen);
    const lowCol = parseColorToUIntArgb(appTheme.VividOrange);
    colSeries.dataLabelProvider.getColor = (state, text) => {
        if (state.yVal() > 0) return highCol;
        else return lowCol;
    };
    sciChartSurface.renderableSeries.add(colSeries);
    const labels = ["Data", "Labels", "can", "come", "from", "values", "in", "metadata"];
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data1.xValues,
                yValues: data1.yValues.map((y) => y * 0.8 + 4),
                metadata: data1.xValues.map((x, i) => ({ isSelected: false, text: labels[(i - 1) / 2] })),
            }),
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                fill: appTheme.ForegroundColor,
                strokeThickness: 0,
            }),
            dataLabels: {
                style: { fontFamily: "Arial", fontSize: 16 },
                color: appTheme.ForegroundColor,
                // @ts-ignore
                metaDataSelector: (md) => md.text,
            },
        })
    );
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 1,
            y1: 10,
            text: "Series with 1000 points, using custom getText function to only show labels for peaks, with x and y",
            textColor: appTheme.VividGreen,
            wrapTo: EWrapTo.ViewRect,
        })
    );
    // Custom getText
    const data2 = ExampleDataProvider.getSpectrumData(10, 1000, 10, 100, 0.02);
    const series = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: data2.xValues.map((x) => x / 50),
            yValues: data2.yValues.map((y) => y * 0.3 + 8),
        }),
        stroke: appTheme.VividGreen,
        strokeThickness: 3,
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 14, padding: new Thickness(0, 0, 3, 0) },
            color: appTheme.ForegroundColor,
            aboveBelow: false,
            verticalTextPosition: EVerticalTextPosition.Above,
        },
    });
    series.dataLabelProvider.getText = (state) => {
        const i = state.index;
        if (
            i > state.indexStart &&
            i < state.indexEnd &&
            state.yVal() > state.yVal(i - 1) &&
            state.yVal() > state.yVal(i + 1)
        ) {
            return `X: ${formatNumber(state.xVal(), ENumericFormat.Decimal, 2)}\nY: ${formatNumber(
                state.yVal(),
                ENumericFormat.Decimal,
                3
            )}`;
        }
        return undefined;
    };
    sciChartSurface.renderableSeries.add(series);
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            x1: 1,
            y1: 14,
            text: "Series with 200 points. Using pointGapThreshold = 1 to show labels when zoomed in enough for there to be space for them",
            textColor: appTheme.VividPink,
            wrapTo: EWrapTo.ViewRect,
        })
    );
    // Show labels when zoomed in
    const data3 = ExampleDataProvider.getSpectrumData(0, 200, 10, 20, 0.02);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data3.xValues.map((x) => x / 10),
                yValues: data3.yValues.map((y) => y * 0.3 + 12),
            }),
            stroke: appTheme.VividPink,
            strokeThickness: 3,
            dataLabels: {
                style: { fontFamily: "Arial", fontSize: 12 },
                color: appTheme.ForegroundColor,
                pointGapThreshold: 1,
            },
        })
    );
    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
