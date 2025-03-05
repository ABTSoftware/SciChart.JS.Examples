import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EColor, 
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    Thickness, 
    GradientParams, 
    Point 
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true
    });

    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [0, 1, 2, 3, 4, 5, 6],
        yValues: [1, 2, 3, 4, 5, 6, 7]
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        visibleRangeLimit: new NumberRange(0, 100),
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        majorGridLineStyle: { strokeThickness: 3, color: "CCCCCC" },
        minorGridLineStyle: { strokeThickness: 3, color: "777777" },
        useNativeText: true,
        drawMinorGridLines: false,
        startAngle: Math.PI / 4,
        overrideOffset: 0
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 7),
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Top,
        useNativeText: true,
        labelStyle: { padding: Thickness.fromNumber(0) },
        startAngle: Math.PI / 4
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        stroke: EColor.Orange,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(1, 0), [
            { color: "rgba(170,30,180,0.2)", offset: 0 },
            { color: "rgba(70,130,180,1)", offset: 0.5 },
            { color: "rgba(170,30,180,0.2)", offset: 1 }
        ]),
        dataSeries,
        strokeThickness: 3,
        dataPointWidth: 0.8
    });
    sciChartSurface.renderableSeries.add(polarColumn);

    sciChartSurface.chartModifiers.add(new PolarPanModifier());
    sciChartSurface.chartModifiers.add(new PolarZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};
//     const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(
//         isFlipped ? divElementId2 : divElementId
//     );

//     const theme = new SciChartJsNavyTheme();
//     const metadata: IColorMetadata[] = [];
//     for (let i = 0; i < 6; i++) {
//         metadata.push({ isSelected: false, fill: theme.getStrokeColor(i, 5, wasmContext) });
//     }

//     const dataSeries = new XyxDataSeries(wasmContext, {
//         xValues: [0, 1, 3, 4, 7, 9],
//         yValues: [1, 2, 3, 4, 5, 6],
//         x1Values: [1, 1.5, 0.7, 2.6, 1, 0.5],
//         metadata
//     });

//     const RadialAxis = new PolarNumericAxis(wasmContext, {
//         visibleRangeLimit: new NumberRange(0, 100),
//         flippedCoordinates: false,
//         axisAlignment: EAxisAlignment.Right,
//         polarAxisMode: EPolarAxisMode.Radial,
//         majorGridLineStyle: { strokeThickness: 1, color: "CCCCCC" },
//         minorGridLineStyle: { strokeThickness: 3, color: "777777" },
//         useNativeText: true,
//         drawMinorGridLines: false
//     });

//     sciChartSurface.yAxes.add(RadialAxis);
//     const polarAxis = new PolarNumericAxis(wasmContext, {
//         polarAxisMode: EPolarAxisMode.Angular,
//         visibleRange: new NumberRange(0, 10),
//         flippedCoordinates: isFlipped,
//         axisAlignment: EAxisAlignment.Top,
//         majorGridLineStyle: { strokeThickness: 1, color: "CCCCCC" },
//         minorGridLineStyle: { strokeThickness: 1, color: "77777777" },
//         useNativeText: true,
//         labelStyle: { padding: Thickness.fromNumber(0) }
//     });
//     sciChartSurface.xAxes.add(polarAxis);

//     const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
//         stroke: EColor.Orange,
//         fill: "#ffffff99",
//         dataSeries,
//         strokeThickness: 1,
//         columnXMode: EColumnMode.StartWidth,
//         paletteProvider: new MetadataPaletteProvider()
//     });
//     sciChartSurface.renderableSeries.add(polarColumn);

//     sciChartSurface.chartModifiers.add(new PolarPanModifier());
//     sciChartSurface.chartModifiers.add(new PolarZoomExtentsModifier());
//     sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier());
// };