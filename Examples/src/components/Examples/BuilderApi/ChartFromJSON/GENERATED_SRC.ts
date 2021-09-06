export const code = `import * as React from "react";
import { SciChartSurface, TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import classes from "../../../Examples/Examples.module.scss";
import { ButtonGroup, Button, TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { EBaseType } from "scichart/types/BaseType";
import { IThemeProvider } from "scichart/Charting/Themes/IThemeProvider";
import { ISciChartLoader } from "scichart/Charting/Visuals/loader";

const divElementId = "chart";

const drawExample = async (json: string, setErrors: (error: any)=> void): Promise<TWebAssemblyChart> => {
    try {
        const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, json);

        return { sciChartSurface, wasmContext };
    } catch(error) {
        const msg = error.message;
        setErrors(msg);
        return { sciChartSurface: undefined, wasmContext: undefined };
    };
};

const defaultJSON = \`{
    "series": { "type": "Line Series", "xyData": { "xValues": [1,3,4,7,9], "yValues": [10,6,7,2,16] } },
    "yAxes": { "type": "NumericAxis", "options": { "visibleRange": {"min": 0, "max": 20} } }
}\`;

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartFromJSON() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [errors, setErrors] = React.useState<string>();
    const [json, setJSON] = React.useState<string>(defaultJSON);
    const [buildRequested, setBuildRequested] = React.useState<boolean>(true);

    React.useEffect(() => {
        (async () => {
            if (buildRequested) {
                const res = await drawExample(json, setErrors);
                setSciChartSurface(res.sciChartSurface);
            }
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => sciChartSurface?.delete();
    }, [buildRequested]);

    const handleChangeJSON = (event: React.ChangeEvent<{ value: string }>) => {
        const newValue = event.target.value;
        setJSON(newValue);
        setBuildRequested(false);
    };

    const handleBuild = (event: any) => {
        if (!buildRequested) {
            setErrors("");
            setBuildRequested(true);
        }
    };

    const loadMinimal = (event: any) => {
        setJSON(\`{
            "series": { "type": "Line Series", "xyData": { "xValues": [1,3,4,7,9], "yValues": [10,6,7,2,16] } },
        }\`);
        setBuildRequested(false);
    };

    const loadFull = (event: any) => {
        setJSON(\`{
            "series": { "type": "Line Series", "xyData": { "xValues": [1,3,4,7,9], "yValues": [10,6,7,2,16] } },
        }\`);
        setBuildRequested(false);
    };

    const loadCentral = (event: any) => {
        const spiralX = [];
        const spiralY = [];
        for (let i = 0; i < 20; i += 0.2) {
            spiralX.push(Math.sin(i) + Math.cos(i / 20));
            spiralY.push(Math.cos(i) - Math.sin(i / 20));
        }
        setJSON(\`{
            "surface": { "layoutManager": { "type": "CentralAxes" } },
            "series": {
                "type": "Scatter Series",
                "options": { "pointMarker": { "type": "Ellipse", "options": { "fill": "white" } } },
                "xyData": { "dataIsSortedInX": false, "xValues": [\${spiralX}], "yValues": [\${spiralY}] }
            },
            "yAxes": {
                "type": "NumericAxis",
                "options": { "labelPrecision": 1, "axisBorder": { "borderRight": 1, "color": "white" } }
            },
            "xAxes": {
                "type": "NumericAxis",
                "options": { "labelPrecision": 1, "axisBorder": { "borderTop": 1, "color": "white" } }
            },
            "modifiers": [
                { "type": "MouseWheelZoom" },
                { "type": "ZoomExtents" },
                { "type": "Cursor" },
                { "type": "ZoomPan" }
            ]
        }\`);
        setBuildRequested(false);
    };

    return (
        <>
            <div className={classes.ChartWrapper}>
                <div id={divElementId} />
            </div>
            <div>
                <div className={classes.FormControl}>
                    <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                        <Button id="buildChart" onClick={handleBuild}>Build</Button>
                        <Button id="eg1" onClick={loadMinimal}>Minimal example</Button>
                        <Button id="eg2" onClick={loadCentral}>Central Axes</Button>
                    </ButtonGroup>
                </div>
            </div>
            <div>
                {errors && (
                    <Alert key="0" severity="error">
                        <AlertTitle>Errors</AlertTitle>
                        {errors}
                    </Alert>
                )}
            </div>
            <div>
                <TextField
                    id="chartDef"
                    type="text"
                    fullWidth={true}
                    multiline={true}
                    rows="10"
                    variant="outlined"
                    value={json}
                    onChange={handleChangeJSON}
                />
            </div>
        </>
    );
}
`;