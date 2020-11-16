import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
} from "scichart/types/AnchorPoint";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";

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
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
        "scichart-root"
    );

    // Create an X,Y Axis and add to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add line annotation
    sciChartSurface.annotations.add(
        new LineAnnotation({
            stroke: "#FF6600",
            strokeThickness: 3,
            x1: 1.0,
            x2: 4.0,
            y1: 6.0,
            y2: 9.0,
        })
    );

    // Add box annotation
    sciChartSurface.annotations.add(
        new BoxAnnotation({
            stroke: "#33FF33",
            strokeThickness: 1,
            fill: "rgba(50, 255, 50, 0.3)",
            x1: 6.0,
            x2: 9.0,
            y1: 6.0,
            y2: 9.0,
        }),
    )

    // Add text annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0.25,
            y1: 0.75,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            textColor: "yellow",
            fontSize: 26,
            fontFamily: "Comic Sans MS",
            text: "TEXT ANNOTATION",
        })
    )

    // Add custom SVG annotation
    const svgString = `
    <svg baseProfile="full" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="100" fill="rgba(50,50,255,0.3)" />
        <text x="100" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
    </svg>`;
    sciChartSurface.annotations.add(
        new CustomAnnotation({
            x1: 7.5,
            y1: 2.5,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            svgString
        })
    );
}

initSciChart();
