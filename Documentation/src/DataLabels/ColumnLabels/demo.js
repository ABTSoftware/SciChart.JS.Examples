import * as SciChart from "scichart";

const { chartBuilder, ESeriesType, EAxisType, EAxisAlignment, NumberRange, EColumnDataLabelPosition } = SciChart;

async function dataLabelColumns(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        xAxes: [
            {
                type: EAxisType.NumericAxis,
                options: { growBy: new NumberRange(0.1, 0.1), axisAlignment: EAxisAlignment.Left }
            }
        ],
        yAxes: [
            {
                type: EAxisType.NumericAxis,
                options: {
                    growBy: new NumberRange(0.1, 0.1),
                    axisAlignment: EAxisAlignment.Bottom,
                    flippedCoordinates: false
                }
            }
        ],
        series: {
            type: ESeriesType.ColumnSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [-3, -4, 0, 6, 6.3, 6.3, 7, 7.2, 7.8, 8, 8, 8]
            },
            options: {
                stroke: "SteelBlue",
                fill: "LightSteelBlue",
                strokeThickness: 1,
                dataLabels: {
                    positionMode: EColumnDataLabelPosition.Outside,
                    style: {
                        fontFamily: "Default",
                        fontSize: 18
                        //padding: new Thickness(0, 0, 0 ,0)
                    },
                    color: "#EEE"
                }
            }
        }
    });
}
dataLabelColumns("scichart-root");
