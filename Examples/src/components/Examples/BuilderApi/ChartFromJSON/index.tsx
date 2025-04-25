import * as React from "react";
import commonClasses from "../../styles/Examples.module.scss";
import { ButtonGroup, Button, TextField } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
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
        <div className={commonClasses.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%", width: '100%' }}>
                <Chart chartConfig={currentChartConfig} />
                <div style={{ position: "absolute", left: 20, top: 20 }}>
                    {errors && (
                        <Alert key="0" severity="error">
                            <AlertTitle>Errors</AlertTitle>
                            {errors}
                        </Alert>
                    )}
                </div>
                <div>
                    <div className={commonClasses.FormControl}>
                        <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                            <Button id="eg1" onClick={loadMinimal}>
                                Simple example
                            </Button>
                            <Button id="eg2" onClick={loadFull}>
                                Full example
                            </Button>
                            <Button id="eg3" onClick={loadCentral}>
                                Central Axes
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div>
                    <TextField
                        id="chartDef"
                        type="text"
                        fullWidth={true}
                        multiline={true}
                        minRows="8"
                        maxRows="8"
                        variant="outlined"
                        value={json}
                        onChange={handleChangeJSON}
                        sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--text)",
                            }, 
                            "& .MuiInputBase-input": {
                                color: "var(--text)",
                            }
                        }}
                    />
                </div>
                <div
                    className={[commonClasses.FormControl, commonClasses.AlignRight].join(" ")}
                >
                    <ButtonGroup size="small" color="primary" aria-label="small outlined button group">
                        <Button className={commonClasses.ButtonFilled} id="buildChart" onClick={handleBuild}>
                            Apply
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}
