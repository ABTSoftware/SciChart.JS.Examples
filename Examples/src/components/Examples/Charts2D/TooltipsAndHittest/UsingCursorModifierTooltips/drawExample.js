import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
import {
    NumericAxis,
    NumberRange,
    SciChartSurface,
    XyDataSeries,
    ENumericFormat,
    FastLineRenderableSeries,
    EllipsePointMarker,
    CursorModifier,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
} from "scichart";
export const drawExample = async (rootElement) => {
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
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
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
        })
    );
    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
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
        })
    );
    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 0.11, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
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
        })
    );
    // Here is where we add cursor behaviour
    //
    sciChartSurface.chartModifiers.add(
        // Add the CursorModifier (crosshairs) behaviour
        new CursorModifier({
            // Defines if crosshair is shown
            crosshairStroke: appTheme.VividOrange,
            crosshairStrokeThickness: 1,
            showXLine: true,
            showYLine: true,
            // Shows the default tooltip
            showTooltip: true,
            tooltipContainerBackground: appTheme.VividOrange,
            tooltipTextStroke: appTheme.ForegroundColor,
            // Defines the axis label colours
            axisLabelFill: appTheme.VividOrange,
            axisLabelStroke: appTheme.ForegroundColor,
            // Shows an additional legend in top left of the screen
            tooltipLegendTemplate: getTooltipLegendTemplate,
        }),
        // Add further zooming and panning behaviours
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );
    return { sciChartSurface, wasmContext };
};
// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (seriesInfos, svgAnnotation) => {
    let outputSvgString = "";
    // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
    seriesInfos.forEach((seriesInfo, index) => {
        const lineHeight = 30;
        const y = 20 + index * lineHeight;
        // Use the series stroke for legend text colour
        const textColor = seriesInfo.stroke;
        // Use the seriesInfo formattedX/YValue for text on the
        outputSvgString += `<text x="8" y="${y}" font-size="16" font-family="Verdana" fill="${textColor}">
            ${seriesInfo.seriesName}: X=${seriesInfo.formattedXValue}, Y=${seriesInfo.formattedYValue}
        </text>`;
    });
    return `<svg width="100%" height="100%">
                ${outputSvgString}
            </svg>`;
};
