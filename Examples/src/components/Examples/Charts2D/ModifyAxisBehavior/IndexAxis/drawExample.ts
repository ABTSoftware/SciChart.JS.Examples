// import {
//     SciChartSurface,
//     NumericAxis,
//     NumberRange,
//     FastLineRenderableSeries,
//     XyDataSeries,
//     ZoomExtentsModifier,
//     MouseWheelZoomModifier,
//     ZoomPanModifier,
//     ESubSurfacePositionCoordinateMode,
//     Rect,
//     EPerformanceMarkType,
//     SciChartSubSurface,
//     I2DSubSurfaceOptions,
//     EAutoRange,
//     RolloverModifier,
// } from "scichart";

// import { appTheme } from "../../../theme";
// // import { SubChartsOverviewModifier } from "./SubChartsOverviewModifier";
// // import { AxisSynchroniser } from "./AxisSynchroniser";

// const colorsArr = [
//     appTheme.MutedBlue,
//     appTheme.MutedOrange,
//     appTheme.MutedPink,
//     appTheme.MutedPurple,
//     appTheme.MutedRed,
//     appTheme.MutedSkyBlue,
//     appTheme.MutedTeal,
// ];

// export type TMarkType = EPerformanceMarkType | string;

// export const drawExample = async (rootElement: string | HTMLDivElement) => {
//     // Create a SciChartSurface
//     const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

//     // Add main axes to the surface for the overview to reference
//     const mainXAxis = new NumericAxis(wasmContext, {
//         id: "mainXAxis",
//         isVisible: false, // Hidden since subcharts have their own axes
//         autoRange: EAutoRange.Always,
//     });
//     const mainYAxis = new NumericAxis(wasmContext, {
//         id: "mainYAxis",
//         isVisible: false, // Hidden since subcharts have their own axes
//         autoRange: EAutoRange.Always,
//     });

//     sciChartSurface.xAxes.add(mainXAxis);
//     sciChartSurface.yAxes.add(mainYAxis);

//     // Helper to create some sample data
//     const createLineData = (phase: number) => {
//         const xValues: number[] = [];
//         const yValues: number[] = [];
//         for (let i = 0; i < 500; i++) {
//             const x = i;
//             const y = Math.sin(i * 0.1 + phase);
//             xValues.push(x);
//             yValues.push(y);
//         }
//         return { xValues, yValues };
//     };

//     // Config for N vertically stacked subcharts (panes)
//     const subChartCount = 4;

//     const allSubCharts: any[] = [];

//     // const axisSynchroniser = new AxisSynchroniser(new NumberRange(0, 500));

//     for (let i = 0; i < subChartCount; i++) {
//         // Define where this subchart sits in parent surface coords
//         // Here: split parent viewport into equal-height rows, leaving space for overview
//         const rect = new Rect(0, (i / subChartCount) * 0.8, 1, (1 / subChartCount) * 0.8);

//         const subChartOptions: I2DSubSurfaceOptions = {
//             id: `subChart-${i}`,
//             position: rect,
//             coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
//         };

//         const subChart = SciChartSubSurface.createSubSurface(sciChartSurface, subChartOptions);

//         // Each subchart gets its own axes
//         const subXAxis = new NumericAxis(wasmContext);
//         const subYAxis = new NumericAxis(wasmContext, {
//             growBy: new NumberRange(0.1, 0.1),
//             axisTitle: `Pane ${i + 1}`,
//             axisTitleStyle: { fontSize: 14 },
//         });

//         subChart.xAxes.add(subXAxis);
//         subChart.yAxes.add(subYAxis);

//         const data = createLineData(i * 0.7);

//         const dataSeries = new XyDataSeries(wasmContext, {
//             xValues: data.xValues,
//             yValues: data.yValues,
//         });

//         const lineSeries = new FastLineRenderableSeries(wasmContext, {
//             dataSeries,
//             strokeThickness: 4,
//             stroke: colorsArr[i],
//             opacity: 0.6,
//         });

//         // axisSynchroniser.addAxis(subXAxis);

//         subChart.renderableSeries.add(lineSeries);

//         subChart.chartModifiers.add(
//             new ZoomPanModifier(),
//             new MouseWheelZoomModifier(),
//             new ZoomExtentsModifier(),
//             new RolloverModifier({ modifierGroup: "one" })
//         );

//         allSubCharts.push(subChart);

//         // Fit each subchart to its data
//         subChart.zoomExtents();
//     }

//     sciChartSurface.zoomExtents();

//     // overview stuff start

//     // const overviewModifier = new SubChartsOverviewModifier({
//     //     overviewPosition: new Rect(0, 0.8, 1, 0.2),
//     //     isTransparent: true,
//     //     colors: colorsArr,
//     //     axisTitle: "Overview - All Charts",
//     //     labelStyle: {
//     //         color: "#ffffff80",
//     //         fontSize: 10,
//     //     },
//     //     majorTickLineStyle: {
//     //         color: "#ffffff80",
//     //         tickSize: 6,
//     //         strokeThickness: 1,
//     //     },
//     //     yAxisGrowBy: new NumberRange(0.1, 0.1),
//     //     strokeThickness: 2,
//     //     opacity: 0.8,
//     //     adjustSubChartPositions: false,
//     //     overviewHeightRatio: 0.2,
//     // });

//     // sciChartSurface.chartModifiers.add(overviewModifier);

//     // overview stuff end

//     return { wasmContext, sciChartSurface };
// };

import {
    ENumericFormat,
    EllipsePointMarker,
    FastLineRenderableSeries,
    LegendModifier,
    LogarithmicAxis,
    MouseWheelZoomModifier,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    SweepAnimation,
    XyDataSeries,
    Thickness,
    ZoomExtentsModifier,
    IndexAxis,
    NumericLabelProvider,
    NumberRange,
    CategoryAxis,
    EAxisAlignment,
    SmartDateLabelProvider,
} from "scichart";
import { appTheme } from "../../../theme";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";

const X_AXIS_LINEAR_ID = "X_AXIS_LINEAR_ID";
const X_AXIS_INDEX_ID = "X_AXIS_INDEX_ID";
const Y_AXIS_LINEAR_ID = "Y_AXIS_LINEAR_ID";
const X_AXIS_CATEGORY_ID = "X_AXIS_CATEGORY_ID";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
        title: "Index X Axis",
        titleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            placeWithinChart: true,
            color: appTheme.ForegroundColor + "C4",
            padding: Thickness.fromString("10 0 4 0"),
        },
    });

    // const xAxisCategory = new CategoryAxis(wasmContext, {
    //     // set other properties
    //     drawMajorGridLines: true,
    //     drawMinorGridLines: true,
    //     axisTitle: "Category X Axis",
    //     axisAlignment: EAxisAlignment.Bottom,
    //     // set a date format for labels
    //     labelProvider: new SmartDateLabelProvider(),
    //     id: X_AXIS_CATEGORY_ID,
    // });

    // sciChartSurface.xAxes.add(xAxisCategory);

    const xAxisIndex = new IndexAxis(wasmContext, {
        flippedCoordinates: false,
        labelPrecision: 3,
        cursorLabelPrecision: 2,
        autoTicks: true,
        majorDelta: 10,
        minorDelta: 2,
        labelProvider: new NumericLabelProvider(),
        isVisible: true,
        growBy: new NumberRange(0.1, 0.1),
        id: X_AXIS_INDEX_ID,
    });

    sciChartSurface.xAxes.add(xAxisIndex);

    const lineDataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5, 8, 9],
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3],
    });

    const lineDataSeries1 = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 2, 4, 5, 8, 9],
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3].map((d) => d + 1),
    });

    const lineDataSeries2 = new XyDataSeries(wasmContext, {
        xValues: [1, 3, 3, 4, 5, 8, 9],
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3].map((d) => d + 2),
    });

    const xAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: false,
        id: X_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.1, 0.1),
    });
    sciChartSurface.xAxes.add(xAxisLinear);

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        isVisible: true,
        id: Y_AXIS_LINEAR_ID,
        growBy: new NumberRange(0.1, 0.3),
    });
    sciChartSurface.yAxes.add(yAxisLinear);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: lineDataSeries,
            stroke: appTheme.VividOrange,
            strokeThickness: 6,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividOrange,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: lineDataSeries1,
            stroke: appTheme.VividRed,
            strokeThickness: 6,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividRed,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: lineDataSeries2,
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 6,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividSkyBlue,
                strokeThickness: 0,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier()
        // new LegendModifier({ showCheckboxes: false })
    );

    sciChartSurface.zoomExtents();
    return {
        sciChartSurface,
        wasmContext,
        yAxisLinear,
        xAxisLinear,
        xAxisIndex,
    };
};
