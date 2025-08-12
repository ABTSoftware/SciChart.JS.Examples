import {
    SciChartSurface,
    NumericAxis,
    EAxisAlignment,
    NumberRange,
    FastLineRenderableSeries,
    XyDataSeries,
    AUTO_COLOR,
    SweepAnimation,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    ZoomPanModifier,
    RolloverModifier,
} from "scichart";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { GridLayoutModifier } from "./GridLayoutModifier";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.05),
        })
    );

    const POINTS = 1000;
    for (let i = 0; i < 10; i++) {
        // Create arrays of x, y values (just arrays of numbers)
        const { xValues, yValues } = new RandomWalkGenerator().getRandomWalkSeries(POINTS);

        // Create a Series and add to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: `Series ${i + 1}` }),
                stroke: AUTO_COLOR,
                strokeThickness: 3,
                animation: new SweepAnimation({ duration: 500, fadeEffect: true }),
            })
        );
    }

    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier({ modifierGroup: "chart" }),
        new MouseWheelZoomModifier({ modifierGroup: "chart" }),
        new ZoomPanModifier({ modifierGroup: "chart" }),
        new RolloverModifier({ modifierGroup: "chart" })
    );

    const glm = new GridLayoutModifier();
    sciChartSurface.chartModifiers.add(glm);

    sciChartSurface.zoomExtents();

    const setIsGridLayoutMode = (value: boolean) => {
        glm.isGrid = value;
    };

    return { wasmContext, sciChartSurface, setIsGridLayoutMode };
};
