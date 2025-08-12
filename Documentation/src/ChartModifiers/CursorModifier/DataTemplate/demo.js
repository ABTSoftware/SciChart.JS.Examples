import * as SciChart from "scichart";

async function cursorDataTemplates(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        CursorModifier,
        TextAnnotation,
        EHorizontalAnchorPoint,
        ECoordinateMode,
        EllipsePointMarker
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        titleStyle: { fontSize: 16 }
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a CursorModifier to the chart
    const cursorModifier = new CursorModifier({
        showTooltip: true,
        showAxisLabels: true,
        hitTestRadius: 10,
        // Add a custom tooltip data template
        tooltipDataTemplate: (seriesInfos, tooltipTitle) => {
            // each element in this array = 1 line in the tooltip
            const lineItems = [];
            // See SeriesInfo docs at https://scichart.com/documentation/js/current/typedoc/classes/xyseriesinfo.html
            seriesInfos.forEach(si => {
                // If hit (within hitTestRadius of point)
                if (si.isHit) {
                    // SeriesInfo.seriesName comes from dataSeries.dataSeriesName
                    lineItems.push(`${si.seriesName}`);
                    // seriesInfo.xValue, yValue are available to be formatted
                    // Or, preformatted values are available as si.formattedXValue, si.formattedYValue
                    lineItems.push(`X: ${si.xValue.toFixed(2)}`);
                    lineItems.push(`Y: ${si.yValue.toFixed(2)}`);
                    // index to the dataseries is available
                    lineItems.push(`Index: ${si.dataSeriesIndex}`);
                    // Which can be used to get anything from the dataseries
                    lineItems.push(
                        `Y-value from dataSeries: ${si.renderableSeries.dataSeries
                            .getNativeYValues()
                            .get(si.dataSeriesIndex)
                            .toFixed(4)}`
                    );
                    // Location of the hit in pixels is available
                    lineItems.push(`Location: ${si.xCoordinate.toFixed(0)}, ${si.yCoordinate.toFixed(0)}`);
                }
            });

            return lineItems;
        }
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

    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues,
                dataSeriesName: "Sinewave 1"
            }),
            pointMarker
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2,
                dataSeriesName: "Sinewave 2"
            }),
            pointMarker
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
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "CursorModifier Custom DataTemplates",
            fontSize: 36,
            yCoordShift: 25,
            ...options
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Move the mouse over the chart to see cursor & tooltip",
            fontSize: 20,
            yCoordShift: 75,
            ...options
        })
    );

    sciChartSurface.chartModifiers.add(new SciChart.LegendModifier());
}

cursorDataTemplates("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
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
                    tooltipTextStroke: "#ff6600"
                }
            }
        ]
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
    const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#FF6600",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            }),
            pointMarker
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "#50C7E0",
            strokeThickness: 5,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: yValues2
            }),
            pointMarker
        })
    );
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
