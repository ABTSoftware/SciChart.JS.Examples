import { EExecuteOn, ModifierMouseArgs, RubberBandXyZoomModifier } from "scichart";

// TODO prevent context menu
export class CustomRubberBandModifier extends RubberBandXyZoomModifier {
    public override modifierMouseUp(args: ModifierMouseArgs): void {
        args.nativeEvent.preventDefault();

        if (this.executeCondition.button === EExecuteOn.MouseRightButton && args.button === 2) {
            args.nativeEvent.preventDefault();
        }
        super.modifierMouseUp(args);
    }
}
