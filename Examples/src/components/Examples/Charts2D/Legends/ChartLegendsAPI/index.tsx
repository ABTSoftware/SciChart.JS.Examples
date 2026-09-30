import * as React from "react";
import { ELegendOrientation, ELegendPlacement, LegendModifier, SciChartSurface } from "scichart";
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

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <label className="sc-switch">
                    <input type="checkbox" checked={showLegendValue} onChange={handleChangeShowLegend} />
                    Show Legend?
                </label>
                <label className="sc-switch">
                    <input type="checkbox" checked={showCheckboxesValue} onChange={handleChangeShowCheckboxes} />
                    Show Visibility Checkboxes?
                </label>
                <label className="sc-switch">
                    <input type="checkbox" checked={showSeriesMarkersValue} onChange={handleChangeShowSeriesMarkers} />
                    Show Series Markers?
                </label>
                <label className="sc-control" htmlFor="sciChartPlacement">
                    Legend Placement
                    <select
                        id="sciChartPlacement"
                        value={placementValue}
                        onChange={handleChangePlacement}
                        className="sc-select"
                    >
                        {placementSelect.map((el) => (
                            <option key={el.value} value={el.value}>
                                {el.text}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="sc-control" htmlFor="sciChartOrientation">
                    Legend Orientation
                    <select
                        id="sciChartOrientation"
                        value={orientationValue}
                        onChange={handleChangeOrientation}
                        className="sc-select"
                    >
                        {orientationSelect.map((el) => (
                            <option key={el.value} value={el.value}>
                                {el.text}
                            </option>
                        ))}
                    </select>
                </label>
            </header>
            <SciChartReact
                initChart={drawExample}
                className="sc-chart-wrapper"
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    const { sciChartSurface, legendModifier } = initResult;
                    legendModifierRef.current = legendModifier;
                    sciChartSurfaceRef.current = sciChartSurface;
                }}
            />
        </div>
    );
}
