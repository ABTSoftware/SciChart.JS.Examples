import { ExampleDataProvider } from "scichart-example-dependencies";
import {
    EAnimationType,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    FastLineRenderableSeries,
    NumberRange,
    NumericAxis,
    SciChartJSDarkv2Theme,
    SciChartJSLightTheme,
    SciChartJsNavyTheme,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
} from "scichart";
export const getChartsInitializationAPI = () => {
    const createLineData = (whichSeries) => {
        const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);
        return {
            xValues: data.xValues,
            yValues: data.yValues.map((y) => (whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5)),
        };
    };
    const createThemedChart = async (rootElement, title, theme) => {
        // Create a SciChartSurface passing theme into constructor options
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme,
        });
        // Create the X,Y Axis
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                labelPrecision: 2,
                maxAutoTicks: 8,
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                labelPrecision: 2,
                maxAutoTicks: 8,
                growBy: new NumberRange(0.05, 0.2),
            })
        );
        // Add title annotation
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: title,
                fontSize: 16,
                textColor: theme.tickTextBrush,
                x1: 0.5,
                y1: 0,
                opacity: 0.77,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
            })
        );
        let data = createLineData(2);
        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 },
                },
            })
        );
        data = createLineData(1);
        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 },
                },
            })
        );
        data = createLineData(0);
        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 },
                },
            })
        );
        return { sciChartSurface };
    };
    const createNavyThemeChart = (divId) => createThemedChart(divId, "Navy Theme", new SciChartJsNavyTheme());
    const createLightThemeChart = (divId) => createThemedChart(divId, "Light Theme", new SciChartJSLightTheme());
    const createDarkThemeChart = (divId) => createThemedChart(divId, "Dark Theme", new SciChartJSDarkv2Theme());
    const createCustomThemeChart = (divId) => createThemedChart(divId, "Custom Theme", customTheme);
    return { createNavyThemeChart, createLightThemeChart, createDarkThemeChart, createCustomThemeChart };
};
// Create a custom theme based on light theme + some modifications
const customTheme = {
    ...new SciChartJSLightTheme(),
    axisBandsFill: "#83D2F511",
    axisBorder: "#1F3D68",
    gridBackgroundBrush: "white",
    gridBorderBrush: "white",
    loadingAnimationForeground: "#6495ED77",
    loadingAnimationBackground: "#E4F5FC",
    majorGridLineBrush: "#264B9322",
    minorGridLineBrush: "#264B9306",
    sciChartBackground: "#E4F5FC",
    tickTextBrush: "#1F3D68",
    axisTitleColor: "#1F3D68",
    // auto / default colour palette for lines and fills
    strokePalette: ["#264B93", "#A16DAE", "#C52E60"],
    fillPalette: ["#264B9333", "#A16DAE33", "#C52E6033"],
};
