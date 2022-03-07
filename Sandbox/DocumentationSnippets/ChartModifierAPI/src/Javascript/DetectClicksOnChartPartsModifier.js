import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";
import {testIsInBounds} from "scichart/utils/pointUtil";
import {RubberBandSvgRect} from "scichart/Charting/Visuals/RubberBandSvgRect/RubberBandSvgRect";
import {DpiHelper} from "scichart/Charting/Visuals/TextureManager/DpiHelper";

// A custom modifier which detects clicks on chart parts
export class DetectClicksOnChartPartsModifierJs extends ChartModifierBase2D {

    constructor() {
        super();
        this.type = EChart2DModifierType.custom;
    }

    onAttach() {
        super.onAttach();
        // Rectangle used to show visually what chart part you clicked
        this.debugRect = new RubberBandSvgRect(this.parentSurface.domSvgAdornerLayer, "#FF000033", "Transparent", 0);
    }

    onDetach() {
        super.onDetach();
        this.debugRect.delete();
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);

        if (!this.isAttached) {
            throw new Error("Should not call DetectClicksOnChartPartsModifier.modifierMouseDown if not attached");
        }

        const mousePoint = args.mousePoint;
        this.updateDebugRectangle(undefined);

        // Check if the mouse was over a YAxis
        this.parentSurface.yAxes.asArray().forEach(yAxis => {
            const { left, right, top, bottom } = yAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                 console.log("Mouse is over YAxis ID=" + yAxis.id);
                 this.updateDebugRectangle(yAxis.viewRect);
            }
        });

        // Check if the mouse was over an XAxis
        this.parentSurface.xAxes.asArray().forEach(xAxis => {
            const { left, right, top, bottom } = xAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                console.log("Mouse is over XAxis ID=" + xAxis.id);
                this.updateDebugRectangle(xAxis.viewRect);
            }
        });

        // Check if the mouse was over the main chart area
        const { left, right, top, bottom } = this.parentSurface.seriesViewRect;
        if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
            console.log("Mouse is over main Chart area");
            this.updateDebugRectangle(this.parentSurface.seriesViewRect);

            // Check if the mouse was over any series
            super.parentSurface.renderableSeries.asArray().forEach(rSeries => {
                const hitTestInfo = rSeries.hitTestProvider.hitTest(mousePoint.x, mousePoint.y);
                if (hitTestInfo.isHit) {
                    console.log(`RenderableSeries with seriesname=${rSeries.dataSeries.dataSeriesName} was hovered`);
                    rSeries.isHovered = true;
                } else {
                    rSeries.isHovered = false;
                }
            });
        }
    }

    updateDebugRectangle(rect) {
        if (!rect) {
            this.debugRect.isHidden = true;
            return;
        }
        this.debugRect.isHidden = false;
        this.debugRect.x1 = rect.x / DpiHelper.PIXEL_RATIO;
        this.debugRect.y1 = rect.y / DpiHelper.PIXEL_RATIO;
        this.debugRect.x2 = rect.x / DpiHelper.PIXEL_RATIO + rect.width / DpiHelper.PIXEL_RATIO;
        this.debugRect.y2 = rect.y / DpiHelper.PIXEL_RATIO + rect.height / DpiHelper.PIXEL_RATIO;
        this.debugRect.isHidden = false;
    }
}
