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
} from 'scichart';

export class ModifierGroup extends ObservableArray<ChartModifierBase2D> {
    public readonly name = `ModifierGroup${generateGuid()}`;

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

        // TODO move to prop;

        const syncByDataValue = true;
        const originalMouseMoveHandler = modifier.modifierMouseMove;

        const customMouseMoveHandler = function (this: ChartModifierBase2D, args: ModifierMouseArgs) {
            const otherModifiers = getOther(modifier);

            originalMouseMoveHandler.call(modifier, args);
            // console.log('customMouseMoveHandler', this.mousePoint, args.isMaster);
            if (this.mousePoint && args.isMaster) {
                let translatedMousePoint: Point = translateFromCanvasToSeriesViewRect(
                    this.mousePoint,
                    this.parentSurface.seriesViewRect
                );

                if (translatedMousePoint) {
                    const masterXAxis = this.parentSurface.xAxes.get(0);
                    const masterYAxis = this.parentSurface.yAxes.get(0);
                    // TODO get ptoper axis
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
    }

    protected onModifierRemove(modifier: IChartModifierBase) {
        
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
