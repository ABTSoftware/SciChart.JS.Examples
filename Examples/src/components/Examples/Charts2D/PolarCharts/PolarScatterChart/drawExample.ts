import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    EPolarLabelMode,
    PolarXyScatterRenderableSeries,
    SweepAnimation,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    Thickness,
    EllipsePointMarker,
    PolarLegendModifier,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        zoomExtentsToInitialRange: true,
        
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,
        
        startAngle: Math.PI / 2,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
        drawLabels: false, // no radial labels
        innerRadius: 0.1, // donut hole
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 9),
        startAngle: Math.PI / 2, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise
        zoomExtentsToInitialRange: true,

        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,

        useNativeText: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const DATA = [
        {
            yVals: [NaN, NaN, 3.5, 2.7, 4.8, NaN, 5, 4.5, 3.5],
            color: appTheme.VividOrange,
            name: "Series 1",
        },
        {
            yVals: [1.9, 4.3, 2.9, 1.2, 3, 3.4, NaN, NaN, 2.3],
            color: appTheme.VividTeal,
            name: "Series 2",
        }
    ]

    // Add some scatter series
    DATA.forEach(({ yVals, color, name }) => {
        const polarScatter = new PolarXyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                yValues: yVals,
                dataSeriesName: name,
            }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                fill: appTheme.DarkIndigo,
                stroke: color,
                strokeThickness: 2,
            }),
            dataLabels: {
                color: color,
                style: {
                    fontSize: 14,
                    fontFamily: "Default",
                    padding: new Thickness(0, 0, 14, 0),
                },
                horizontalTextPosition: EHorizontalTextPosition.Center,
                verticalTextPosition: EVerticalTextPosition.Above,
            },
            stroke: color, // set stroke color for Legend modifier markers
            animation: new SweepAnimation({ duration: 800 }),
        });
        sciChartSurface.renderableSeries.add(polarScatter);
    });

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
        new PolarLegendModifier({
            showCheckboxes: true
        })
    );

    return { sciChartSurface, wasmContext };
};