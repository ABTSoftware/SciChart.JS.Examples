import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyTextDataSeries} from "scichart/Charting/Model/XyTextDataSeries";
import {FastTextRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastTextRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { EAxisType } from "scichart/types/AxisType";
import { EAxisAlignment } from "scichart/types/AxisAlignment";

export async function textSeriesExample(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.4) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 9) }));
    // Create a chart with textSeries
    sciChartSurface.renderableSeries.add(new FastTextRenderableSeries(wasmContext, {
        dataSeries: new XyTextDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            yValues: [3, 5, 6, 4, 2, 5],
            textValues: ["This", "text", "is", "drawn", "using", "FastTextRenderableSeries"]
        }),
        // font and size is required for text to be drawn
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 18
            },
            color: "#EEE"
        }
    }));
}

export async function textSeriesBuilderAPIExample(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.4) }},
        yAxes: { type: EAxisType.NumericAxis, options: { visibleRange: new NumberRange(0, 9) }},
        series: {
            type: ESeriesType.TextSeries,
            xyTextData: {
                xValues: [1, 2, 3, 4, 5, 6],
                yValues: [3, 5, 6, 4, 2, 5],
                textValues: ["This", "text", "is", "drawn", "using", "FastTextRenderableSeries"]
            },
            options: {
                // font and size is required for text to be drawn
                dataLabels: {
                    style: {
                        fontFamily: "Arial",
                        fontSize: 18
                    },
                    color: "#EEE"
                }
            },
        }
    });
}