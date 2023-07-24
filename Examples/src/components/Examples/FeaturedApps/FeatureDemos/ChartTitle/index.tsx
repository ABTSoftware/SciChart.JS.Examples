import * as React from "react";
import { FormControl, FormControlLabel, Checkbox, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classes from "../../../styles/Examples.module.scss";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
import {
    NumericAxis,
    SciChartSurface,
    EMultiLineAlignment,
    ETextAlignment,
    ETitlePosition,
    FastLineRenderableSeries,
    XyDataSeries,
    Thickness
} from "scichart";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
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
        position: ETitlePosition.Top
    };

    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis Title",
        axisTitleStyle: { fontSize: 16, color: appTheme.ForegroundColor }
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis",
        axisTitleStyle: { fontSize: 16, color: appTheme.ForegroundColor }
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: 3,
            stroke: "auto",
            dataSeries: new XyDataSeries(wasmContext, new RandomWalkGenerator().getRandomWalkSeries(30))
        })
    );

    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function FeatureChartTitle() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    const [titleText, setTitleText] = React.useState("Multiline\nChart Title");
    const [titlePosition, setTitlePosition] = React.useState(ETitlePosition.Top);
    const [titleAlignment, setTitleAlignment] = React.useState(ETextAlignment.Center);
    const [multilineAlignment, setMultilineAlignment] = React.useState(EMultiLineAlignment.Center);
    const [placeWithinChart, setPlaceWithinChart] = React.useState(false);

    const handleChangeTitleText = (event: React.ChangeEvent<{ value: string }>) => {
        if (sciChartSurfaceRef.current) {
            const newValue = event.target.value;
            setTitleText(newValue);
            sciChartSurfaceRef.current.title = newValue;
        }
    };

    const selectTitleTextPosition = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (sciChartSurfaceRef.current) {
            const { value } = event.target;
            setTitlePosition(value as ETitlePosition);
            sciChartSurfaceRef.current.titleStyle = { position: value as ETitlePosition };
        }
    };

    const selectTitleTextMultilineAlignment = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (sciChartSurfaceRef.current) {
            const { value } = event.target;
            setMultilineAlignment(value as EMultiLineAlignment);
            sciChartSurfaceRef.current.titleStyle = { multilineAlignment: value as EMultiLineAlignment };
        }
    };

    const selectTitleTextAlignment = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (sciChartSurfaceRef.current) {
            const { value } = event.target;
            setTitleAlignment(value as ETextAlignment);
            sciChartSurfaceRef.current.titleStyle = { alignment: value as ETextAlignment };
        }
    };

    const handleChangePlaceWithinChart = (event: React.ChangeEvent<{ checked: boolean }>) => {
        if (sciChartSurfaceRef.current) {
            const newValue = event.target.checked;
            setPlaceWithinChart(newValue);
            sciChartSurfaceRef.current.titleStyle = { placeWithinChart: newValue };
        }
    };

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
            });
        };
    }, []);

    const useStyles = makeStyles(theme => ({
        flexContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%"
        },
        toolbar: {
            minHeight: "70px",
            padding: "10px",
            color: appTheme.ForegroundColor,
            fontSize: "13px",
            flex: "none"
        },
        combobox: {
            color: "black",
            backgroundColor: appTheme.Background,
            margin: "10px 20px 10px 10px"
        },
        textarea: {
            color: "black",
            backgroundColor: appTheme.Background,
            margin: "10px 20px 10px 10px",
            verticalAlign: "middle"
        },
        chartElement: {
            width: "100%",
            flex: "auto"
        }
    }));
    const localClasses = useStyles();

    return (
        <div className={classes.FullHeightChartWrapper} style={{ background: appTheme.DarkIndigo }}>
            <div className={localClasses.flexContainer}>
                <div className={localClasses.toolbar}>
                    <FormControlLabel
                        control={
                            <textarea
                                className={localClasses.textarea}
                                value={titleText}
                                onChange={handleChangeTitleText}
                            ></textarea>
                        }
                        labelPlacement="start"
                        label="Title text"
                    />

                    <FormControlLabel
                        control={
                            <select
                                className={localClasses.combobox}
                                value={titleAlignment}
                                onChange={selectTitleTextAlignment}
                            >
                                {Object.values(ETextAlignment).map(value => (
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
                        control={
                            <select
                                className={localClasses.combobox}
                                value={titlePosition}
                                onChange={selectTitleTextPosition}
                            >
                                {Object.values(ETitlePosition).map(value => (
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
                        control={
                            <select
                                className={localClasses.combobox}
                                value={multilineAlignment}
                                onChange={selectTitleTextMultilineAlignment}
                            >
                                {Object.values(EMultiLineAlignment).map(value => (
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
                    <div id={divElementId} style={{ width: "100%", height: "100%" }} />
                </div>
            </div>
        </div>
    );
}
