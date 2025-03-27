async function customTextChart(divElementId) {
    // Demonstrates how to create a text chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastTextRenderableSeries,
        XyTextDataSeries,
        SciChartJsNavyTheme,
        NumberRange,
        EHorizontalTextPosition,
        EVerticalTextPosition,
        parseColorToUIntArgb,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 9) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-5, 5) }));

    // #region ExampleA
    // Register a remote font
    await sciChartSurface.registerFont(
        "notoserif",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/NotoSerif-Regular.ttf"
    );

    // Create a textSeries with custom fond
    const textSeries = new FastTextRenderableSeries(wasmContext, {
        dataSeries: new XyTextDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            yValues: [1, 1, 1, 1, 1, 1],
            textValues: ["This", "text", "is", "drawn", "using", "FastTextRenderableSeries"],
        }),
        // font and size is required for text to be drawn
        dataLabels: {
            style: {
                // Set custom font
                fontFamily: "notoserif",
                fontSize: 18,
            },
            color: "white",
            // Set text position relative to the data point
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Center,
            // force the label sizes to be calculated as we need them below
            calculateTextBounds: true,
        },
    });

    // Handle further customisation of positioning and color
    textSeries.dataLabelProvider.getColor = (state, text) => {
        if (state.xVal() < 4) {
            return parseColorToUIntArgb("red");
        } else {
            return state.color;
        }
    };

    textSeries.dataLabelProvider.onAfterGenerate = (dataLabels) => {
        for (let i = 0; i < dataLabels.length; i++) {
            const label = dataLabels[i];
            if (i < dataLabels.length - 1) {
                // Shift this label down if it would overlap the next one
                if (label.rect.right > dataLabels[i + 1].rect.left) {
                    label.position.y += label.rect.height;
                }
            }
        }
    };

    // Add the TextSeries to the chart
    sciChartSurface.renderableSeries.add(textSeries);
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

customTextChart("scichart-root");
