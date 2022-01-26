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
        const msg = (error as any).message;
        setErrors(msg);
        return { sciChartSurface: undefined, wasmContext: undefined };
    };
};

const defaultJSON = \`{
    "series": { "type": "SplineLineSeries", 
        "options": { "stroke": "red" }, 
        "xyData": { "xValues": [1,3,4,7,9], "yValues": [10,6,7,2,16] } 
    },
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
        setJSON(defaultJSON);
        setBuildRequested(false);
    };

    const loadFull = (event: any) => {
        setJSON(\`{
            "surface": {
                "theme": {
                    "type": "Light",
                    "axisTitleColor": "#1d4e8f"
                }
            },
            "xAxes": [{
                    "type": "CategoryAxis",
                    "options": {
                        "axisTitle": "X Axis Title",
                        "labelProvider": {
                            "type": "Text",
                            "options": {
                                "labels": { "1": "one", "2": "two", "3": "three", "4": "four", "5": "five" }
                            }
                        }
                    }
                }
            ],
            "yAxes": [{
                    "type": "NumericAxis",
                    "options": {
                        "axisAlignment": "Left",
                        "axisTitle": "Left Axis",
                        "id": "y1",
                        "visibleRange": { "min": 0, "max": 20 },
                        "zoomExtentsToInitialRange": true
                    }
                }, {
                    "type": "NumericAxis",
                    "options": {
                        "axisAlignment": "Right",
                        "axisTitle": "Right Axis",
                        "id": "y2",
                        "visibleRange": { "min": 0, "max": 800 },
                        "zoomExtentsToInitialRange": true
                    }
                }
            ],
            "series": [{
                    "type": "SplineMountainSeries",
                    "options": {
                        "yAxisId": "y1",
                        "stroke": "#1d4e8f",
                        "fillLinearGradient": {
                            "gradientStops": [{
                                    "color": "rgba(161, 233, 255, 1)",
                                    "offset": 0.5
                                }, {
                                    "color": "rgba(0, 55, 117, 0.3)",
                                    "offset": 1
                                }
                            ],
                            "startPoint": { "x": 0, "y": 0 },
                            "endPoint": {"x": 0, "y": 1 }
                        }
                    },
                    "xyData": {
                        "xValues": [1, 2, 3, 4, 5],
                        "yValues": [8, 6, 7, 2, 16]
                    }
                }, {
                    "type": "BubbleSeries",
                    "options": {
                        "pointMarker": {
                            "type": "Ellipse",
                            "options": {
                                "fill": "#FFA24399",
                                "strokeThickness": 0,
                                "height": 100,
                                "width": 100
                            }
                        },
                        "yAxisId": "y2"
                    },
                    "xyzData": {
                        "xValues": [1, 2, 3, 4, 5],
                        "yValues": [180, 350, 490, 720, 530],
                        "zValues": [20, 40, 20, 30, 35]
                    }
                }
            ],
            "modifiers": [
                { "type": "Rollover", "options": { "yAxisId": "y1" } },
                { "type": "MouseWheelZoom" },
                { "type": "ZoomExtents" }
            ],
            "annotations": [{
                    "type": "SVGTextAnnotation",
                    "options": {
                        "y1": 10,
                        "text": "Annotation"
                    }
                }
            ]
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
                "type": "ScatterSeries",
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
                        <Button id="eg1" onClick={loadMinimal}>Simple example</Button>
                        <Button id="eg2" onClick={loadFull}>Full example</Button>
                        <Button id="eg3" onClick={loadCentral}>Central Axes</Button>
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
            <div className={[classes.FormControl, classes.AlignRight].join(' ')}>
                <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                    <Button className={classes.ButtonFilled} id="buildChart" onClick={handleBuild}>Apply</Button>
                </ButtonGroup>
            </div>
        </>
    );
}
`;