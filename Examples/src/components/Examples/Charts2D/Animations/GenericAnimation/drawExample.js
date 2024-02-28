import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    FastBubbleRenderableSeries,
    XyzDataSeries,
    EllipsePointMarker,
    NativeTextAnnotation,
    EVerticalAnchorPoint,
    LineAnnotation,
    GenericAnimation,
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
import { populationData } from "../../../Charts3D/Basic3DChartTypes/Bubble3DChart/data/PopulationData";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface with bubble chart
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.title = "In SciChart.js you can animate anything";
    sciChartSurface.titleStyle = {
        placeWithinChart: true,
        fontSize: 24,
        color: appTheme.ForegroundColor + "C4",
    };
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Year",
            labelPrecision: 0,
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Life Expectancy (years)",
            labelPrecision: 0,
            growBy: new NumberRange(0, 0.2),
        })
    );
    // Population dataset from gapminderdata
    // data format example = [
    //    { country: "Afghanistan", year: 1952, population: 8425333, continent: "Asia", lifeExpectancy: 28.801, gdpPerCapita: 779.4453145 },
    // ]
    const year = populationData.map((item) => item.year);
    const lifeExpectancy = populationData.map((item) => item.lifeExpectancy);
    const gdpPerCapita = populationData.map((item) => item.gdpPerCapita);
    const population = populationData.map((item) => item.population);
    const bubbleSeries0 = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries: new XyzDataSeries(wasmContext, { xValues: year, yValues: lifeExpectancy, zValues: gdpPerCapita }),
        opacity: 0.3,
        // Set the default pointmarker size
        pointMarker: new EllipsePointMarker(wasmContext, {
            fill: appTheme.VividSkyBlue,
            opacity: 0.3,
            width: 64,
            height: 64,
            strokeThickness: 0,
        }),
        // z sizes are pixels so normalize these until the largest value in gdpPerCapita = 100px
        zMultiplier: 100 / Math.max(...gdpPerCapita),
    });
    sciChartSurface.renderableSeries.add(bubbleSeries0);
    // add a label & line
    const labelAnnotation1 = new NativeTextAnnotation({
        x1: 1955,
        y1: 82,
        text: "In this dataset life expectancy increases with time (years).\n Bubble size is GDP/capita",
        fontSize: 18,
        opacity: 0,
        textColor: appTheme.PaleSkyBlue,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
    });
    sciChartSurface.annotations.add(labelAnnotation1);
    const lineAnnotation = new LineAnnotation({
        x1: 1960,
        y1: 81.5,
        x2: 1966,
        y2: 76,
        opacity: 0,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    sciChartSurface.annotations.add(lineAnnotation);
    // Add some animations using genericAnimation
    //
    // From 0..2 seconds typewrite the title
    sciChartSurface.addAnimation(addTypewriterEffect(2000, 0, sciChartSurface));
    // From 2..4 seconds animate the label on the data
    sciChartSurface.addAnimation(
        new GenericAnimation({
            from: 0,
            to: 1,
            onAnimate: (from, to, progress) => {
                labelAnnotation1.opacity = to * progress;
                lineAnnotation.opacity = to * progress;
            },
            duration: 2000,
            delay: 2000,
        })
    );
    // From 5..8s change the data and relabel
    //
    const bubbleSeries1 = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries: new XyzDataSeries(wasmContext, {
            xValues: gdpPerCapita,
            yValues: lifeExpectancy,
            zValues: population,
        }),
        opacity: 0.3,
        // Set the default pointmarker size
        pointMarker: new EllipsePointMarker(wasmContext, {
            fill: appTheme.VividSkyBlue,
            opacity: 0.3,
            width: 64,
            height: 64,
            strokeThickness: 0,
        }),
        // z sizes are pixels so normalize these until the largest value in population = 100px
        zMultiplier: 100 / Math.max(...population),
        // initially hidden
        isVisible: false,
    });
    sciChartSurface.renderableSeries.add(bubbleSeries1);
    // Animate the new data
    sciChartSurface.addAnimation(
        new GenericAnimation({
            from: 0,
            to: 0.3,
            onAnimate: (from, to, progress) => {
                bubbleSeries1.isVisible = true;
                bubbleSeries1.pointMarker.opacity = to * progress;
                bubbleSeries0.pointMarker.opacity = 0.3 * (1 - progress);
                labelAnnotation1.opacity = 1 - progress;
                lineAnnotation.opacity = 1 - progress;
            },
            onCompleted: () => {
                bubbleSeries0.isVisible = false;
                // When the data has changed, now zoom to fit new data
                sciChartSurface.xAxes.get(0).animateVisibleRange(new NumberRange(0, 50000), 1000);
                sciChartSurface.xAxes.get(0).axisTitle = "GDP per capita";
            },
            duration: 3000,
            delay: 5000,
        })
    );
    // add a second label & line from 7..9s
    const labelAnnotation2 = new NativeTextAnnotation({
        x1: 10000,
        y1: 50,
        text: "Let's swap the axis to GDP vs. Life Expectancy using GenericAnimation.\n Bubble size is Population",
        fontSize: 18,
        opacity: 0,
        textColor: appTheme.PaleSkyBlue,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
    });
    sciChartSurface.annotations.add(labelAnnotation2);
    const lineAnnotation2 = new LineAnnotation({
        x1: 10000,
        y1: 60,
        x2: 20000,
        y2: 50,
        opacity: 0,
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    sciChartSurface.annotations.add(lineAnnotation2);
    // Animate the 2nd label and line
    sciChartSurface.addAnimation(
        new GenericAnimation({
            from: 0,
            to: 1,
            onAnimate: (from, to, progress) => {
                labelAnnotation2.opacity = to * progress;
                lineAnnotation2.opacity = to * progress;
            },
            duration: 2000,
            delay: 7000,
        })
    );
    return { sciChartSurface };
};
const addTypewriterEffect = (duration, delay, sciChartSurface) => {
    return new GenericAnimation({
        from: "",
        to: sciChartSurface.title,
        onAnimate: (from, to, progress) => {
            const length = Math.floor(to.length * progress);
            sciChartSurface.title = to.substring(0, length);
        },
        duration,
        delay,
        setInitialValueImmediately: true,
    });
};
