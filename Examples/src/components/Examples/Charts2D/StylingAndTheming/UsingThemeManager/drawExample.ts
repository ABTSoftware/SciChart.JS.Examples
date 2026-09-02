import {
    ECoordinateMode,
    EHorizontalAnchorPoint,
    FastLineRenderableSeries,
    IThemeProvider,
    NumberRange,
    NumericAxis,
    SciChartJSDarkv2Theme,
    SciChartJSLightTheme,
    SciChartJsNavyTheme,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    SweepAnimation,
} from "scichart";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

export const getChartsInitializationAPI = () => {
    const createLineData = (whichSeries: number) => {
        const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);

        return {
            xValues: data.xValues,
            yValues: data.yValues.map((y) => (whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5)),
        };
    };

    const createThemedChart = async (rootElement: string | HTMLDivElement, title: string, theme: IThemeProvider) => {
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
                animation: new SweepAnimation({ duration: 500 }),
            })
        );

        data = createLineData(1);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: new SweepAnimation({ duration: 500 }),
            })
        );

        data = createLineData(0);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: new SweepAnimation({ duration: 500 }),
            })
        );

        return { sciChartSurface };
    };

    const createNavyThemeChart = (divId: string | HTMLDivElement) =>
        createThemedChart(divId, "Navy Theme", new SciChartJsNavyTheme());
    const createLightThemeChart = (divId: string | HTMLDivElement) =>
        createThemedChart(divId, "Light Theme", new SciChartJSLightTheme());
    const createDarkThemeChart = (divId: string | HTMLDivElement) =>
        createThemedChart(divId, "Dark Theme", new SciChartJSDarkv2Theme());
    const createCustomThemeChart = (divId: string | HTMLDivElement) =>
        createThemedChart(divId, "Custom Theme", customTheme);

    return { createNavyThemeChart, createLightThemeChart, createDarkThemeChart, createCustomThemeChart };
};

// Create a custom theme based on light theme + some modifications
// (modifying a constructed theme instance, as SciChartSurface.create expects an IThemeProvider instance)
const customTheme: IThemeProvider = new SciChartJSLightTheme();

customTheme.axisBandsFill = "#83D2F511";
customTheme.axisBorder = "#1F3D68";
customTheme.gridBackgroundBrush = "white";
customTheme.gridBorderBrush = "white";
customTheme.loadingAnimationForeground = "#6495ED77";
customTheme.loadingAnimationBackground = "#E4F5FC";
customTheme.majorGridLineBrush = "#264B9322";
customTheme.minorGridLineBrush = "#264B9306";
customTheme.sciChartBackground = "#E4F5FC";
customTheme.tickTextBrush = "#1F3D68";
customTheme.axisTitleColor = "#1F3D68";
// auto / default colour palette for lines and fills
customTheme.strokePalette = ["#264B93", "#A16DAE", "#C52E60"];
customTheme.fillPalette = ["#264B9333", "#A16DAE33", "#C52E6033"];
