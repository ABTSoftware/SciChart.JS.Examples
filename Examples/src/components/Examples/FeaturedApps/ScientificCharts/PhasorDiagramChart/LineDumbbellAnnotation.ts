import { 
    deleteSafe,
    Guard,
    Rect,
    WebGlRenderContext2D,
    CoordinateCalculatorBase,
    SciChartSurface,
    DpiHelper,
    LineAnnotation, 
    ILineAnnotationOptions
} from "scichart";

import {
    BrushCache,
    createBrushInCache,
    getWebGlBrushFromCache
} from "scichart/Charting/Drawing/BrushCache";
import {
    createPenInCache,
    getWebGlPenFromCache,
    Pen2DCache
} from "scichart/Charting/Drawing/Pen2DCache";

/**
 * Enumeration of possible positions for the circle(s) inside a {@link LineDumbbellAnnotation}
 */
export enum ECirclePosition {
    /**
     * The circle will be at `x2y2`
     */
    End = "End",
    /**
     * The circle will be at `x1y1`
     */
    Start = "Start",
    /**
     * Circles will be at both `x1y1` and `x2y2`
     * Default value
     */
    StartEnd = "StartEnd"
}

/**
 * Options passed to the constructor of a {@link LineDumbbellAnnotation}, used to configure it at instantiation time
 */
export interface ILineDumbbellAnnotationOptions extends ILineAnnotationOptions {
    /**
     * The radius of the circle in pixels
     */
    circleRadius?: number;
    /**
     * The stroke thickness of the circle in pixels
     */
    circleStrokeThickness?: number;
    /**
     * The outline color of the circle as an HTML color string
     * Defaults to the stroke color of the annotation
     */
    circleStroke?: string;
    /**
     * The fill color of the circle as an HTML color string
     * Defaults to the stroke color of the annotation
     */
    circleFill?: string;
    /**
     * Dictates on which side(s) the circle(s) should be.
     * See {@link ECirclePosition} for possible values.
     *
     * Default {@link ECirclePosition.StartEnd} - meaning both ends
     */
    circlePosition?: ECirclePosition;
}

/**
 * @summary The {@link LineDumbbellAnnotation} provides an {@link LineAnnotation} which draws a line with circles at
 * the start and/or end points over the {@link SciChartSurface}
 * @description
 * To add a {@link LineDumbbellAnnotation} to a {@link SciChartSurface}, use the following code:
 * ```ts
 * const sciChartSurface: SciChartSurface;
 * const dumbbelAnnotation = new LineDumbbellAnnotation({
 *   x1: 1, y1: 3, x2: 2, y2: 4,
 *   stroke: "#FF0000",
 *   strokeThickness: 2,
 *   circleRadius: 5,
 *   circleStrokeThickness: 1,
 *   circleStroke: "#000000",
 *   circleFill: "#FF0000",
 *   circlePosition: ECirclePosition.StartEnd
 * });
 * sciChartSurface.annotations.add(dumbbelAnnotation);
 * ```
 * @remarks Uses the fast WebGL/WebAssembly {@link WebGL2RenderingContext} for rendering
 */
export class LineDumbbellAnnotation extends LineAnnotation {
    /**
     * Fill brush for the circles
     */
    protected circleFillBrushCache: BrushCache;
    /**
     * Stroke pen for the circles
     */
    protected circleStrokePenCache: Pen2DCache;

    private circleRadiusProperty: number = 5;
    private circleStrokeThicknessProperty: number = 1;
    private circleStrokeProperty?: string;
    private circleFillProperty?: string;
    private circlePositionProperty: ECirclePosition = ECirclePosition.StartEnd;

    /**
     * Create an instance of a LineDumbbellAnnotation
     * @param options Optional parameters of type {@link ILineDumbbellAnnotationOptions} which configure the annotation upon construction
     */
    constructor(options?: ILineDumbbellAnnotationOptions) {
        super(options);
        this.circleRadiusProperty = options?.circleRadius ?? this.circleRadiusProperty;
        this.circleStrokeThicknessProperty = options?.circleStrokeThickness ?? this.circleStrokeThicknessProperty;
        this.circleStrokeProperty = options?.circleStroke;
        this.circleFillProperty = options?.circleFill;
        this.circlePositionProperty = options?.circlePosition ?? this.circlePositionProperty;
    }

    /**
     * Gets the radius of the circle in pixels
     */
    public get circleRadius(): number {
        return this.circleRadiusProperty;
    }
    /**
     * Sets the radius of the circle in pixels
     */
    public set circleRadius(value: number) {
        this.circleRadiusProperty = value;
        this.notifyPropertyChanged("CIRCLE_RADIUS");
    }

    /**
     * Gets the stroke thickness of the circle in pixels
     */
    public get circleStrokeThickness(): number {
        return this.circleStrokeThicknessProperty;
    }
    /**
     * Sets the stroke thickness of the circle in pixels
     */
    public set circleStrokeThickness(value: number) {
        this.circleStrokeThicknessProperty = value;
        this.notifyPropertyChanged("CIRCLE_STROKE_THICKNESS");
    }

    /**
     * Gets the outline color of the circle
     */
    public get circleStroke(): string {
        return this.circleStrokeProperty ?? this.stroke;
    }
    /**
     * Sets the outline color of the circle
     */
    public set circleStroke(value: string) {
        this.circleStrokeProperty = value;
        this.notifyPropertyChanged("CIRCLE_STROKE");
    }

    /**
     * Gets the fill color of the circle
     */
    public get circleFill(): string {
        return this.circleFillProperty ?? this.stroke;
    }
    /**
     * Sets the fill color of the circle
     */
    public set circleFill(value: string) {
        this.circleFillProperty = value;
        this.notifyPropertyChanged("CIRCLE_FILL");
    }

    /**
     * Gets the position of the circle(s)
     */
    public get circlePosition(): ECirclePosition {
        return this.circlePositionProperty;
    }
    /**
     * Sets the position of the circle(s)
     */
    public set circlePosition(value: ECirclePosition) {
        this.circlePositionProperty = value;
        this.notifyPropertyChanged("CIRCLE_POSITION");
    }

    /** @inheritDoc */
    public onAttach(scs: SciChartSurface) {
        super.onAttach(scs);

        if (!this.circleStrokePenCache) {
            this.circleStrokePenCache = new Pen2DCache(scs.webAssemblyContext2D);
        }
        createPenInCache(this.circleStrokePenCache, this.circleStroke, this.circleStrokeThickness, this.opacity);

        if (!this.circleFillBrushCache) {
            this.circleFillBrushCache = new BrushCache(scs.webAssemblyContext2D);
        }
        createBrushInCache(this.circleFillBrushCache, this.circleFill, this.opacity);
    }

    /** @inheritDoc */
    public delete(): void {
        super.delete();
        this.circleFillBrushCache = deleteSafe(this.circleFillBrushCache);
        this.circleStrokePenCache = deleteSafe(this.circleStrokePenCache);
    }

    /** @inheritDoc */
    public drawWithContext(
        renderContext: WebGlRenderContext2D,
        xCalc: CoordinateCalculatorBase,
        yCalc: CoordinateCalculatorBase,
        seriesViewRect: Rect,
        surfaceViewRect: Rect,
        chartViewRect: Rect
    ): void {
        Guard.notNull(renderContext, "renderContext");
        Guard.notNull(xCalc, "xCalc");
        Guard.notNull(yCalc, "yCalc");

        const { x: borderX1, y: borderY1 } = this.convertPolarToCartesian(
            this.getX1Coordinate(xCalc, yCalc),
            this.getY1Coordinate(xCalc, yCalc)
        );
        const { x: borderX2, y: borderY2 } = this.convertPolarToCartesian(
            this.getX2Coordinate(xCalc, yCalc),
            this.getY2Coordinate(xCalc, yCalc)
        );
        this.setAnnotationBorders(borderX1, borderX2, borderY1, borderY2);

        const clipRect = this.getClippingRect(this.clipping, seriesViewRect, surfaceViewRect, chartViewRect);
        const { x1, x2, y1, y2 } = this.getAnnotationBorders();
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (dx === 0 && dy === 0) {
            return;
        }

        this.drawLine(renderContext, x1, y1, x2, y2, seriesViewRect, surfaceViewRect, chartViewRect);
        const scaledCircleRadius = this.circleRadiusProperty * DpiHelper.PIXEL_RATIO;

        if (this.circlePosition === ECirclePosition.Start || this.circlePosition === ECirclePosition.StartEnd) {
            this.drawCircle(renderContext, x1, y1, scaledCircleRadius, seriesViewRect, clipRect);
        }

        if (this.circlePosition === ECirclePosition.End || this.circlePosition === ECirclePosition.StartEnd) {
            this.drawCircle(renderContext, x2, y2, scaledCircleRadius, seriesViewRect, clipRect);
        }
    }

    private drawLine(
        renderContext: WebGlRenderContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        seriesViewRect: Rect,
        surfaceViewRect: Rect,
        chartViewRect: Rect
    ): void {
        const strokePen =
            this.stroke && this.strokeThickness && this.strokePenCache
                ? getWebGlPenFromCache(this.strokePenCache)
                : undefined;

        if (strokePen) {
            const clipRect = this.getClippingRect(this.clipping, seriesViewRect, surfaceViewRect, chartViewRect);
            renderContext.drawLine(x1, y1, x2, y2, strokePen, seriesViewRect, clipRect);
        }
        this.updateAdornerInner();
    }

    private drawCircle(
        renderContext: WebGlRenderContext2D,
        centerX: number,
        centerY: number,
        radius: number,
        seriesViewRect: Rect,
        clipRect: Rect
    ): void {
        const strokePen = getWebGlPenFromCache(this.circleStrokePenCache);
        const fillBrush = getWebGlBrushFromCache(this.circleFillBrushCache);

        const points: number[] = [];
        const numSegments = 32; // Number of segments to approximate the circle
        for (let i = 0; i < numSegments; i++) {
            const angle = (i / numSegments) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            points.push(x, y);
        }
        // Close the circle
        points.push(points[0], points[1]);

        if (fillBrush) {
            // TODO-andrei - fill
            // renderContext.drawPolygon(points, fillBrush, seriesViewRect, clipRect);
        }
        if (strokePen) {
            renderContext.drawLines(points, strokePen, seriesViewRect, clipRect);
        }
    }

    /** @inheritDoc */
    protected notifyPropertyChanged(propertyName: string): void {
        super.notifyPropertyChanged(propertyName);

        const circlePenRelated = ["CIRCLE_STROKE", "CIRCLE_STROKE_THICKNESS", "OPACITY", "STROKE"];
        if (this.circleStrokePenCache && circlePenRelated.includes(propertyName)) {
            createPenInCache(this.circleStrokePenCache, this.circleStroke, this.circleStrokeThickness, this.opacity);
        }

        const circleBrushRelated = ["CIRCLE_FILL", "OPACITY", "STROKE"];
        if (this.circleFillBrushCache && circleBrushRelated.includes(propertyName)) {
            createBrushInCache(this.circleFillBrushCache, this.circleFill, this.opacity);
        }
    }
}
