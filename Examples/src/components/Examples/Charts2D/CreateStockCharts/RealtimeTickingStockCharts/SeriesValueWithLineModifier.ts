import { HorizontalLineAnnotation, IRenderableSeries } from "scichart";
import { SeriesValueModifier } from "scichart-financial-tools";

export class SeriesValueWithLineModifier extends SeriesValueModifier {
    private readonly linesBySeries = new Map<IRenderableSeries, HorizontalLineAnnotation>();

    override onParentSurfaceLayoutComplete(): void {
        super.onParentSurfaceLayoutComplete();

        // The base modifier removes markers for hidden or excluded series.
        this.linesBySeries.forEach((line, series) => {
            if (!this.annotationsBySeries.has(series)) {
                this.removeLine(series);
            }
        });

        this.annotationsBySeries.forEach((marker, series) => {
            let line = this.linesBySeries.get(series);
            if (!line) {
                line = new HorizontalLineAnnotation({
                    xAxisId: marker.xAxisId,
                    yAxisId: marker.yAxisId,
                    strokeDashArray: [2, 2],
                    strokeThickness: 1,
                    showLabel: false,
                    isHidden: true,
                });
                this.linesBySeries.set(series, line);
                this.parentSurface.annotations.add(line);
            }

            line.isHidden = !marker.isVisible;
            if (marker.isVisible) {
                line.y1 = marker.y1;
                line.stroke = marker.backgroundColor;
                line.opacity = marker.opacity;
            }
        });
    }

    override onDetachSeries(series: IRenderableSeries): void {
        this.removeLine(series);
        super.onDetachSeries(series);
    }

    override resetAllMarkers(): void {
        this.linesBySeries.forEach((line, series) => this.removeLine(series));
        super.resetAllMarkers();
    }

    private removeLine(series: IRenderableSeries): void {
        const line = this.linesBySeries.get(series);
        if (line) {
            this.parentSurface?.annotations.remove(line);
            line.delete();
            this.linesBySeries.delete(series);
        }
    }
}
