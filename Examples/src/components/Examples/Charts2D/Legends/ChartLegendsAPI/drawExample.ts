import {
    ELegendOrientation,
    ELegendPlacement,
    ENumericFormat,
    FastLineRenderableSeries,
    LegendModifier,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    XyDataSeries,
    getLegendItemHtml,
} from "scichart";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add an X, Y Axis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            growBy: new NumberRange(0.1, 0.1),
        })
    );

    // Add some data
    const data0 = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data0.xValues,
                yValues: data0.yValues,
                dataSeriesName: "First Line Series",
            }),
            strokeThickness: 3,
            stroke: "auto",
        })
    );

    const data1 = ExampleDataProvider.getFourierSeriesZoomed(0.6, 0.13, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data1.xValues,
                yValues: data1.yValues,
                dataSeriesName: "Second Line Series",
            }),
            strokeThickness: 3,
            stroke: "auto",
        })
    );

    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data2.xValues,
                yValues: data2.yValues,
                dataSeriesName: "Third Line Series",
            }),
            strokeThickness: 3,
            stroke: "auto",
        })
    );

    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 0.11, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: data3.xValues,
                yValues: data3.yValues,
                dataSeriesName: "Fourth Line Series",
            }),
            strokeThickness: 3,
            stroke: "auto",
        })
    );

    // add the legend modifier and show legend in the top left
    const legendModifier = new LegendModifier({
        showLegend: true,
        placement: ELegendPlacement.TopLeft,
        orientation: ELegendOrientation.Vertical,
        showCheckboxes: true,
        showSeriesMarkers: true,
    });

    sciChartSurface.chartModifiers.add(legendModifier);

    return { sciChartSurface, wasmContext, legendModifier };
};
