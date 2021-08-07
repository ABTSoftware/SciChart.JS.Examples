import { ChartModifierBase2D, IChartModifierBaseOptions } from 'scichart/Charting/ChartModifiers/ChartModifierBase2D';
import { Point } from 'scichart/Core/Point';
import { ModifierMouseArgs } from 'scichart/Charting/ChartModifiers/ModifierMouseArgs';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { ENearestPointLogic } from 'scichart/Charting/Visuals/RenderableSeries/HitTest/IHitTestProvider';
import { AxisBase2D, EClipMode } from 'scichart/Charting/Visuals/Axis/AxisBase2D';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';

export interface IDragSeriesModifierOptions extends IChartModifierBaseOptions {
    annotations?: CustomAnnotation[];
}

export class DragSeriesModifier extends ChartModifierBase2D {
    private lastPoint: Point;
    private selectedRS: IRenderableSeries;
    private markerAnnotations: CustomAnnotation[];

    constructor(options?: IDragSeriesModifierOptions) {
        super(options);
        this.markerAnnotations = options?.annotations ?? this.markerAnnotations;
    }

    public modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);

        if (this.executeOn !== args.button) {
            return;
        }

        const rsList = this.parentSurface.renderableSeries.asArray();

        this.selectedRS = undefined;
        rsList.forEach((rs, index) => {
            // selection using axis markers
            if (this.markerAnnotations) {
                const rsAnnotation = this.markerAnnotations[index];
                if (rsAnnotation) {
                    const isClicked = rsAnnotation.checkIsClickedOnAnnotation(args.mousePoint.x, args.mousePoint.y);
                    if (isClicked) {
                        this.selectedRS = rs;
                    }
                }
            }
            // selection using renderable series body and hitTest
            if (rs.hitTestProvider) {
                const hitTestInfo = rs.hitTestProvider.hitTest(
                    args.mousePoint,
                    ENearestPointLogic.NearestHorizontalPoint,
                    10,
                    true
                );
                if (!hitTestInfo.isEmpty) {
                    if (hitTestInfo.isHit) {
                        this.selectedRS = rs;
                    }
                }
            }
        });

        console.log('Selected series', this.selectedRS?.dataSeries?.dataSeriesName);

        args.handled = true;
        this.lastPoint = args.mousePoint;
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);

        if (!this.selectedRS) return;

        const currentPoint = args.mousePoint;
        const xDelta = currentPoint.x - this.lastPoint.x;
        const yDelta = this.lastPoint.y - currentPoint.y;

        const xAxis = this.selectedRS.xAxis as AxisBase2D;
        const yAxis = this.selectedRS.yAxis as AxisBase2D;

        const deltaX = xAxis.isHorizontalAxis ? xDelta : -yDelta;
        xAxis.scroll(xAxis.flippedCoordinates ? -deltaX : deltaX, EClipMode.None);

        const deltaY = yAxis.isHorizontalAxis ? -xDelta : yDelta;
        yAxis.scroll(yAxis.flippedCoordinates ? -deltaY : deltaY, EClipMode.None);

        this.lastPoint = currentPoint;
    }

    public modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);

        this.lastPoint = undefined;
        this.selectedRS = undefined;
    }

    public modifierPointerCancel(args: ModifierMouseArgs): void {
        super.modifierPointerCancel(args);

        this.lastPoint = undefined;
        this.selectedRS = undefined;
    }
}
