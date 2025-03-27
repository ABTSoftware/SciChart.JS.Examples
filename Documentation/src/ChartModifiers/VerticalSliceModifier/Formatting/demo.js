async function formattingVerticalSliceModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        ENumericFormat,
        NumberRange,
        VerticalSliceModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker,
        ZoomPanModifier,
        ZoomExtentsModifier,
        MouseWheelZoomModifier,
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
            axisTitle: "X Axis",
            // label format options applied to the X-Axis
            labelPrecision: 1,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 2,
            cursorLabelFormat: ENumericFormat.Decimal,
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis",
            // label format options applied to the X-Axis
            labelPrecision: 1,
            labelFormat: ENumericFormat.Decimal,
            // label format options applied to cursors & tooltips
            cursorLabelPrecision: 6,
            cursorLabelFormat: ENumericFormat.Decimal,
        })
    );

    // Add some vertical slices to the chart
    const vSlice1 = new VerticalSliceModifier({
        x1: 10.1,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        // Defines if rollover vertical line is shown
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#FF6600",
        lineSelectionColor: "#FF6600",
        // Shows the default tooltip
        showTooltip: true,
    });
    vSlice1.verticalLine.showLabel = true;
    vSlice1.verticalLine.axisLabelFill = "#FF6600";
    vSlice1.verticalLine.axisLabelStroke = "White";
    const vSlice2 = new VerticalSliceModifier({
        x1: 30.0,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        // Defines if rollover vertical line is shown
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#50C7E0",
        lineSelectionColor: "#50C7E0",
        // Shows the default tooltip
        showTooltip: true,
    });
    vSlice2.verticalLine.showLabel = true;
    vSlice2.verticalLine.axisLabelFill = "#50C7E0";
    vSlice2.verticalLine.axisLabelStroke = "White";
    sciChartSurface.chartModifiers.add(vSlice1, vSlice2);
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
            text: "VerticalSliceModifier 6 Decimal Places",
            fontSize: 36,
            yCoordShift: 25,
            ...options,
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Shows how axis.cursorTextFormatting affects VerticalSlice tooltips",
            fontSize: 20,
            yCoordShift: 75,
            ...options,
        })
    );

    // Add further zooming and panning behaviours
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
}

formattingVerticalSliceModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
    const {
        chartBuilder,
        EThemeProviderType,
        ECoordinateMode,
        EChart2DModifierType,
        ENumericFormat,
        EAxisType,
        NumberRange,
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis",
                // label format options applied to the X-Axis
                labelPrecision: 1,
                labelFormat: ENumericFormat.Decimal,
                // label format options applied to cursors & tooltips
                cursorLabelPrecision: 2,
                cursorLabelFormat: ENumericFormat.Decimal,
            },
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                visibleRange: new NumberRange(-2, 0.5),
                axisTitle: "Y Axis",
                // label format options applied to the X-Axis
                labelPrecision: 1,
                labelFormat: ENumericFormat.Decimal,
                // label format options applied to cursors & tooltips
                cursorLabelPrecision: 6,
                cursorLabelFormat: ENumericFormat.Decimal,
            },
        },
        modifiers: [
            {
                type: EChart2DModifierType.VerticalSlice,
                options: {
                    x1: 10.1,
                    xCoordinateMode: ECoordinateMode.DataValue,
                    isDraggable: true,
                    // Defines if rollover vertical line is shown
                    showRolloverLine: true,
                    rolloverLineStrokeThickness: 1,
                    rolloverLineStroke: "#FF6600",
                    lineSelectionColor: "#FF6600",
                    // Shows the default tooltip
                    showTooltip: true,
                },
            },
            {
                type: EChart2DModifierType.VerticalSlice,
                options: {
                    x1: 30.0,
                    xCoordinateMode: ECoordinateMode.DataValue,
                    isDraggable: true,
                    // Defines if rollover vertical line is shown
                    showRolloverLine: true,
                    rolloverLineStrokeThickness: 1,
                    rolloverLineStroke: "#50C7E0",
                    lineSelectionColor: "#50C7E0",
                    // Shows the default tooltip
                    showTooltip: true,
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
