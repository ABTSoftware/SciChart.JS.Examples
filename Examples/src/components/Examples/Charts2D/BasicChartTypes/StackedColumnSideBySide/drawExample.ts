import { appTheme } from "../../../theme";
import {
    ELegendOrientation,
    ELegendPlacement,
    ENumericFormat,
    LegendModifier,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    StackedColumnCollection,
    StackedColumnRenderableSeries,
    WaveAnimation,
    NumberRange,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    EVerticalTextPosition,
    EColumnDataLabelPosition,
    IStackedColumnSeriesDataLabelProviderOptions,
    Thickness,
} from "scichart";

const xValues = [1997, 1998, 1999, 2000, 2001, 2002, 2003];
const tomatoesData = [15, 17, 26, 22, 28, 21, 22];
const cucumberData = [14, 12, 27, 25, 23, 17, 17];
const pepperData = [17, 14, 27, 26, 22, 28, 16];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create XAxis, YAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
            autoTicks: false,
            majorDelta: 1,
            minorDelta: 1,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
            axisTitle: "Year",
            growBy: new NumberRange(0.02, 0.02),
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            labelPrecision: 0,
            drawMinorGridLines: false,
            drawMinorTickLines: false,
            axisTitle: "Produce sold (Tonnes)",
            growBy: new NumberRange(0.02, 0.05),
        })
    );

    const dataLabels: IStackedColumnSeriesDataLabelProviderOptions = {
        style: {
            fontSize: 12,
            fontFamily: "Arial",
            padding: new Thickness(0, 0, 2, 0), // lift label above the top by 2 pixels
        },
        positionMode: EColumnDataLabelPosition.Outside,
        verticalTextPosition: EVerticalTextPosition.Center,
        precision: 0,
    };

    // Different stackedGroupIds place the columns side by side.
    const stackedColumnCollection = new StackedColumnCollection(wasmContext, { dataPointWidth: 0.5 });
    [
        { yValues: tomatoesData, dataSeriesName: "Tomato", fill: appTheme.VividPink },
        { yValues: pepperData, dataSeriesName: "Pepper", fill: appTheme.VividOrange },
        { yValues: cucumberData, dataSeriesName: "Cucumber", fill: appTheme.VividSkyBlue },
    ].forEach(({ yValues, dataSeriesName, fill }, index) => {
        stackedColumnCollection.add(
            new StackedColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName }),
                fill,
                stackedGroupId: `Group${index}`,
                dataLabels,
            })
        );
    });
    stackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    // Add the Stacked Column collection to the chart
    sciChartSurface.renderableSeries.add(stackedColumnCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

    // Add a legend to the chart to show the series
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: false,
            showSeriesMarkers: true,
        })
    );

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface };
};
