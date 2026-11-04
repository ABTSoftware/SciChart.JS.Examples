import { useRef, useState, ChangeEvent } from "react";
import { ELegendOrientation, ELegendPlacement, LegendModifier } from "scichart";
import { drawExample } from "./drawExample";
import { appTheme } from "../../../theme";
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
    const legendModifierRef = useRef<LegendModifier>(undefined);

    const [placementValue, setPlacementValue] = useState<ELegendPlacement>(ELegendPlacement.TopLeft);
    const [orientationValue, setOrientationValue] = useState<ELegendOrientation>(ELegendOrientation.Vertical);
    const [showLegendValue, setShowLegendValue] = useState(true);
    const [showCheckboxesValue, setShowCheckboxesValue] = useState(true);
    const [showSeriesMarkersValue, setShowSeriesMarkersValue] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState(appTheme.SciChartJsTheme.legendBackgroundBrush.slice(0, 7));
    const [textColor, setTextColor] = useState(appTheme.SciChartJsTheme.labelForegroundBrush.slice(0, 7));
    const [margin, setMargin] = useState(10);

    const handleChangePlacement = (event: ChangeEvent<{ value: unknown }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.value as ELegendPlacement;
            setPlacementValue(newValue);
            legendModifierRef.current.sciChartLegend.placement = newValue;
        }
    };

    const handleChangeOrientation = (event: ChangeEvent<{ value: unknown }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.value as ELegendOrientation;
            setOrientationValue(newValue);
            legendModifierRef.current.sciChartLegend.orientation = newValue;
        }
    };

    const handleChangeShowLegend = (event: ChangeEvent<{ checked: boolean }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.checked;
            setShowLegendValue(newValue);
            legendModifierRef.current.sciChartLegend.showLegend = newValue;
        }
    };

    const handleChangeShowCheckboxes = (event: ChangeEvent<{ checked: boolean }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.checked;
            setShowCheckboxesValue(newValue);
            legendModifierRef.current.sciChartLegend.showCheckboxes = newValue;
        }
    };

    const handleChangeShowSeriesMarkers = (event: ChangeEvent<{ checked: boolean }>) => {
        if (legendModifierRef.current) {
            const newValue = event.target.checked;
            setShowSeriesMarkersValue(newValue);
            legendModifierRef.current.sciChartLegend.showSeriesMarkers = newValue;
        }
    };

    return (
        <div className="sc-chart-wrapper sc-responsive-chart-wrapper">
            <SciChartReact
                initChart={drawExample}
                onInit={({ legendModifier }: TResolvedReturnType<typeof drawExample>) => {
                    legendModifierRef.current = legendModifier;
                    const legend = legendModifier.sciChartLegend;
                    setBackgroundColor(
                        (legend.backgroundColor ?? appTheme.SciChartJsTheme.legendBackgroundBrush).slice(0, 7)
                    );
                    setTextColor((legend.textColor ?? appTheme.SciChartJsTheme.labelForegroundBrush).slice(0, 7));
                    setMargin(legend.margin);
                }}
            />

            <aside className="sc-responsive-controls" aria-label="Legend settings">
                <h2>Legend settings</h2>

                <label className="sc-switch">
                    <input type="checkbox" checked={showLegendValue} onChange={handleChangeShowLegend} />
                    Show legend
                </label>
                <label className="sc-switch">
                    <input type="checkbox" checked={showCheckboxesValue} onChange={handleChangeShowCheckboxes} />
                    Visibility checkboxes
                </label>
                <label className="sc-switch">
                    <input type="checkbox" checked={showSeriesMarkersValue} onChange={handleChangeShowSeriesMarkers} />
                    Series markers
                </label>

                <hr />

                <label className="sc-control justify-between" htmlFor="sciChartPlacement">
                    <span className="flex-none">Placement</span>
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

                <label className="sc-control justify-between" htmlFor="sciChartOrientation">
                    <span className="flex-none">Orientation</span>
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

                <hr />

                <label className="sc-control justify-between">
                    Background color
                    <input
                        type="color"
                        className="sc-input"
                        value={backgroundColor}
                        onChange={(event) => {
                            const legend = legendModifierRef.current?.sciChartLegend;
                            if (legend) {
                                setBackgroundColor(event.target.value);
                                legend.backgroundColor = event.target.value;
                            }
                        }}
                    />
                </label>
                <label className="sc-control justify-between">
                    Text color
                    <input
                        type="color"
                        className="sc-input"
                        value={textColor}
                        onChange={(event) => {
                            const legend = legendModifierRef.current?.sciChartLegend;
                            if (legend) {
                                setTextColor(event.target.value);
                                legend.textColor = event.target.value;
                            }
                        }}
                    />
                </label>
                <label className="sc-control">
                    <span className="flex-none">Margin: {margin}px</span>
                    <input
                        type="range"
                        className="sc-range flex-1"
                        min={0}
                        max={50}
                        step={1}
                        value={margin}
                        onChange={(event) => {
                            const legend = legendModifierRef.current?.sciChartLegend;
                            if (legend) {
                                const value = event.target.valueAsNumber;
                                setMargin(value);
                                legend.margin = value;
                            }
                        }}
                    />
                </label>
            </aside>
        </div>
    );
}
