import { ChartModifierBase2D } from "scichart";
import type { IChartModifierBaseOptions } from "scichart";
import type { ModifierMouseArgs } from "scichart";
import { ECursorStyle } from "scichart";
import { translateFromCanvasToSeriesViewRect, translateToNotScaled } from "scichart";
import type { ParallelCoordinateDataSource } from "./ParallelCoordinateDataSource";

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Optional parameters used to configure a {@link ParallelCoordinateAxisReorderModifier}
 */
export interface IParallelCoordinateAxisReorderModifierOptions extends IChartModifierBaseOptions {
    /**
     * How close (in x data units, i.e. category positions) the pointer must be to a category axis on
     * mouse-down to start dragging it. Default 0.4 (axes sit one unit apart, so this grabs the nearest axis
     * when the pointer is within ~40% of the way to its neighbour).
     */
    grabTolerance?: number;
}

/**
 * @summary A chart modifier that drags a category (Y) axis of a Parallel Coordinate Plot left/right to
 * reorder the dimensions.
 * @description
 * On mouse-down the modifier grabs the category axis nearest the pointer (within {@link grabTolerance}). On
 * mouse-up {@link ParallelCoordinateDataSource.moveCategory} moves the grabbed dimension into the slot nearest
 * the release point and rebuilds once - reordering on release (rather than per crossing) avoids repeated
 * rebuilds when dragging across several columns. Category axes sit at x data positions 0..K-1, so the target
 * slot is just the rounded pointer x.
 *
 * Shares the left-drag gesture with the range-highlight / rubber-band-zoom modifiers, so enable only one at a
 * time (the demo exposes each as its own toggle).
 *
 * ```ts
 * const data = new ParallelCoordinateDataSource(wasmContext, sciChartSurface);
 * // ... addCategory / build ...
 * sciChartSurface.chartModifiers.add(new ParallelCoordinateAxisReorderModifier(data));
 * ```
 */
export class ParallelCoordinateAxisReorderModifier extends ChartModifierBase2D {
    public readonly type = "ParallelCoordinateAxisReorder";

    public grabTolerance: number;

    private readonly dataSource: ParallelCoordinateDataSource;
    /** The category index currently being dragged, or undefined when not dragging */
    private dragIndex: number | undefined;
    /** A dashed vertical line marking the drop slot while dragging (pure SVG, no rebuild) */
    private dropIndicator: SVGLineElement | undefined;

    /**
     * Creates an instance of a ParallelCoordinateAxisReorderModifier
     * @param dataSource The {@link ParallelCoordinateDataSource} whose category axes can be reordered
     * @param options Optional parameters used to configure the modifier
     */
    constructor(dataSource: ParallelCoordinateDataSource, options?: IParallelCoordinateAxisReorderModifierOptions) {
        super(options);
        this.dataSource = dataSource;
        this.grabTolerance = options?.grabTolerance ?? 0.4;
    }

    /** @inheritDoc */
    public get isEnabled(): boolean {
        return super.isEnabled;
    }
    /**
     * Overridden so the canvas shows the "grab" affordance while reordering is enabled, and reverts to the
     * default cursor when disabled (no mouse event fires while disabled, so this is the reset hook).
     */
    public set isEnabled(value: boolean) {
        super.isEnabled = value;
        this.setCursor(value ? ECursorStyle.Grab : ECursorStyle.Default);
    }

    private setCursor(style: ECursorStyle): void {
        const canvas = this.parentSurface?.getMainCanvas();
        if (canvas) {
            canvas.style.cursor = style;
        }
    }

    /**
     * Converts a canvas mouse point to a fractional category position on the x axis, or undefined when the
     * point is outside the series area.
     */
    private getFractionalCategory(args: ModifierMouseArgs): number | undefined {
        const xAxis = this.parentSurface?.getDefaultXAxis();
        if (!xAxis || !args.mousePoint) {
            return undefined;
        }
        const point = translateFromCanvasToSeriesViewRect(args.mousePoint, this.parentSurface.seriesViewRect);
        if (!point) {
            return undefined;
        }
        return xAxis.getCurrentCoordinateCalculator().getDataValue(point.x);
    }

    /** The nearest category slot (0..K-1) to the pointer, clamped into range */
    private getTargetIndex(fractionalCategory: number): number {
        const lastIndex = this.dataSource.categories.length - 1;
        return Math.max(0, Math.min(lastIndex, Math.round(fractionalCategory)));
    }

    /**
     * Draws (or moves) a full-height dashed line at the drop slot. Coordinates are computed in device pixels
     * from the x coordinate calculator, then converted with translateToNotScaled (i.e. divided by
     * DpiHelper.PIXEL_RATIO) into the not-scaled CSS-pixel space the modifier SVG layer uses, so the line stays
     * aligned with the axes on high-DPI displays.
     */
    private updateDropIndicator(slotIndex: number): void {
        const surface = this.parentSurface;
        if (!surface?.domSvgContainer) {
            return;
        }
        if (!this.dropIndicator) {
            const line = document.createElementNS(SVG_NS, "line");
            line.setAttribute("stroke", "#FFFFFF");
            line.setAttribute("stroke-width", "2");
            line.setAttribute("stroke-dasharray", "4 4");
            line.setAttribute("pointer-events", "none");
            surface.domSvgContainer.appendChild(line);
            this.dropIndicator = line;
        }
        const { height } = surface.seriesViewRect;
        const coordSvgTranslation = surface.getCoordSvgTranslation();
        const xCalc = surface.getDefaultXAxis().getCurrentCoordinateCalculator();
        const x = translateToNotScaled(xCalc.getCoordinate(slotIndex) + coordSvgTranslation.x);
        const y1 = translateToNotScaled(coordSvgTranslation.y);
        const y2 = translateToNotScaled(height + coordSvgTranslation.y);
        this.dropIndicator.setAttribute("x1", String(x));
        this.dropIndicator.setAttribute("x2", String(x));
        this.dropIndicator.setAttribute("y1", String(y1));
        this.dropIndicator.setAttribute("y2", String(y2));
    }

    private removeDropIndicator(): void {
        this.dropIndicator?.remove();
        this.dropIndicator = undefined;
    }

    /** @inheritDoc */
    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        if (!this.checkExecuteConditions(args).isPrimary) {
            return;
        }
        const fractional = this.getFractionalCategory(args);
        if (fractional === undefined) {
            return;
        }
        const nearest = this.getTargetIndex(fractional);
        // Only grab if the pointer actually landed near an axis, so an empty-space drag does nothing.
        if (Math.abs(fractional - nearest) <= this.grabTolerance) {
            this.dragIndex = nearest;
            this.setCursor(ECursorStyle.Grabbing);
            this.updateDropIndicator(nearest);
        }
    }

    /** @inheritDoc */
    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        if (this.dragIndex === undefined) {
            return;
        }
        // Move the drop indicator to the slot under the pointer. No reorder/rebuild happens until mouse-up.
        const fractional = this.getFractionalCategory(args);
        if (fractional !== undefined) {
            this.updateDropIndicator(this.getTargetIndex(fractional));
        }
    }

    /** @inheritDoc */
    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);
        if (this.dragIndex !== undefined) {
            // Reorder once, into the slot nearest the release point (a no-op if it lands back on itself).
            const fractional = this.getFractionalCategory(args);
            if (fractional !== undefined) {
                this.dataSource.moveCategory(this.dragIndex, this.getTargetIndex(fractional));
            }
        }
        this.dragIndex = undefined;
        this.removeDropIndicator();
        // Back to the "can grab" affordance while still enabled.
        this.setCursor(ECursorStyle.Grab);
    }

    /** @inheritDoc */
    public modifierMouseLeave(args: ModifierMouseArgs): void {
        super.modifierMouseLeave(args);
        this.dragIndex = undefined;
        this.removeDropIndicator();
    }

    /** @inheritDoc */
    public onAttach(): void {
        super.onAttach();
        if (this.isEnabled) {
            this.setCursor(ECursorStyle.Grab);
        }
    }

    /** @inheritDoc */
    public onDetach(): void {
        this.dragIndex = undefined;
        this.removeDropIndicator();
        this.setCursor(ECursorStyle.Default);
        super.onDetach();
    }
}
