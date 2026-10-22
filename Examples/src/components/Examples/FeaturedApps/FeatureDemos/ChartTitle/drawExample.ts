import { appTheme } from "../../../theme";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import {
    NumericAxis,
    SciChartSurface,
    EMultiLineAlignment,
    ETextAlignment,
    ETitlePosition,
    FastLineRenderableSeries,
    XyDataSeries,
    Thickness,
} from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.title = "Multiline\nChart Title";
    sciChartSurface.titleStyle = {
        color: appTheme.ForegroundColor,
        fontSize: 70,
        padding: Thickness.fromString("4 0 4 0"),
        useNativeText: false,
        placeWithinChart: false,
        multilineAlignment: EMultiLineAlignment.Center,
        alignment: ETextAlignment.Center,
        position: ETitlePosition.Top,
    };

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis Title",
        axisTitleStyle: { fontSize: 16, color: appTheme.ForegroundColor },
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis",
        axisTitleStyle: { fontSize: 16, color: appTheme.ForegroundColor },
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: 3,
            stroke: "auto",
            dataSeries: new XyDataSeries(wasmContext, new RandomWalkGenerator().getRandomWalkSeries(30)),
        })
    );

    const updateTitleText = (value: string) => {
        sciChartSurface.title = value;
    };

    const updateTitlePosition = (value: ETitlePosition) => {
        sciChartSurface.titleStyle = { position: value };
    };

    const updateTitleMultilineAlignment = (value: EMultiLineAlignment) => {
        sciChartSurface.titleStyle = { multilineAlignment: value };
    };

    const updateTitleAlignment = (value: ETextAlignment) => {
        sciChartSurface.titleStyle = { alignment: value };
    };

    const updateTitlePlaceWithinChart = (value: boolean) => {
        sciChartSurface.titleStyle = { placeWithinChart: value };
    };

    return {
        sciChartSurface,
        wasmContext,
        controls: {
            updateTitleText,
            updateTitlePosition,
            updateTitleMultilineAlignment,
            updateTitleAlignment,
            updateTitlePlaceWithinChart,
            updateTitleFontSize: (fontSize: number) => {
                sciChartSurface.titleStyle = { fontSize };
            },
            updateTitleColor: (color: string) => {
                sciChartSurface.titleStyle = { color };
            },
        },
    };
};
