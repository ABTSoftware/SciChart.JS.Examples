import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    GradientParams, 
    Point, 
    EPolarLabelMode,
    WaveAnimation,
    SciChartSurface,
    SciChartPolarSubSurface,
    ECoordinateMode,
    PolarPointerAnnotation,
    Rect,
    EStrokeLineJoin,
    TextAnnotation,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    SciChartSubSurface,
    NumericAxis,
    FastLineRenderableSeries,
    DateTimeNumericAxis,
    ENumericFormat,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Polar Subchart 1
    const gauge1SubChart = SciChartPolarSubSurface.createSubSurface(sciChartSurface, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true,
        position: new Rect(0, 0, 0.4, 0.5),
    });
    const radialXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 4.7),
        zoomExtentsToInitialRange: true,

        startAngle: Math.PI * 3 / 2 + Math.PI / 4,

        drawLabels: false,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
    });
    gauge1SubChart.xAxes.add(radialXAxis);

    const angularYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 100), // 0 to 100
        zoomExtentsToInitialRange: true,
        polarLabelMode: EPolarLabelMode.Parallel,

        flippedCoordinates: true,
        useNativeText: true,
        totalAngle: Math.PI * 3 / 2,
        startAngle: Math.PI * 3 / 2 + Math.PI / 4,

        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        labelPrecision: 0
    });
    gauge1SubChart.yAxes.add(angularYAxis);

    // Add a single column strip
    const backgroundStrip = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [4],  
            yValues: [100]
        }),
        stroke: "#FFFFFF",
        fill: "gray"
    });
    gauge1SubChart.renderableSeries.add(backgroundStrip);
    
    // Add a single column strip
    const columnStrip = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [4],  
            yValues: [83.90]
        }),
        stroke: "#FFFFFF",
        fill: appTheme.VividOrange
    });
    gauge1SubChart.renderableSeries.add(columnStrip);

    const pointerAnnotation = new PolarPointerAnnotation({
        x1: 83.90,
        y1: 4,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        strokeLineJoin: EStrokeLineJoin.Round,

        pointerStyle: {
            baseSize: 0,
            strokeWidth: 0
        },

        pointerArrowStyle: {
            strokeWidth: 2,
            fill: "white",
            stroke: "black",
            height: 0.4,
            width: 0.08,
        }
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
    }

    const centeredText = new TextAnnotation({
        text: "83.90",
        x1: 0,
        y1: 0,
        textColor: appTheme.VividOrange,
        fontSize: 38,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    })

    gauge1SubChart.annotations.add(
        pointerAnnotation,
        centeredText
    );

    gauge1SubChart.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    // Polar Subchart 2
    const gauge2SubChart = SciChartPolarSubSurface.createSubSurface(sciChartSurface, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true,
        position: new Rect(0, 0.5, 0.4, 0.5),
    });
    const radialXAxis2 = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 4.7),
        zoomExtentsToInitialRange: true,

        startAngle: Math.PI * 3 / 2 + Math.PI / 4,

        drawLabels: false,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
    });
    gauge2SubChart.xAxes.add(radialXAxis2);

    const angularYAxis2 = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 100), // 0 to 100
        zoomExtentsToInitialRange: true,
        polarLabelMode: EPolarLabelMode.Parallel,

        flippedCoordinates: true,
        useNativeText: true,
        totalAngle: Math.PI * 3 / 2,
        startAngle: Math.PI * 3 / 2 + Math.PI / 4,

        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        labelPrecision: 0
    });
    gauge2SubChart.yAxes.add(angularYAxis2);

    // Add a single column strip
    const backgroundStrip2 = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [4],  
            yValues: [100]
        }),
        stroke: "#FFFFFF",
        fill: "gray"
    });    
    // Add a single column strip
    const columnStrip2 = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [4],  
            yValues: [57.23]
        }),
        stroke: "#FFFFFF",
        fill: appTheme.VividTeal
    });
    gauge2SubChart.renderableSeries.add(backgroundStrip2, columnStrip2);

    const pointerAnnotation2 = new PolarPointerAnnotation({
        x1: 57.23,
        y1: 4,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        strokeLineJoin: EStrokeLineJoin.Round,

        pointerStyle: {
            baseSize: 0,
            strokeWidth: 0
        },

        pointerArrowStyle: {
            strokeWidth: 2,
            fill: "white",
            stroke: "black",
            height: 0.4,
            width: 0.08,
        }
    });

    // Customize the pointer arrow annotation to make it look like a pill shape
    // pointerAnnotation2.getPointerArrowSvg = (
    //     pointerLength: number, 
    //     height: number, 
    //     width: number, 
    //     headDepth: number
    // ) => {
    //     const size = 2 * pointerLength;
    //     return `<rect 
    //         x="${size - height / 2}" 
    //         y="${pointerLength - width / 2}" 
    //         width="${height}" 
    //         height="${width}" 
    //         fill="${pointerAnnotation2.pointerArrowStyle.fill}"
    //         stroke="${pointerAnnotation2.pointerArrowStyle.stroke}"
    //         stroke-width="${2}"
    //         rx="${width / 2}"
    //         ry="${width / 2}"
    //     />`;
    // }

    const centeredText2 = new TextAnnotation({
        text: "57.23",
        x1: 0,
        y1: 0,
        textColor: appTheme.VividTeal,
        fontSize: 38,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    })

    gauge2SubChart.annotations.add(
        pointerAnnotation2,
        centeredText2
    );

    gauge2SubChart.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );


    // Cartesian Subchart 1
    const fifoSubchart1 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        theme: appTheme.SciChartJsTheme,
        position: new Rect(0.4, 0, 0.6, 0.5),
    });

    fifoSubchart1.xAxes.add(new DateTimeNumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_HHMM
    }));
    fifoSubchart1.yAxes.add(new NumericAxis(wasmContext, {
        labelPrecision: 0,
    }));

    const fifoSeries1 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({length: 50}, (_, i) => i * 100 + 10000000),
            yValues: Array.from({length: 50}, () => Math.random() * 100),
        }),
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
    })
    fifoSubchart1.renderableSeries.add(fifoSeries1);



    // Cartesian Subchart 2
    const fifoSubchat2 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        theme: appTheme.SciChartJsTheme,
        position: new Rect(0.4, 0.5, 0.6, 0.5),
    });

    fifoSubchat2.xAxes.add(new DateTimeNumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_HHMM
    }));
    fifoSubchat2.yAxes.add(new NumericAxis(wasmContext, {
        labelPrecision: 0,
    }));

    const fifoSeries2 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({length: 50}, (_, i) => i * 100 + 10000000),
            yValues: Array.from({length: 50}, () => Math.random() * 100),
        }),
        stroke: appTheme.VividTeal,
        strokeThickness: 3,
    })
    fifoSubchat2.renderableSeries.add(fifoSeries2);

    return { sciChartSurface, wasmContext };
};