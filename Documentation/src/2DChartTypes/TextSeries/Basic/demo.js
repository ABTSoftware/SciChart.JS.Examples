import * as SciChart from "scichart";

async function simpleTextChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a text chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastTextRenderableSeries,
        XyTextDataSeries,
        SciChartJsNavyTheme,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 9) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 9) }));

    // Create a chart with textSeries
    const textSeries = new FastTextRenderableSeries(wasmContext, {
        dataSeries: new XyTextDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            yValues: [3, 5, 6, 4, 2, 5],
            textValues: ["This", "text", "is", "drawn", "using", "FastTextRenderableSeries"]
        }),
        // font and size is required for text to be drawn
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 18
            },
            color: "white"
        }
    });
    sciChartSurface.renderableSeries.add(textSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleTextChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.TextSeries,
                xyTextData: {
                    xValues: [1, 2, 3, 4, 5, 6],
                    yValues: [3, 5, 6, 4, 2, 5],
                    textValues: ["This", "text", "is", "drawn", "using", "FastTextRenderableSeries"]
                },
                options: {
                    dataLabels: {
                        style: {
                            fontFamily: "Arial",
                            fontSize: 18
                        },
                        color: "white"
                    }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
