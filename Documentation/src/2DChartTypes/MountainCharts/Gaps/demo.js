// Seeded random approximation (required for tests / data generation consistency)
let randomSeed = 0;
function random() {
    const x = Math.sin(randomSeed++) * 10000;
    return x - Math.floor(x);
}

async function drawMountainChartsWithGaps(divElementId) {
    // Demonstrates how to create a line chart with gaps using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastMountainRenderableSeries,
        GradientParams,
        XyDataSeries,
        Point,
        SciChartJsNavyTheme,
        TextAnnotation,
        LineAnnotation,
        MouseWheelZoomModifier,
        ZoomPanModifier,
        ZoomExtentsModifier,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region ExampleA
    // Create some data with Y=NAN gaps
    let yLast = 100.0;
    const xValues = [];
    const yValues = [];
    for (let i = 0; i <= 250; i++) {
        const y = yLast + (random() - 0.48);
        yLast = y;
        xValues.push(i);
        yValues.push(i % 50 < 15 ? NaN : y);
    }

    // Create a mountain series
    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        stroke: "#4682b4",
        strokeThickness: 3,
        zeroLineY: 0.0,
        // when a solid color is required, use fill
        fill: "rgba(176, 196, 222, 0.7)",
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,0.77)", offset: 0 },
            { color: "rgba(70,130,180,0.0)", offset: 1 },
        ]),
    });
    // #endregion

    sciChartSurface.renderableSeries.add(mountainSeries);

    // add labels
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 75,
            y1: 104.1,
            text: "Gaps occur where Y = NaN",
            textColor: "LightSteelBlue",
            fontSize: 16,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        })
    );
    sciChartSurface.annotations.add(
        new LineAnnotation({ x1: 70, x2: 105, y1: 104, y2: 102, stroke: "LightSteelBlue", strokeThickness: 2 })
    );

    // add interaction for demo
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

drawMountainChartsWithGaps("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a line chart with gaps in SciChart.js using the Builder API
    const {
        chartBuilder,
        ESeriesType,
        ELineDrawMode,
        EThemeProviderType,
        EAnnotationType,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // #region ExampleB
    // Create some data with Y=NAN gaps
    let yLast = 100.0;
    const xValues = [];
    const yValues = [];
    for (let i = 0; i <= 250; i++) {
        const y = yLast + (random() - 0.48);
        yLast = y;
        xValues.push(i);
        yValues.push(i % 50 < 15 ? NaN : y);
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.MountainSeries,
                xyData: {
                    xValues,
                    yValues,
                },
                options: {
                    stroke: "#4682b4",
                    strokeThickness: 3,
                    zeroLineY: 0.0,
                    drawNaNAs: ELineDrawMode.DiscontinuousLine,
                    fill: "rgba(176, 196, 222, 0.7)", // when a solid color is required, use fill
                    fillLinearGradient: {
                        gradientStops: [
                            { color: "rgba(70,130,180,0.77)", offset: 0.0 },
                            { color: "rgba(70,130,180,0.0)", offset: 1 },
                        ],
                        startPoint: { x: 0, y: 0 },
                        endPoint: { x: 0, y: 1 },
                    },
                },
            },
        ],
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    x1: 75,
                    y1: 104.1,
                    text: "Gaps occur where Y = NaN",
                    textColor: "LightSteelBlue",
                    fontSize: 16,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
                    verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                },
            },
            {
                type: EAnnotationType.RenderContextLineAnnotation,
                options: { x1: 70, x2: 105, y1: 104, y2: 102, stroke: "LightSteelBlue", strokeThickness: 2 },
            },
        ],
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
