import * as SciChart from "scichart";

async function drawGaugeChartArc(divElementId) {
    // Demonstrates how to create a gauge chart using ArcAnnotation & PolarPointerAnnotation using SciChart.js
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        NumberRange,
        Thickness,
        PolarArcAnnotation,
        PolarNumericAxis,
        EPolarAxisMode,
        PolarPointerAnnotation
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: Thickness.fromNumber(20)
    });

    const gaugeValue = Math.random() * 10; // Random start value between 0 and 10 for the gauge to point to
    const gaugeTotalAngle = Math.PI * 1.3;
    const gaugeRange = new NumberRange(0, 10);

    const gradientColors = ["#44DD66", "#FFBB00", "#FF1133"];
    const columnYValues = [5, 7.5, 10];

    // Pre-populate object with the color / value thresholds
    const colorThresholds = columnYValues.map((val, i) => ({
        threshold: val,
        color: gradientColors[i]
    }));

    // Current color calculation
    const getColorForValue = value => {
        const threshold = colorThresholds.find(t => value <= t.threshold);
        return threshold ? threshold.color : gradientColors[gradientColors.length - 1];
    };

    // Create axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: gaugeRange,
        flippedCoordinates: true, // go clockwise
        totalAngle: gaugeTotalAngle,
        startAngle: (Math.PI - gaugeTotalAngle) / 2, // to center the bottom gap
        isVisible: false
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        isVisible: false
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // gray background arc - optional
    const backgroundArc = new PolarArcAnnotation({
        y1: 9.4, // outer radius of the arc (how far to the edge it ends at)
        y2: 7, // inner radius of the arc (how far to the center it starts at)
        x1: gaugeRange.min,
        x2: gaugeRange.max,
        fill: "#88888822",
        strokeThickness: 0
    });

    const initialColor = getColorForValue(gaugeValue);

    // the arc showing the current value
    const valueArc = new PolarArcAnnotation({
        y1: 9.4, // outer radius
        y2: 7, // inner radius
        x1: gaugeRange.min, // start angle
        x2: gaugeValue, // current angle (end of arc)
        fill: initialColor,
        strokeThickness: 0
    });
    sciChartSurface.annotations.add(backgroundArc, valueArc);

    // Add 3 thin arc sectors which outline the three color zones
    columnYValues.forEach((yVal, i) => {
        const thinArc = new PolarArcAnnotation({
            y1: 10, // outer radius
            y2: 9.7, // inner radius
            x1: columnYValues[i - 1] ?? 0, // start angle
            x2: yVal > columnYValues[i] ? columnYValues[i] : yVal, // end angle
            fill: gradientColors[i],
            strokeThickness: 0
        });
        sciChartSurface.annotations.add(thinArc);
    });

    const polarPointer = new PolarPointerAnnotation({
        x1: gaugeValue,
        y1: 7,
        // pointerArrowStyle: {
        //     fill: "black",
        //     stroke: "gray",
        //     strokeThickness: 3,
        //     width: 0.2,
        //     height: 0.3,
        //     headDepth: 0.85,
        // },
        pointerCenterStyle: {
            size: 0.15,
            stroke: "gray",
            strokeWidth: 5,
            fill: "black"
        },
        pointerStyle: {
            fill: "gray",
            stroke: "gray",
            strokeThickness: 0,
            backExtensionSize: 0.2,
            baseSize: 0.1
        }
    });
    sciChartSurface.annotations.add(polarPointer);
}

drawGaugeChartArc("scichart-root");
