export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";
import { SmartDateLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/SmartDateLabelProvider";

const divElementId = "chart";

// tslint:disable:no-empty
// tslint:disable:max-line-length

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add an XAxis, YAxis
    const xAxis = new CategoryAxis(wasmContext);
    xAxis.growBy = new NumberRange(0.01, 0.01);
    xAxis.labelProvider = new SmartDateLabelProvider();
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1), labelFormat: ENumericFormat.Decimal })
    );

    // Add a Candlestick series with some values to the chart
    const { dateValues, openValues, highValues, lowValues, closeValues } = ExampleDataProvider.getTradingData(200);

    sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: new OhlcDataSeries(wasmContext, {
                xValues: dateValues,
                openValues,
                highValues,
                lowValues,
                closeValues
            })
        })
    );

    // Add some trades to the chart using the Annotations API
    for (let i = 0; i < dateValues.length; i++) {
        // Every 10th bar, add a buy annotation
        if (i % 10 === 0) {
            sciChartSurface.annotations.add(buyMarkerAnnotation(i, lowValues[i]));
        }
        // Every 10th bar between buys, add a sell annotation
        if ((i + 5) % 10 === 0) {
            sciChartSurface.annotations.add(sellMarkerAnnotation(i, highValues[i]));
        }
        // Every 25th bar, add a news bullet
        if (i % 25 === 0) {
            sciChartSurface.annotations.add(newsBulletAnnotation(i));
        }
    }

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};

// Returns a CustomAnnotation that represents a buy marker arrow
// The CustomAnnotation supports SVG as content. Using Inkscape or similar you can create SVG content for annotations
const buyMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString:
            '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">' +
            '<g transform="translate(-53.867218,-75.091687)">' +
            '<path style="fill:#1cb61c;fill-opacity:0.34117647;stroke:#00b400;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"' +
            'd="m 55.47431,83.481251 c 7.158904,-7.408333 7.158904,-7.408333 7.158904,-7.408333 l 7.158906,7.408333 H 66.212668 V 94.593756 H 59.053761 V 83.481251 Z"' +
            "/>" +
            "</g>" +
            "</svg>"
    });
};

// Returns a CustomAnnotation that represents a sell marker arrow
// The CustomAnnotation supports SVG as content. Using Inkscape or similar you can create SVG content for annotations
const sellMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString:
            '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">' +
            '<g transform="translate(-54.616083,-75.548914)">' +
            '<path style="fill:#b22020;fill-opacity:0.34117648;stroke:#990000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"' +
            'd="m 55.47431,87.025547 c 7.158904,7.408333 7.158904,7.408333 7.158904,7.408333 L 69.79212,87.025547 H 66.212668 V 75.913042 h -7.158907 v 11.112505 z"' +
            "/>" +
            "</g>" +
            "</svg>"
    });
};

const newsBulletAnnotation = (x1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1: 0.99, // using YCoordinateMode.Relative and 0.99, places the annotation at the bottom of the viewport
        yCoordinateMode: ECoordinateMode.Relative,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString:
            '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">' +
            "  <g" +
            '     inkscape:label="Layer 1"' +
            '     inkscape:groupmode="layer"' +
            '     id="layer1"' +
            '     transform="translate(-55.430212,-77.263552)">' +
            "    <rect" +
            '       style="fill:#C0D4EE;fill-opacity:1;stroke:#333333;stroke-width:0.26458332;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.66666667"' +
            '       id="rect4528"' +
            '       width="13.229166"' +
            '       height="15.875"' +
            '       x="55.562504"' +
            '       y="77.395844"' +
            '       rx="2"' +
            '       ry="2" />' +
            "    <text" +
            '       xml:space="preserve"' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#333333;fill-opacity:1;stroke:none;stroke-width:0.26458332"' +
            '       x="57.688622"' +
            '       y="89.160347"' +
            '       id="text4540"><tspan' +
            '         sodipodi:role="line"' +
            '         id="tspan4538"' +
            '         x="57.688622"' +
            '         y="89.160347"' +
            "         style=\"font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:#333333;fill-opacity:1;stroke-width:0.26458332\">N</tspan></text>" +
            "  </g>" +
            "</svg>"
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

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;