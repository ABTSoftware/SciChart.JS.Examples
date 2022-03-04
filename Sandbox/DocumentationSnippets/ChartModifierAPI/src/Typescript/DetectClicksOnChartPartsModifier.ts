import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import {testIsInBounds} from "scichart/utils/pointUtil";
import {Rect} from "scichart/Core/Rect";
import {RubberBandSvgRect} from "scichart/Charting/Visuals/RubberBandSvgRect/RubberBandSvgRect";

// A custom modifier which detects clicks on chart parts
export class DetectClicksOnChartPartsModifier extends ChartModifierBase2D {
    readonly type: EChart2DModifierType = EChart2DModifierType.Custom;
    private debugRect: RubberBandSvgRect;

    override onAttach() {
        super.onAttach();
        // Rectangle used to show visually what chart part you clicked
        this.debugRect = new RubberBandSvgRect(this.parentSurface.domSvgAdornerLayer, "#FF000033", "Transparent", 0);
    }

    override onDetach() {
        super.onDetach();
        this.debugRect.delete();
    }

    override modifierMouseMove(args: ModifierMouseArgs) {
        super.modifierMouseMove(args);

        if (!this.isAttached) {
            throw new Error("Should not call DetectClicksOnChartPartsModifier.modifierMouseDown if not attached");
        }

        const mousePoint = args.mousePoint;
        this.updateDebugRectangle(undefined);

        // Check if the mouse was over A YAxis
        this.parentSurface?.yAxes.asArray().forEach(yAxis => {
            const { left, right, top, bottom } = yAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                console.log("Mouse is over YAxis ID=" + yAxis.id);
                this.updateDebugRectangle(yAxis.viewRect);
            }
        });

        // Check if the mouse was over an XAxis
        this.parentSurface?.xAxes.asArray().forEach(xAxis => {
            const { left, right, top, bottom } = xAxis.viewRect;
            if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
                console.log("Mouse is over XAxis ID=" + xAxis.id);
                this.updateDebugRectangle(xAxis.viewRect);
            }
        });

        // Check if the mouse was over the main chart area
        const { left, right, top, bottom } = this.parentSurface?.seriesViewRect;
        if (testIsInBounds(mousePoint.x, mousePoint.y, left, bottom, right, top)) {
            console.log("Mouse is over main Chart area");
            this.updateDebugRectangle(this.parentSurface?.seriesViewRect);

            // Check if the mouse was over any series
            this.parentSurface?.renderableSeries.asArray().forEach(rSeries => {
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

    private updateDebugRectangle(rect: Rect) {
        if (!rect) {
            this.debugRect.isHidden = true;
            return;
        }
        this.debugRect.isHidden = false;
        this.debugRect.x1 = rect.x;
        this.debugRect.y1 = rect.y;
        this.debugRect.x2 = rect.x + rect.width;
        this.debugRect.y2 = rect.y + rect.height;
        this.debugRect.isHidden = false;
    }
}
