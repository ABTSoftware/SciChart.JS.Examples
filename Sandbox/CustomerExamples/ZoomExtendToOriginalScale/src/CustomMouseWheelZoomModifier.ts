import {
    IMouseWheelZoomModifierOptions,
    MouseWheelZoomModifier
} from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ModifierMouseArgs } from 'scichart/Charting/ChartModifiers/ModifierMouseArgs';
import { easing, TEasingFn } from 'scichart/Core/Animations/EasingFunctions';
import { NumberRange } from 'scichart/Core/NumberRange';

export class CustomMouseWheelZoomModifier extends MouseWheelZoomModifier {
    protected isExtendsRangeSet: boolean = false;

    constructor(options?: IMouseWheelZoomModifierOptions) {
        super(options);
    }

    public modifierMouseWheel(args: ModifierMouseArgs): void {
        console.log('modifierMouseWheel');
        if (!this.isExtendsRangeSet) {
            this.parentSurface.xAxes.asArray().forEach(xAxis => {
                xAxis.zoomExtentsRange = new NumberRange(xAxis.visibleRange.min, xAxis.visibleRange.max);
                console.log('xAxis.zoomExtentsRange', xAxis.zoomExtentsRange.min, xAxis.zoomExtentsRange.max);
            });
            this.isExtendsRangeSet = true;
        }
        super.modifierMouseWheel(args);
    }

    public modifierDoubleClick(args: ModifierMouseArgs) {
        console.log('modifierDoubleClick');
        if (this.isExtendsRangeSet) {
            const animationDuration = 500;
            const easingFunction: TEasingFn = easing.outExpo;
            this.parentSurface.zoomExtentsX(animationDuration, easingFunction);
            this.isExtendsRangeSet = false;
        }
    }
}
