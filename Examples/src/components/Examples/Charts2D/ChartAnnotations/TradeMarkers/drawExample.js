import {
    CategoryAxis,
    CustomAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ENumericFormat,
    EVerticalAnchorPoint,
    FastCandlestickRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    SciChartSurface,
    SmartDateLabelProvider,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
// tslint:disable:no-empty
// tslint:disable:max-line-length
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Add an XAxis, YAxis
    const xAxis = new CategoryAxis(wasmContext, { labelProvider: new SmartDateLabelProvider() });
    xAxis.growBy = new NumberRange(0.01, 0.01);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            labelFormat: ENumericFormat.Decimal,
        })
    );
    // Add a Candlestick series with some values to the chart
    const { dateValues, openValues, highValues, lowValues, closeValues } = ExampleDataProvider.getTradingData(775, 100);
    sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: new OhlcDataSeries(wasmContext, {
                xValues: dateValues,
                openValues,
                highValues,
                lowValues,
                closeValues,
            }),
            strokeUp: appTheme.VividSkyBlue,
            strokeDown: appTheme.VividSkyBlue,
            brushUp: appTheme.VividSkyBlue,
            brushDown: "Transparent",
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
        if (i % 20 === 0) {
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
const buyMarkerAnnotation = (x1, y1) => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString: `<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-54.867218,-75.091687)">
                    <path style="fill:${appTheme.VividGreen};fill-opacity:0.77;stroke:${appTheme.VividGreen};stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                        d="m 55.47431,83.481251 c 7.158904,-7.408333 7.158904,-7.408333 7.158904,-7.408333 l 7.158906,7.408333 H 66.212668 V 94.593756 H 59.053761 V 83.481251 Z"
                    "/>
                </g>
            </svg>`,
    });
};
// Returns a CustomAnnotation that represents a sell marker arrow
// The CustomAnnotation supports SVG as content. Using Inkscape or similar you can create SVG content for annotations
const sellMarkerAnnotation = (x1, y1) => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString: `<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-54.616083,-75.548914)">
                    <path style="fill:${appTheme.VividRed};fill-opacity:0.77;stroke:${appTheme.VividRed};stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                    d="m 55.47431,87.025547 c 7.158904,7.408333 7.158904,7.408333 7.158904,7.408333 L 69.79212,87.025547 H 66.212668 V 75.913042 h -7.158907 v 11.112505 z"
                    />
                </g>
            </svg>`,
    });
};
const newsBulletAnnotation = (x1) => {
    return new CustomAnnotation({
        x1,
        y1: 0.99,
        yCoordinateMode: ECoordinateMode.Relative,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString: `<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">
              <g
                 inkscape:label="Layer 1"
                 inkscape:groupmode="layer"
                 id="layer1"
                 transform="translate(-55.430212,-77.263552)">
                <rect
                   style="fill:${appTheme.ForegroundColor};fill-opacity:1;stroke:${appTheme.Background};stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.66666667"
                   id="rect4528"
                   width="50"
                   height="18"
                   x="55.562504"
                   y="77.395844"
                   rx="2"
                   ry="2" />
                <text
                   xml:space="preserve"
                   style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:${appTheme.Background};fill-opacity:1;stroke:none;stroke-width:0.26458332"
                   x="59.688622"
                   y="91.160347"
                   id="text4540"><tspan
                     sodipodi:role="line"
                     id="tspan4538"
                     x="57.688622"
                     y="89.160347"
                     style=\"font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-family:sans-serif;-inkscape-font-specification:'sans-serif Bold';fill:${appTheme.Background};fill-opacity:1;stroke-width:0.26458332\">Dividend</tspan></text>
              </g>
            </svg>`,
    });
};
