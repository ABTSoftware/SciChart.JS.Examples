import {
    ENumericFormat,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    StackedColumnCollection,
    StackedColumnRenderableSeries,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    EColumnDataLabelPosition,
    IStackedColumnSeriesDataLabelProviderOptions,
    StackedColumnSeriesDataLabelProvider,
    EVerticalTextPosition,
    NumberRange,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create XAxis, YAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            axisTitle: "Year",
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.03),
            axisTitle: "Sales $USD (Billion)",
            drawMinorGridLines: false,
        })
    );

    // Data for the example
    const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
    const yValues1 = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
    const yValues2 = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
    const yValues3 = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
    const yValues4 = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
    const yValues5 = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];

    const dataLabels: IStackedColumnSeriesDataLabelProviderOptions = {
        color: appTheme.TextColor,
        style: { fontSize: 12, fontFamily: "Arial", padding: new Thickness(0, 0, 2, 0) },
        precision: 0,
        positionMode: EColumnDataLabelPosition.Center,
        verticalTextPosition: EVerticalTextPosition.Center,
    };

    // One shared group ID stacks the regions into a single column per year.
    const stackedColumnCollection = new StackedColumnCollection(wasmContext, { dataPointWidth: 0.6 });
    for (const { yValues, dataSeriesName, fill } of [
        { yValues: yValues1, dataSeriesName: "EU", fill: appTheme.VividPurple },
        { yValues: yValues2, dataSeriesName: "Asia", fill: appTheme.VividPink },
        { yValues: yValues3, dataSeriesName: "USA", fill: appTheme.VividOrange },
        { yValues: yValues4, dataSeriesName: "UK", fill: appTheme.VividSkyBlue },
        { yValues: yValues5, dataSeriesName: "Latam", fill: appTheme.VividTeal },
    ]) {
        stackedColumnCollection.add(
            new StackedColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName }),
                fill,
                opacity: 0.8,
                stackedGroupId: "StackedGroupId",
                dataLabels,
            })
        );
    }
    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    sciChartSurface.renderableSeries.add(stackedColumnCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );
    sciChartSurface.zoomExtents();

    const toggleHundredPercentMode = (value: boolean) => {
        stackedColumnCollection.isOneHundredPercent = value;
        sciChartSurface.zoomExtents(200);
    };

    const toggleDataLabels = (visible: boolean) => {
        for (const columnSeries of stackedColumnCollection.asArray()) {
            columnSeries.dataLabelProvider.style.fontSize = visible ? 12 : 0;
        }
        sciChartSurface.invalidateElement();
    };

    const setDataLabelPosition = (positionMode: EColumnDataLabelPosition) => {
        for (const columnSeries of stackedColumnCollection.asArray()) {
            (columnSeries.dataLabelProvider as StackedColumnSeriesDataLabelProvider).positionMode = positionMode;
        }
        sciChartSurface.invalidateElement();
    };

    return { sciChartSurface, controls: { toggleHundredPercentMode, toggleDataLabels, setDataLabelPosition } };
};
