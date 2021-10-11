import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import { Point } from "scichart/Core/Point";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {XyScatterRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import {FadeAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/FadeAnimation";
import {NumberRange} from "scichart/Core/NumberRange";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {easing} from "scichart/Core/Animations/EasingFunctions";
import {LineAnnotation} from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import {DoubleAnimator} from "scichart/Core/Animations/DoubleAnimator";
import {DpiHelper} from "scichart/Charting/Visuals/TextureManager/DpiHelper";

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    // Create a SciChartSurface with X,Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create("scichart-root");
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1)
    }));

    // Create a Line Series with XyDataSeries and some data
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            stroke: "White",
            fill: "White",
            width: 9,
            height: 9,
        }),
    });
    lineSeries.dataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Line Series",
        xValues: [0,1,2,3,4,5,6,7,8,9],
        yValues: [0,1,5,1,20,5,1,8,9,3],
    });

    // Add the line series to the SciChartSurface
    sciChartSurface.renderableSeries.add(lineSeries);

    // add an event listener for mouse down. You can access the actual SciChartSurface canvas as
    // follows, or find element by ID=divElementId in the dom
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {

        // Translate the point to the series viewrect before hit-testing
        // Attention!
        // We need to multiply it by DpiHelper.PIXEL_RATIO
        // DpiHelper.PIXEL_RATIO is used for High DPI and Retina screen support and also for the browser scaling
        const mousePointX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const mousePointY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        // const translatedPoint = translateFromCanvasToSeriesViewRect(mousePoint, sciChartSurface.seriesViewRect);
        const HIT_TEST_RADIUS = 10 * DpiHelper.PIXEL_RATIO;

        // call renderableSeries.hitTestProvider.hitTest passing in the mouse point
        // other parameters determine the type of hit-test operation to perform
        // here we use IHitTestProvider.hitTestDataPoint method which finds the nearest point on the 2D surface
        const hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(
            mousePointX,
            mousePointY,
            HIT_TEST_RADIUS
        );

        // Log the result to console. HitTestInfo contains information about the hit-test operation
        console.log(`${hitTestInfo.dataSeriesName} hit test result:\r\n` +
            ` MouseCoord=(${mousePointX}, ${mousePointY})\r\n` +
            // ` TranslatedCoord=(${translatedPoint.x}, ${translatedPoint.y})\r\n` +
            ` Hit-Test Coord=(${hitTestInfo.xCoord}, ${hitTestInfo.yCoord})\r\n` +
            ` IsHit? ${hitTestInfo.isHit}\r\n` +
            ` Result=(${hitTestInfo.xValue}, ${hitTestInfo.yValue}) `
        );
        showHitTestPoint(sciChartSurface, wasmContext, hitTestInfo, 1000);
    });
}

function showHitTestPoint(sciChartSurface, wasmContext, hitTestInfo, timeout) {
    sciChartSurface.annotations.clear();

    // Use a scatter series to temporarily render a single point at the hitTestInfo.x/yValue
    const fill = hitTestInfo.isHit ? "DarkGreen" : "Crimson";
    const series = new XyScatterRenderableSeries(wasmContext, {
        animation: new FadeAnimation({ duration: timeout, ease: (t) => 1-t }),
        opacity: 1,
        dataSeries: new XyDataSeries(wasmContext, { xValues: [hitTestInfo.xValue], yValues: [hitTestInfo.yValue] }),
        pointMarker: new EllipsePointMarker(wasmContext, { width: 25, height: 25, strokeThickness: 0, fill})
    });
    sciChartSurface.renderableSeries.add(series);
    const hitOrMissLabel = new TextAnnotation({
        x1: hitTestInfo.xValue + 0.1,
        y1: hitTestInfo.yValue,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        text: hitTestInfo.isHit ? "Hit!" : "miss...",
        textColor: "White"
    });
    sciChartSurface.annotations.add(hitOrMissLabel);

    const hitTestLine = new LineAnnotation( {
        x1: hitTestInfo.xValue,
        y1: hitTestInfo.yValue,
        x2: hitTestInfo.hitTestPointValues.x,// sciChartSurface.xAxes.get(0).getCurrentCoordinateCalculator().getDataValue(hitTestInfo.xCoord),
        y2: hitTestInfo.hitTestPointValues.y,// sciChartSurface.yAxes.get(0).getCurrentCoordinateCalculator().getDataValue(hitTestInfo.yCoord),
        stroke: fill,
    });
    sciChartSurface.annotations.add(hitTestLine);

    DoubleAnimator.animate(
        1,
        0,
        timeout,
        (value) => {
            hitTestLine.opacity = value;
            hitOrMissLabel.opacity = value;
        },
        () => {
            sciChartSurface.renderableSeries.remove(series);
            sciChartSurface.annotations.remove(hitOrMissLabel);
            sciChartSurface.annotations.remove(hitTestLine);
            series.delete();
            hitOrMissLabel.delete();
            hitTestLine.delete();
        },
        easing.linear
    );
    // const clearAll = () => {
    //     sciChartSurface.renderableSeries.remove(series);
    //     sciChartSurface.annotations.remove(hitOrMissLabel);
    //     sciChartSurface.annotations.remove(hitTestLine);
    //     series.delete();
    //     hitOrMissLabel.delete();
    //     hitTestLine.delete();
    // }
    // setTimeout(clearAll, timeout);
}

initSciChart();
