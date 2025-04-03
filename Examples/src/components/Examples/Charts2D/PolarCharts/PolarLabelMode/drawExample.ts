import {
    SciChartPolarSurface,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarLineRenderableSeries,
    EllipsePointMarker,
    PolarNumericAxis, 
    EPolarAxisMode,
    NumberRange,
    EPolarLabelMode,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,

        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,

        useNativeText: true,
        drawLabels: true,
        innerRadius: 0,
        labelPrecision: 0,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // Only Angular axes support `polarLabelMode`
    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        polarLabelMode: EPolarLabelMode.Horizontal, // this will change based on user input
        visibleRange: new NumberRange(0, 100),
        useNativeText: true,

        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,

        zoomExtentsToInitialRange: true,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    // Add a series to better visualize the chart
    const polarlineSeries = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
            yValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        }),
        pointMarker: new EllipsePointMarker(wasmContext),
        stroke: appTheme.VividOrange,
        strokeThickness: 3
    });
    sciChartSurface.renderableSeries.add(polarlineSeries);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier({ growFactor: 0.0002 })
    );

    // sets new polarLabelMode
    function changePolarLabelMode(newMode: EPolarLabelMode) {
        angularXAxis.polarLabelMode = newMode;
    }

    return { 
        sciChartSurface, 
        wasmContext, 
        controls: { 
            changePolarLabelMode,
            toggleIsInnerAxis: (isInnerAxis: boolean) => {
                angularXAxis.isInnerAxis = isInnerAxis;
            }
        } 
    };
};