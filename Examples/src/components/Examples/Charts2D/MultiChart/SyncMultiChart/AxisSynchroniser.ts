import {
    NumberRange,
    AxisBase2D,
    VisibleRangeChangedArgs,
    EventHandler,
    CategoryAxis,
    CategoryCoordinateCalculator,
} from "scichart";

/** A helper class for synchronising arbitrary number of axes */
export class AxisSynchroniser {
    public visibleRange: NumberRange;
    private axes: AxisBase2D[] = [];
    public visibleRangeChanged: EventHandler<VisibleRangeChangedArgs> = new EventHandler<VisibleRangeChangedArgs>();

    public constructor(initialRange: NumberRange, axes?: AxisBase2D[]) {
        this.visibleRange = initialRange;
        this.publishChange = this.publishChange.bind(this);
        if (axes) {
            axes.forEach((a) => this.addAxis(a));
        }
    }

    public publishChange(data: VisibleRangeChangedArgs, sourceAxis: AxisBase2D) {
        if (sourceAxis.isCategoryAxis) {
            const cc = sourceAxis.getCurrentCoordinateCalculator() as CategoryCoordinateCalculator;
            const dataVisibleRange = new NumberRange(
                cc.transformIndexToData(data.visibleRange.min),
                cc.transformIndexToData(data.visibleRange.max)
            );
            this.visibleRange = dataVisibleRange;
            if (this.visibleRange.equals(data.visibleRange)) return;
            this.axes
                .filter((a) => a != sourceAxis)
                .forEach((a) => {
                    if (a.isCategoryAxis) {
                        a.visibleRange = this.visibleRange;
                    } else {
                        // Because we are setting a new object, we set the backing property directly to avoid triggering an infinite loop of visibleRangeChanged
                        //@ts-ignore
                        a.visibleRangeProperty = dataVisibleRange;
                        a.clearCoordCalcCache();
                        a.invalidateParentCallback();
                    }
                });
        } else {
            if (this.visibleRange.equals(data.visibleRange)) return;
            this.visibleRange = data.visibleRange;
            this.axes
                .filter((a) => a != sourceAxis)
                .forEach((a) => {
                    if (a.isCategoryAxis) {
                        const cc = a.getCurrentCoordinateCalculator() as CategoryCoordinateCalculator;
                        //@ts-ignore
                        a.visibleRangeProperty = new NumberRange(
                            cc.transformDataToIndex(data.visibleRange.min),
                            cc.transformDataToIndex(data.visibleRange.max)
                        );
                        a.clearCoordCalcCache();
                        a.invalidateParentCallback();
                    } else {
                        a.visibleRange = this.visibleRange;
                    }
                });
        }

        this.visibleRangeChanged.raiseEvent(data);
    }

    public addAxis(axis: AxisBase2D) {
        if (!this.axes.includes(axis)) {
            this.axes.push(axis);
            if (axis.isCategoryAxis) {
                const cc = axis.getCurrentCoordinateCalculator() as CategoryCoordinateCalculator;
                axis.visibleRange = new NumberRange(
                    cc.transformDataToIndex(this.visibleRange.min),
                    cc.transformDataToIndex(this.visibleRange.max)
                );
            } else {
                axis.visibleRange = this.visibleRange;
            }
            axis.visibleRangeChanged.subscribe((data) => this.publishChange(data, axis));
        }
    }

    public removeAxis(axis: AxisBase2D) {
        const index = this.axes.findIndex((a) => a === axis);
        if (index >= 0) {
            this.axes.splice(index, 1);
            axis.visibleRangeChanged.unsubscribe((data) => this.publishChange(data, axis));
        }
    }
}
