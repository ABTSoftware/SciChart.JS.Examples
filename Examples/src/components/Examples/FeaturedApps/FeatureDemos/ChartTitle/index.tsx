import * as React from "react";
import { FormControl, FormControlLabel, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classes from "../../../Examples.module.scss";
import { appTheme } from "../../../theme";
import { NumericAxis, SciChartSurface, EMultiLineAlignment, ETextAlignment, ETitlePosition } from "scichart";
import { Thickness } from "../../../../../../../../SciChart.Dev/Web/src/SciChart/lib";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    sciChartSurface.title = "Multiline\nChart Title";
    sciChartSurface.titleStyle = {
        color: appTheme.ForegroundColor,
        fontSize: 70,
        padding: Thickness.fromString("2 0 4 0"),
        useNativeText: false,
        placeWithinChart: false,
        multilineAlignment: EMultiLineAlignment.Center,
        alignment: ETextAlignment.Center,
        position: ETitlePosition.Top,
    };

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function FeatureChartTitle() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    const [titlePosition, setTitlePosition] = React.useState(ETitlePosition.Top);
    const [titleAlignment, setTitleAlignment] = React.useState(ETextAlignment.Center);
    const [multilineAlignment, setMultilineAlignment] = React.useState(EMultiLineAlignment.Center);
    const [placeWithinChart, setPlaceWithinChart] = React.useState(false);
    const [useNativeText, setUseNativeText] = React.useState(false);

    const selectTitleTextPosition = (event: React.ChangeEvent<{ value: unknown }>) => {
        const { value } = event.target;
        setTitlePosition(value as ETitlePosition);
        sciChartSurfaceRef.current.titleStyle = { position: value as ETitlePosition };
    };

    const selectTitleTextMultilineAlignment = (event: React.ChangeEvent<{ value: unknown }>) => {
        const { value } = event.target;
        setMultilineAlignment(value as EMultiLineAlignment);
        sciChartSurfaceRef.current.titleStyle = { multilineAlignment: value as EMultiLineAlignment };
    };

    const selectTitleTextAlignment = (event: React.ChangeEvent<{ value: unknown }>) => {
        const { value } = event.target;
        setTitleAlignment(value as ETextAlignment);
        sciChartSurfaceRef.current.titleStyle = { alignment: value as ETextAlignment };
    };

    const handleChangePlaceWithinChart = (event: React.ChangeEvent<{ checked: boolean }>) => {
        const newValue = event.target.checked;
        setPlaceWithinChart(newValue);
        sciChartSurfaceRef.current.titleStyle = { placeWithinChart: newValue };
    };

    const handleChangeUseNativeText = (event: React.ChangeEvent<{ checked: boolean }>) => {
        const newValue = event.target.checked;
        setUseNativeText(newValue);
        sciChartSurfaceRef.current.titleStyle = { useNativeText: newValue };
    };

    React.useEffect(() => {
        const initChartPromise = drawExample().then(res => {
            sciChartSurfaceRef.current = res.sciChartSurface;
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            initChartPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = null;
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
            padding: "10",
            color: appTheme.ForegroundColor,
            fontSize: "13px",
            flex: "none"
        },
        checkbox: {
            margin: "10"
        },
        combobox: {
            color: appTheme.Background,
            backgroundColor: appTheme.ForegroundColor,
            margin: "10"
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
                        className={localClasses.checkbox}
                        control={
                            <Checkbox
                                checked={placeWithinChart}
                                onChange={handleChangePlaceWithinChart}
                                name="checkedB"
                            />
                        }
                        labelPlacement="start"
                        label="place Title within chart?"
                    />
                    <FormControlLabel
                        className={localClasses.checkbox}
                        control={
                            <Checkbox checked={useNativeText} onChange={handleChangeUseNativeText} name="checkedB" />
                        }
                        labelPlacement="start"
                        label="use Native Text?"
                    />

                    <label>
                        Title ALignment
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
                    </label>

                    <label>
                        Title Position
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
                    </label>

                    <label>
                        Multiline Text Alignment
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
                    </label>
                </div>

                <div style={{ flex: "auto" }}>
                    <div id={divElementId} style={{ width: "100%", height: "100%" }} />
                </div>
            </div>
        </div>
    );
}
