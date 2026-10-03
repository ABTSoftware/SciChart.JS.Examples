import "./styles.css";
import * as React from "react";
import { SciChartReact } from "scichart-react";
import { centralLayoutJsonDefinition, defaultJsonDefinition, detailedJsonDefinition, drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartFromJSON() {
    const [errors, setErrors] = React.useState<string>();
    const [json, setJSON] = React.useState<string>(defaultJsonDefinition);
    const [currentChartConfig, setCurrentChartConfig] = React.useState<string>(defaultJsonDefinition);
    const [isCustom, setIsCustom] = React.useState<boolean>(false);

    const Chart = React.useMemo(() =>
        React.memo((props: { chartConfig: string }) => {
            return (
                <SciChartReact
                    initChart={(rootElementId: string | HTMLDivElement) =>
                        drawExample(rootElementId, props.chartConfig, setErrors)
                    }
                    style={{ flexBasis: 400, flexGrow: 1 }}
                />
            );
        }), [currentChartConfig]
    );

    const handleChangeJSON = (event: React.ChangeEvent<{ value: string }>) => {
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
            <Chart chartConfig={currentChartConfig} />

            <div style={{ position: "absolute", left: 20, top: 20 }}>
                {errors && (
                    <div key="0" className="sc-alert" role="alert">
                        <strong className="sc-alert-title">Errors</strong>
                        {errors}
                    </div>
                )}
            </div>
            
            <div className="flex justify-between p-2">
                <div className="sc-button-group" 
                    role="group" 
                    aria-label="Chart definition presets"
                >
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
                    type="button" 
                    className="sc-button" 
                    id="buildChart" 
                    onClick={handleBuild}
                    disabled={!isCustom}
                >
                    Apply
                </button>
            </div>

            <textarea
                className="sc-input"
                aria-label="Chart JSON definition"
                id="chartDef"
                rows={8}
                value={json}
                onChange={handleChangeJSON}
            />
        </div>
    );
}
