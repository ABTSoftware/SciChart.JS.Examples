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
import {CustomAnnotation} from "scichart/Charting/Visuals/Annotations/CustomAnnotation";

const divElementId = "chart";

// tslint:disable:no-empty
// tslint:disable:max-line-length

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

    // Add some trades to the chart using the Annotations API
    for (let i = 0; i < dateValues.length; i++) {
        if (i % 10 === 0) {
            sciChartSurface.annotations.add(buyMarkerAnnotation(i, lowValues[i]));
        }
        if ((i + 5) % 10 === 0) {
            sciChartSurface.annotations.add(sellMarkerAnnotation(i, highValues[i]));
        }
    }

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};

// Returns a CustomAnnotation that represents a buy marker arrow
const buyMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString:
            '<svg>' +
            '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">' +
            '<g transform="translate(-53.867218,-75.091687)">' +
            '<path style="fill:#1cb61c;fill-opacity:0.34117647;stroke:#00b400;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"' +
            'd="m 55.47431,83.481251 c 7.158904,-7.408333 7.158904,-7.408333 7.158904,-7.408333 l 7.158906,7.408333 H 66.212668 V 94.593756 H 59.053761 V 83.481251 Z"' +
            '/>' +
            '</g>' +
            '</svg>' +
            '</svg>'
    });
};

// Returns a CustomAnnotation that represents a sell marker arrow
const sellMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString:
            '<svg>' +
            '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">' +
            '<g transform="translate(-54.616083,-75.548914)">' +
            '<path style="fill:#b22020;fill-opacity:0.34117648;stroke:#990000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"' +
            'd="m 55.47431,87.025547 c 7.158904,7.408333 7.158904,7.408333 7.158904,7.408333 L 69.79212,87.025547 H 66.212668 V 75.913042 h -7.158907 v 11.112505 z"' +
            '/>' +
            '</g>' +
            '</svg>' +
            '</svg>'
    });
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
