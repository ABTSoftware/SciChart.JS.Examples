import {
    ChartModifierBase2D,
    IRenderableSeries,
    ModifierMouseArgs,
    DpiHelper,
    translateFromCanvasToSeriesViewRect,
    XyDataSeries,
} from "scichart";

export class PointDragModifier extends ChartModifierBase2D {
    public readonly type = "PointDragModifier";
    private selectedRS: IRenderableSeries;
    private selectedIndex: number = undefined;

    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        if (args.button !== this.executeOn) return;
        const rsList = this.parentSurface.renderableSeries.asArray();

        this.selectedRS = undefined;
        for (const rs of rsList) {
            // selection using renderable series body and hitTest
            if (rs.hitTestProvider) {
                // DpiHelper.PIXEL_RATIO is used for High DPI and Retina screen support and also for the browser scaling
                const hitTestInfo = rs.hitTestProvider.hitTest(
                    args.mousePoint.x,
                    args.mousePoint.y,
                    10 * DpiHelper.PIXEL_RATIO
                );
                if (!hitTestInfo.isEmpty) {
                    if (hitTestInfo.isHit) {
                        this.selectedRS = rs;
                        // if (args.button === EExecuteOn.MouseLeftButton) {
                        //     this.selectedIndex = hitTestInfo.dataSeriesIndex;
                        //     if (hitTestInfo.metadata) {
                        //         hitTestInfo.metadata.isSelected = true;
                        //     }
                        // } else {
                        rs.isSelected = true;
                        // }
                        break;
                    }
                }
            }
        }
        if (!this.selectedRS) {
            for (const rs of this.parentSurface.renderableSeries.asArray()) {
                if (rs.isSelected) {
                    // Use already selected series
                    this.selectedRS = rs;
                    break;
                }
            }
        }
        args.handled = true;
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);

        const currentPoint = translateFromCanvasToSeriesViewRect(
            args.mousePoint,
            this.parentSurface.seriesViewRect,
            false
        );
        if (!currentPoint) return;

        if (!this.selectedRS) return;
        const dataSeries = this.selectedRS.dataSeries as XyDataSeries;
        const ycoordCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        const newY = ycoordCalc.getDataValue(currentPoint.y);
        const xcoordCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const x = xcoordCalc.getDataValue(currentPoint.x);
        const index = Math.min(Math.round(x / dataSeries.getNativeXValues().get(1)), dataSeries.count() - 1);
        dataSeries.update(index, newY);
        // } else {
        //     const dataSeries = this.selectedRS.dataSeries as XyDataSeries;
        //     const coordCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        //     const newY = coordCalc.getDataValue(currentPoint.y);
        //     dataSeries.update(this.selectedIndex, newY);
        // }
    }

    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);

        if (!this.selectedRS) return;

        const dataSeries = this.selectedRS.dataSeries as XyDataSeries;
        if (this.selectedIndex !== undefined) {
            const meta = dataSeries.getMetadataAt(this.selectedIndex);
            if (meta) {
                meta.isSelected = false;
                // updating metadata doesn't force a redraw, so we have to do it manually
                this.parentSurface.invalidateElement();
            }
        }
        if (this.selectedRS.isSelected) this.parentSurface.invalidateElement();
        this.selectedRS.isSelected = false;
        this.selectedIndex = undefined;
        this.selectedRS = undefined;
    }

    public modifierPointerCancel(args: ModifierMouseArgs): void {
        super.modifierPointerCancel(args);

        this.modifierMouseUp(args);
    }
}
