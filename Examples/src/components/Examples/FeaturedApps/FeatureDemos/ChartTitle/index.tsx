import * as React from "react";
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
import { SciChartReact, TResolvedReturnType } from "scichart-react";

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
        },
    };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function FeatureChartTitle() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const [titleText, setTitleText] = React.useState("Multiline\nChart Title");
    const [titlePosition, setTitlePosition] = React.useState(ETitlePosition.Top);
    const [titleAlignment, setTitleAlignment] = React.useState(ETextAlignment.Center);
    const [multilineAlignment, setMultilineAlignment] = React.useState(EMultiLineAlignment.Center);
    const [placeWithinChart, setPlaceWithinChart] = React.useState(false);

    const handleChangeTitleText = (event: React.ChangeEvent<{ value: string }>) => {
        if (controlsRef.current) {
            const newValue = event.target.value;
            setTitleText(newValue);
            controlsRef.current.updateTitleText(newValue);
        }
    };

    const selectTitleTextPosition = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (controlsRef.current) {
            const { value } = event.target;
            setTitlePosition(value as ETitlePosition);
            controlsRef.current.updateTitlePosition(value as ETitlePosition);
        }
    };

    const selectTitleTextMultilineAlignment = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (controlsRef.current) {
            const { value } = event.target;
            setMultilineAlignment(value as EMultiLineAlignment);
            controlsRef.current.updateTitleMultilineAlignment(value as EMultiLineAlignment);
        }
    };

    const selectTitleTextAlignment = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (controlsRef.current) {
            const { value } = event.target;
            setTitleAlignment(value as ETextAlignment);
            controlsRef.current.updateTitleAlignment(value as ETextAlignment);
        }
    };

    const handleChangePlaceWithinChart = (event: React.ChangeEvent<{ checked: boolean }>) => {
        if (controlsRef.current) {
            const newValue = event.target.checked;
            setPlaceWithinChart(newValue);
            controlsRef.current.updateTitlePlaceWithinChart(newValue);
        }
    };

    return (
        <div className="sc-chart-wrapper" style={{ background: appTheme.DarkIndigo }}>
            <header className="sc-toolbar-row flex-col">
                <div className="flex items-center gap-2 w-full">
                    <label className="sc-control flex-1" style={{ minWidth: 0 }}>
                        <span>Title text</span>
                        <textarea
                            value={titleText}
                            onChange={handleChangeTitleText}
                            className="sc-input flex-1"
                            style={{ minWidth: 0 }}
                        />
                    </label>

                    <label className="sc-switch flex-none">
                        <input type="checkbox" checked={placeWithinChart} onChange={handleChangePlaceWithinChart} />
                        Place Title within chart?
                    </label>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full">
                    <label className="sc-control">
                        <span>Title Alignment</span>
                        <select className="sc-select" value={titleAlignment} onChange={selectTitleTextAlignment}>
                            {Object.values(ETextAlignment).map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="sc-control">
                        <span>Title Position</span>
                        <select className="sc-select" value={titlePosition} onChange={selectTitleTextPosition}>
                            {Object.values(ETitlePosition).map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="sc-control">
                        <span>Multiline Text Alignment</span>
                        <select
                            className="sc-select"
                            value={multilineAlignment}
                            onChange={selectTitleTextMultilineAlignment}
                        >
                            {Object.values(EMultiLineAlignment).map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </header>

            <SciChartReact
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                }}
            />
        </div>
    );
}
