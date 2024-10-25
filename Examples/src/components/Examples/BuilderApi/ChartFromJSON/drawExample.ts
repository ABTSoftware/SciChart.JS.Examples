import { SciChartSurface, chartBuilder, TWebAssemblyChart } from "scichart";

export const drawExample = async (
    divElementId: string | HTMLDivElement,
    json: string,
    setErrors: (error: any) => void
) => {
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

export const defaultJsonDefinition = `{
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

export const detailedJsonDefinition = `{
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
        }`;

const spiralX = [];
const spiralY = [];
for (let i = 0; i < 20; i += 0.2) {
    spiralX.push(Math.sin(i) + Math.cos(i / 20));
    spiralY.push(Math.cos(i) - Math.sin(i / 20));
}
export const centralLayoutJsonDefinition = `{
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
        }`;
