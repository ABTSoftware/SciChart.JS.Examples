import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {FastCandlestickRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import {OhlcDataSeries} from "scichart/Charting/Model/OhlcDataSeries";
import {CategoryAxis} from "scichart/Charting/Visuals/Axis/CategoryAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {ENumericFormat} from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1), labelFormat: ENumericFormat.Decimal_4}));

    // Add a Candlestick series with some values to the chart
    const {dateValues, openValues, highValues, lowValues, closeValues} = ExampleDataProvider.getTradingData(200);

    sciChartSurface.renderableSeries.add(new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: dateValues, openValues, highValues, lowValues, closeValues
        })
    }));

    // Add some trades to the chart
    // We randomly generate these
    for (let i = 0; i < dateValues.length; i++) {
        if (i % 10 === 0) {
            sciChartSurface.annotations.add(new TextAnnotation({
                text: "BUY",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
                x1: i,
                y1: lowValues[i],
            }))
        }
        if ((i + 5) % 10 === 0) {
            sciChartSurface.annotations.add(new TextAnnotation({
                text: "SELL",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
                x1: i,
                y1: highValues[i],
            }))
        }
    }

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};

export default function TradeMarkers() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
