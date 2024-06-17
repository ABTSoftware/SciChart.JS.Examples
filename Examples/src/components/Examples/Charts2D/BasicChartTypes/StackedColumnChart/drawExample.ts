import {
    ELegendOrientation,
    ELegendPlacement,
    ENumericFormat,
    LegendModifier,
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
    StackedColumnSeriesDataLabelProvider,
    DataLabelProvider,
    IStackedColumnSeriesDataLabelProviderOptions,
    EVerticalTextPosition,
    NumberRange,
    DataLabelState,
} from "scichart";
import { appTheme } from "../../../theme";

export const divElementId = "chart";

export const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
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
    // const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
    // const yValues1 = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
    // const yValues2 = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
    // const yValues3 = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
    // const yValues4 = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
    // const yValues5 = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];

    const xValues = [1999, 2000];
    const yValues1 = [5, 32];
    const yValues2 = [5, 16];
    const yValues3 = [5, 8];
    const yValues4 = [5, 4];
    const yValues5 = [5, 2];

    class CustomDataLabelProvider extends StackedColumnSeriesDataLabelProvider {
        constructor(options: IStackedColumnSeriesDataLabelProviderOptions) {
            super(options);
        }

        getText(state: DataLabelState): string {
            if (this.metaDataSelector) {
                return this.metaDataSelector(state.getMetaData());
            }
            const usefinal = !this.updateTextInAnimation && state.parentSeries.isRunningAnimation;
            const yval = usefinal ? state.yValAfterAnimation() : state.yVal();
            if (yval === yval) { //isNaN check
                if(this.isOneHundredPercent){
                    const sum = 50; // TODO calculate sum of all columns from one stack

                    // const sum = seriesList.reduce((prev, cur) => prev + cur.dataSeries.getNativeYValues().get(i), 0);
                    console.log(this.topVector.get(state.index))

                    return `${(yval * 100 / sum).toFixed(1)}%`;
                }
                else {
                    return yval.toFixed(1);
                }
            } else {
                return undefined;
            }
        }
    }

    const customDataLabelProvider = new CustomDataLabelProvider({
        style: { fontFamily: "Arial", fontSize: 12 },
        verticalTextPosition: EVerticalTextPosition.Center,
        positionMode: EColumnDataLabelPosition.Outside,
        color: "#EEEEEE",
    });

    const dataLabels = {
        color: "#FFfFFF",
        style: { fontSize: 12, fontFamily: 'Arial' },
        positionMode: EColumnDataLabelPosition.Outside,
        verticalTextPosition: EVerticalTextPosition.Center
    }

    // Create some RenderableSeries - for each part of the stacked column
    // Notice the stackedGroupId. This defines if series are stacked (same), or grouped side by side (different)
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1, dataSeriesName: "EU" }),
        fill: appTheme.VividPurple,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
        dataLabelProvider: customDataLabelProvider
    });

    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues2, dataSeriesName: "Asia" }),
        fill: appTheme.VividPink,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
        dataLabelProvider: customDataLabelProvider

    });

    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues3, dataSeriesName: "USA" }),
        fill: appTheme.VividOrange,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
        dataLabelProvider: customDataLabelProvider

    });

    const rendSeries4 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues4, dataSeriesName: "UK" }),
        fill: appTheme.VividSkyBlue,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
        dataLabelProvider: customDataLabelProvider

    });

    const rendSeries5 = new StackedColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues5, dataSeriesName: "Latam" }),
        fill: appTheme.VividTeal,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
        opacity: 0.8,
        stackedGroupId: "StackedGroupId",
        dataLabels,
        dataLabelProvider: customDataLabelProvider
    });

    // To add the series to the chart, put them in a StackedColumnCollection
    const stackedColumnCollection = new StackedColumnCollection(wasmContext);
    stackedColumnCollection.dataPointWidth = 0.6;
    stackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);
    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    // (rendSeries1.dataLabelProvider as DataLabelProvider).getText = (state) => {
    //     if(!stackedColumnCollection.isOneHundredPercent) return `${state.yVal()}`;
    //     console.log(state.yValues.get(0), state.yValues.get(1));
    //     const stackSum = state.yValues.get(0) + state.yValues.get(1);
    //     const percentage = state.yVal() * 100 / stackSum;
    //     return `${percentage.toFixed(1)}%`;
    // };
    // (rendSeries2.dataLabelProvider as DataLabelProvider).getText = (state) => {
    //     if(!stackedColumnCollection.isOneHundredPercent) return `${state.yVal()}`;
    //     const stackSum = state.yValues.get(0) + state.yValues.get(1);
    //     const percentage = state.yVal() * 100 / stackSum;
    //     return `${percentage.toFixed(1)}%`;
    // };
    // (rendSeries3.dataLabelProvider as DataLabelProvider).getText = (state) => {
    //     if(!stackedColumnCollection.isOneHundredPercent) return `${state.yVal()}`;
    //     const stackSum = state.yValues.get(0) + state.yValues.get(1);
    //     const percentage = state.yVal() * 100 / stackSum;
    //     return `${percentage.toFixed(1)}%`;
    // };
    // (rendSeries4.dataLabelProvider as DataLabelProvider).getText = (state) => {
    //     if(!stackedColumnCollection.isOneHundredPercent) return `${state.yVal()}`;
    //     const stackSum = state.yValues.get(0) + state.yValues.get(1);
    //     const percentage = state.yVal() * 100 / stackSum;
    //     return `${percentage.toFixed(1)}%`;
    // };
    // (rendSeries5.dataLabelProvider as DataLabelProvider).getText = (state) => {
    //     if(!stackedColumnCollection.isOneHundredPercent) return `${state.yVal()}`;
    //     const stackSum = state.yValues.get(0) + state.yValues.get(1);
    //     const percentage = state.yVal() * 100 / stackSum;
    //     return `${percentage.toFixed(1)}%`;
    // };
    
    sciChartSurface.renderableSeries.add(stackedColumnCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(), 
        new ZoomPanModifier(), 
        new MouseWheelZoomModifier()
    );

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, stackedColumnCollection };
};
