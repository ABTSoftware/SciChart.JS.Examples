import { SciChartSurface } from "scichart";
import { createPenInCache, getWebGlPenFromCache, Pen2DCache } from "scichart/Charting/Drawing/Pen2DCache";
import { WebGlRenderContext2D } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { CoordinateCalculatorBase } from "scichart/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase";
import { ILineAnnotationOptions, LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { Rect } from "scichart/Core/Rect";

export interface ICappedLineAnnotationOptions extends ILineAnnotationOptions {
    capLength?: number;
}


export class CappedLineAnnotation extends LineAnnotation {

    private capLengthProperty: number = 10;

    protected capStrokePenCache: Pen2DCache;

    constructor(options?: ICappedLineAnnotationOptions) {
        super(options);
        this.capLength = options?.capLength ?? this.capLengthProperty;
    }

    public get capLength(): number {
        return this.capLengthProperty;
    }

    public set capLength(length: number) {
        if (this.capLengthProperty !== length) {
            this.capLengthProperty = length;
            // Use this will cause the chart to redraw if the property is changed
            this.notifyPropertyChanged("Cap Length");
        }
    }

    public onAttach(scs: SciChartSurface) {
        super.onAttach(scs);

        if (!this.capStrokePenCache) {
            this.capStrokePenCache = new Pen2DCache(scs.webAssemblyContext2D);
        }
        // Cap uses same pen as line, but without dashes.  You could create extra properties if you wanted different stroke or thickness for the cap
        createPenInCache(this.capStrokePenCache, this.stroke, this.strokeThickness, this.opacity);
    }

    public drawWithContext(renderContext: WebGlRenderContext2D, xCalc: CoordinateCalculatorBase, yCalc: CoordinateCalculatorBase, viewRect: Rect): void {
        super.drawWithContext(renderContext, xCalc, yCalc, viewRect);
        if (this.capLength > 0) {
            // Get the pen
            const capPen = this.stroke && this.strokeThickness ? getWebGlPenFromCache(this.capStrokePenCache) : undefined;

            // Get the pixel coordinates of the line
            const x1 = this.getX1Coordinate(xCalc, yCalc);
            const x2 = this.getX2Coordinate(xCalc, yCalc);
            const y1 = this.getY1Coordinate(xCalc, yCalc);
            const y2 = this.getY2Coordinate(xCalc, yCalc);

            const lineGradient = (y2-y1) / (x2-x1);
            // Invert the gradient of the line to get the gradient of the cap
            const capAngle = Math.atan(-1 / lineGradient);
            const capXShift = this.capLength / 2 * Math.cos(capAngle);
            const capYShift = this.capLength / 2 * Math.sin(capAngle);

            renderContext.drawLine(x1 - capXShift, y1 - capYShift, x1 + capXShift, y1 + capYShift, capPen, viewRect);
            renderContext.drawLine(x2 - capXShift, y2 - capYShift, x2 + capXShift, y2 + capYShift, capPen, viewRect);
        }
    }
}