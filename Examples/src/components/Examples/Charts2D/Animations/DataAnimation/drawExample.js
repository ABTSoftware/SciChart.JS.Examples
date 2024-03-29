import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    EllipsePointMarker,
    ScatterAnimation,
    XyDataSeries,
    PaletteFactory,
    GradientParams,
    Point,
    FastLineRenderableSeries,
    easing,
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const length = 120;
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, length),
            growBy: new NumberRange(0.1, 0.1),
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, length),
            growBy: new NumberRange(0.1, 0.1),
        })
    );
    let xValues = Array.from(Array(length).keys());
    let yValues = Array.from({ length }, () => Math.random() * length);
    // Create a scatter series with some initial data
    const scatterSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
        }),
        strokeThickness: 2,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: appTheme.VividSkyBlue,
            strokeThickness: 0,
        }),
        paletteProvider: PaletteFactory.createGradient(
            wasmContext,
            new GradientParams(new Point(0, 0), new Point(1, 1), [
                { offset: 0, color: "#36B8E6" },
                { offset: 0.2, color: "#5D8CC2" },
                { offset: 0.4, color: "#8166A2" },
                { offset: 0.6, color: "#AE418C" },
                { offset: 1.0, color: "#CA5B79" },
            ]),
            { enableStroke: true, enablePointMarkers: true, strokeOpacity: 0.67 }
        ),
    });
    sciChartSurface.renderableSeries.add(scatterSeries);
    // create a temp series for passing animation values
    const animationSeries = new XyDataSeries(wasmContext);
    // register this so it is deleted along with the main surface
    sciChartSurface.addDeletable(animationSeries);
    // Update data using data animations
    let timerId;
    const animateData = () => {
        xValues = xValues.map((x) => x + ((Math.random() - 0.5) * length) / 5);
        yValues = yValues.map((y) => y + ((Math.random() - 0.5) * length) / 5);
        // Set the values on the temp series
        animationSeries.clear();
        animationSeries.appendRange(xValues, yValues);
        scatterSeries.runAnimation(
            new ScatterAnimation({
                duration: 1000,
                ease: easing.outQuad,
                // Do not create a new DataSeries here or it will leak and eventually crash.
                dataSeries: animationSeries,
            })
        );
        timerId = setTimeout(animateData, 1200);
    };
    timerId = setTimeout(animateData, 1000);
    const startAnimation = () => {
        timerId = setTimeout(animateData, 1000);
    };
    const stopAnimation = () => {
        clearTimeout(timerId);
    };
    return { wasmContext, sciChartSurface, controls: { startAnimation, stopAnimation } };
};
