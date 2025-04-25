import {
    EAxisAlignment,
    ECoordinateMode,
    EPolarAxisMode,
    NumberRange,
    PolarNumericAxis,
    PolarStackedColumnCollection,
    PolarStackedColumnRenderableSeries,
    SciChartPolarSurface,
    Thickness,
    XyDataSeries,
    PolarPointerAnnotation,
    EPolarLabelMode,
    TextAnnotation,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    EAnnotationLayer,
    EStrokeLineJoin,
    PolarArcAnnotation,
    NativeTextAnnotation,
    GradientParams,
    Point,
    PolarColumnRenderableSeries,
    XyxyDataSeries,
    XyyDataSeries,
    EColumnMode,
    XyxDataSeries,
    EColumnYMode,
    EAutoRange,
} from "scichart";
import { appTheme } from "../../../theme";

const DARK_BLUE = "#111111";
const POINTER_VALUE = 62;

export const getChartsInitializationAPI = () => {
    const gauge1 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0),
        });

        const columnYValues = [50, 70, 80, 90, 100];
        const GRADIENT_COLROS = [
            appTheme.VividPink,
            appTheme.VividOrange,
            appTheme.VividTeal,
            appTheme.Indigo,
            appTheme.DarkIndigo,
        ];

        const radialXAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Right,

            // start labels in sync with angular axis
            startAngle: - Math.PI / 4,

            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(radialXAxis);

        const angularYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            visibleRange: new NumberRange(0, 100), // 0 to 100
            zoomExtentsToInitialRange: true,

            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: (Math.PI * 3) / 2,
            startAngle: - Math.PI / 4,

            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0,
            labelStyle: {
                color: "#FFFFFF",
            },
        });
        angularYAxis.labelProvider.formatLabel = (value: number) => {
            if (columnYValues.includes(value) || value === 0) {
                return value.toFixed(0);
            }
            return "";
        };
        sciChartSurface.yAxes.add(angularYAxis);

        // Add 5 background arc sectors
        columnYValues.forEach((yVal, i) => {
            const highlightArc = new PolarArcAnnotation({
                x2: 8,
                x1: 10,

                y1: columnYValues[i - 1] ?? 0,
                y2: yVal,

                fill: GRADIENT_COLROS[i],
                strokeThickness: 2,
            });
            sciChartSurface.annotations.add(highlightArc);
        });

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: POINTER_VALUE,
            y1: 8,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,

            pointerStyle: {
                baseSize: 0.2,
                fill: "#FFFFFF",
                stroke: "#FFFFFF",
                strokeWidth: 2,
            },

            pointerCenterStyle: {
                size: 0.2,
                fill: DARK_BLUE,
                stroke: "#FFFFFF",
                strokeWidth: 2,
            },
        });
        sciChartSurface.annotations.add(pointerAnnotation);

        return { sciChartSurface, wasmContext };
    };

    const gauge2 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(10, 0, 10, 0),
        });

        const radialYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Right,
            zoomExtentsToInitialRange: true,
            visibleRange: new NumberRange(0, 5),
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.yAxes.add(radialYAxis);

        const angularXAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            flippedCoordinates: true,
            visibleRange: new NumberRange(-10, 10),
            useNativeText: true,
            startAngle: 0,
            totalAngleDegrees: 90,

            autoTicks: false,
            majorDelta: 5,

            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0,
            labelStyle: {
                color: "#FFFFFF",
            },
        });
        sciChartSurface.xAxes.add(angularXAxis);

        const column = new PolarColumnRenderableSeries(wasmContext, {
            columnXMode: EColumnMode.StartEnd,
            dataSeries: new XyxDataSeries(wasmContext, {
                xValues: [-10], // start
                x1Values: [10], //end
                yValues: [5], // top
            }),
            defaultY1: 4, // bottom
            fillLinearGradient: new GradientParams(new Point(1, 0), new Point(0, 0), [
                { offset: 0, color: appTheme.VividPink },
                { offset: 0.4, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.Indigo },
                { offset: 1, color: appTheme.DarkIndigo },
            ]),
            stroke: "#FFFFFF",
        });
        sciChartSurface.renderableSeries.add(column);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: -3,
            y1: 4,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,

            pointerStyle: {
                baseSize: 0.05,
                fill: DARK_BLUE,
                stroke: DARK_BLUE,
                backExtensionSize: 0.1,
            },

            pointerCenterStyle: {
                size: 0.1,
                fill: appTheme.Indigo,
                stroke: DARK_BLUE,
                strokeWidth: 6,
            },
        });
        sciChartSurface.annotations.add(pointerAnnotation);

        return { sciChartSurface, wasmContext };
    };

    const gauge3 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0),
        });

        const radialXAxis = new PolarNumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 10),
            labelStyle: { padding: new Thickness(0, 0, 0, 0) },
            axisAlignment: EAxisAlignment.Right,
            polarAxisMode: EPolarAxisMode.Radial,
            useNativeText: true,
            drawLabels: false,

            autoTicks: false,
            majorDelta: 10,
            drawMajorGridLines: true,
            majorGridLineStyle: {
                color: "#FFFFFF",
                strokeThickness: 2,
            },

            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            totalAngle: (Math.PI * 3) / 2,
        });
        sciChartSurface.xAxes.add(radialXAxis);

        const psiAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Parallel,
            visibleRange: new NumberRange(0, 100),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: (Math.PI * 3) / 2,
            startAngle: - Math.PI / 4,
            autoTicks: false,
            majorDelta: 10,

            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: appTheme.VividPink,
                strokeThickness: 2,
                tickSize: 10,
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: appTheme.VividPink,
                strokeThickness: 0.5,
                tickSize: 6,
            },

            isInnerAxis: false,
            labelPrecision: 0,
            labelStyle: {
                color: appTheme.VividPink,
            },
        });
        const barAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Horizontal,
            visibleRange: new NumberRange(0, 7),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: (Math.PI * 3) / 2,
            startAngle: Math.PI * 2 - Math.PI / 4,
            autoTicks: false,
            majorDelta: 1,

            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: "#FFFFFF",
                strokeThickness: 2,
                tickSize: 10,
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: "#FFFFFF",
                strokeThickness: 0.5,
                tickSize: 6,
            },

            isInnerAxis: true,
            labelPrecision: 0,
            labelStyle: {
                color: "white",
            },
        });
        sciChartSurface.yAxes.add(psiAxis, barAxis);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: POINTER_VALUE,
            y1: 10,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            annotationLayer: EAnnotationLayer.Background,

            pointerStyle: {
                baseSize: 0.1,
                stroke: DARK_BLUE,
                fill: DARK_BLUE,
                backExtensionSize: 0.3,
                strokeWidth: 2,
            },

            pointerCenterStyle: {
                size: 0.15,
                stroke: DARK_BLUE,
                fill: "#FFFFFF",
                strokeWidth: 5,
            },

            pointerArrowStyle: {
                headDepth: 0.8,
                width: 0.15,
                height: 0.25,
                fill: DARK_BLUE,
                stroke: DARK_BLUE,
            },

            strokeLineJoin: EStrokeLineJoin.Miter,
        });

        const barText = new TextAnnotation({
            text: "bar",
            x1: 0,
            y1: 0,
            fontSize: 20,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(30, 0, 0, 0),
        });
        const psiText = new TextAnnotation({
            text: "psi",
            x1: 0,
            y1: 0,
            fontSize: 20,
            textColor: appTheme.VividPink,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(50, 0, 0, 0),
        });

        sciChartSurface.annotations.add(pointerAnnotation, barText, psiText);

        return { sciChartSurface, wasmContext };
    };

    const gauge4 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0),
        });

        const localPointerValue = 31;

        const radialXAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Right,

            visibleRange: new NumberRange(0, 10),
            zoomExtentsToInitialRange: true,

            startAngle: - Math.PI / 4,

            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(radialXAxis);

        const angularYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            visibleRange: new NumberRange(0, 50),
            zoomExtentsToInitialRange: true,

            polarLabelMode: EPolarLabelMode.Parallel,
            labelStyle: {
                color: "#FFFFFF",
                padding: new Thickness(5, 5, 5, 5),
            },

            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: (Math.PI * 3) / 2,
            startAngle: - Math.PI / 4,

            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0,
        });
        sciChartSurface.yAxes.add(angularYAxis);

        // Add a background arc sector
        const backgroundArc = new PolarArcAnnotation({
            x2: 8,
            x1: 10,
            y1: 0,
            y2: 50,

            fill: DARK_BLUE,
            strokeThickness: 2,
        });
        // Add the highlight arc sector - represents the current value
        const highlightArc = new PolarArcAnnotation({
            x2: 8,
            x1: 10,
            y1: 0,
            y2: localPointerValue,

            fill: appTheme.VividPink,
            strokeThickness: 2,
        });
        sciChartSurface.annotations.add(backgroundArc, highlightArc);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: localPointerValue,
            y1: 9,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            strokeLineJoin: EStrokeLineJoin.Round,

            pointerStyle: {
                baseSize: 0,
                strokeWidth: 0,
            },

            pointerArrowStyle: {
                strokeWidth: 2,
                fill: "#FFFFFF",
                stroke: DARK_BLUE,
                height: 0.3,
                width: 0.05,
            },
        });

        // Customize the pointer arrow annotation to make it look like a pill shape
        pointerAnnotation.getPointerArrowSvg = (
            pointerLength: number,
            height: number,
            width: number,
            headDepth: number
        ) => {
            const size = 2 * pointerLength;
            return `<rect 
                x="${size - height / 2}" 
                y="${pointerLength - width / 2}" 
                width="${height}" 
                height="${width}" 
                fill="${pointerAnnotation.pointerArrowStyle.fill}"
                stroke="${pointerAnnotation.pointerArrowStyle.stroke}"
                stroke-width="${2}"
                rx="${width / 2}"
                ry="${width / 2}"
            />`;
        };

        const centeredText = new NativeTextAnnotation({
            text: `${localPointerValue}`,
            x1: 0,
            y1: 0,
            textColor: "#FFFFFF",
            fontSize: 38,
            padding: new Thickness(0, 0, 20, 0),
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        });

        sciChartSurface.annotations.add(pointerAnnotation, centeredText);

        return { sciChartSurface, wasmContext };
    };

    const gauge5 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0),
        });
        const columnYValues = [50, 75, 100];
        const GRADIENT_COLROS = [appTheme.VividGreen, appTheme.VividOrange, appTheme.VividPink];

        const radialXAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            axisAlignment: EAxisAlignment.Right,

            // start labels in sync with angular axis
            startAngle: (Math.PI * 3) / 2 + Math.PI / 4,

            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(radialXAxis);

        const angularYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Perpendicular,

            visibleRange: new NumberRange(0, 100), // 0 to 100
            zoomExtentsToInitialRange: true,

            flippedCoordinates: true,
            useNativeText: true,
            totalAngleDegrees: 220,
            startAngleDegrees: -20, // (180 )

            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0,
            labelStyle: {
                color: "#FFFFFF",
            },
        });
        sciChartSurface.yAxes.add(angularYAxis);

        // the gray background arc
        const backgroundArc = new PolarArcAnnotation({
            x2: 8.1,
            x1: 10,

            y1: 0,
            y2: 100,

            fill: "#88888844",
            strokeThickness: 0,
        });
        sciChartSurface.annotations.add(backgroundArc);

        // Add 3 thin background arc sectors
        let hasPointerPassedValue = false;
        columnYValues.forEach((yVal, i) => {
            const thinArc = new PolarArcAnnotation({
                x2: 7.6,
                x1: 7.9,

                y1: columnYValues[i - 1] ?? 0,
                y2: yVal, // always present and visible

                fill: GRADIENT_COLROS[i],
                strokeThickness: 0,
            });
            sciChartSurface.annotations.add(thinArc);

            const valueArc = new PolarArcAnnotation({
                id: `arc${i}`,

                x2: 8.1,
                x1: 10,
                y1: columnYValues[i - 1] ?? 0,
                y2: hasPointerPassedValue ? columnYValues[i - 1] ?? 0 : yVal > POINTER_VALUE ? POINTER_VALUE : yVal,
                // visible until the pointer passes the threshold

                fill: GRADIENT_COLROS[i],
                strokeThickness: 0,
            });
            sciChartSurface.annotations.add(valueArc);

            if (yVal >= POINTER_VALUE) {
                hasPointerPassedValue = true;
            }
        });

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: POINTER_VALUE,
            y1: 7.6,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,

            pointerStyle: {
                // hide line
                baseSize: 0,
                strokeWidth: 0,
            },

            pointerArrowStyle: {
                strokeWidth: 3,
                stroke: "white",
                fill: "none",
                height: 0.4,
                width: 0.25,
            },

            strokeLineJoin: EStrokeLineJoin.Miter,
        });
        const centeredText = new NativeTextAnnotation({
            text: `${POINTER_VALUE}`,
            x1: 0,
            y1: 0,
            textColor: "#FFFFFF",
            fontSize: 38,
            padding: new Thickness(0, 0, 20, 0),
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        });
        sciChartSurface.annotations.add(pointerAnnotation, centeredText);

        return { sciChartSurface, wasmContext };
    };

    const gauge6 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(15, 15, 15, 15), // optional padding to match the others 5 gauges with outer labels
        });

        const radialXAxis = new PolarNumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 10),
            labelStyle: { padding: new Thickness(0, 0, 0, 0) },
            axisAlignment: EAxisAlignment.Right,
            polarAxisMode: EPolarAxisMode.Radial,
            useNativeText: true,
            drawLabels: false,

            autoTicks: false,
            majorDelta: 10,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            totalAngle: (Math.PI * 3) / 2,
        });
        sciChartSurface.xAxes.add(radialXAxis);

        const angularYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Horizontal,
            visibleRange: new NumberRange(0, 7),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: (Math.PI * 3) / 2,
            startAngle: Math.PI * 2 - Math.PI / 4,
            autoTicks: false,
            majorDelta: 1,
            minorsPerMajor: 4,

            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: "#FFFFFF",
                strokeThickness: 2.5,
                tickSize: 14,
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: "#FFFFFF",
                strokeThickness: 0.5,
                tickSize: 8,
            },

            isInnerAxis: true,
            labelPrecision: 0,
            labelStyle: {
                color: "white",
                fontSize: 25,
                padding: Thickness.fromNumber(8),
            },
        });
        sciChartSurface.yAxes.add(angularYAxis);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: 4.3,
            y1: 10,
            // annotationLayer: EAnnotationLayer.Background,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,

            pointerStyle: {
                baseSize: 0.02,
                fill: appTheme.VividPink,
                stroke: appTheme.VividPink,
                backExtensionSize: 0.2,
            },

            pointerCenterStyle: {
                size: 0.25,
                fill: DARK_BLUE,
                stroke: DARK_BLUE,
            },
            isStrokeAboveCenter: true,
            strokeLineJoin: EStrokeLineJoin.Round,
        });

        const dangerArcSector = new PolarArcAnnotation({
            y1: 5,
            y2: 7,
            x1: 10,
            x2: 9.4,
            fill: appTheme.VividRed,
            strokeThickness: 0,
            annotationLayer: EAnnotationLayer.Background,
        });

        const outlineArcLine = new PolarArcAnnotation({
            y1: 0,
            y2: 7,

            x1: 10,
            x2: 9.7,
            stroke: "#FFFFFF",
            isLineMode: true,
            strokeThickness: 3,
            annotationLayer: EAnnotationLayer.Background,
        });

        sciChartSurface.annotations.add(pointerAnnotation, dangerArcSector, outlineArcLine);

        return { sciChartSurface, wasmContext };
    };

    return {
        gauge1,
        gauge2,
        gauge3,
        gauge4,
        gauge5,
        gauge6,
    };
};
