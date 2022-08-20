import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";

export const drawScatterSeriesBuilderApi = async (divElementId) => {

    const xValues = [];
    const yValues = [];
    for( let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(i % 5 === 0 ? NaN : 0.2 * Math.sin(i*0.1) - Math.cos(i * 0.01));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            {
                type: ESeriesType.ScatterSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    pointMarker: {
                        type: EPointMarkerType.Ellipse,
                        options: {
                            width: 7,
                            height: 7,
                            strokeThickness: 1,
                            fill: "steelblue",
                            stroke: "LightSteelBlue",
                        }
                    },
                }
            }
        ]
    });
};
