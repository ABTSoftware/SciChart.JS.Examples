import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";

export const drawDigitalLineSeriesPointMarkersBuilderApi = async (divElementId) => {

    const xValues = [];
    const yValues = [];
    for(let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 5,
                    isDigitalLine: true,
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            fill: "White",
                            stroke: "#ff6600",
                            strokeThickness: 1,
                        }
                    }
                },
            }
        ]
    });
};
