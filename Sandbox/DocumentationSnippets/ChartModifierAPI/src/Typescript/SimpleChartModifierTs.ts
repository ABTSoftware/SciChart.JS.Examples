import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";
import {ModifierMouseArgs} from "scichart/Charting/ChartModifiers/ModifierMouseArgs";

export class SimpleChartModifierTs extends ChartModifierBase2D {
    readonly type: EChart2DModifierType = EChart2DModifierType.Custom;

    override modifierMouseDown(args: ModifierMouseArgs) {
        super.modifierMouseDown(args);

        console.log(`MouseDown at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    override modifierMouseMove(args: ModifierMouseArgs) {
        super.modifierMouseMove(args);

        console.log(`MouseMove at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    override modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);

        console.log(`MouseUp at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    override modifierDoubleClick(args: ModifierMouseArgs) {
        super.modifierDoubleClick(args);

        console.log(`DoubleClick at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    override modifierMouseWheel(args: ModifierMouseArgs) {
        super.modifierMouseWheel(args);

        console.log(`MouseWheel delta=${args.mouseWheelDelta} at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    override modifierMouseEnter(args: ModifierMouseArgs) {
        super.modifierMouseEnter(args);

        console.log(`MouseEnter!`);
    }

    override modifierMouseLeave(args: ModifierMouseArgs) {
        super.modifierMouseLeave(args);

        console.log(`MouseLeave!`);
    }
}
