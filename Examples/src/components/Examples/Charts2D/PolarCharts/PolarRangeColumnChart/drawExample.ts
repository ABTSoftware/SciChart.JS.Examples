import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    PolarCategoryAxis,
    PolarColumnRenderableSeries,
    XyyDataSeries,
    PolarLineRenderableSeries,
    XyDataSeries,
    SplineRenderDataTransform,
    BezierRenderDataTransform,
    EColumnMode,
    ZoomPanModifier
} from "scichart";
import { appTheme } from "../../../theme";

export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const TEMPERATURE_DATA = {
    min: [11.81948, 12.034697, 12.778375, 13.789007, 14.624746, 15.316486, 15.89393, 15.517554, 14.725496, 13.799661, 12.776523, 12.119616],
    max: [12.493054, 12.817261, 14.034957, 14.891214, 15.676935, 16.244125, 16.889472, 16.512617, 15.804098, 14.787963, 13.775281, 13.000732]
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Min and Max surface temperature of each month of 20204",
        titleStyle: {
            fontSize: 24
        }
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        drawLabels: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white"
        },
        labelPostfix: "°C",
        autoTicks: false,
        majorDelta: 1,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1
        },
        visibleRange: new NumberRange(11, 17), // min and max temperatures
        zoomExtentsToInitialRange: true,
        innerRadius: 0.05, // donut hole
        startAngle: Math.PI / 2, // start only after 12 o'clock
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, 
        labels: MONTHS_SHORT,
        autoTicks: false,
        majorDelta: 1, // one tick per month    

        // replace minors with majors by not drawing majors and setting this:
        minorsPerMajor: 2, 
        drawMajorGridLines: false,
        drawMinorGridLines: true,
        minorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1
        },

        drawMajorTickLines: false,
        drawMinorTickLines: false,
        flippedCoordinates: true, // grow clockwise
        startAngle: Math.PI / 2 - Math.PI / 12,
        visibleRange: new NumberRange(0, 12), // 12 months
        zoomExtentsToInitialRange: true,
    });
    sciChartSurface.xAxes.add(polarXAxis);

    // Add series
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const columns = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
            xValues,
            yValues: TEMPERATURE_DATA.min,
            y1Values: TEMPERATURE_DATA.max
        }),
        dataPointWidth: 1, 
        fill: appTheme.VividSkyBlue + "44",
        stroke: appTheme.VividSkyBlue
    })
    sciChartSurface.renderableSeries.add(columns);

    // Add modifiers
    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
    );

    return { sciChartSurface, wasmContext };
};