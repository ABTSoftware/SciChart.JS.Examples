import {
    AxisBase2D,
    ChartModifierBase2D,
    IChartModifierBase,
    ModifierMouseArgs,
    ObservableArray,
    Point,
    SciChartSurface,
    SciChartSurfaceBase,
    generateGuid,
    translateFromCanvasToSeriesViewRect,
    translateFromSeriesViewRectToCanvas,
} from "scichart";

export class ModifierGroup extends ObservableArray<ChartModifierBase2D> {
    public readonly name = `ModifierGroup${generateGuid()}`;
    private boundModifiers = new Map<ChartModifierBase2D, () => void>();

    constructor() {
        super();

        this.onModifierRemove = this.onModifierRemove.bind(this);
        this.onModifierAdd = this.onModifierAdd.bind(this);

        this.collectionChanged.subscribe((args) => {
            args.getOldItems()?.forEach(this.onModifierRemove);
            args.getNewItems()?.forEach(this.onModifierAdd);
        });
    }

    protected getOtherModifiers(modifier: ChartModifierBase2D) {
        return this.asArray().filter((m) => m !== modifier && m.parentSurface !== modifier.parentSurface);
    }

    protected onModifierAdd(modifier: ChartModifierBase2D) {
        // TODO handle modifier detach
        const getOther = (mod: ChartModifierBase2D) => this.getOtherModifiers(mod);

        const syncByDataValue = true;
        const originalMouseMoveHandler = modifier.modifierMouseMove;

        const customMouseMoveHandler = function (this: ChartModifierBase2D, args: ModifierMouseArgs) {
            const otherModifiers = getOther(modifier);

            originalMouseMoveHandler.call(modifier, args);
            if (this.mousePoint && args.isMaster) {
                let translatedMousePoint: Point = translateFromCanvasToSeriesViewRect(
                    this.mousePoint,
                    this.parentSurface.seriesViewRect,
                    true
                );

                if (translatedMousePoint) {
                    const masterXAxis = this.parentSurface.xAxes.get(0);
                    const masterYAxis = this.parentSurface.yAxes.get(0);
                    const xValue = masterXAxis.getCurrentCoordinateCalculator().getDataValue(translatedMousePoint.x);
                    const yValue = masterYAxis.getCurrentCoordinateCalculator().getDataValue(translatedMousePoint.y);

                    // call the same event handler on related modifiers in the group
                    otherModifiers.forEach((relatedModifier) => {
                        const argsCopy = getArgsCopy(
                            args,
                            this.parentSurface,
                            relatedModifier,
                            syncByDataValue,
                            xValue,
                            yValue
                        );
                        relatedModifier.modifierMouseMove(argsCopy);
                    });
                }
            }
        };

        modifier.modifierMouseMove = customMouseMoveHandler.bind(modifier);
        const originalMouseLeaveHandler = modifier.modifierMouseLeave;

        const customMouseLeaveHandler = function (this: ChartModifierBase2D, args: ModifierMouseArgs) {
            const otherModifiers = getOther(modifier);

            originalMouseLeaveHandler.call(modifier, args);
            if (args.isMaster) {
                // call the same event handler on related modifiers in the group
                otherModifiers.forEach((relatedModifier) => {
                    const argsCopy = ModifierMouseArgs.copy(
                        args,
                        undefined,
                        this.parentSurface.seriesViewRect,
                        relatedModifier.parentSurface.seriesViewRect,
                        undefined
                    );
                    relatedModifier.modifierMouseLeave(argsCopy);
                });
            }
        };

        modifier.modifierMouseLeave = customMouseLeaveHandler.bind(modifier);

        const unsubscribe = () => {
            modifier.modifierMouseMove = originalMouseMoveHandler.bind(modifier);
            modifier.modifierMouseLeave = originalMouseLeaveHandler.bind(modifier);
        };

        this.boundModifiers.set(modifier, unsubscribe);
        modifier.parentSurface.addDeletable({ delete: unsubscribe });
    }

    protected onModifierRemove(modifier: ChartModifierBase2D) {
        const unsubscribe = this.boundModifiers.get(modifier);
        unsubscribe();
    }
}

const getArgsCopy = (
    args: ModifierMouseArgs,
    masterSurface: SciChartSurface,
    relatedModifier: ChartModifierBase2D,
    syncByDataValue: boolean,
    xValue: number,
    yValue: number
) => {
    // Copy args
    const masterData = masterSurface.mouseManager.getMasterData(masterSurface, args);

    const argsCopy = ModifierMouseArgs.copy(
        args,
        undefined,
        masterSurface.seriesViewRect,
        relatedModifier.parentSurface.seriesViewRect,
        masterData
    );

    if (syncByDataValue) {
        // Set mousePoint corresponding to X and Y values on the master surface
        const slaveXAxis = relatedModifier.parentSurface.xAxes.get(0);
        const slaveYAxis = relatedModifier.parentSurface.yAxes.get(0);
        const translatedX = slaveXAxis.getCurrentCoordinateCalculator().getCoordinate(xValue);
        const translatedY = slaveYAxis.getCurrentCoordinateCalculator().getCoordinate(yValue);

        const correspondingMousePoint = translateFromSeriesViewRectToCanvas(
            new Point(translatedX, translatedY),
            relatedModifier.parentSurface.seriesViewRect,
            true
        );

        // @ts-ignore
        argsCopy.mousePoint.x = correspondingMousePoint.x;
    }

    return argsCopy;
};
