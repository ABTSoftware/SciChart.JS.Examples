import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisType } from "scichart/types/AxisType";

export const drawTextSeriesBuilderApi = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.2)}},
        yAxes: { type: EAxisType.NumericAxis, options: { visibleRange: new NumberRange(-3, 5)}},
        series: [
            {
                type: ESeriesType.TextSeries,
                xyTextData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2, 1, 0, 2, 1, 0, 2, 1, 0],
                    textValues: ["Text Series", "can be", "used", "to display",
                        "arbitrary", "text", "including\r\nmultiline", "at points", "of interest" ]
                },
                options: {
                    dataLabels: {
                        style: {
                            fontFamily: "Arial",
                            fontSize: 22,
                            color: "SteelBlue"
                        }
                    }
                }
            }
        ]
    });
};
