async function simpleBubbleChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a bubble chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        XyzDataSeries,
        FastBubbleRenderableSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    const sizes = [];
    for (let i = 0; i < 30; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.2) - Math.cos(i * 0.04));
        sizes.push(Math.sin(i) * 60 + 3);
    }

    const xyzDataSeries = new XyzDataSeries(wasmContext, {
        xValues,
        yValues,
        zValues: sizes,
    });

    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries: xyzDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            // choose a suitably large size for pointmarker. This will  be scaled per-point
            width: 64,
            height: 64,
            strokeThickness: 0,
            fill: "#4682b477",
        }),
    });

    sciChartSurface.renderableSeries.add(bubbleSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleBubbleChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a scatter with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EPointMarkerType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [];
    const yValues = [];
    const sizes = [];
    for (let i = 0; i < 30; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.2) - Math.cos(i * 0.04));
        sizes.push(Math.sin(i) * 60 + 3);
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.BubbleSeries,
                xyzData: {
                    xValues,
                    yValues,
                    zValues: sizes,
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            // choose a suitably large size for pointmarker. This will  be scaled per-point
                            width: 64,
                            height: 64,
                            strokeThickness: 0,
                            fill: "#4682b477",
                        },
                    },
                },
            },
        ],
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
