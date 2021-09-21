import { ChartModifierBase2D, IChartModifierBaseOptions } from 'scichart/Charting/ChartModifiers/ChartModifierBase2D';
import { Point } from 'scichart/Core/Point';
import { ModifierMouseArgs } from 'scichart/Charting/ChartModifiers/ModifierMouseArgs';
import { IRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/IRenderableSeries';
import { AxisBase2D, EClipMode } from 'scichart/Charting/Visuals/Axis/AxisBase2D';
import { CustomAnnotation } from 'scichart/Charting/Visuals/Annotations/CustomAnnotation';
import { DpiHelper } from 'scichart/Charting/Visuals/TextureManager/DpiHelper';

export interface IDragSeriesModifierOptions extends IChartModifierBaseOptions {
    annotations?: CustomAnnotation[];
}

export class DragSeriesModifier extends ChartModifierBase2D {
    public readonly type = 'DragSeriesModifier';
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
                    // The args has X and Y values premultiplied by PIXEL_RATIO
                    // Which is why we need to divide by it
                    const x = args.mousePoint.x / DpiHelper.PIXEL_RATIO;
                    const y = args.mousePoint.y / DpiHelper.PIXEL_RATIO;
                    const isClicked = rsAnnotation.checkIsClickedOnAnnotation(x, y);
                    if (isClicked) {
                        this.selectedRS = rs;
                    }
                }
            }
            // selection using renderable series body and hitTest
            if (rs.hitTestProvider) {
                // Attention!
                // if we add an event listener and use mouseEvent we need to multiply it by DpiHelper.PIXEL_RATIO
                // sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent: MouseEvent) => { ... })
                // For example: rs.hitTestProvider.hitTest(mouseEvent.offsetX * DpiHelper.PIXEL_RATIO, mouseEvent.offsetY * DpiHelper.PIXEL_RATIO)
                // DpiHelper.PIXEL_RATIO is used for High DPI and Retina screen support and also for the browser scaling
                const hitTestInfo = rs.hitTestProvider.hitTest(
                    args.mousePoint.x,
                    args.mousePoint.y,
                    10 * DpiHelper.PIXEL_RATIO
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
