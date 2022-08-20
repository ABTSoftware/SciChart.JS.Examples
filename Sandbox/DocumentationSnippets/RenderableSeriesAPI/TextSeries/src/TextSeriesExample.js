import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyTextDataSeries } from "scichart/Charting/Model/XyTextDataSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastTextRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastTextRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";

export const drawTextSeries = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const xValues = [];
    const yValues = [];
    const textValues = [];
    const textSource = ["G", "A", "T", "C"];
    for (let i = 0; i < 40; i++) {
        xValues.push(i);
        yValues.push(0);
        textValues.push(textSource[Math.floor(Math.random() * 4)]);
    }

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
                fontSize: 18,
                color: "White"
            }
        },
    });

    sciChartSurface.renderableSeries.add(textSeries);
};
