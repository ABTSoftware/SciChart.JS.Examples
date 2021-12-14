import { ChartModifierBase2D, IChartModifierBaseOptions } from 'scichart/Charting/ChartModifiers/ChartModifierBase2D';
import { ModifierMouseArgs } from 'scichart/Charting/ChartModifiers/ModifierMouseArgs';
import { DpiHelper } from 'scichart/Charting/Visuals/TextureManager/DpiHelper';

export class MouseOverAnnotationModifier extends ChartModifierBase2D {
    public readonly type = 'MouseOverAnnotationModifier';
    public isHandCursor: boolean;

    constructor(options?: IChartModifierBaseOptions) {
        super(options);
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        const canvas = this.parentSurface.getMainCanvas();

        const x = args.mousePoint.x / DpiHelper.PIXEL_RATIO;
        const y = args.mousePoint.y / DpiHelper.PIXEL_RATIO;

        let isCursorOverAnnotation = false;
        for (let i = 0; i < this.parentSurface.annotations.size(); i++) {
            const an = this.parentSurface.annotations.get(i);
            if (an.checkIsClickedOnAnnotation(x, y)) {
                isCursorOverAnnotation = true;
                break;
            }
        }

        if (isCursorOverAnnotation) {
            if (!this.isHandCursor) {
                canvas.style.cursor = 'grab';
                this.isHandCursor = true;
            }
        } else {
            if (this.isHandCursor) {
                canvas.style.cursor = 'auto';
                this.isHandCursor = false;
            }
        }
    }
}
