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
            growBy: new NumberRange(0, 0.05),
            axisTitle: "Sales $USD (Billion)",
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
        color: "#FFfFFF",
        style: { fontSize: 12, fontFamily: "Arial", padding: new Thickness(0, 0, 2, 0) },
        precision: 0,
        positionMode: EColumnDataLabelPosition.Outside,
        verticalTextPosition: EVerticalTextPosition.Center,
    };

    // Create some RenderableSeries - for each part of the stacked column
    // Notice the stackedGroupId. This defines if series are stacked (same), or grouped side by side (different)
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "EU" }),
        fill: appTheme.VividPurple,
        stroke: appTheme.PaleSkyBlue,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
    });

    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Asia" }),
        fill: appTheme.VividPink,
        stroke: appTheme.PaleSkyBlue,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
    });

    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3, dataSeriesName: "USA" }),
        fill: appTheme.VividOrange,
        stroke: appTheme.PaleSkyBlue,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
    });

    const rendSeries4 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues4, dataSeriesName: "UK" }),
        fill: appTheme.VividSkyBlue,
        stroke: appTheme.PaleSkyBlue,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
    });

    const rendSeries5 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues5, dataSeriesName: "Latam" }),
        fill: appTheme.VividTeal,
        stroke: appTheme.PaleSkyBlue,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
    });

    // To add the series to the chart, put them in a StackedColumnCollection
    const stackedColumnCollection = new StackedColumnCollection(wasmContext, {
        dataPointWidth: 0.6,
    });

    stackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);
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

    const toggleDataLabels = (areDataLabelsVisible: boolean) => {
        for (let i = 0; i < 5; i++) {
            const columnSeries = stackedColumnCollection.get(i);
            columnSeries.dataLabelProvider.style.fontSize = areDataLabelsVisible ? 0 : 12;
        }
        sciChartSurface.invalidateElement();
    };

    return { sciChartSurface, controls: { toggleHundredPercentMode, toggleDataLabels } };
};
