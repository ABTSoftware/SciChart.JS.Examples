import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisType } from "scichart/types/AxisType";

export const drawTextSeriesBuilderApi = async (divElementId) => {
    const xValues = [];
    const yValues = [];
    const textValues = [];
    const textSource = ["G", "A", "T", "C"];
    for (let i = 0; i < 40; i++) {
        xValues.push(i);
        yValues.push(0);
        textValues.push(textSource[Math.floor(Math.random() * 4)]);
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1)}},
        yAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1)}},
        series: [
            {
                type: ESeriesType.TextSeries,
                xyTextData: {
                    xValues,
                    yValues,
                    textValues
                },
                options: {
                    dataLabels: {
                        style: {
                            fontFamily: "Arial",
                            fontSize: 18,
                            color: "White"
                        }
                    }
                }
            }
        ]
    });
};
