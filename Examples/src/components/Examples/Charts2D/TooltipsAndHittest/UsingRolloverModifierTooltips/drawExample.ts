import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
import {
    EllipsePointMarker,
    ENumericFormat,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    RolloverLegendSvgAnnotation,
    RolloverModifier,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { SeriesInfo } from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 4,
        })
    );

    // Add some data
    const data1 = ExampleDataProvider.getFourierSeriesZoomed(0.6, 0.13, 5.0, 5.15);
    const lineSeries0 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: data1.xValues,
            yValues: data1.yValues,
            dataSeriesName: "First Line Series",
        }),
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 0,
            fill: appTheme.VividSkyBlue,
        }),
    });
    sciChartSurface.renderableSeries.add(lineSeries0);

    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: data2.xValues,
            yValues: data2.yValues,
            dataSeriesName: "Second Line Series",
        }),
        strokeThickness: 3,
        stroke: appTheme.VividOrange,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 0,
            fill: appTheme.VividOrange,
        }),
    });
    sciChartSurface.renderableSeries.add(lineSeries1);

    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 0.11, 5.0, 5.15);
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: data3.xValues,
            yValues: data3.yValues,
            dataSeriesName: "Third Line Series",
        }),
        strokeThickness: 3,
        stroke: appTheme.MutedPink,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 0,
            fill: appTheme.MutedPink,
        }),
    });
    sciChartSurface.renderableSeries.add(lineSeries2);

    // Here is where we add rollover tooltip behaviour
    //
    sciChartSurface.chartModifiers.add(
        new RolloverModifier({
            // Defines if rollover vertical line is shown
            showRolloverLine: true,
            rolloverLineStrokeThickness: 1,
            rolloverLineStroke: appTheme.VividOrange,
            // Shows the default tooltip
            showTooltip: true,
            // Optional: Overrides the legend template to display additional info top-left of the chart
            tooltipLegendTemplate: getTooltipLegendTemplate,
            // Optional: Overrides the content of the tooltip
            tooltipDataTemplate: getTooltipDataTemplate,
        })
    );

    // Optional: Additional customisation may be done per-series, e.g.
    //
    lineSeries0.rolloverModifierProps.tooltipTitle = "Custom Tooltip Title";
    lineSeries0.rolloverModifierProps.tooltipTextColor = appTheme.DarkIndigo;
    lineSeries2.rolloverModifierProps.tooltipColor = appTheme.VividPink;

    // Add further zooming and panning behaviours
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

const getTooltipDataTemplate = (
    seriesInfo: SeriesInfo,
    tooltipTitle: string,
    tooltipLabelX: string,
    tooltipLabelY: string
) => {
    // Lines here are returned to the tooltip and displayed as text-line per tooltip
    const lines: string[] = [];
    lines.push(tooltipTitle);
    lines.push(`x: ${seriesInfo.formattedXValue}`);
    lines.push(`y: ${seriesInfo.formattedYValue}`);
    return lines;
};

// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: RolloverLegendSvgAnnotation) => {
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
                <text x="8" y="20" font-size="15" font-family="Verdana" fill="lightblue">Custom Rollover Legend</text>
                ${outputSvgString}
            </svg>`;
};
