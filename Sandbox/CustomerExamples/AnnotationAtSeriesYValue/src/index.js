import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
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
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {YAxisDragModifier} from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {XAxisDragModifier} from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import {CustomAnnotation} from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import {LineAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/LineAnimation";

const pulsingDotSvgString =
    `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="100%" height="100%" fill="transparent"/>
        <circle cx="20" cy="20" fill="steelblue" r="1" stroke="steelblue">
            <animate attributeName="r" from="0" to="20" dur="1s" begin="0s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"/>
        </circle>
        <circle cx="20" cy="20" fill="steelblue" r="5"/>
    </svg>`;

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
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.25, 0.25)
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
    const xyDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Line Series",
        xValues: [0,1,2,3,4,5,6,7,8,9],
        yValues: [0,1,3,1,4,5,1,3,2,5],
    });
    lineSeries.dataSeries = xyDataSeries;

    // Add the line series to the SciChartSurface
    sciChartSurface.renderableSeries.add(lineSeries);

    const pulsingDotAnnotation = new CustomAnnotation({
        x1: 2,
        y1: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString: pulsingDotSvgString
    });
    const textAnnotation = new TextAnnotation({
        x1: 2,
        y1: 0,
        xCoordShift: 10,
        yCoordShift: 10,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        fontFamily: "Montserrat",
        fontSize: 20,
        opacity: 0.7,
        text: "Dynamic Annotation"
    });
    sciChartSurface.annotations.add(pulsingDotAnnotation, textAnnotation);

    // Subscribe to rendered (called when chart updates)
    sciChartSurface.rendered.subscribe(() => {
        // Given an xvalue, how do you find the y-value of the series to position the annotation?
        //

        const xIndex = wasmContext.NumberUtil.FindIndex(xyDataSeries.getNativeXValues(),
            pulsingDotAnnotation.x1,
            wasmContext.SCRTFindIndexSearchMode.Nearest,
            true);
        const yValue = xyDataSeries.getNativeYValues().get(xIndex);

        // Position the annotation
        pulsingDotAnnotation.y1 = yValue;
        textAnnotation.y1 = yValue;

        console.log(`Hit-Testing SciChart:\r\n
         dataValue=${textAnnotation.x1}\r\n
         xIndex=${xIndex}\r\n
         yValue=${yValue}`);
    });

    const animateData = () => {
        const xValues = [0,1,2,3,4,5,6,7,8,9];
        const yValues = Array.from({ length: 10 }, () => Math.random() * 5);

        lineSeries.runAnimation(
            new LineAnimation({
                duration: 500,
                ease: easing.outQuad,
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
            })
        );

        setTimeout(animateData, 1000);
    };

    setTimeout(animateData, 1000);

    // Add some interactivity modifiers to test out dynamic nature of the annotation above
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new YAxisDragModifier());
    sciChartSurface.chartModifiers.add(new XAxisDragModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
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
}

initSciChart();
