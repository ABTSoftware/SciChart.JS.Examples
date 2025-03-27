async function basicCursorModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EAutoRange,
        NumberRange,
        CursorModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker,
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 },
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            axisTitle: "X Axis",
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis",
        })
    );

    // Add a CursorModifier to the chart
    const cursorModifier = new CursorModifier({
        // Optional properties to configure what parts are shown
        showTooltip: true,
        showAxisLabels: true,
        showXLine: true,
        showYLine: true,
        // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
        hitTestRadius: 10,
        // Optional properties to configure the axis labels
        axisLabelFill: "#b36200",
        axisLabelStroke: "#fff",
        // Optional properties to configure line and tooltip style
        crosshairStroke: "#ff6600",
        crosshairStrokeThickness: 1,
        tooltipContainerBackground: "#000",
        tooltipTextStroke: "#ff6600",
    });
    sciChartSurface.chartModifiers.add(cursorModifier);

    // #endregion

    // Add some series to inspect
    const xValues = [];
    const yValues = [];
    const yValues2 = [];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.25) - Math.cos(i * 0.02));
        yValues2.push(0.5 * Math.cos(i * 0.18) - Math.sin(i * 0.025));
    }

    const pointMarker = new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0,
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues,
                dataSeriesName: "Sinewave 1",
            }),
            pointMarker,
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2,
                dataSeriesName: "Sinewave 2",
            }),
            pointMarker,
        })
    );

    // Add some instructions to the user
    const options = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White",
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "CursorModifier Example",
            fontSize: 36,
            yCoordShift: 25,
            ...options,
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Move the mouse over the chart to see cursor & tooltip",
            fontSize: 20,
            yCoordShift: 75,
            ...options,
        })
    );
}

basicCursorModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the CursorModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, EAxisType, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        modifiers: [
            {
                type: EChart2DModifierType.Cursor,
                options: {
                    // Optional properties to configure what parts are shown
                    showTooltip: true,
                    showAxisLabels: true,
                    showXLine: true,
                    showYLine: true,
                    // How close to a datapoint to show the tooltip? 10 = 10 pixels. 0 means always
                    hitTestRadius: 10,
                    // Optional properties to configure the axis labels
                    axisLabelFill: "#b36200",
                    axisLabelStroke: "#fff",
                    // Optional properties to configure line and tooltip style
                    crosshairStroke: "#ff6600",
                    crosshairStrokeThickness: 1,
                    tooltipContainerBackground: "#000",
                    tooltipTextStroke: "#ff6600",
                },
            },
        ],
    });
    // #endregion

    const xValues = [];
    const yValues = [];
    const yValues2 = [];
    for (let i = 0; i < 50; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.25) - Math.cos(i * 0.02));
        yValues2.push(0.5 * Math.cos(i * 0.18) - Math.sin(i * 0.025));
    }

    const { EllipsePointMarker, FastLineRenderableSeries, XyDataSeries } = SciChart;
    const pointMarker = new EllipsePointMarker(wasmContext, {
        width: 7,
        height: 7,
        fill: "white",
        strokeThickness: 0,
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues,
            }),
            pointMarker,
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2,
            }),
            pointMarker,
        })
    );
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
