import { useRef, useState, ChangeEvent } from "react";
import { EMultiLineAlignment, ETextAlignment, ETitlePosition } from "scichart";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

export { drawExample };

export default function FeatureChartTitle() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const [titleText, setTitleText] = useState("Multiline\nChart Title");
    const [titlePosition, setTitlePosition] = useState(ETitlePosition.Top);
    const [titleAlignment, setTitleAlignment] = useState(ETextAlignment.Center);
    const [multilineAlignment, setMultilineAlignment] = useState(EMultiLineAlignment.Center);
    const [placeWithinChart, setPlaceWithinChart] = useState(false);
    const [fontSize, setFontSize] = useState(70);
    const [titleColor, setTitleColor] = useState(appTheme.ForegroundColor.slice(0, 7));

    const handleChangeTitleText = (event: ChangeEvent<{ value: string }>) => {
        if (controlsRef.current) {
            const newValue = event.target.value;
            setTitleText(newValue);
            controlsRef.current.updateTitleText(newValue);
        }
    };

    const selectTitleTextPosition = (event: ChangeEvent<{ value: unknown }>) => {
        if (controlsRef.current) {
            const { value } = event.target;
            setTitlePosition(value as ETitlePosition);
            controlsRef.current.updateTitlePosition(value as ETitlePosition);
        }
    };

    const selectTitleTextMultilineAlignment = (event: ChangeEvent<{ value: unknown }>) => {
        if (controlsRef.current) {
            const { value } = event.target;
            setMultilineAlignment(value as EMultiLineAlignment);
            controlsRef.current.updateTitleMultilineAlignment(value as EMultiLineAlignment);
        }
    };

    const selectTitleTextAlignment = (event: ChangeEvent<{ value: unknown }>) => {
        if (controlsRef.current) {
            const { value } = event.target;
            setTitleAlignment(value as ETextAlignment);
            controlsRef.current.updateTitleAlignment(value as ETextAlignment);
        }
    };

    const handleChangePlaceWithinChart = (event: ChangeEvent<{ checked: boolean }>) => {
        if (controlsRef.current) {
            const newValue = event.target.checked;
            setPlaceWithinChart(newValue);
            controlsRef.current.updateTitlePlaceWithinChart(newValue);
        }
    };

    return (
        <div className="sc-chart-wrapper sc-responsive-chart-wrapper">
            <SciChartReact
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                }}
            />

            <aside className="sc-responsive-controls" aria-label="Title settings">
                <h2>Title settings:</h2>
                <label className="sc-control flex-col items-start">
                    Title text
                    <textarea
                        value={titleText}
                        onChange={handleChangeTitleText}
                        className="sc-input w-full"
                        rows={3}
                        style={{ minHeight: 88 }}
                    />
                </label>

                <label className="sc-switch justify-between">
                    Place inside chart
                    <input type="checkbox" checked={placeWithinChart} onChange={handleChangePlaceWithinChart} />
                </label>

                <hr />

                <label className="sc-control justify-between">
                    <span className="flex-none">Position</span>
                    <select
                        className="sc-select"
                        style={{ width: 104 }}
                        value={titlePosition}
                        onChange={selectTitleTextPosition}
                    >
                        {Object.values(ETitlePosition).map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="sc-control justify-between">
                    <span className="flex-none">Alignment</span>
                    <select
                        className="sc-select"
                        style={{ width: 104 }}
                        value={titleAlignment}
                        onChange={selectTitleTextAlignment}
                    >
                        {Object.values(ETextAlignment).map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="sc-control justify-between">
                    <span className="flex-none">Multiline alignment</span>
                    <select
                        className="sc-select"
                        style={{ width: 104 }}
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
                <hr />

                <label className="sc-control">
                    <span className="flex-none">Font size</span>
                    <input
                        className="sc-range flex-1 min-w-0"
                        aria-label="Font size"
                        type="range"
                        min={12}
                        max={100}
                        step={1}
                        value={fontSize}
                        onChange={(event) => {
                            const value = event.target.valueAsNumber;
                            setFontSize(value);
                            controlsRef.current?.updateTitleFontSize(value);
                        }}
                    />
                    <span className="flex-none" style={{ width: 36 }}>
                        {fontSize}px
                    </span>
                </label>

                <label className="sc-control justify-between">
                    Color
                    <input
                        className="sc-input"
                        type="color"
                        value={titleColor}
                        onChange={(event) => {
                            const value = event.target.value;
                            setTitleColor(value);
                            controlsRef.current?.updateTitleColor(value);
                        }}
                    />
                </label>
            </aside>
        </div>
    );
}
