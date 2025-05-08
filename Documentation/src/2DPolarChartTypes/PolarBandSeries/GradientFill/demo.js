import * as SciChart from "scichart";

async function gradientFillBandChart(divElementId) {
    // Demonstrates how to create a band chart using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastBandRenderableSeries,
        XyyDataSeries,
        SciChartJsNavyTheme,
        Point,
        GradientParams
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }

    const dataSeries = new XyyDataSeries(wasmContext, {
        xValues,
        yValues,
        y1Values
    });

    // #region ExampleA
    const bandSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "#F48420",
        strokeY1: "#50C7E0",
        // use fillLinearGradient and fillLinearGradientY1 to set a gradient fill
        // instead of fill and fillY1
        fillLinearGradient: new GradientParams(new Point(0, 0.6), new Point(0, 0.9), [
            { color: "#F48420ff", offset: 0 },
            { color: "#F4842033", offset: 1 }
        ]),
        fillLinearGradientY1: new GradientParams(new Point(0, 0.6), new Point(0, 0.9), [
            { color: "#50C7E033", offset: 0 },
            { color: "#50C7E0ff", offset: 1 }
        ]),
        strokeThickness: 4
    });

    sciChartSurface.renderableSeries.add(bandSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

gradientFillBandChart("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, GradientParams, Point } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        xValues.push(i);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.BandSeries,
                xyyData: {
                    xValues,
                    yValues,
                    y1Values
                },
                options: {
                    stroke: "#FF1919FF",
                    strokeY1: "#279B27FF",
                    // use fillLinearGradient and fillLinearGradientY1 to set a gradient fill
                    // instead of fill and fillY1
                    fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: "#F48420ff", offset: 0 },
                        { color: "#F4842033", offset: 1 }
                    ]),
                    fillLinearGradientY1: new GradientParams(new Point(0, 0), new Point(0, 1), [
                        { color: "#50C7E033", offset: 0 },
                        { color: "#50C7E0ff", offset: 1 }
                    ]),
                    strokeThickness: 4
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
