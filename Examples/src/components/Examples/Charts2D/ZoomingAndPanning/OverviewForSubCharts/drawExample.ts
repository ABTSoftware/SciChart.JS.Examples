import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    FastLineRenderableSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    ESubSurfacePositionCoordinateMode,
    Rect,
    EPerformanceMarkType,
    SciChartSubSurface,
    I2DSubSurfaceOptions,
    EAutoRange,
    RolloverModifier,
    EXyDirection,
} from "scichart";

import { appTheme } from "../../../theme";
import { SubChartsOverviewModifier } from "./SubChartsOverviewModifier";
import { AxisSynchroniser } from "../../MultiChart/SyncMultiChart/AxisSynchroniser";

const colorsArr = [
    appTheme.MutedBlue,
    appTheme.MutedOrange,
    appTheme.MutedPink,
    appTheme.MutedPurple,
    appTheme.MutedRed,
    appTheme.MutedSkyBlue,
    appTheme.MutedTeal,
];

export type TMarkType = EPerformanceMarkType | string;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    // Add main axes to the surface for the overview to reference
    const mainXAxis = new NumericAxis(wasmContext, {
        id: "mainXAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always,
    });
    const mainYAxis = new NumericAxis(wasmContext, {
        id: "mainYAxis",
        isVisible: false, // Hidden since subcharts have their own axes
        autoRange: EAutoRange.Always,
    });

    sciChartSurface.xAxes.add(mainXAxis);
    sciChartSurface.yAxes.add(mainYAxis);

    // Helper to create some sample data
    const createLineData = (phase: number) => {
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let i = 0; i < 500; i++) {
            const x = i;
            const y = Math.sin(i * 0.1 + phase);
            xValues.push(x);
            yValues.push(y);
        }
        return { xValues, yValues };
    };

    // Config for N vertically stacked subcharts (panes)
    const subChartCount = 4;

    const allSubCharts: any[] = [];

    const axisSynchroniser = new AxisSynchroniser(new NumberRange(0, 500));

    for (let i = 0; i < subChartCount; i++) {
        // Define where this subchart sits in parent surface coords
        // Here: split parent viewport into equal-height rows, leaving space for overview
        const rect = new Rect(0, (i / subChartCount) * 0.8, 1, (1 / subChartCount) * 0.8);

        const subChartOptions: I2DSubSurfaceOptions = {
            id: `subChart-${i}`,
            position: rect,
            coordinateMode: ESubSurfacePositionCoordinateMode.Relative,
        };

        const subChart = SciChartSubSurface.createSubSurface(sciChartSurface, subChartOptions);

        // Each subchart gets its own axes
        const subXAxis = new NumericAxis(wasmContext);
        const subYAxis = new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            axisTitle: `Pane ${i + 1}`,
            axisTitleStyle: { fontSize: 14 },
            drawMinorGridLines: false,
        });

        subChart.xAxes.add(subXAxis);
        subChart.yAxes.add(subYAxis);

        const data = createLineData(i * 0.7);

        const dataSeries = new XyDataSeries(wasmContext, {
            xValues: data.xValues,
            yValues: data.yValues,
        });

        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 4,
            stroke: colorsArr[i],
            opacity: 0.6,
        });

        axisSynchroniser.addAxis(subXAxis);

        subChart.renderableSeries.add(lineSeries);

        subChart.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier(),
            new RolloverModifier({ modifierGroup: "one" })
        );

        allSubCharts.push(subChart);

        // Fit each subchart to its data
        subChart.zoomExtents();
    }

    sciChartSurface.zoomExtents();

    // overview stuff start

    const overviewModifier = new SubChartsOverviewModifier({
        overviewPosition: new Rect(0, 0.8, 1, 0.2),
        isTransparent: true,
        axisTitle: "Overview - All Charts",
        labelStyle: {
            color: "#ffffff80",
            fontSize: 10,
        },
        majorTickLineStyle: {
            color: "#ffffff80",
            tickSize: 6,
            strokeThickness: 1,
        },
        yAxisGrowBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.chartModifiers.add(overviewModifier);

    // overview stuff end

    return { wasmContext, sciChartSurface };
};
