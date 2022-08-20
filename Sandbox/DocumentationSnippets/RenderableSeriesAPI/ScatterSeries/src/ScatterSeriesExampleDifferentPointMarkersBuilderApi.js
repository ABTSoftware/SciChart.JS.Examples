import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { createImageAsync } from "scichart/utils/imageUtil";
import customPointImage from "./img/CustomMarkerImage.png";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisType } from "scichart/types/AxisType";

export const drawScatterSeriesPointMarkersBuilderApi = async (divElementId) => {

    const data = createData();

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis },
        yAxes: { type: EAxisType.NumericAxis, options: { visibleRange: new NumberRange(0, 5) }},
        series: [
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues: data[0].xValues,
                    yValues: data[0].yValues
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 11,
                            height: 11,
                            strokeThickness: 2,
                            fill: "#0077FF99",
                            stroke: "LightSteelBlue"
                        }
                    }
                }
            },
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues: data[1].xValues,
                    yValues: data[1].yValues
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Square,
                        options: {
                            width: 11,
                            height: 11,
                            strokeThickness: 2,
                            fill: "#FF000099",
                            stroke: "Red"
                        }
                    }
                }
            },
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues: data[2].xValues,
                    yValues: data[2].yValues
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Triangle,
                        options: {
                            width: 11,
                            height: 11,
                            strokeThickness: 2,
                            fill: "#FFDD00",
                            stroke: "#FF6600"
                        }
                    }
                }
            },
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues: data[3].xValues,
                    yValues: data[3].yValues
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Cross,
                        options: {
                            width: 11,
                            height: 11,
                            strokeThickness: 2,
                            stroke: "#FF00FF"
                        }
                    }
                }
            },
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues: data[4].xValues,
                    yValues: data[4].yValues
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Sprite,
                        options: {
                            image: await createImageAsync(customPointImage)
                        }
                    }
                }
            }
        ]
    });
};

function createData() {
    // Create some dataseries
    const xValues = [], yValues1 = [];
    const yValues2 = [];
    const yValues3 = [];
    const yValues4 = [];
    const yValues5 = [];

    // Append values
    const dataSize = 30;
    for (let i = 0; i < dataSize; i++) {
        xValues.push(i);
        yValues1.push(Math.random() * 0.4 + 0.5);
        yValues2.push(Math.random() * 0.4 + 1.5);
        yValues3.push(Math.random() * 0.4 + 2.3);
        yValues4.push(Math.random() * 0.4 + 3.0);
        yValues5.push(Math.random() * 0.4 + 4.1);
    }

    return [
        { xValues, yValues: yValues1 },
        { xValues, yValues: yValues2 },
        { xValues, yValues: yValues3 },
        { xValues, yValues: yValues4 },
        { xValues, yValues: yValues5 }
    ];
}
