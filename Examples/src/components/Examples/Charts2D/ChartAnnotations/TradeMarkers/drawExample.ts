import {
    AnnotationHoverEventArgs,
    AnnotationHoverModifier,
    AUTO_COLOR,
    CategoryAxis,
    CustomAnnotation,
    EAnnotationType,
    EAxisAlignment,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ELineType,
    ENumericFormat,
    EVerticalAnchorPoint,
    FastCandlestickRenderableSeries,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    IAnnotation,
    LegendModifier,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
    SciChartSurface,
    SmartDateLabelProvider,
    TextAnnotation,
    Thickness,
    TTargetsSelector,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { ExampleDataProvider, IOhlcvValues } from "../../../ExampleData/ExampleDataProvider";
import { multiPaneData } from "../../../ExampleData/multiPaneData";
import { appTheme } from "../../../theme";

// tslint:disable:no-empty
// tslint:disable:max-line-length

const getTradingData = (startPoints?: number, maxPoints?: number): IOhlcvValues => {
    const { dateValues, openValues, highValues, lowValues, closeValues, volumeValues } = multiPaneData;

    if (maxPoints !== undefined) {
        return {
            dateValues: dateValues.slice(startPoints, startPoints + maxPoints),
            openValues: openValues.slice(startPoints, startPoints + maxPoints),
            highValues: highValues.slice(startPoints, startPoints + maxPoints),
            lowValues: lowValues.slice(startPoints, startPoints + maxPoints),
            closeValues: closeValues.slice(startPoints, startPoints + maxPoints),
            volumeValues: volumeValues.slice(startPoints, startPoints + maxPoints),
        };
    }

    return { dateValues, openValues, highValues, lowValues, closeValues, volumeValues };
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
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
            labelPrecision: 2,
        })
    );

    // Add a Candlestick series with some values to the chart
    const { dateValues, openValues, highValues, lowValues, closeValues } = getTradingData(775, 100);

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

    const trades: any[] = [];
    let position = 0;
    let equity = 0;
    let balance = 100;
    let avgPrice = 0;

    const positionDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Position" });
    const balanceDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Balance" });

    // Trade at random!
    for (let i = 0; i < dateValues.length; i++) {
        const low = lowValues[i];
        const high = highValues[i];
        const price = low + Math.random() * (high - low);
        if (Math.random() < 0.2) {
            const t = equity / (equity + balance);
            if (Math.random() > t) {
                // Buy
                const quantity = Math.floor((Math.random() * balance) / price);
                const size = quantity * price;
                avgPrice = (avgPrice * position + size) / (position + quantity);
                position += quantity;
                balance -= size;
                sciChartSurface.annotations.add(new TradeAnnotation(i, true, quantity, price, low, avgPrice));
            } else {
                // Sell
                const quantity = Math.floor((Math.random() * equity) / price);
                const size = quantity * price;
                position -= quantity;
                balance += size;
                const pnl = (price - avgPrice) * quantity;
                sciChartSurface.annotations.add(new TradeAnnotation(i, false, quantity, price, high, pnl));
            }
        }
        equity = position * closeValues[i];
        positionDataSeries.append(i, position);
        balanceDataSeries.append(i, balance + equity);

        // Every 25th bar, add a news bullet
        if (i % 20 === 0) {
            sciChartSurface.annotations.add(newsBulletAnnotation(i));
        }
    }

    //const positionAxis = new NumericAxis(wasmContext, { id: "Position", axisAlignment: EAxisAlignment.Left });
    const balanceAxis = new NumericAxis(wasmContext, {
        id: "Balance",
        //visibleRange: new NumberRange(90, 110),
        growBy: new NumberRange(0.1, 0.1),
        stackedAxisLength: "20%",
    });
    sciChartSurface.yAxes.add(balanceAxis);
    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

    const positionSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: positionDataSeries,
        stroke: AUTO_COLOR,
        yAxisId: "Position",
        lineType: ELineType.Digital,
    });
    const balanceSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: balanceDataSeries,
        stroke: appTheme.VividPurple,
        fill: appTheme.MutedPurple,
        yAxisId: "Balance",
        zeroLineY: 100,
    });
    sciChartSurface.renderableSeries.add(balanceSeries);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    const targetsSelector: TTargetsSelector<IAnnotation> = (modifer) => {
        return modifer.getAllTargets().filter((t) => "quantity" in t);
    };
    sciChartSurface.chartModifiers.add(
        new AnnotationHoverModifier({
            targets: targetsSelector,
        })
    );

    return { sciChartSurface, wasmContext };
};

class TradeAnnotation extends CustomAnnotation {
    public isBuy: boolean;
    public quantity: number;
    public price: number;
    public change: number;

    private priceAnnotation: CustomAnnotation;
    private toolTipAnnotation: TextAnnotation;

    public onHover(args: AnnotationHoverEventArgs) {
        const { x1, x2 } = this.getAdornerAnnotationBorders(true);
        const viewRect = this.parentSurface.seriesViewRect;
        if (args.isHovered && !this.priceAnnotation) {
            this.priceAnnotation = tradePriceAnnotation(this.x1, this.price, this.isBuy);
            this.toolTipAnnotation = new TextAnnotation({
                yCoordShift: this.isBuy ? 20 : -20,
                x1: this.x1,
                y1: this.y1,
                verticalAnchorPoint: this.isBuy ? EVerticalAnchorPoint.Top : EVerticalAnchorPoint.Bottom,
                horizontalAnchorPoint:
                    x1 < viewRect.left + 50
                        ? EHorizontalAnchorPoint.Left
                        : x2 > viewRect.right - 50
                        ? EHorizontalAnchorPoint.Right
                        : EHorizontalAnchorPoint.Center,
                background: this.isBuy ? appTheme.VividGreen : appTheme.VividRed,
                textColor: "black",
                padding: new Thickness(0, 0, 5, 0),
                fontSize: 16,
                text: `${this.quantity} @${this.price.toFixed(3)} ${
                    this.isBuy ? "Avg Price" : "PnL"
                } ${this.change.toFixed(3)}`,
            });
            this.parentSurface.annotations.add(this.priceAnnotation, this.toolTipAnnotation);
        } else if (this.priceAnnotation) {
            this.parentSurface.annotations.remove(this.priceAnnotation, true);
            this.parentSurface.annotations.remove(this.toolTipAnnotation, true);
            this.priceAnnotation = undefined;
            this.toolTipAnnotation = undefined;
        }
    }

    public constructor(
        timeStamp: number,
        isBuy: boolean,
        quantity: number,
        tradePrice: number,
        markerPrice: number,
        change: number
    ) {
        super({
            x1: timeStamp,
            y1: markerPrice,
            verticalAnchorPoint: isBuy ? EVerticalAnchorPoint.Top : EVerticalAnchorPoint.Bottom,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        });
        this.isBuy = isBuy;
        this.quantity = quantity;
        this.price = tradePrice;
        this.change = change;
        this.onHover = this.onHover.bind(this);
        this.hovered.subscribe(this.onHover);
    }

    public getSvgString(annotation: CustomAnnotation): string {
        if (this.isBuy) {
            return `<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-54.867218,-75.091687)">
                <path style="fill:${appTheme.VividGreen};fill-opacity:0.77;stroke:${appTheme.VividGreen};stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                    d="m 55.47431,83.481251 c 7.158904,-7.408333 7.158904,-7.408333 7.158904,-7.408333 l 7.158906,7.408333 H 66.212668 V 94.593756 H 59.053761 V 83.481251 Z"
                "/>
            </g>
        </svg>`;
        } else {
            return `<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-54.616083,-75.548914)">
                <path style="fill:${appTheme.VividRed};fill-opacity:0.77;stroke:${appTheme.VividRed};stroke-width:2px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
                d="m 55.47431,87.025547 c 7.158904,7.408333 7.158904,7.408333 7.158904,7.408333 L 69.79212,87.025547 H 66.212668 V 75.913042 h -7.158907 v 11.112505 z"
                />
            </g>
        </svg>`;
        }
    }
}

const tradePriceAnnotation = (timestamp: number, price: number, isBuy: boolean): CustomAnnotation => {
    return new CustomAnnotation({
        x1: timestamp,
        y1: price,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
        svgString: `<svg xmlns="http://www.w3.org/2000/svg">
            <path style="fill: transparent; stroke:${
                isBuy ? appTheme.VividGreen : appTheme.VividRed
            }; stroke-width: 3px;" d="M 0 0 L 10 10 L 0 20"></path>
        </svg>`,
    });
};

const newsBulletAnnotation = (x1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1: 0.99, // using YCoordinateMode.Relative and 0.99, places the annotation at the bottom of the viewport
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
