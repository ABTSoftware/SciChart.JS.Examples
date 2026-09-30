import * as React from "react";
import { SciChartReact } from "scichart-react";
import { centralLayoutJsonDefinition, defaultJsonDefinition, detailedJsonDefinition, drawExample } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartFromJSON() {
    const [errors, setErrors] = React.useState<string>();
    const [json, setJSON] = React.useState<string>(defaultJsonDefinition);
    const [currentChartConfig, setCurrentChartConfig] = React.useState<string>(defaultJsonDefinition);

    const Chart = React.useMemo(
        () =>
            React.memo((props: { chartConfig: string }) => {
                //console.log("Rebuild");
                return (
                    <SciChartReact
                        initChart={(rootElementId: string | HTMLDivElement) =>
                            drawExample(rootElementId, props.chartConfig, setErrors)
                        }
                        style={{ flexBasis: 400, flexGrow: 1, flexShrink: 1 }}
                    />
                );
            }),
        [currentChartConfig]
    );

    const handleChangeJSON = (event: React.ChangeEvent<{ value: string }>) => {
        const newValue = event.target.value;
        setJSON(newValue);
    };

    const handleBuild = (event: any) => {
        setErrors("");
        setCurrentChartConfig(json);
    };

    const loadMinimal = (event: any) => {
        setJSON(defaultJsonDefinition);
    };

    const loadFull = (event: any) => {
        setJSON(detailedJsonDefinition);
    };

    const loadCentral = (event: any) => {
        setJSON(centralLayoutJsonDefinition);
    };

    return (
        <div className="sc-chart-wrapper">
            <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
                <Chart chartConfig={currentChartConfig} />
                <div style={{ position: "absolute", left: 20, top: 20 }}>
                    {errors && (
                        <div key="0" className="sc-alert sc-alert-error" role="alert">
                            <strong className="sc-alert-title">Errors</strong>
                            {errors}
                        </div>
                    )}
                </div>
                <div>
                    <div className="sc-form-control">
                        <div className="sc-button-group" role="group" aria-label="small outlined button group">
                            <button
                                type="button"
                                className="sc-button sc-button-secondary"
                                id="eg1"
                                onClick={loadMinimal}
                            >
                                Simple example
                            </button>
                            <button type="button" className="sc-button sc-button-secondary" id="eg2" onClick={loadFull}>
                                Full example
                            </button>
                            <button
                                type="button"
                                className="sc-button sc-button-secondary"
                                id="eg3"
                                onClick={loadCentral}
                            >
                                Central Axes
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <textarea
                        className="sc-input sc-textarea"
                        id="chartDef"
                        rows={8}
                        value={json}
                        onChange={handleChangeJSON}
                    />
                </div>
                <div className="sc-form-control sc-align-right">
                    <div className="sc-button-group" role="group" aria-label="small outlined button group">
                        <button
                            type="button"
                            className="sc-button sc-button-primary"
                            id="buildChart"
                            onClick={handleBuild}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
