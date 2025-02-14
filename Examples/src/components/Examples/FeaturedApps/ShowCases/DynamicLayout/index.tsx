import { makeStyles } from "tss-react/mui";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import {
    AUTO_COLOR,
    EAxisAlignment,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    RolloverModifier,
    SciChartSurface,
    SweepAnimation,
    WaveAnimation,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { GridLayoutModifier } from "./GridLayoutModifier";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import { useContext } from "react";

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

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function DynamicLayout() {
    return (
        <SciChartReact className={commonClasses.ChartWithToolbar} initChart={drawExample}>
            <ChartToolbar />
        </SciChartReact>
    );
}

const ChartToolbar = () => {
    const initResult = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof drawExample>;
    const [isGrid, setIsGrid] = React.useState<boolean>(false);

    const handleToggleButtonChanged = (event: any, value: boolean) => {
        initResult.setIsGridLayoutMode(value);
        setIsGrid(value);
    };
    return (
        <ToggleButtonGroup
            className={commonClasses.ToolbarRow}
            style={{ order: 1 }}
            exclusive
            value={isGrid}
            onChange={handleToggleButtonChanged}
            size="medium"
            color="primary"
            aria-label="small outlined button group"
        >
            <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                Single Chart
            </ToggleButton>
            <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                Chart Per Series
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
