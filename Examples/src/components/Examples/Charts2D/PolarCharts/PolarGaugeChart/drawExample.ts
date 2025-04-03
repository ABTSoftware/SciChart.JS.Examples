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
    XyxyDataSeries,
    EPolarLabelMode,
    TextAnnotation,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    EAnnotationLayer,
    // PolarArcAnnotation,
    EStrokeLineJoin,
} from "scichart";
import { appTheme } from "../../../theme";

export const getChartsInitializationAPI = () => {
    const gauge1 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
            padding: new Thickness(0, 0, 0, 0),
        });
    
        const radialXAxis = new PolarNumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Right,
            polarAxisMode: EPolarAxisMode.Radial,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            innerRadius: 0.2,
        });
        sciChartSurface.xAxes.add(radialXAxis);
    
        const angularYAxis = new PolarNumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            polarAxisMode: EPolarAxisMode.Angular,
            startAngle: 0,
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: Math.PI,
    
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0
        });
        sciChartSurface.yAxes.add(angularYAxis);
    
        const COLORS = [
            appTheme.VividPink,
            appTheme.VividOrange,
            appTheme.MutedRed,
            appTheme.VividGreen,
            appTheme.VividSkyBlue,
            appTheme.Indigo,
            appTheme.DarkIndigo,
        ];
        const collection = new PolarStackedColumnCollection(wasmContext);
        
        for (let i = 0; i < 5; i++) {
            const column = new PolarStackedColumnRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues: [4, 4, 7, 7],  
                    x1Values: [1, 1, 1, 1],
                    yValues: [3, 4, 6, 1],
                    y1Values: [1, 1, 1, 1]
                }),
                fill: COLORS[i],
                stroke: "#FFFFFF"
            });
            collection.add(column);
        }
    
        sciChartSurface.renderableSeries.add(collection);
    
        const pointerAnnotation = new PolarPointerAnnotation({
            x1: 10,
            y1: 7,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
    
            pointerStyle: {
                baseSize: 0.16,
                fill: "white",
                stroke: "black"
            },
    
            pointerCenterStyle: {
                size: 0.16,
                fill: "white",
                stroke: "black"
            }
        });
        sciChartSurface.annotations.add(pointerAnnotation);

        return { sciChartSurface, wasmContext };
    };

    const gauge2 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            // title: "RPM Gauge Chart",
            padding: new Thickness(10, 0, 10, 0)
        });

        const radialXAxis = new PolarNumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 10),
            zoomExtentsToInitialRange: true,
            axisAlignment: EAxisAlignment.Right,
            polarAxisMode: EPolarAxisMode.Radial,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false
        });
        sciChartSurface.xAxes.add(radialXAxis);
    
        const angularYAxis = new PolarNumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            polarAxisMode: EPolarAxisMode.Angular,
            flippedCoordinates: true,
            useNativeText: true,
            startAngle: 0,
            totalAngle: Math.PI,

            autoTicks: false,
            majorDelta: 20,
    
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0
        });
        sciChartSurface.yAxes.add(angularYAxis);
    
        const collection = new PolarStackedColumnCollection(wasmContext, {
        });
        const COLORS = ["red", "orange", "yellow", "lightgreen", "green"];
    
        for (let i = 0; i < 5; i++) {
            const column = new PolarStackedColumnRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: [5],
                    yValues: [20]
                }),
                fill: COLORS[i],
                stroke: "#FFFFFF",
            });
            collection.add(column);
        }
    
        sciChartSurface.renderableSeries.add(collection);
    
        const pointerAnnotation = new PolarPointerAnnotation({
            x1: 46 ,
            y1: 8,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
    
            pointerStyle: {
                baseSize: 0.1,
                fill: "white",
                stroke: "black"
            },
    
            pointerCenterStyle: {
                size: 0.1,
                fill: "white",
                stroke: "black"
            }
        });
        sciChartSurface.annotations.add(pointerAnnotation);

        return { sciChartSurface, wasmContext };
    };

    const gauge3 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0)
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
                color: "white",
                strokeThickness: 2
            },

            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            totalAngle: Math.PI * 3 / 2,
        });
        sciChartSurface.xAxes.add(radialXAxis);
    
        const psiAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Parallel,
            visibleRange: new NumberRange(0, 100),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: Math.PI * 3 / 2,
            startAngle: Math.PI * 2 - Math.PI / 4,
            autoTicks: false,
            majorDelta: 10,
    
            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: appTheme.VividPink,
                strokeThickness: 2,
                tickSize: 10
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: appTheme.VividPink,
                strokeThickness: 0.5,
                tickSize: 6
            },

            isInnerAxis: false,
            labelPrecision: 0,
            labelStyle: {
                color: appTheme.VividPink
            }
        });
        const barAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Horizontal,
            visibleRange: new NumberRange(0, 7),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: Math.PI * 3 / 2,
            startAngle: Math.PI * 2 - Math.PI / 4,
            autoTicks: false,
            majorDelta: 1,
    
            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: "white",
                strokeThickness: 2,
                tickSize: 10
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: "white",
                strokeThickness: 0.5,
                tickSize: 6
            },

            isInnerAxis: true,
            labelPrecision: 0,
            labelStyle: {
                color: 'white'
            }
        });
        sciChartSurface.yAxes.add(psiAxis, barAxis);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: 8,
            y1: 10,
            // annotationLayer: EAnnotationLayer.Background,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            
            pointerStyle: {
                baseSize: 0.1,
                fill: "black",
                backExtensionSize: 0.3,
                strokeWidth: 0,
            },
            
            pointerCenterStyle: {
                size: 0.15,
                stroke: "black",
                fill: "white",
                strokeWidth: 5,
            },

            strokeLineJoin: EStrokeLineJoin.Round
        })

        const barText = new TextAnnotation({
            text: "bar",
            x1: 0, 
            y1: 0,
            fontSize: 20,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(30, 0, 0, 0)
        })
        const psiText = new TextAnnotation({
            text: "psi",
            x1: 0, 
            y1: 0,
            fontSize: 20,
            textColor: appTheme.VividPink,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(50, 0, 0, 0)
        })

        sciChartSurface.annotations.add(
            pointerAnnotation,
            barText, psiText
        )

        return { sciChartSurface, wasmContext };
    };

    const gauge4 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0)
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
            totalAngle: Math.PI * 3 / 2,
        });
        sciChartSurface.xAxes.add(radialXAxis);
    
        const angularYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Horizontal,
            visibleRange: new NumberRange(0, 7),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: Math.PI * 3 / 2,
            startAngle: Math.PI * 2 - Math.PI / 4,
            autoTicks: false,
            majorDelta: 1,
            minorsPerMajor: 2,
    
            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: "white",
                strokeThickness: 2,
                tickSize: 10
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: "white",
                strokeThickness: 0.5,
                tickSize: 6
            },

            isInnerAxis: true,
            labelPrecision: 0,
            labelStyle: {
                color: 'white',
                fontSize: 16,
                padding: new Thickness(3, 2, 0, 2)
            }
        });
        sciChartSurface.yAxes.add(angularYAxis);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: 3.3,
            y1: 10,
            // annotationLayer: EAnnotationLayer.Background,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            
            pointerStyle: {
                baseSize: 0.01,
                fill: appTheme.VividPink,
                stroke: appTheme.VividPink,
                backExtensionSize: 0.2
            },
    
            pointerCenterStyle: {
                size: 0.2,
                fill: "#111111",
                stroke: "#111111"
            },
            isStrokeAboveCenter: true
        })

        const centeredText = new TextAnnotation({
            text: "1/min × 1000",
            x1: 0, 
            y1: 0,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(20, 0, 0, 0)
        })

        // const dangerArcSector = new PolarArcAnnotation({
        //     x1: 10.14,
        //     y1: -4.33,
        //     x2: 8.8,
        //     y2: -2.33,
        //     isEditable: true,
        //     fill: appTheme.VividPink,
        //     strokeThickness: 0,
        //     annotationLayer: EAnnotationLayer.Background,
        // })

        sciChartSurface.annotations.add(
            pointerAnnotation,
            centeredText,
            // dangerArcSector
        )

        return { sciChartSurface, wasmContext };
    };

    const gauge5 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0)
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
            totalAngle: Math.PI * 3 / 2,
        });
        sciChartSurface.xAxes.add(radialXAxis);
    
        const angularYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Horizontal,
            visibleRange: new NumberRange(0, 7),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: Math.PI * 3 / 2,
            startAngle: Math.PI * 2 - Math.PI / 4, 
            autoTicks: false,
            majorDelta: 1,
    
            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: "white",
                strokeThickness: 2,
                tickSize: 10
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: "white",
                strokeThickness: 0.5,
                tickSize: 6
            },

            isInnerAxis: true,
            labelPrecision: 0,
            labelStyle: {
                color: 'white',
                fontSize: 50,
                padding: Thickness.fromNumber(8)
            }
        });
        sciChartSurface.yAxes.add(angularYAxis);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: 3.3,
            y1: 10,
            // annotationLayer: EAnnotationLayer.Background,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            
            pointerStyle: {
                baseSize: 0.01,
                fill: appTheme.VividPink,
                stroke: appTheme.VividPink,
                backExtensionSize: 0.2
            },
    
            pointerCenterStyle: {
                size: 0.2,
                fill: "#111111",
                stroke: "#111111"
            },
            isStrokeAboveCenter: true
        })

        const centeredText = new TextAnnotation({
            text: "1/min × 1000",
            x1: 0, 
            y1: 0,
            fontSize: 18,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(30, 0, 0, 0)
        })

        // const dangerArcSector = new PolarArcAnnotation({
        //     x1: 10.14,
        //     y1: -4.3,
        //     x2: 8.8,
        //     y2: -2.33,
        //     fill: appTheme.VividPink,
        //     strokeThickness: 0,
        //     annotationLayer: EAnnotationLayer.Background,
        // })

        sciChartSurface.annotations.add(
            pointerAnnotation,
            centeredText,
            // dangerArcSector
        )

        return { sciChartSurface, wasmContext };
    };

    const gauge6 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            padding: new Thickness(0, 0, 0, 0)
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
            totalAngle: Math.PI * 3 / 2,
        });
        sciChartSurface.xAxes.add(radialXAxis);
    
        const angularYAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            axisAlignment: EAxisAlignment.Top,
            polarLabelMode: EPolarLabelMode.Horizontal,
            visibleRange: new NumberRange(0, 7),
            flippedCoordinates: true,
            useNativeText: true,
            totalAngle: Math.PI * 3 / 2,
            startAngle: Math.PI * 2 - Math.PI / 4,
            autoTicks: false,
            majorDelta: 1,
    
            drawMajorGridLines: false,
            drawMinorGridLines: false,

            drawMajorTickLines: true,
            majorTickLineStyle: {
                color: "white",
                strokeThickness: 2,
                tickSize: 10
            },
            drawMinorTickLines: true,
            minorTickLineStyle: {
                color: "white",
                strokeThickness: 0.5,
                tickSize: 6
            },

            isInnerAxis: true,
            labelPrecision: 0,
            labelStyle: {
                color: 'white',
                fontSize: 22,
                padding: Thickness.fromNumber(8)
            }
        });
        sciChartSurface.yAxes.add(angularYAxis);

        const pointerAnnotation = new PolarPointerAnnotation({
            x1: 3.3,
            y1: 10,
            // annotationLayer: EAnnotationLayer.Background,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            
            pointerStyle: {
                baseSize: 0.01,
                fill: appTheme.VividPink,
                stroke: appTheme.VividPink,
                backExtensionSize: 0.2
            },
    
            pointerCenterStyle: {
                size: 0.2,
                fill: "#111111",
                stroke: "#111111"
            },
            isStrokeAboveCenter: true
        })

        const centeredText = new TextAnnotation({
            text: "1/min × 1000",
            x1: 0, 
            y1: 0,
            fontSize: 18,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            padding: new Thickness(30, 0, 0, 0)
        })

        // const dangerArcSector = new PolarArcAnnotation({
        //     x1: 10.14,
        //     y1: -4.3,
        //     x2: 8.8,
        //     y2: -2.33,
        //     fill: appTheme.VividPink,
        //     strokeThickness: 0,
        //     annotationLayer: EAnnotationLayer.Background,
        // })

        sciChartSurface.annotations.add(
            pointerAnnotation,
            centeredText,
            // dangerArcSector
        )

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
