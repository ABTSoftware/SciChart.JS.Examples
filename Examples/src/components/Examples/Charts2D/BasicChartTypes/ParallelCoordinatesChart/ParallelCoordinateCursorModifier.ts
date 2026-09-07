import { CursorModifier } from "scichart";
import type { ICursorModifierOptions } from "scichart";
import type { ModifierMouseArgs } from "scichart";
import type { SeriesInfo } from "scichart";
import { translateToNotScaled } from "scichart";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Optional parameters used to configure a {@link ParallelCoordinateCursorModifier}
 */
export interface IParallelCoordinateCursorModifierOptions extends ICursorModifierOptions {
    /** Fill colour of the data-point marker. Default "#32CD32" (green) */
    markerFill?: string;
    /** Radius of the data-point marker in CSS pixels. Default 4 */
    markerRadius?: number;
}

/**
 * A {@link CursorModifier} that additionally draws a small green circle over the data point the tooltip is
 * describing. The stock cursor draws the crosshair + tooltip but gives no marker at the hit-tested vertex; here
 * the nearest hit point (from the same hit-test the tooltip uses) is marked with an SVG circle in the modifier
 * layer. Coordinates come back in device pixels (seriesViewRect space) and are converted with
 * translateToNotScaled (i.e. divided by DpiHelper.PIXEL_RATIO) into the not-scaled space the SVG layer uses.
 */
export class ParallelCoordinateCursorModifier extends CursorModifier {
    public markerFill: string;
    public markerRadius: number;
    private marker: SVGCircleElement | undefined;

    constructor(options?: IParallelCoordinateCursorModifierOptions) {
        super(options);
        this.markerFill = options?.markerFill ?? "#32CD32";
        this.markerRadius = options?.markerRadius ?? 4;
    }

    /** @inheritDoc */
    protected getSeriesInfos(): SeriesInfo[] {
        const seriesInfos = super.getSeriesInfos();
        // Mark the nearest hit point - the same one whose record the tooltip is showing.
        const nearestHit = seriesInfos.filter((info) => info.isHit).sort((a, b) => a.distance - b.distance)[0];
        if (nearestHit && nearestHit.xCoordinate !== undefined && nearestHit.yCoordinate !== undefined) {
            this.updateMarker(nearestHit.xCoordinate, nearestHit.yCoordinate);
        } else {
            this.hideMarker();
        }
        return seriesInfos;
    }

    private updateMarker(xCoord: number, yCoord: number): void {
        const surface = this.parentSurface;
        if (!surface?.domSvgContainer) {
            return;
        }
        if (!this.marker) {
            const circle = document.createElementNS(SVG_NS, "circle");
            circle.setAttribute("fill", this.markerFill);
            circle.setAttribute("stroke", "#FFFFFF");
            circle.setAttribute("stroke-width", "1");
            circle.setAttribute("pointer-events", "none");
            surface.domSvgContainer.appendChild(circle);
            this.marker = circle;
        }
        const coordSvgTranslation = surface.getCoordSvgTranslation();
        this.marker.setAttribute("cx", String(translateToNotScaled(xCoord + coordSvgTranslation.x)));
        this.marker.setAttribute("cy", String(translateToNotScaled(yCoord + coordSvgTranslation.y)));
        this.marker.setAttribute("r", String(this.markerRadius));
        this.marker.style.display = "";
    }

    private hideMarker(): void {
        if (this.marker) {
            this.marker.style.display = "none";
        }
    }

    private removeMarker(): void {
        this.marker?.remove();
        this.marker = undefined;
    }

    /** @inheritDoc */
    public get isEnabled(): boolean {
        return super.isEnabled;
    }
    /** Hide the marker when the modifier is disabled (no mouse events fire while disabled). */
    public set isEnabled(value: boolean) {
        super.isEnabled = value;
        if (!value) {
            this.hideMarker();
        }
    }

    /** @inheritDoc */
    public modifierMouseLeave(args: ModifierMouseArgs): void {
        super.modifierMouseLeave(args);
        this.hideMarker();
    }

    /** @inheritDoc */
    public onDetach(): void {
        this.removeMarker();
        super.onDetach();
    }
}
