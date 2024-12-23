import {
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    XyyDataSeries,
    NumericAxis,
    FastBandRenderableSeries,
    SciChartSurface,
    NumberRange,
    BandAnimation,
} from "scichart";
import { appTheme } from "../../../theme";
// Colours used for style 1
const lineColor1 = appTheme.VividOrange;
const fillColor1 = appTheme.VividOrange + "33";
const lineColor2 = appTheme.VividSkyBlue;
const fillColor2 = appTheme.VividSkyBlue + "33";
// Colurs used for style 2
const lineColor1b = appTheme.VividPink;
const fillColor1b = appTheme.VividPink + "33";
const lineColor2b = appTheme.PaleTeal;
const fillColor2b = appTheme.PaleTeal + "33";
const POINTS = 100;
const STEP = (3 * Math.PI) / POINTS;
export const drawExample = async (rootElement) => {
    // create a chart with X, Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));
    // Generate some data
    let xValues = [];
    let yValues = [];
    let y1Values = [];
    for (let x = 0; x <= POINTS; x++) {
        const k = 1 - x / 2000;
        const y = Math.sin(x * STEP) * k * 0.7 + 1;
        const y1 = Math.cos(x * STEP) * k + 1;
        xValues.push(x);
        yValues.push(y);
        y1Values.push(y1);
    }
    // Create a band series with the data and initial stroke/fill colours
    const bandSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
        strokeThickness: 4,
        stroke: lineColor1,
        strokeY1: lineColor2,
        fill: fillColor1,
        fillY1: fillColor2,
    });
    sciChartSurface.renderableSeries.add(bandSeries);
    // create a temp series for passing animation values
    const animationSeries = new XyyDataSeries(wasmContext);
    // register this so it is deleted along with the main surface
    sciChartSurface.addDeletable(animationSeries);
    // Animate both the data & the style of the chart, using a style animation
    const animateChartStyle = (isStyle1) => {
        xValues = [];
        yValues = [];
        y1Values = [];
        // Depending on the flag passed in, change the data. Just for eye candy
        if (isStyle1) {
            for (let x = 0; x <= POINTS; x++) {
                const k = 1 - x / 2000;
                const y = Math.sin(x * STEP) * k * 0.7 + 1;
                const y1 = Math.cos(x * STEP) * k + 1;
                xValues.push(x);
                yValues.push(y);
                y1Values.push(y1);
            }
        } else {
            for (let x = 0; x <= POINTS; x++) {
                const k = 1 - x / 2000;
                const y = Math.cos(x * STEP) * k * 0.7 + 1;
                const y1 = Math.sin(x * STEP) * k + 1;
                xValues.push(x);
                yValues.push(y);
                y1Values.push(y1);
            }
        }
        // Set the values on the temp series
        animationSeries.clear();
        animationSeries.appendRange(xValues, yValues, y1Values);
        // Running an animation on the series lets you change data as well as styles
        bandSeries.runAnimation(
            new BandAnimation({
                duration: 1000,
                styles: {
                    strokeThickness: isStyle1 ? 4 : 8,
                    stroke: isStyle1 ? lineColor1 : lineColor1b,
                    strokeY1: isStyle1 ? lineColor2 : lineColor2b,
                    fill: isStyle1 ? fillColor1 : fillColor1b,
                    fillY1: isStyle1 ? fillColor2 : fillColor2b,
                },
                // Don't create a new dataSeries here or it will leak and crash if run repeatedly
                dataSeries: animationSeries,
            })
        );
    };
    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());
    setTimeout(() => animateChartStyle(false), 1000);
    setTimeout(() => animateChartStyle(true), 3000);
    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface, controls: { animateChartStyle } };
};
