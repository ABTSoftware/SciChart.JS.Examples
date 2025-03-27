async function basicVerticalSliceModifier(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
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

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 },
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-2, 0.5),
            axisTitle: "Y Axis",
        })
    );

    // #region ExampleA
    // Create a tooltip legend template
    const getTooltipLegendTemplate = (seriesInfos, svgAnnotation) => {
        let outputSvgString = "";
        // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
        seriesInfos.forEach((seriesInfo, index) => {
            if (seriesInfo.isWithinDataBounds) {
                const lineHeight = 30;
                const y = 50 + index * lineHeight;
                // Use the series stroke for legend text colour
                const textColor = seriesInfo.stroke;
                // Use the seriesInfo formattedX/YValue for text on the
                outputSvgString += `<text x="8" y="${y}" font-size="16" font-family="Verdana" fill="${textColor}">
                                    ${seriesInfo.seriesName}: X=${seriesInfo.formattedXValue}, Y=${seriesInfo.formattedYValue}
                                </text>`;
            }
        });
        // Content here is returned for the custom legend placed in top-left of the chart
        return `<svg width="100%" height="100%">
                <text x="8" y="20" font-size="15" font-family="Verdana" fill="lightblue">Custom VerticalSlice Legend</text>
                ${outputSvgString}
            </svg>`;
    };

    // Apply it to a VerticalSliceModifier
    const vSlice = new VerticalSliceModifier({
        x1: 30.0,
        xCoordinateMode: ECoordinateMode.DataValue,
        isDraggable: true,
        showRolloverLine: true,
        rolloverLineStrokeThickness: 1,
        rolloverLineStroke: "#50C7E0",
        lineSelectionColor: "#50C7E0",
        showTooltip: true,
        // Optional: Overrides the legend template to display additional info top-left of the chart
        tooltipLegendTemplate: getTooltipLegendTemplate,
    });
    sciChartSurface.chartModifiers.add(vSlice);
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
        y1: 0.75,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White",
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "VerticalSliceModifier Example",
            fontSize: 36,
            ...options,
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Creating Active Legends with tooltipLegendTemplate",
            fontSize: 20,
            yCoordShift: 50,
            ...options,
        })
    );

    // Add further zooming and panning behaviours
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
}

basicVerticalSliceModifier("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the VerticalSliceModifier in SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, ECoordinateMode, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
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
