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
import { EHorizontalTextPosition, EVerticalTextPosition } from "scichart/types/TextPosition";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";

export async function textSeriesExample(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.4) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 9) }));
    // Create a chart with textSeries
    const textSeries = new FastTextRenderableSeries(wasmContext, {
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
            color: "white"
        }
    });
    sciChartSurface.renderableSeries.add(textSeries);
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
                    color: "white"
                }
            },
        }
    });
}

export async function textSeriesOptionsExample(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.4) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 9) }));

    // Register a remote font
    await sciChartSurface.registerFont(
        "notoserif",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserif/NotoSerif-Regular.ttf"
    );

    // Create a textSeries with custom font
    const textSeries = new FastTextRenderableSeries(wasmContext, {
        dataSeries: new XyTextDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            yValues: [1, 1, 1, 1, 1, 1],
            textValues: ["This", "text", "is", "drawn", "using", "FastTextRenderableSeries"]
        }),
        // font and size is required for text to be drawn
        dataLabels: {
            style: {
                fontFamily: "notoserif",
                fontSize: 18
            },
            color: "white",
            // Set text position relative to the data point
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Center,
            // force the label sizes to be calcualted as we need them below 
            calculateTextBounds: true,
        }
    });
    textSeries.dataLabelProvider.getColor = (state, text) => {
        if (state.xVal() < 4) {
            return parseColorToUIntArgb("red");
        } else {
            return state.color;
        }
    }
    textSeries.dataLabelProvider.onAfterGenerate = (dataLabels) => {
        for (let i = 0; i < dataLabels.length; i++) {
            const label = dataLabels[i];
            if (i < dataLabels.length - 1) {
                // Shift this label down if it would overlap the next one
                if (label.rect.right > dataLabels[i+1].rect.left) {
                    label.position.y += label.rect.height;
                }
            }
        }
    }
    sciChartSurface.renderableSeries.add(textSeries);
}