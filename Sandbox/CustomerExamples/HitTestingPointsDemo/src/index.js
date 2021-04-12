import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import { Point } from "scichart/Core/Point";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {translateFromCanvasToSeriesViewRect} from "scichart/utils/translate";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {ENearestPointLogic} from "scichart/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider";
import {XyScatterRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import {FadeAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/FadeAnimation";
import {NumberRange} from "scichart/Core/NumberRange";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";

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
        })
    });
    lineSeries.dataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Line Series",
        xValues: [0,1,2,3,4,5,6,7,8,9],
        yValues: [0,1,2,3,2,1,0,1,2,3],
    });

    // Add the line series to the SciChartSurface
    sciChartSurface.renderableSeries.add(lineSeries);

    // add an event listener for mouse down. You can access the actual SciChartSurface canvas as
    // follows, or find element by ID=divElementId in the dom
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {

        // Translate the point to the series viewrect before hit-testing
        const mousePoint = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        // const translatedPoint = translateFromCanvasToSeriesViewRect(mousePoint, sciChartSurface.seriesViewRect);
        const HIT_TEST_RADIUS = 7;

        // call renderableSeries.hitTestProvider.hitTest passing in the mouse point
        // other parameters determine the type of hit-test operation to perform
        const hitTestInfo = lineSeries.hitTestProvider.hitTest(
            mousePoint,
            ENearestPointLogic.NearestPoint2D,
            HIT_TEST_RADIUS,
            false);

        // Log the result to console. HitTestInfo contains information about the hit-test operation
        console.log(`${hitTestInfo.dataSeriesName} hit test result:\r\n` +
            ` MouseCoord=(${mousePoint.x}, ${mousePoint.y})\r\n` +
            // ` TranslatedCoord=(${translatedPoint.x}, ${translatedPoint.y})\r\n` +
            ` Hit-Test Coord=(${hitTestInfo.xCoord}, ${hitTestInfo.yCoord})\r\n` +
            ` IsHit? ${hitTestInfo.isHit}\r\n` +
            ` Result=(${hitTestInfo.xValue}, ${hitTestInfo.yValue}) `
        );

        animateHitTestPoint(sciChartSurface, wasmContext, hitTestInfo, 200);
    });
}

function animateHitTestPoint(sciChartSurface, wasmContext, hitTestInfo, timeout) {
    // Use a scatter series to temporarily render a single point at the hitTestInfo.x/yValue
    const fill = hitTestInfo.isHit ? "#33FF33AA" : "#FF3333AA";
    const series = new XyScatterRenderableSeries(wasmContext, {
        animation: new FadeAnimation({ duration: timeout }),
        dataSeries: new XyDataSeries(wasmContext, { xValues: [hitTestInfo.xValue], yValues: [hitTestInfo.yValue] }),
        pointMarker: new EllipsePointMarker(wasmContext, { width: 15, height: 15, opacity: 0.5, strokeThickness: 0, fill})
    });
    sciChartSurface.renderableSeries.add(series);
    const annotation = new TextAnnotation({
        x1: hitTestInfo.xValue + 0.1,
        y1: hitTestInfo.yValue,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        text: hitTestInfo.isHit ? "Hit!" : "miss...",
        textColor: "White"
    });
    sciChartSurface.annotations.add(annotation);
    const clearAll = () => {
        sciChartSurface.renderableSeries.remove(series);
        sciChartSurface.annotations.remove(annotation);
    }
    setTimeout(clearAll, timeout * 5);
}

initSciChart();
