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
    Point, 
    EPolarLabelMode,
    WaveAnimation,
    ScaleAnimation,
    EColumnMode,
    MetadataPaletteProvider,
    IColorMetadata,
    XDataSeries,
    PolarLegendModifier
} from "scichart";
import { appTheme } from "../../../theme";

const DATA ={
    labels: ["React.js", "Angular", "Vue.js", "Svelte", "Next.js", "Ember.js"],
    color: [appTheme.MutedBlue, appTheme.VividRed, appTheme.VividTeal, appTheme.VividOrange, appTheme.DarkIndigo, appTheme.MutedRed],
    values: [45, 31, 14, 5, 3, 2]
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Most Popular JS Frameworks 2024",
        titleStyle: {
            fontSize: 24
        }
    });

    const RadialAxis = new PolarNumericAxis(wasmContext, {
        visibleRangeLimit: new NumberRange(0, 1),
        polarAxisMode: EPolarAxisMode.Radial,
        isVisible: false,
        startAngle: Math.PI / 2
    });
    sciChartSurface.yAxes.add(RadialAxis);

    const polarAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        flippedCoordinates: true, // go clockwise
        isVisible: false,
        startAngle: Math.PI / 2
    });
    sciChartSurface.xAxes.add(polarAxis);

    const metadata: IColorMetadata[] = [];
    for (let i = 0; i < DATA.values.length; i++) {
        metadata.push({ 
            isSelected: false,
            fill: DATA.color[i],
        });
    }
    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XDataSeries(wasmContext, {
            xValues: DATA.values,
            metadata,
        }),
        stroke: "white",
        strokeThickness: 1,
        // columnXMode: EColumnMode.Width,
        paletteProvider: new MetadataPaletteProvider()
    });

    sciChartSurface.renderableSeries.add(polarColumn);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};



// todo 
// export const drawExample2 = async () => {
//     const startAngleInput = 1 / 2;
//     const totalAngleInput = 2;
//     const xMin = 0;
//     const xMax = 10 + 20 + 30 + 40;
//     const yMin = 0;
//     const yMax = 1;
//     const isCategoryAxis = false;
//     const zeroLineY = 0;
//     const dataPointWidth = 0.5;
//     const padding = 30;
//     const axisPadding = 0;
//     const flippedCoordinates = false;
//     const isAxesVisible = false;
//     const coef2 = 1.02;

//     const theme = { ...new SciChartJSLightTheme() };
//     theme.sciChartBackground = "Transparent";
//     theme.columnFillBrush = EColor.White;

//     const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(divElementId, {
//         theme,
//         padding: Thickness.fromNumber(padding)
//     });

//     const startAngle = Math.PI * startAngleInput;
//     const totalAngle = Math.PI * totalAngleInput;
//     const polarLabelMode = EPolarLabelMode.Perpendicular;

//     if (isCategoryAxis) {
//         const xAxis = new PolarCategoryAxis(wasmContext, {
//             visibleRange: new NumberRange(xMin, xMax), // ? 12
//             flippedCoordinates,
//             polarAxisMode: EPolarAxisMode.Angular,
//             majorGridLineStyle: { strokeThickness: 1, color: "000000" },
//             drawMinorGridLines: false,
//             useNativeText: true,
//             labelStyle: { padding: Thickness.fromNumber(axisPadding) },
//             startAngle,
//             totalAngle,
//             isVisible: isAxesVisible
//         });
//         xAxis.polarLabelMode = polarLabelMode;
//         sciChartSurface.xAxes.add(xAxis);
//     } else {
//         const xAxis = new PolarNumericAxis(wasmContext, {
//             visibleRange: new NumberRange(xMin, xMax), // ? 12
//             flippedCoordinates,
//             polarAxisMode: EPolarAxisMode.Angular,
//             majorGridLineStyle: { strokeThickness: 1, color: "000000" },
//             drawMinorGridLines: false,
//             useNativeText: true,
//             labelStyle: { padding: Thickness.fromNumber(axisPadding) },
//             startAngle,
//             totalAngle,
//             isVisible: isAxesVisible
//         });
//         xAxis.polarLabelMode = polarLabelMode;
//         sciChartSurface.xAxes.add(xAxis);
//     }

//     const yAxis = new PolarNumericAxis(wasmContext, {
//         visibleRange: new NumberRange(yMin, yMax * coef2),
//         visibleRangeLimit: new NumberRange(0, 100),
//         flippedCoordinates: false,
//         polarAxisMode: EPolarAxisMode.Radial,
//         majorGridLineStyle: { strokeThickness: 1, color: "AAAAAAAA" },
//         useNativeText: true,
//         drawMinorGridLines: false,
//         startAngle,
//         totalAngle,
//         labelPrecision: 1,
//         drawLabels: true,
//         gridlineMode: EPolarGridlineMode.Circles,
//         labelStyle: { padding: Thickness.fromNumber(axisPadding) },
//         isVisible: isAxesVisible
//     });
//     sciChartSurface.yAxes.add(yAxis);

//     const getPieSegments = (): IPieSegment[] => {
//         const pieSegment1 = new PieSegment({
//             color: EColor.Green,
//             value: 10,
//             text: "Green",
//             delta: 20,
//             showLabel: false
//         });
//         // pieSegment1.radiusAdjustment = 1.2;
//         const pieSegment2 = new PieSegment({
//             color: EColor.Orange,
//             value: 20,
//             text: "Orange",
//             delta: 20,
//             showLabel: false
//         });
//         // pieSegment2.radiusAdjustment = 0.7;
//         //pieSegment2.labelProvider.formatLabel = (value: number) => `<span>${value.toFixed(1)}</span><br/>パーセンテージ`;
//         const pieSegment3 = new PieSegment({
//             color: EColor.Blue,
//             value: 30,
//             text: "Blue",
//             delta: 30,
//             showLabel: false
//         });
//         //pieSegment3.labelProvider.formatLabel = (value: number) => ``;
//         const pieSegment4 = new PieSegment({
//             color: EColor.Yellow,
//             value: 40,
//             text: "Yellow",
//             delta: 40,
//             showLabel: false
//         });
//         return [pieSegment1, pieSegment2, pieSegment3, pieSegment4];
//     };
//     sciChartSurface.chartModifiers.add(
//         new NativePieChartModifier({
//             segments: getPieSegments(),
//             coef2,
//             executeCondition: { button: EExecuteOn.MouseLeftButton }
//         })
//     );
// };