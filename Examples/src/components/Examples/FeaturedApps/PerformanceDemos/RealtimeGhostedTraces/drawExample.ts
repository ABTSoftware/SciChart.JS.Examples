import {
    CentralAxesLayoutManager,
    EAxisAlignment,
    EInnerAxisPlacementCoordinateMode,
    FastLineRenderableSeries,
    GlowEffect,
    ICentralAxesLayoutManagerOptions,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
} from "scichart";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { appTheme } from "../../../theme";

const AMPLITUDE = 200;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Optional parameters to control exact placement of the axis
    // Below: These are defaults, but we specify them for completeness of the example
    // Relative coordinate mode and 0.5 means 'place half way'
    const options: ICentralAxesLayoutManagerOptions = {
        horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        horizontalAxisPosition: 0.5,
        verticalAxisPosition: 0.5,
    };

    // Configure x,y axis with central layout - oscilloscope style
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 900),
            isInnerAxis: true,
            axisAlignment: EAxisAlignment.Top,
            labelStyle: {
                color: appTheme.PaleSkyBlue,
            },
            axisBorder: {
                borderTop: 1,
                color: appTheme.VividSkyBlue,
            },
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-300, 300),
            isInnerAxis: true,
            axisAlignment: EAxisAlignment.Left,
            labelStyle: {
                color: appTheme.PaleSkyBlue,
            },
            axisBorder: {
                borderLeft: 1,
                color: appTheme.VividSkyBlue,
            },
        })
    );

    // Control the placement of the axis by specifying CentralAxesLayoutManager
    // and isInnerAxis property
    sciChartSurface.layoutManager = new CentralAxesLayoutManager(options);

    const addSeries = (stroke: string, opacity: number) => {
        const amplitude = Math.random() * AMPLITUDE;
        const effect = new GlowEffect(wasmContext, {
            range: 0,
            intensity: 0.5,
        });
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke, effect });
        lineSeries.strokeThickness = 3;
        lineSeries.opacity = opacity;
        sciChartSurface.renderableSeries.add(lineSeries);
        const { xValues, yValues } = ExampleDataProvider.getNoisySinewave(500, 900, 7, amplitude, 30);
        lineSeries.dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
        return lineSeries;
    };

    const seriesColor = appTheme.VividTeal;
    const series1 = addSeries(seriesColor, 1);
    const series2 = addSeries(seriesColor, 0.9);
    const series3 = addSeries(seriesColor, 0.8);
    const series4 = addSeries(seriesColor, 0.7);
    const series5 = addSeries(seriesColor, 0.6);
    const series6 = addSeries(seriesColor, 0.5);
    const series7 = addSeries(seriesColor, 0.4);
    const series8 = addSeries(seriesColor, 0.3);
    const series9 = addSeries(seriesColor, 0.2);
    const series10 = addSeries(seriesColor, 0.1);

    let timerId: NodeJS.Timeout;

    const reassignRenderableSeries = () => {
        const oldSeries = series10.dataSeries;
        series10.dataSeries = series9.dataSeries;
        series9.dataSeries = series8.dataSeries;
        series8.dataSeries = series7.dataSeries;
        series7.dataSeries = series6.dataSeries;
        series6.dataSeries = series5.dataSeries;
        series5.dataSeries = series4.dataSeries;
        series4.dataSeries = series3.dataSeries;
        series3.dataSeries = series2.dataSeries;
        series2.dataSeries = series1.dataSeries;

        const amplitude = Math.random() * AMPLITUDE;
        const dataSeries = new XyDataSeries(wasmContext);
        ExampleDataProvider.fillNoisySinewave(500, 900, 7, amplitude, 30, dataSeries);
        series1.dataSeries = dataSeries;
        // To prevent memory leak we should delete
        oldSeries.delete();

        timerId = setTimeout(reassignRenderableSeries, 20);
    };

    const stopUpdate = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    // Buttons for chart
    const startUpdate = () => {
        if (timerId) {
            stopUpdate();
        }
        reassignRenderableSeries();
    };

    return { wasmContext, sciChartSurface, controls: { startUpdate, stopUpdate } };
};
