import { SciChartSurface, VisibleRangeChangedArgs } from "scichart";

/**
 * A basic solution for synchronizing visible ranges of charts in this example
 * */
export class VisibleRangeSynchronizationManager {
    enabled = true;

    sync(...surfaces: SciChartSurface[]) {
        const [firstSurface, ...otherSurfaces] = surfaces;
        const currentXAxis = firstSurface.xAxes.get(0);
        otherSurfaces.forEach((otherSurface) => {
            const otherXAxis = otherSurface.xAxes.get(0);

            const reflectToSecondary = (data1: VisibleRangeChangedArgs) => {
                if (this.enabled) {
                    otherXAxis.visibleRange = data1.visibleRange;
                }
            };

            // subscribe secondary axis to main axis
            currentXAxis.visibleRangeChanged.subscribe(reflectToSecondary);

            const reflectToMain = () => {
                if (this.enabled) {
                    currentXAxis.visibleRange = otherXAxis.visibleRange;
                }
            };

            // subscribe main axis to secondary axis
            otherXAxis.visibleRangeChanged.subscribe(reflectToMain);

            firstSurface.addDeletable({
                delete: () => {
                    otherXAxis.visibleRangeChanged.unsubscribe(reflectToMain);
                },
            });

            otherSurface.addDeletable({
                delete: () => {
                    currentXAxis.visibleRangeChanged.unsubscribe(reflectToSecondary);
                },
            });
        });
    }
}
