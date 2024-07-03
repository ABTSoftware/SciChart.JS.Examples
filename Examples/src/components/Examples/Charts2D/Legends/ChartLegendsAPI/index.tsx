import * as React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import classes from "../../../styles/Examples.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import { ELegendOrientation, ELegendPlacement, LegendModifier, SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

const placementSelect = [
    { value: ELegendPlacement.TopLeft, text: "Top-Left" },
    { value: ELegendPlacement.TopRight, text: "Top-Right" },
    { value: ELegendPlacement.BottomLeft, text: "Bottom-Left" },
    { value: ELegendPlacement.BottomRight, text: "Bottom-Right" },
];

const orientationSelect = [
    { value: ELegendOrientation.Vertical, text: "Vertical" },
    { value: ELegendOrientation.Horizontal, text: "Horizontal" },
];

export default function ChartLegendsAPI() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const legendModifierRef = React.useRef<LegendModifier>();

    const [placementValue, setPlacementValue] = React.useState<ELegendPlacement>(ELegendPlacement.TopLeft);
    const [orientationValue, setOrientationValue] = React.useState<ELegendOrientation>(ELegendOrientation.Vertical);
    const [showLegendValue, setShowLegendValue] = React.useState(true);
    const [showCheckboxesValue, setShowCheckboxesValue] = React.useState(true);
    const [showSeriesMarkersValue, setShowSeriesMarkersValue] = React.useState(true);

    const handleChangePlacement = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (legendModifierRef.current) {
            const newValue = +event.target.value as ELegendPlacement;
            setPlacementValue(newValue);
            legendModifierRef.current.sciChartLegend.placement = newValue;
        }
    };

    const handleChangeOrientation = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (legendModifierRef.current) {
            const newValue = +event.target.value as ELegendOrientation;
            setOrientationValue(newValue);
            legendModifierRef.current.sciChartLegend.orientation = newValue;
        }
    };

    const handleChangeShowLegend = (event: React.ChangeEvent<{ checked: boolean }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.checked;
            setShowLegendValue(newValue);
            legendModifierRef.current.sciChartLegend.showLegend = newValue;
        }
    };

    const handleChangeShowCheckboxes = (event: React.ChangeEvent<{ checked: boolean }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.checked;
            setShowCheckboxesValue(newValue);
            legendModifierRef.current.sciChartLegend.showCheckboxes = newValue;
        }
    };

    const handleChangeShowSeriesMarkers = (event: React.ChangeEvent<{ checked: boolean }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.checked;
            setShowSeriesMarkersValue(newValue);
            legendModifierRef.current.sciChartLegend.showSeriesMarkers = newValue;
        }
    };

    const useStyles = makeStyles((theme) => ({
        flexContainer: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
        },
        toolbar: {
            minHeight: "70px",
            padding: "10",
            color: appTheme.ForegroundColor,
            fontSize: "13px",
            flex: "none",
            // flexBasis: "70px"
        },
        combobox: {
            color: appTheme.Background,
            backgroundColor: appTheme.ForegroundColor,
            margin: "10",
        },
        chartElement: {
            width: "100%",
            flex: "auto",
        },
    }));
    const localClasses = useStyles();

    return (
        <React.Fragment>
            <div className={classes.FullHeightChartWrapper} style={{ background: appTheme.DarkIndigo }}>
                <div className={localClasses.flexContainer}>
                    {/*The toolbar is here*/}
                    <div className={localClasses.toolbar}>
                        Show Legend?
                        <Checkbox checked={showLegendValue} onChange={handleChangeShowLegend} />
                        Show Visibility Checkboxes?
                        <Checkbox checked={showCheckboxesValue} onChange={handleChangeShowCheckboxes} />
                        Show Series Markers?
                        <Checkbox checked={showSeriesMarkersValue} onChange={handleChangeShowSeriesMarkers} />
                        <label id="sciChartPlacement-label">
                            Legend Placement
                            <select
                                className={localClasses.combobox}
                                id="sciChartPlacement"
                                value={placementValue}
                                onChange={handleChangePlacement}
                            >
                                {placementSelect.map((el) => (
                                    <option key={el.value} value={el.value}>
                                        {el.text}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label id="sciChartPlacement-label">
                            Legend Orientation
                            <select
                                className={localClasses.combobox}
                                id="sciChartOrientation"
                                value={orientationValue}
                                onChange={handleChangeOrientation}
                            >
                                {orientationSelect.map((el) => (
                                    <option key={el.value} value={el.value}>
                                        {el.text}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div style={{ flex: "auto" }}>
                        <SciChartReact
                            initChart={drawExample}
                            style={{ width: "100%", height: "100%" }}
                            className={classes.ChartWrapper}
                            onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                                const { sciChartSurface, legendModifier } = initResult;
                                legendModifierRef.current = legendModifier;
                                sciChartSurfaceRef.current = sciChartSurface;
                            }}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
