import { BasePointMarker, EPointMarkerType, IPointMarkerOptions, TSciChart } from "scichart";


const isTransparentColor = (color: string) =>
    !color || color.toLowerCase() === "transparent" || color.toLowerCase() === "#00000000";
const RELATIVE_SYMBOL_THICKNESS = 0.22;
const MAX_RELATIVE_SYMBOL_THICKNESS = 0.35;

export class PointAndFigurePointMarker extends BasePointMarker {
    public readonly type = EPointMarkerType.Custom;

    constructor(webAssemblyContext: TSciChart, options?: IPointMarkerOptions) {
        super(webAssemblyContext, options);
    }

    public drawSprite(
        context: CanvasRenderingContext2D,
        spriteWidth: number,
        spriteHeight: number,
        stroke: string,
        strokeThickness: number,
        fill: string
    ): void {
        const centerX = context.canvas.width / 2;
        const centerY = context.canvas.height / 2;
        const halfHeight = spriteHeight / 2;
        const halfWidth = spriteWidth / 2;
        const quarterStroke = strokeThickness / 4;
        const transparentFill = isTransparentColor(fill);
        const transparentStroke = isTransparentColor(stroke);
        const minSize = Math.min(spriteWidth, spriteHeight);
        const relativeThickness = Math.max(
            1,
            Math.round(Math.min(minSize * RELATIVE_SYMBOL_THICKNESS, minSize * MAX_RELATIVE_SYMBOL_THICKNESS))
        );

        if (transparentFill && !transparentStroke && strokeThickness > 0) {
            // Stroke channel encodes X.
            const xThickness = strokeThickness;
            const inset = Math.max(quarterStroke, xThickness / 2);
            context.strokeStyle = stroke;
            context.lineWidth = xThickness;
            context.lineCap = "round";

            context.beginPath();
            context.moveTo(centerX - halfWidth + inset, centerY - halfHeight + inset);
            context.lineTo(centerX + halfWidth - inset, centerY + halfHeight - inset);
            context.stroke();

            context.beginPath();
            context.moveTo(centerX + halfWidth - inset, centerY - halfHeight + inset);
            context.lineTo(centerX - halfWidth + inset, centerY + halfHeight - inset);
            context.stroke();
            return;
        }

        if (!transparentFill) {
            // Fill channel encodes O as a ring.
            const radiusOuterX = Math.max(1, spriteWidth / 2 - 1);
            const radiusOuterY = Math.max(1, spriteHeight / 2 - 1);
            const ringThickness = strokeThickness;
            context.fillStyle = fill;
            context.beginPath();
            context.ellipse(centerX, centerY, radiusOuterX, radiusOuterY, 0, 0, Math.PI * 2);
            context.ellipse(
                centerX,
                centerY,
                Math.max(0, radiusOuterX - ringThickness),
                Math.max(0, radiusOuterY - ringThickness),
                0,
                0,
                Math.PI * 2
            );
            context.fill("evenodd");
        }
    }
}
