import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyTextDataSeries } from "scichart/Charting/Model/XyTextDataSeries";
import { FastTextRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastTextRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";

export const drawTextSeries = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.2) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-3, 5)
    }));

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yValues = [2, 1, 0, 2, 1, 0, 2, 1, 0];
    const textValues = ["Text Series", "can be", "used", "to display",
        "arbitrary", "text", "including\r\nmultiline", "at points", "of interest" ];

    const xyTextDataSeries = new XyTextDataSeries(wasmContext, {
        xValues,
        yValues,
        textValues,
    });

    const textSeries = new FastTextRenderableSeries(wasmContext, {
        dataSeries: xyTextDataSeries,
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 22,
                color: "SteelBlue"
            }
        },
    });

    sciChartSurface.renderableSeries.add(textSeries);
};
