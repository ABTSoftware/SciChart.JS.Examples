import { ChartModifierBase2D } from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { EMousePosition } from "scichart/types/MousePosition";
import { translateFromCanvasToSeriesViewRect, translateToNotScaled } from "scichart/utils/translate";
import { PROPERTY } from "scichart/Charting/ChartModifiers/constants";
import { ELabelPlacement } from "scichart/types/LabelPlacement";
import { DpiHelper } from "scichart/Charting/Visuals/TextureManager/DpiHelper";
import { RolloverMarkerSvgAnnotation } from "scichart/Charting/Visuals/Annotations/RolloverMarkerSvgAnnotation";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { VerticalLineAnnotation } from "scichart/Charting/Visuals/Annotations/VerticalLineAnnotation";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
export class DepthCursorModifier extends ChartModifierBase2D {
    type = "DepthCursor";
    /**
     * Gets or sets the crosshair line strokethickness
     */
    crosshairStrokeThickness = 2;
    /**
     * Gets or sets the crosshair line dash array
     */
    crosshairStrokeDashArray = [];
    /**
     * Gets or sets both axis label text color as an HTML Color code
     */
    axisLabelStroke = "#fff";
    /**
     * Gets or sets both axis label fill as an HTML Color code.
     */
    axisLabelFill = "#228B22";
    highlightColor = "black";
    buyColor = "green";
    sellColor = "red";
    tooltipDataTemplate;
    buySeries;
    sellSeries;
    xBuyLineAnnotation;
    yBuyLineAnnotation;
    xSellLineAnnotation;
    ySellLineAnnotation;
    buyLabel;
    sellLabel;
    midLine;
    highlightBox;
    mousePosition = EMousePosition.OutOfCanvas;
    /**
     */
    constructor(options) {
        super(options);
        this.crosshairStrokeThickness = options?.crosshairStrokeThickness ?? this.crosshairStrokeThickness;
        this.crosshairStrokeDashArray = options?.crosshairStrokeDashArray ?? this.crosshairStrokeDashArray;
        this.axisLabelFill = options?.axisLabelFill ?? this.axisLabelFill;
        this.axisLabelStroke = options?.axisLabelStroke ?? this.axisLabelStroke;
        this.buySeries = options.buySeries;
        this.sellSeries = options.sellSeries;
    }
    /**
     * @inheritDoc
     */
    applyTheme(themeProvider) {}
    /**
     * @inheritDoc
     */
    onAttach() {
        super.onAttach();
        this.xBuyLineAnnotation = this.createLineAnnotation(this.buyColor, this.axisLabelFill, this.axisLabelStroke);
        this.yBuyLineAnnotation = this.createLineAnnotation(this.buyColor, this.axisLabelFill, this.axisLabelStroke);
        this.yBuyLineAnnotation.showLabel = true;
        this.xSellLineAnnotation = this.createLineAnnotation(this.sellColor, this.axisLabelFill, this.axisLabelStroke);
        this.ySellLineAnnotation = this.createLineAnnotation(this.sellColor, this.axisLabelFill, this.axisLabelStroke);
        this.ySellLineAnnotation.showLabel = true;
        this.parentSurface.modifierAnnotations.add(
            this.xBuyLineAnnotation,
            this.yBuyLineAnnotation,
            this.xSellLineAnnotation,
            this.ySellLineAnnotation
        );
        this.createMarkers();
        this.parentSurface.modifierAnnotations.add(
            this.buySeries.rolloverModifierProps.marker,
            this.sellSeries.rolloverModifierProps.marker
        );
        this.buyLabel = this.createTextAnnotation(EHorizontalAnchorPoint.Right);
        this.sellLabel = this.createTextAnnotation(EHorizontalAnchorPoint.Left);
        this.parentSurface.modifierAnnotations.add(this.buyLabel, this.sellLabel);
        this.midLine = new VerticalLineAnnotation({
            stroke: "white",
            strokeDashArray: [3, 2],
            showLabel: true,
            axisLabelFill: "white",
            labelPlacement: ELabelPlacement.Top,
        });
        this.parentSurface.modifierAnnotations.add(this.midLine);
        this.highlightBox = new BoxAnnotation({
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Relative,
            strokeThickness: 0,
            fill: this.highlightColor,
            opacity: 0.3,
            isHidden: true,
            y1: 0,
            y2: 1,
        });
        this.parentSurface.modifierAnnotations.add(this.highlightBox);
    }
    /**
     * @inheritDoc
     */
    onDetach() {
        super.onDetach();
        this.getAnnotations().forEach((l) => this.removeAnnotation(l));
        this.xBuyLineAnnotation = undefined;
        this.yBuyLineAnnotation = undefined;
        this.xSellLineAnnotation = undefined;
        this.ySellLineAnnotation = undefined;
        this.midLine = undefined;
        [this.buySeries, this.sellSeries].forEach((rs) => {
            this.parentSurface.modifierAnnotations.remove(rs.rolloverModifierProps.marker);
            rs.rolloverModifierProps.delete();
        });
        this.buyLabel = undefined;
        this.sellLabel = undefined;
        this.highlightBox = undefined;
    }
    getMidPrice() {
        const firstBuy = this.buySeries.dataSeries.getNativeXValues().get(0);
        const firstSell = this.sellSeries.dataSeries.getNativeXValues().get(0);
        return (firstBuy + firstSell) / 2;
    }
    /**
     * @inheritDoc
     */
    modifierMouseMove(args) {
        super.modifierMouseMove(args);
        let translatedMousePoint;
        if (!this.mousePoint) {
            this.mousePosition = EMousePosition.OutOfCanvas;
        } else {
            translatedMousePoint = translateFromCanvasToSeriesViewRect(
                this.mousePoint,
                this.parentSurface.seriesViewRect
            );
            if (!translatedMousePoint) {
                this.mousePosition = EMousePosition.AxisArea;
            } else {
                this.mousePosition = EMousePosition.SeriesArea;
            }
        }
        this.update();
    }
    /**
     * @inheritDoc
     */
    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);
        this.mousePosition = EMousePosition.OutOfCanvas;
        this.update();
    }
    /**
     * @inheritDoc
     */
    modifierMouseEnter(args) {
        super.modifierMouseEnter(args);
    }
    /**
     * @inheritDoc
     */
    onParentSurfaceRendered() {
        this.update();
    }
    getAnnotations() {
        return [
            this.xBuyLineAnnotation,
            this.yBuyLineAnnotation,
            this.xSellLineAnnotation,
            this.ySellLineAnnotation,
            this.midLine,
            this.buyLabel,
            this.sellLabel,
            this.highlightBox,
        ];
    }
    /**
     * Override hitTestRenderableSeries and add a custom logic here
     * @param rs
     * @param mousePoint
     */
    hitTestRenderableSeries(rs, mousePoint) {
        if (!mousePoint) {
            return undefined;
        }
        return rs.hitTestProvider.hitTestXSlice(mousePoint.x, mousePoint.y);
    }
    /**
     * Returns current mouse position
     */
    getMousePosition() {
        return this.mousePosition;
    }
    /** @inheritDoc */
    toJSON() {
        const json = super.toJSON();
        const options = {
            axisLabelFill: this.axisLabelFill,
            axisLabelStroke: this.axisLabelStroke,
            crosshairStrokeDashArray: this.crosshairStrokeDashArray,
            crosshairStrokeThickness: this.crosshairStrokeThickness,
        };
        Object.assign(json.options, options);
        return json;
    }
    notifyPropertyChanged(propertyName) {
        super.notifyPropertyChanged(propertyName);
        if (propertyName === PROPERTY.X_AXIS_ID) {
            this.getAnnotations().forEach((l) => {
                if (l) {
                    l.xAxisId = this.xAxisId;
                }
            });
        }
        if (propertyName === PROPERTY.Y_AXIS_ID) {
            this.getAnnotations().forEach((l) => {
                if (l) {
                    l.yAxisId = this.yAxisId;
                }
            });
        }
    }
    update() {
        if (this.mousePosition !== EMousePosition.SeriesArea) {
            this.getAnnotations().forEach((l) => {
                l.isHidden = true;
            });
            this.buySeries.rolloverModifierProps.marker.isHidden = true;
            this.sellSeries.rolloverModifierProps.marker.isHidden = true;
            return;
        }
        if (!this.buySeries || !this.sellSeries) return;
        const translatedMousePoint = translateFromCanvasToSeriesViewRect(
            this.mousePoint,
            this.parentSurface.seriesViewRect
        );
        if (translatedMousePoint) {
            this.getAnnotations().forEach((l) => {
                l.isHidden = false;
            });
            const midPrice = this.getMidPrice();
            const midCoord = translateToNotScaled(
                this.parentSurface.getXAxisById(this.xAxisId).getCurrentCoordinateCalculator().getCoordinate(midPrice)
            );
            this.xBuyLineAnnotation.x1 = midCoord;
            this.xSellLineAnnotation.x1 = midCoord;
            this.yBuyLineAnnotation.y1 = 0;
            this.ySellLineAnnotation.y1 = 0;
            this.midLine.x1 = midPrice;
            const buyHitTestInfo = this.hitTestRenderableSeries(this.buySeries, this.mousePoint);
            if (buyHitTestInfo && buyHitTestInfo.isWithinDataBounds) {
                this.updateBuy(buyHitTestInfo);
                // Find corresponding sell value
                const xSell = (midCoord + (midCoord - this.xBuyLineAnnotation.x2)) * DpiHelper.PIXEL_RATIO;
                const sellHitTestInfo = this.sellSeries.hitTestProvider.hitTestXSlice(xSell, this.mousePoint.y);
                //console.log(this.mousePoint.x, xSell);
                this.updateSell(sellHitTestInfo);
            } else {
                const sellHitTestInfo = this.hitTestRenderableSeries(this.sellSeries, this.mousePoint);
                if (sellHitTestInfo && sellHitTestInfo.isWithinDataBounds) {
                    this.updateSell(sellHitTestInfo);
                    // Find corresponding buy value
                    const xBuy = (midCoord - (this.xSellLineAnnotation.x2 - midCoord)) * DpiHelper.PIXEL_RATIO;
                    const buyHitTestInfo = this.buySeries.hitTestProvider.hitTestXSlice(xBuy, this.mousePoint.y);
                    this.updateBuy(buyHitTestInfo);
                }
            }
            this.highlightBox.x1 = this.xBuyLineAnnotation.x2;
            this.highlightBox.x2 = this.xSellLineAnnotation.x2;
        }
    }
    updateBuy(buyHitTestInfo) {
        const x = translateToNotScaled(buyHitTestInfo.xCoord);
        const y = translateToNotScaled(buyHitTestInfo.yCoord);
        this.xBuyLineAnnotation.x2 = x;
        this.xBuyLineAnnotation.y1 = y;
        this.xBuyLineAnnotation.y2 = y;
        this.yBuyLineAnnotation.x1 = x;
        this.yBuyLineAnnotation.x2 = x;
        this.yBuyLineAnnotation.y2 = y;
        this.buyLabel.x1 = this.xBuyLineAnnotation.x1;
        this.buyLabel.y1 = y;
        this.buyLabel.text = this.parentSurface
            .getYAxisById(this.yAxisId)
            .labelProvider.formatCursorLabel(buyHitTestInfo.yValue);
        this.buySeries.rolloverModifierProps.marker.isHidden = false;
        this.buySeries.rolloverModifierProps.marker.x1 = buyHitTestInfo.xValue;
        this.buySeries.rolloverModifierProps.marker.y1 = buyHitTestInfo.yValue;
    }
    updateSell(sellHitTestInfo) {
        const x = translateToNotScaled(sellHitTestInfo.xCoord);
        const y = translateToNotScaled(sellHitTestInfo.yCoord);
        this.xSellLineAnnotation.x2 = x;
        this.xSellLineAnnotation.y1 = y;
        this.xSellLineAnnotation.y2 = y;
        this.ySellLineAnnotation.x1 = x;
        this.ySellLineAnnotation.x2 = x;
        this.ySellLineAnnotation.y2 = y;
        this.sellLabel.x1 = this.xBuyLineAnnotation.x1;
        this.sellLabel.y1 = y;
        this.sellLabel.text = this.parentSurface
            .getYAxisById(this.yAxisId)
            .labelProvider.formatCursorLabel(sellHitTestInfo.yValue);
        this.sellSeries.rolloverModifierProps.marker.isHidden = false;
        this.sellSeries.rolloverModifierProps.marker.x1 = sellHitTestInfo.xValue;
        this.sellSeries.rolloverModifierProps.marker.y1 = sellHitTestInfo.yValue;
    }
    createMarkers() {
        [this.buySeries, this.sellSeries].forEach((rs) => {
            rs.rolloverModifierProps.marker = new RolloverMarkerSvgAnnotation(rs.rolloverModifierProps);
            rs.rolloverModifierProps.marker.xAxisId = rs.xAxisId;
            rs.rolloverModifierProps.marker.yAxisId = rs.yAxisId;
            rs.rolloverModifierProps.rolloverModifier = this;
            rs.rolloverModifierProps.markerColor = rs.stroke;
        });
    }
    createLineAnnotation(lineStroke, axisLabelFill, axisLabelStroke) {
        return new LineAnnotation({
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            strokeThickness: this.crosshairStrokeThickness,
            strokeDashArray: this.crosshairStrokeDashArray,
            stroke: lineStroke,
            showLabel: false,
            isHidden: true,
            axisLabelFill,
            axisLabelStroke,
            xAxisId: this.xAxisId,
            yAxisId: this.yAxisId,
        });
    }
    createTextAnnotation(horizontalAnchorPoint) {
        return new TextAnnotation({
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            fontSize: 10,
            textColor: "white",
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            horizontalAnchorPoint,
        });
    }
    isVerticalChart() {
        const xAxis = this.parentSurface?.getXAxisById(this.xAxisId) || this.parentSurface?.xAxes.get(0);
        if (xAxis) {
            return xAxis.isVerticalChart;
        }
        return false;
    }
    removeAnnotation(annotation) {
        if (annotation) {
            annotation.delete();
            this.parentSurface.modifierAnnotations.remove(annotation);
        }
    }
}
