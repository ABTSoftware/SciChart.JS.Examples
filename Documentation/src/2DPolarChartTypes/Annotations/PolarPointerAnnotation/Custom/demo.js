import * as SciChart from "scichart";

async function drawGaugeChartArc(divElementId) {
    // Demonstrates how to customise the PolarPointerAnnotation in SciChart.js
    const {
        SciChartPolarSurface,
        Thickness,
        PolarNumericAxis,
        EPolarAxisMode,
        PolarPointerAnnotation,
        EStrokeLineJoin,
        ECoordinateMode
    } = SciChart;
    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(divElementId, {
        padding: Thickness.fromNumber(20),
    });
    
    // Create axes
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        flippedCoordinates: true, // go clockwise
        totalAngle: Math.PI * 3 / 2,
        startAngle: -Math.PI / 4,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        startAngle: -Math.PI / 4,
        innerRadius: 0.2,
        majorGridLineStyle: { strokeThickness: 1, color: "#666666" },
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // Define a pointer annotation
    const customPointer = new PolarPointerAnnotation({
        x1: Math.random() * 10,
        y1: 10, // pointer length
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,

        pointerStyle: {
            baseSize: 0.05, // relative to the pointer length
            fill: "#195",
            stroke: "#195",
        },

        // optional - arrowhead at the tip of the pointer
        pointerArrowStyle: { 
            stroke: "#195",
            strokeLineJoin: EStrokeLineJoin.Round,
            fill: "#241",
            height: 0.2,
            width: 0.1,
            headDepth: 0.8,
        },
        
        // optional - circle at the base of the pointer
        pointerCenterStyle: { 
            size: 0.05, // relative to the pointer length
            fill: "#241",
            stroke: "#195",
        },
    });

    // You can override 1. the Stick (pointer) path
    customPointer.getPointerStickSvg = (pointerLength, pointerWidth, backExtensionSize) => {
        const size = pointerLength * 2;
        return `<path stroke-linejoin=${customPointer.strokeLineJoinProperty}
            d="
                M${size} ${pointerLength}
                L${pointerLength - pointerLength * backExtensionSize} ${pointerLength - pointerWidth / 2}
                l0 ${pointerWidth}
                L${size} ${pointerLength}Z
            " 
            fill="${customPointer.pointerStyleProperty.fill}"
            stroke="${customPointer.pointerStyleProperty.stroke}"  
            stroke-width="${customPointer.pointerStyleProperty.strokeWidth}"
        />`; 
    }
    
    // 2. Center path
    customPointer.getPointerCenterSvg = (pointerLength, centerSize) => {
        return `<rect
            x="${pointerLength - centerSize / 2}" 
            y="${pointerLength - centerSize / 2}"
            width=${centerSize} 
            height=${centerSize}
            rx=${centerSize / 2}
            ry=${centerSize / 2}
            stroke=${customPointer.pointerCenterStyleProperty.stroke}
            stroke-width=${customPointer.pointerCenterStyleProperty.strokeWidth}
            fill=${customPointer.pointerCenterStyleProperty.fill}
        />`;
    }

    // 3. The arrowhead path
    customPointer.getPointerArrowSvg = (pointerLength, height, width, headDepth) => {
        const size = 2 * pointerLength;
        return `<path 
            stroke="${customPointer.pointerArrowStyleProperty.stroke}"
            stroke-width="${customPointer.pointerArrowStyleProperty.strokeWidth}"
            fill="${customPointer.pointerArrowStyleProperty.fill}"
            stroke-linejoin=${customPointer.strokeLineJoinProperty}
            d="
                M${size - height / 2} ${pointerLength - width / 2}
                l${height / 2} ${width / 2}
                l-${height / 2} ${width / 2}
                ${headDepth === 0
                    ? ""
                    : `l${((1 - headDepth) * height) / 2} ${-width / 2}Z`
                }
            " 
        />`;
    }
    // The above methods are the default implementations, but you can override them if you want to

    sciChartSurface.annotations.add(customPointer);
}

drawGaugeChartArc("scichart-root");
