import {
    EAxisAlignment,
    EllipsePointMarker,
    EPolarAxisMode,
    NumberRange,
    PolarNumericAxis,
    SciChartPolarSurface,
    Thickness,
    XyDataSeries,
    PolarPanModifier,
    PolarMouseWheelZoomModifier,
    RadianLabelProvider,
    PolarLineRenderableSeries,
    PolarZoomExtentsModifier,
    SweepAnimation,
} from "scichart";
import { appTheme } from "../../../theme";

function generatePolarTraces(numPoints: number = 300) {
    const theta: number[] = Array.from({ length: numPoints }, (_, i) => (i / (numPoints - 1)) * (2 * Math.PI));
    
    // Normalize function
    function normalizeY(data: number[]) {
        const minY = Math.min(...data);
        const maxY = Math.max(...data);
        return data.map(d => (d - minY) / (maxY - minY));
    }
    
    // Butterfly Curve
    const butterfly = normalizeY(theta.map(t => Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5)));
    
    // Rose Curve
    const roseCurve = normalizeY(theta.map(t => Math.cos(12 * t)));
    
    // Deltoid Curve
    const deltoid = normalizeY(theta.map(t => 2 * (1 - Math.cos(2 * t))));
    
    // Archimedean Spiral
    const archimedeanSprial = normalizeY(theta.map(t => t / (2 * Math.PI)));

    return {
        xValues: theta,
        data: [
            {
                name: "Rose",
                yValues: roseCurve,
                color: appTheme.VividTeal + "66"
            },
            {
                name: "Butterfly",
                yValues: butterfly,
                color: appTheme.VividOrange,
            },
            // {
            //     name: "Deltoid",
            //     yValues: deltoid,
            //     color: appTheme.VividPink,
            // },
            // {
            //     name: "Archimedean Spiral",
            //     yValues: archimedeanSprial,
            //     color: appTheme.VividBlue,
            // },
        ]
    };
}

const COMMON_POLAR_SURFACE_OPTIONS = {
    theme: appTheme.SciChartJsTheme,
    padding: new Thickness(0, 0, 0, 0),
    titleStyle: {
        fontSize: 18,
    },
}

const COMMON_ANGULAR_AXIS_OPTIONS = {
    polarAxisMode: EPolarAxisMode.Angular,
    axisAlignment: EAxisAlignment.Top,

    drawMinorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,

    labelPrecision: 0,
    useNativeText: true,
}

const COMMON_RADIAL_AXIS_OPTIONS = {
    polarAxisMode: EPolarAxisMode.Radial,
    axisAlignment: EAxisAlignment.Left,

    drawMinorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,

    labelPrecision: 0,
    useNativeText: true,

    // zoomExtentsToInitialRange: true,
};

export const getChartsInitializationAPI = () => {
    const line1 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Simple Polar Lines",
        });
        
        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            
            autoTicks: false,
            majorDelta: 2,

            startAngle: Math.PI / 2, // place labels at 12 o'clock
        });
        sciChartSurface.yAxes.add(radialYAxis);
        
        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            autoTicks: false,
            majorDelta: 30,

            visibleRange: new NumberRange(0, 360),
            labelPostfix: "°",

            startAngle: Math.PI / 2, // Start drawing at 12 o'clock
            flippedCoordinates: true, // go clockwise

            zoomExtentsToInitialRange: true, // make sure the visibleRange stays fixed, in `zoomExtents` event case
        });
        sciChartSurface.xAxes.add(angularXAxis);
    
        // Add SERIES
        const xValues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300];
        const polarLine1 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: [0, 1, 2, 3, 4, 5, 6, 4, 5, 3, 3]
            }),
            stroke: appTheme.VividOrange,
            strokeThickness: 4,
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });

        const polarLine2 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: [2, 3, 4, 3, 2, 3, 4, 5, 6, 5, 4]
            }),
            stroke: appTheme.VividTeal,
            strokeThickness: 4,
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });

        sciChartSurface.renderableSeries.add(
            polarLine1, polarLine2
        );
    
        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );
    
        return { sciChartSurface, wasmContext };
    };

    const line2 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Polar Line Function Traces",
        });
        
        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            drawLabels: false
        });
        sciChartSurface.yAxes.add(radialYAxis);
        
        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            visibleRange: new NumberRange(0, Math.PI * 2), // Full trigonometric circle

            labelProvider: new RadianLabelProvider({
                maxDenominator: 6
            }),
            autoTicks: false,
            majorDelta: Math.PI / 6, // needed by RadianLabelProvider to show PI fractions
        });
        sciChartSurface.xAxes.add(angularXAxis);
    
        // Add SERIES
        const TRACES = generatePolarTraces();
        TRACES.data.forEach((dataset, i) => { 
            const polarLine = new PolarLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: TRACES.xValues,
                    yValues: dataset.yValues,
                    dataSeriesName: dataset.name,
                }),
                stroke: dataset.color,
                strokeThickness: 4,
                animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
            });
            sciChartSurface.renderableSeries.add(polarLine);
        })
    
        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );
    
        return { sciChartSurface, wasmContext };
    };

    const line3 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Polar Spiral Line",
        });
        
        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            drawLabels: false
        });
        sciChartSurface.yAxes.add(radialYAxis);
        
        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,
            zoomExtentsToInitialRange: true
        });
        sciChartSurface.xAxes.add(angularXAxis);
    
        // Add SERIES
        const xValues =  Array.from({ length: 26 }, (_, i) => i % 10); // [0, 1, .., 9, 0, .., 9]

        const polarLine = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: xValues,
                yValues: Array.from({ length: 26 }, (_, i) => i), // [0, 1, 2, ... , 18, 19]
            }),
            stroke: appTheme.VividTeal,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 6,
                height: 6,
                stroke: appTheme.VividTeal,
                fill: appTheme.DarkIndigo,
            }),
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });
        sciChartSurface.renderableSeries.add(polarLine);
    
        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );

        sciChartSurface.zoomExtents();
    
        return { sciChartSurface, wasmContext };
    };

    const line4 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Simple Polar Lines",
        });
        
        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            
            autoTicks: false,
            majorDelta: 2,

            startAngle: Math.PI / 2, // place labels at 12 o'clock
        });
        sciChartSurface.yAxes.add(radialYAxis);
        
        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            autoTicks: false,
            majorDelta: 30,

            visibleRange: new NumberRange(0, 360),
            labelPostfix: "°",

            startAngle: Math.PI / 2, // Start drawing at 12 o'clock
            flippedCoordinates: true, // go clockwise

            zoomExtentsToInitialRange: true, // make sure the visibleRange stays fixed, in `zoomExtents` event case
        });
        sciChartSurface.xAxes.add(angularXAxis);
    
        // Add SERIES
        const xValues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300];
        const polarLine1 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: [0, 1, 2, 3, 4, 5, 6, 4, 5, 3, 3]
            }),
            stroke: appTheme.VividOrange,
            strokeThickness: 4,
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });

        const polarLine2 = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: [2, 3, 4, 3, 2, 3, 4, 5, 6, 5, 4]
            }),
            stroke: appTheme.VividTeal,
            strokeThickness: 4,
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });

        sciChartSurface.renderableSeries.add(
            polarLine1, polarLine2
        );
    
        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );
    
        return { sciChartSurface, wasmContext };
    };

    const line5 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Polar Line Function Traces",
        });
        
        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            drawLabels: false
        });
        sciChartSurface.yAxes.add(radialYAxis);
        
        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,

            visibleRange: new NumberRange(0, Math.PI * 2), // Full trigonometric circle

            labelProvider: new RadianLabelProvider({
                maxDenominator: 6
            }),
            autoTicks: false,
            majorDelta: Math.PI / 6, // needed by RadianLabelProvider to show PI fractions
        });
        sciChartSurface.xAxes.add(angularXAxis);
    
        // Add SERIES
        const TRACES = generatePolarTraces();
        TRACES.data.forEach((dataset, i) => { 
            const polarLine = new PolarLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: TRACES.xValues,
                    yValues: dataset.yValues,
                    dataSeriesName: dataset.name,
                }),
                stroke: dataset.color,
                strokeThickness: 4,
                animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
            });
            sciChartSurface.renderableSeries.add(polarLine);
        })
    
        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );
    
        return { sciChartSurface, wasmContext };
    };

    const line6 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
            ...COMMON_POLAR_SURFACE_OPTIONS,
            title: "Polar Spiral Line",
        });
        
        // Add the yAxis
        const radialYAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_RADIAL_AXIS_OPTIONS,
            drawLabels: false
        });
        sciChartSurface.yAxes.add(radialYAxis);
        
        // Add the xAxis
        const angularXAxis = new PolarNumericAxis(wasmContext, {
            ...COMMON_ANGULAR_AXIS_OPTIONS,
            zoomExtentsToInitialRange: true
        });
        sciChartSurface.xAxes.add(angularXAxis);
    
        // Add SERIES
        const xValues =  Array.from({ length: 26 }, (_, i) => i % 10); // [0, 1, .., 9, 0, .., 9]

        const polarLine = new PolarLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: xValues,
                yValues: Array.from({ length: 26 }, (_, i) => i), // [0, 1, 2, ... , 18, 19]
            }),
            stroke: appTheme.VividTeal,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 6,
                height: 6,
                stroke: appTheme.VividTeal,
                fill: appTheme.DarkIndigo,
            }),
            animation: new SweepAnimation({ duration: 800, fadeEffect: true }),
        });
        sciChartSurface.renderableSeries.add(polarLine);
    
        sciChartSurface.chartModifiers.add(
            new PolarPanModifier(),
            new PolarZoomExtentsModifier(),
            new PolarMouseWheelZoomModifier()
        );

        sciChartSurface.zoomExtents();
    
        return { sciChartSurface, wasmContext };
    };

    return {
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
    };
};
