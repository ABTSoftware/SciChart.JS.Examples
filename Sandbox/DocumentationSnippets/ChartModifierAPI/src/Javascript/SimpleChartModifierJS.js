import {ChartModifierBase2D} from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import {EChart2DModifierType} from "scichart/types/ChartModifierType";

export class SimpleChartModifierJs extends ChartModifierBase2D {

    constructor() {
        super();
        this.type = EChart2DModifierType.Custom;
    }

    modifierMouseDown(args) {
        super.modifierMouseDown(args);

        console.log(`MouseDown at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    modifierMouseMove(args) {
        super.modifierMouseMove(args);

        console.log(`MouseMove at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    modifierMouseUp(args) {
        super.modifierMouseUp(args);

        console.log(`MouseUp at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    modifierDoubleClick(args) {
        super.modifierDoubleClick(args);

        console.log(`DoubleClick at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    modifierMouseWheel(args) {
        super.modifierMouseWheel(args);

        console.log(`MouseWheel delta=${args.mouseWheelDelta} at point ${args.mousePoint.x}, ${args.mousePoint.y}`);
    }

    modifierMouseEnter(args) {
        super.modifierMouseEnter(args);

        console.log(`MouseEnter!`);
    }

    modifierMouseLeave(args) {
        super.modifierMouseLeave(args);

        console.log(`MouseLeave!`);
    }
}
