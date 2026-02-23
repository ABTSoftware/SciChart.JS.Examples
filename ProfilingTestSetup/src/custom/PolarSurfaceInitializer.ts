// import {
//     I2DSurfaceOptions,
//     TWebAssemblyChart,
//     SciChartSurface,
//     SciChartPolarSurface,
//     NumericAxis,
//     PolarNumericAxis
// } from "scichart";
// import { SerializableInitializer } from "./SerializableInitializer";

// export class PolarSurfaceInitializer extends SerializableInitializer {
//     protected override initMultiSurface(
//         rootElement: HTMLDivElement | string,
//         options?: I2DSurfaceOptions
//     ): Promise<TWebAssemblyChart<SciChartPolarSurface>> {
//         return SciChartPolarSurface.create(rootElement, options);
//     }

//     protected override async initSingleSurface(
//         rootElement: HTMLDivElement | string,
//         options?: I2DSurfaceOptions
//     ) {
//         return await SciChartPolarSurface.createSingle(rootElement, options);
//     }

//     protected override configureAxes(sciChartSurface: SciChartSurface): Promise<{ xAxis: NumericAxis; yAxis: NumericAxis; }> {
//                const wasmContext = sciChartSurface.webAssemblyContext2D;

//         const mainSurface = sciChartSurface;

//         const { drawLabels } = this.options;

//         const axisOptions: INumericAxisOptions = {
//             useNativeText: true,
//             isVisible: drawLabels,
//             drawMajorBands: false,
//             drawMinorGridLines: false,
//             drawMinorTickLines: false,
//             drawMajorTickLines: false,
//             drawMajorGridLines: false,
//             // labelStyle: { fontSize: 8 },
//             labelFormat: ENumericFormat.Decimal,
//             labelPrecision: 0,
//             autoRange: EAutoRange.Always
//         };

//         const mainXAxis = new PolarNumericAxis(wasmContext, {
//             ...axisOptions,
//             id: "mainXAxis"
//         });

//         mainSurface.xAxes.add(mainXAxis);
//         const mainYAxis = new NumericAxis(wasmContext, {
//             ...axisOptions,
//             id: "mainYAxis"
//         });
//         mainSurface.yAxes.add(mainYAxis);

//         return { xAxis: mainXAxis, yAxis: mainYAxis };
//     }
// }
