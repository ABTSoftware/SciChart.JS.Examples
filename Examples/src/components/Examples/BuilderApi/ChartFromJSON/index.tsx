import { useState, ChangeEvent } from "react";
import { SciChartReact } from "scichart-react";
import { centralLayoutJsonDefinition, defaultJsonDefinition, detailedJsonDefinition, drawExample } from "./drawExample";

export default function ChartFromJSON() {
    const [errors, setErrors] = useState<string>();
    const [json, setJSON] = useState<string>(defaultJsonDefinition);
    const [currentChartConfig, setCurrentChartConfig] = useState<string>(defaultJsonDefinition);
    const [isCustom, setIsCustom] = useState<boolean>(false);

    const handleChangeJSON = (event: ChangeEvent<{ value: string }>) => {
        const newValue = event.target.value;
        setJSON(newValue);
        setIsCustom(true);
    };

    const handleBuild = () => {
        setErrors("");
        setCurrentChartConfig(json);
    };

    function setJSONAndBuild(newJson: string) {
        setJSON(newJson);
        setCurrentChartConfig(newJson);
        setIsCustom(false);
    }

    return (
        <div className="sc-chart-wrapper flex flex-col w-full h-full">
            <SciChartReact
                key={currentChartConfig}
                initChart={(rootElement) => drawExample(rootElement, currentChartConfig, setErrors)}
                style={{ flexBasis: 400, flexGrow: 1 }}
            />

            <div className="absolute left-4 top-4">
                {errors && (
                    <div
                        key="0"
                        className="text-error p-2"
                        style={{
                            border: "1px solid var(--sc-error)",
                            borderRadius: "var(--radius)",
                            background: "var(--sc-background)",
                        }}
                        role="alert"
                    >
                        <strong style={{ display: "block", marginBottom: 4 }}>Errors</strong>
                        {errors}
                    </div>
                )}
            </div>

            <div className="flex justify-between p-2">
                <div className="sc-button-group" role="group" aria-label="Chart definition presets">
                    <button
                        type="button"
                        className="sc-button sc-button-outline"
                        id="eg1"
                        onClick={() => setJSONAndBuild(defaultJsonDefinition)}
                        aria-checked={currentChartConfig === defaultJsonDefinition && !isCustom}
                    >
                        Simple example
                    </button>
                    <button
                        type="button"
                        className="sc-button sc-button-outline"
                        id="eg2"
                        onClick={() => setJSONAndBuild(detailedJsonDefinition)}
                        aria-checked={currentChartConfig === detailedJsonDefinition && !isCustom}
                    >
                        Full example
                    </button>
                    <button
                        type="button"
                        className="sc-button sc-button-outline"
                        id="eg3"
                        onClick={() => setJSONAndBuild(centralLayoutJsonDefinition)}
                        aria-checked={currentChartConfig === centralLayoutJsonDefinition && !isCustom}
                    >
                        Central Axes
                    </button>
                </div>

                <button 
                    className="sc-button" 
                    type="button" 
                    onClick={handleBuild}
                    disabled={!isCustom}
                >
                    Apply
                </button>
            </div>

            <textarea
                className="sc-input"
                aria-label="Chart JSON definition"
                rows={8}
                value={json}
                onChange={handleChangeJSON}
            />
        </div>
    );
}
