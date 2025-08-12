import * as SciChart from "scichart";

async function drawGaugeChartArc(divElementId) {
    // Demonstrates how to use PolarPointerAnnotation in SciChart.js
    const {
        SciChartPolarSurface,
        SciChartJsNavyTheme,
        Thickness,
        PolarNumericAxis,
        EPolarAxisMode,
        PolarPointerAnnotation,
        EStrokeLineJoin,
        ECoordinateMode
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        padding: Thickness.fromNumber(20)
    });

    // Create axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        flippedCoordinates: true, // go clockwise
        totalAngle: Math.PI,
        startAngle: 0
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const carPointerAnnotation = new PolarPointerAnnotation({
        id: "car_gauge",
        x1: Math.random() * 10,
        y1: 10, // pointer length (or height)
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,

        pointerStyle: {
            baseSize: 0.01, // slightly wider base than the pointer
            fill: "#F00",
            stroke: "#F00",
            backExtensionSize: 0.2
        },

        // optional - arrowhead at the tip of the pointer
        // pointerArrowStyle: {
        //     stroke: "#F00",
        //     strokeThickness: 2,
        //     strokeLineJoin: EStrokeLineJoin.Round,
        //     fill: "#900",
        //     height: 0.2,
        //     width: 0.1,
        //     headDepth: 0.8
        // },

        // optional - circle at the base of the pointer
        pointerCenterStyle: {
            size: 0.12, // relative to the pointer height
            fill: "#111"
        },

        isStrokeAboveCenter: true
    });
    sciChartSurface.annotations.add(carPointerAnnotation);
}

drawGaugeChartArc("scichart-root");
