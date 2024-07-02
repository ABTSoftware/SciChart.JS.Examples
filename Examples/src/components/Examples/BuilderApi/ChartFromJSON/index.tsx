import * as React from "react";
import { SciChartSurface, chartBuilder, TWebAssemblyChart } from "scichart";
import classes from "../../styles/Examples.module.scss";
import { ButtonGroup, Button, TextField } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { SciChartReact } from "scichart-react";

const drawExample = async (
    divElementId: string | HTMLDivElement,
    json: string,
    setErrors: (error: any) => void
): Promise<TWebAssemblyChart> => {
    try {
        // Build the SciChartSurface from Json passed in
        const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, json);

        return { sciChartSurface, wasmContext };
    } catch (error) {
        const msg = (error as any).message;
        setErrors(msg);
        return { sciChartSurface: undefined, wasmContext: undefined };
    }
};

const defaultJSON = `{
    "surface": { "theme": { "type": "Navy" }},
    "series": { "type": "SplineLineSeries",
        "options": { "stroke": "red" },
        "xyData": { "xValues": [1,3,4,7,9], "yValues": [10,6,7,2,16] }
    },
    "yAxes": { "type": "NumericAxis", "options": { "visibleRange": {"min": 0, "max": 20} } },
    "annotations": [{
        "type": "SVGTextAnnotation", "options": { "text": "Builder API Demo", "x1": 0.5, "y1": 0.5, "opacity": 0.33,
              "yCoordShift": -26, "xCoordinateMode": "Relative", "yCoordinateMode": "Relative",
              "horizontalAnchorPoint": "Center", "verticalAnchorPoint": "Center",
              "fontSize": 42, "fontWeight": "Bold"
            }
        },
        {
            "type": "SVGTextAnnotation", "options": { "text": "Create SciChart charts from JSON", "x1": 0.5, "y1": 0.5, "opacity": 0.33,
                "yCoordShift": 26, "xCoordinateMode": "Relative", "yCoordinateMode": "Relative",
                "horizontalAnchorPoint": "Center", "verticalAnchorPoint": "Center",
                "fontSize": 36, "fontWeight": "Bold"
            }
        }]
}`;

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartFromJSON() {
    const [errors, setErrors] = React.useState<string>();
    const [json, setJSON] = React.useState<string>(defaultJSON);
    const [currentChartConfig, setCurrentChartConfig] = React.useState<string>(defaultJSON);

    const Chart = React.useMemo(
        () =>
            React.memo((props: { chartConfig: string }) => {
                console.log("Rebuild");
                return (
                    <SciChartReact
                        initChart={(divId: string | HTMLDivElement) => drawExample(divId, props.chartConfig, setErrors)}
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
        setJSON(defaultJSON);
    };

    const loadFull = (event: any) => {
        setJSON(`{
            "surface": {
                "theme": {
                    "type": "Navy",
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
        }`);
    };

    const loadCentral = (event: any) => {
        const spiralX = [];
        const spiralY = [];
        for (let i = 0; i < 20; i += 0.2) {
            spiralX.push(Math.sin(i) + Math.cos(i / 20));
            spiralY.push(Math.cos(i) - Math.sin(i / 20));
        }
        setJSON(`{
            "surface": { "layoutManager": { "type": "CentralAxes" }, "theme": { "type": "Navy" }},
            "series": {
                "type": "ScatterSeries",
                "options": { "pointMarker": { "type": "Ellipse", "options": { "fill": "white" } } },
                "xyData": { "dataIsSortedInX": false, "xValues": [${spiralX}], "yValues": [${spiralY}] }
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
        }`);
    };

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Chart chartConfig={currentChartConfig} />
                <div style={{ position: "absolute", left: 20, top: 20 }}>
                    {errors && (
                        <Alert key="0" severity="error">
                            <AlertTitle>Errors</AlertTitle>
                            {errors}
                        </Alert>
                    )}
                </div>
                <div style={{ flexBasis: "50px" }}>
                    <div className={classes.FormControl}>
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
                <div style={{ flexBasis: "200px" }}>
                    <TextField
                        id="chartDef"
                        type="text"
                        fullWidth={true}
                        multiline={true}
                        minRows="10"
                        maxRows="10"
                        variant="outlined"
                        value={json}
                        onChange={handleChangeJSON}
                    />
                </div>
                <div className={[classes.FormControl, classes.AlignRight].join(" ")} style={{ flexBasis: "50px" }}>
                    <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                        <Button className={classes.ButtonFilled} id="buildChart" onClick={handleBuild}>
                            Apply
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}
