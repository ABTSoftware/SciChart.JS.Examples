import { ChartModifierBase2D, IChartModifierBaseOptions } from 'scichart/Charting/ChartModifiers/ChartModifierBase2D';
import { ModifierMouseArgs } from 'scichart/Charting/ChartModifiers/ModifierMouseArgs';
import { AxisBase2D } from 'scichart/Charting/Visuals/Axis/AxisBase2D';

export class MouseOverAxisModifier extends ChartModifierBase2D {
    public readonly type = 'MouseOverAnnotationModifier';
    public isHandCursor: boolean;

    constructor(options?: IChartModifierBaseOptions) {
        super(options);
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        const canvas = this.parentSurface.getMainCanvas();

        const x = args.mousePoint.x;
        const y = args.mousePoint.y;

        const isCursorOverXAxes = this.testCursorOverAxes(this.parentSurface.xAxes.asArray(), x, y);
        const isCursorOverYAxes = this.testCursorOverAxes(this.parentSurface.yAxes.asArray(), x, y);

        if (isCursorOverXAxes || isCursorOverYAxes) {
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

    private testCursorOverAxes(axes: AxisBase2D[], x: number, y: number) {
        let isCursorOverAxes = false;
        for (let i = 0; i < axes.length; i++) {
            const axis = axes[i];
            const viewRect = axis.viewRect;
            const isInBounds = viewRect.left <= x && x <= viewRect.right && viewRect.top <= y && y <= viewRect.bottom;
            if (isInBounds) {
                isCursorOverAxes = true;
                break;
            }
        }
        return isCursorOverAxes;
    }
}
