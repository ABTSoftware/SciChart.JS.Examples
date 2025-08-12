import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { ELegendOrientation, ELegendPlacement, LegendModifier, SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

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
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);
    const legendModifierRef = React.useRef<LegendModifier>(undefined);

    const [placementValue, setPlacementValue] = React.useState<ELegendPlacement>(ELegendPlacement.TopLeft);
    const [orientationValue, setOrientationValue] = React.useState<ELegendOrientation>(ELegendOrientation.Vertical);
    const [showLegendValue, setShowLegendValue] = React.useState(true);
    const [showCheckboxesValue, setShowCheckboxesValue] = React.useState(true);
    const [showSeriesMarkersValue, setShowSeriesMarkersValue] = React.useState(true);

    const handleChangePlacement = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.value as ELegendPlacement;
            setPlacementValue(newValue);
            legendModifierRef.current.sciChartLegend.placement = newValue;
        }
    };

    const handleChangeOrientation = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.value as ELegendOrientation;
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

    const styles: Record<string, React.CSSProperties> = {
        toolbar: {
            padding: "10px",
            fontSize: "13px",
            flex: "none",
            flexWrap: "wrap",
        },
        combobox: {
            color: appTheme.Background,
            backgroundColor: appTheme.ForegroundColor,
            margin: "10px",
        },
    };

    return (
        <div className={commonClasses.ChartWithToolbar}>
            <div className={commonClasses.ToolbarRow} style={styles.toolbar}>
                <FormControlLabel
                    control={<Switch checked={showLegendValue} onChange={handleChangeShowLegend} />}
                    label=" Show Legend?"
                />
                <FormControlLabel
                    control={<Switch checked={showCheckboxesValue} onChange={handleChangeShowCheckboxes} />}
                    label=" Show Visibility Checkboxes?"
                />
                <FormControlLabel
                    control={<Switch checked={showSeriesMarkersValue} onChange={handleChangeShowSeriesMarkers} />}
                    label="Show Series Markers?"
                />
                <label id="sciChartPlacement-label">
                    Legend Placement
                    <select
                        style={styles.combobox}
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
                        style={styles.combobox}
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
            <SciChartReact
                initChart={drawExample}
                className={commonClasses.ChartWrapper}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { sciChartSurface, legendModifier } = initResult;
                    legendModifierRef.current = legendModifier;
                    sciChartSurfaceRef.current = sciChartSurface;
                }}
            />
        </div>
    );
}
