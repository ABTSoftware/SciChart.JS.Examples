import * as React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import commonClasses from "../../../styles/Examples.module.scss";
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

    const useStyles = makeStyles()((theme) => ({
        flexContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
        },
        toolbar: {
            minHeight: "70px",
            padding: "10px",
            color: appTheme.ForegroundColor,
            fontSize: "13px",
            flex: "none",
        },
        combobox: {
            color: "black",
            backgroundColor: appTheme.Background,
            margin: "10px 20px 10px 10px",
        },
        textarea: {
            color: "black",
            backgroundColor: appTheme.Background,
            margin: "10px 20px 10px 10px",
            verticalAlign: "middle",
        },
        chartElement: {
            width: "100%",
            flex: "auto",
        },
    }));
    const { classes } = useStyles();

    return (
        <div className={commonClasses.FullHeightChartWrapper} style={{ background: appTheme.DarkIndigo }}>
            <div className={classes.flexContainer}>
                <div className={classes.toolbar}>
                    <FormControlLabel
                        className={commonClasses.FormControlLabel}
                        control={
                            <textarea
                                className={classes.textarea}
                                value={titleText}
                                onChange={handleChangeTitleText}
                            ></textarea>
                        }
                        labelPlacement="start"
                        label="Title text"
                    />

                    <FormControlLabel
                        className={commonClasses.FormControlLabel}
                        control={
                            <select
                                className={classes.combobox}
                                value={titleAlignment}
                                onChange={selectTitleTextAlignment}
                            >
                                {Object.values(ETextAlignment).map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        }
                        labelPlacement="start"
                        label="Title Alignment"
                    />

                    <FormControlLabel
                        className={commonClasses.FormControlLabel}
                        control={
                            <select
                                className={classes.combobox}
                                value={titlePosition}
                                onChange={selectTitleTextPosition}
                            >
                                {Object.values(ETitlePosition).map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        }
                        labelPlacement="start"
                        label="Title Position"
                    />

                    <FormControlLabel
                        className={commonClasses.FormControlLabel}
                        control={
                            <select
                                className={classes.combobox}
                                value={multilineAlignment}
                                onChange={selectTitleTextMultilineAlignment}
                            >
                                {Object.values(EMultiLineAlignment).map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        }
                        labelPlacement="start"
                        label="Multiline Text Alignment"
                    />

                    <FormControlLabel
                        className={commonClasses.FormControlLabel}
                        control={
                            <Checkbox
                                checked={placeWithinChart}
                                onChange={handleChangePlaceWithinChart}
                                name="checkedB"
                            />
                        }
                        labelPlacement="start"
                        label="Place Title within chart?"
                    />
                </div>

                <div style={{ flex: "auto" }}>
                    <SciChartReact
                        style={{ width: "100%", height: "100%" }}
                        initChart={drawExample}
                        onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                            controlsRef.current = controls;
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
