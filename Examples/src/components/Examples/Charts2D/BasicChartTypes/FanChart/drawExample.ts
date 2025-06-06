import { appTheme } from "../../../theme";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";

import {
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyyDataSeries,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    ENumericFormat,
    WaveAnimation,
    SplineLineRenderableSeries,
    TextAnnotation,
    EVerticalAnchorPoint,
    SplineBandRenderableSeries,
} from "scichart";
// tslint:disable:max-line-length

const animation = new WaveAnimation({ duration: 700, fadeEffect: true });

export type TVarPoint = {
    date: number;
    actual: number;
    varMax: number;
    var4: number;
    var3: number;
    var2: number;
    var1: number;
    varMin: number;
};

export function getVarianceData(): TVarPoint[] {
    const varianceData: TVarPoint[] = [];
    const startDate = 1546300800; // 1st Jan 2019
    const dateStep = 1546387200 - startDate; // one day;

    const length: number = 10;
    const yValues: number[] = new RandomWalkGenerator().Seed(923478).getRandomWalkSeries(length).yValues;
    for (let i = 0; i < length; i++) {
        const date = startDate + dateStep * i;

        let varMax: number = NaN;
        let var4: number = NaN;
        let var3: number = NaN;
        let var2: number = NaN;
        let var1: number = NaN;
        let varMin: number = NaN;

        if (i > 4) {
            varMax = yValues[i] + (i - 5) * 0.3;
            var4 = yValues[i] + (i - 5) * 0.2;
            var3 = yValues[i] + (i - 5) * 0.1;
            var2 = yValues[i] - (i - 5) * 0.1;
            var1 = yValues[i] - (i - 5) * 0.2;
            varMin = yValues[i] - (i - 5) * 0.3;
        }

        varianceData.push({ date, actual: yValues[i], varMax, var4, var3, var2, var1, varMin });
    }

    return varianceData;
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelFormat: ENumericFormat.Date_DDMMYYYY }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Generates some data for the example as an array of TVarPoint: {
    //     date: number;
    //     actual: number;
    //     varMax: number;
    //     var4: number;
    //     var3: number;
    //     var2: number;
    //     var1: number;
    //     varMin: number;
    // }
    const varianceData = getVarianceData();

    // To render the fan chart, we use a Line Chart with XyDataSeries
    // and three Band charts with XyyDataSeries
    const actualDataSeries = new XyDataSeries(wasmContext);
    const variance3DataSeries = new XyyDataSeries(wasmContext);
    const variance2DataSeries = new XyyDataSeries(wasmContext);
    const variance1DataSeries = new XyyDataSeries(wasmContext);

    actualDataSeries.appendRange(
        varianceData.map((v) => v.date),
        varianceData.map((v) => v.actual)
    );
    variance3DataSeries.appendRange(
        varianceData.map((v) => v.date),
        varianceData.map((v) => v.varMin),
        varianceData.map((v) => v.varMax)
    );
    variance2DataSeries.appendRange(
        varianceData.map((v) => v.date),
        varianceData.map((v) => v.var1),
        varianceData.map((v) => v.var4)
    );
    variance1DataSeries.appendRange(
        varianceData.map((v) => v.date),
        varianceData.map((v) => v.var2),
        varianceData.map((v) => v.var3)
    );

    // Add a line series with the Xy data (the actual data)
    // Note use FastLineRenderableSeries for non-spline version
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            strokeThickness: 2,
            dataSeries: actualDataSeries,
            stroke: appTheme.VividPink,
            animation,
        })
    );

    // Add band series with progressively higher opacity for the fan variance data
    // Note use FastBandRenderableSeries for non-spline version
    sciChartSurface.renderableSeries.add(
        new SplineBandRenderableSeries(wasmContext, {
            dataSeries: variance3DataSeries,
            opacity: 0.15,
            fill: appTheme.VividPink,
            strokeY1: "#00000000",
            animation,
        })
    );
    sciChartSurface.renderableSeries.add(
        new SplineBandRenderableSeries(wasmContext, {
            dataSeries: variance2DataSeries,
            opacity: 0.33,
            fill: appTheme.VividPink,
            strokeY1: "#00000000",
            animation,
        })
    );
    sciChartSurface.renderableSeries.add(
        new SplineBandRenderableSeries(wasmContext, {
            dataSeries: variance1DataSeries,
            opacity: 0.5,
            fill: appTheme.VividPink,
            strokeY1: "#00000000",
            animation,
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
    );

    // Optional: Add some annotations (text) to show detail
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: varianceData[0].date,
            y1: varianceData[0].actual,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            yCoordShift: -50,
            text: "Actual data",
            opacity: 0.45,
            textColor: appTheme.ForegroundColor,
        })
    );

    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: varianceData[5].date,
            y1: varianceData[5].actual,
            text: "Forecast Variance",
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            yCoordShift: 50,
            opacity: 0.45,
            textColor: appTheme.ForegroundColor,
        })
    );

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};
