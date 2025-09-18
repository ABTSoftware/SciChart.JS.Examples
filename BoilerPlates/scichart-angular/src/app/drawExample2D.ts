import {
    FastBandRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartJsNavyTheme,
    SciChartSurface,
    SweepAnimation,
    XyyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from 'scichart';

export const drawExample2D = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
        rootElement,
        {
            theme: new SciChartJsNavyTheme(),
        }
    );

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { axisTitle: 'X Axis' })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.4, 0.4),
            axisTitle: 'Y Axis',
        })
    );

    // Create some data for the example. We need X, Y and Y1 values
    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 50;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= POINTS; i++) {
        const k = 1 - i / 100;
        xValues.push(i);
        yValues.push(Math.sin(i * STEP) * k * 0.7);
        y1Values.push(Math.cos(i * STEP) * k);
    }

    // Create the band series and add to the chart
    // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues,
                yValues,
                y1Values,
            }),
            strokeThickness: 3,
            fill: '#ff5f00',
            fillY1: '#87CEEB',
            stroke: '#ff5f00',
            strokeY1: '#87CEEB',
            animation: new SweepAnimation({ delay: 1000, duration: 800 }),
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier()
    );

    return { wasmContext, sciChartSurface };
};
