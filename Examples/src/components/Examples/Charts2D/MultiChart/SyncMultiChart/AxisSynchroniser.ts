import { NumberRange, AxisBase2D, VisibleRangeChangedArgs, EventHandler } from "scichart";

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

    public publishChange(data: VisibleRangeChangedArgs) {
        this.visibleRange = data.visibleRange;
        this.axes.forEach((a) => (a.visibleRange = this.visibleRange));
        this.visibleRangeChanged.raiseEvent(data);
    }

    public addAxis(axis: AxisBase2D) {
        if (!this.axes.includes(axis)) {
            this.axes.push(axis);
            axis.visibleRange = this.visibleRange;
            axis.visibleRangeChanged.subscribe(this.publishChange);
        }
    }

    public removeAxis(axis: AxisBase2D) {
        const index = this.axes.findIndex((a) => a === axis);
        if (index >= 0) {
            this.axes.splice(index, 1);
            axis.visibleRangeChanged.unsubscribe(this.publishChange);
        }
    }
}
