import { SciChartSurface } from 'scichart';
import { BoxAnnotation } from 'scichart/Charting/Visuals/Annotations/BoxAnnotation';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { chartBuilder } from 'scichart/Builder/chartBuilder';
import { EAnnotationType } from 'scichart/Charting/Visuals/Annotations/IAnnotation';
import { EDraggingGripPoint } from 'scichart/Charting/Visuals/Annotations/AnnotationBase';
import { EXyDirection } from 'scichart/types/XyDirection';

export async function annotationAdornersDefaultStyle(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const boxAnnotation = new BoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
        isEditable: true,
        isSelected: true,
    });

    sciChartSurface.annotations.add(boxAnnotation);
}

export async function annotationAdornersDefaultStyleViaBuilderAPI(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        annotations: {
            type: EAnnotationType.RenderContextBoxAnnotation,
            options: {
                x1: 3,
                x2: 7,
                y1: 3,
                y2: 7,
                isEditable: true,
                isSelected: true,
            },
        },
    });
}

export async function annotationAdornersStylingViaOptions(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const boxAnnotation = new BoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
        isEditable: true,
        isSelected: true,
        // add custom styling
        annotationsGripsStroke: 'Blue',
        annotationsGripsFill: 'Black',
        selectionBoxStroke: 'Green',
        annotationsGripsRadius: 10,
        selectionBoxDelta: 30,
        selectionBoxThickness: 9,
    });

    sciChartSurface.annotations.add(boxAnnotation);
}

export async function annotationAdornersStylingViaProperties(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const boxAnnotation = new BoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
    });

    boxAnnotation.isEditable = true;
    boxAnnotation.isSelected = true;

    // add custom styling
    boxAnnotation.annotationsGripsStroke = 'Blue';
    boxAnnotation.annotationsGripsFill = 'Black';
    boxAnnotation.selectionBoxStroke = 'Green';
    boxAnnotation.annotationsGripsRadius = 10;
    boxAnnotation.selectionBoxDelta = 30;
    boxAnnotation.selectionBoxThickness = 10;

    sciChartSurface.annotations.add(boxAnnotation);
}

export async function annotationAdornersStylingViaBuilderAPI(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        annotations: {
            type: EAnnotationType.RenderContextBoxAnnotation,
            options: {
                x1: 3,
                x2: 7,
                y1: 3,
                y2: 7,
                isEditable: true,
                isSelected: true,
                // add custom styling
                annotationsGripsStroke: 'Blue',
                annotationsGripsFill: 'Black',
                selectionBoxStroke: 'Green',
                annotationsGripsRadius: 10,
                selectionBoxDelta: 30,
                selectionBoxThickness: 9,
            },
        },
    });
}

export async function dragPointsCustomization(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const boxAnnotation = new BoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
        isEditable: true,
        isSelected: true,
        // custom drag points
        dragPoints: [EDraggingGripPoint.Body, EDraggingGripPoint.x2y1],
    });

    sciChartSurface.annotations.add(boxAnnotation);
}

export async function dragPointsCustomizationViaBuilderAPI(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        annotations: {
            type: EAnnotationType.RenderContextBoxAnnotation,
            options: {
                x1: 3,
                x2: 7,
                y1: 3,
                y2: 7,
                isEditable: true,
                isSelected: true,
                // custom drag points
                dragPoints: [EDraggingGripPoint.Body, EDraggingGripPoint.x2y1],
            },
        },
    });
}

export async function resizeDirectionCustomization(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const boxAnnotation = new BoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
        isEditable: true,
        isSelected: true,
        // custom resize direction
        resizeDirections: EXyDirection.XDirection,
    });

    sciChartSurface.annotations.add(boxAnnotation);
}

export async function resizeDirectionCustomizationViaBuilderAPI(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        annotations: {
            type: EAnnotationType.RenderContextBoxAnnotation,
            options: {
                x1: 3,
                x2: 7,
                y1: 3,
                y2: 7,
                isEditable: true,
                isSelected: true,
                // custom resize direction
                resizeDirections: EXyDirection.XDirection,
            },
        },
    });
}

export async function adornersSvgCustomization(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // use extended class for creating the annotation
    const boxAnnotation = new CustomBoxAnnotation({
        x1: 3,
        x2: 7,
        y1: 3,
        y2: 7,
        isEditable: true,
        isSelected: true,
    });

    sciChartSurface.annotations.add(boxAnnotation);
}

class CustomBoxAnnotation extends BoxAnnotation {
    getAnnotationGripSvg(x, y) {
        const size = this.annotationsGripsRadius;
        return `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="${
            this.annotationsGripsFill
        }" stroke="${this.annotationsGripsStroke}"/>`;
    }

    svgStringAdornerTemplate(x1, y1, x2, y2) {
        const width = x2 - x1;
        const height = y2 - y1;
        let svg = `<svg xmlns="http://www.w3.org/2000/svg">
        <style type="text/css">
            line { stroke: #474747;  }
        </style>
        <defs>
            <pattern id="grid1" patternUnits="userSpaceOnUse" width="10" height="10">
                <line x1="0" y1="0" x2="10" y2="10" />
            </pattern>
        </defs>
        <rect x="${x1}" y="${y1}" width="${width}" height="${height}" fill="url(#grid1)"/>
        `;

        const grips = this.getAdornerAnnotationBorders(false, true);
        if (this.canDragPoint(EDraggingGripPoint.x1y1)) {
            svg += this.getAnnotationGripSvg(grips.x1, grips.y1);
        }
        if (this.canDragPoint(EDraggingGripPoint.x2y2)) {
            svg += this.getAnnotationGripSvg(grips.x2, grips.y2);
        }
        if (this.canDragPoint(EDraggingGripPoint.x2y1)) {
            svg += this.getAnnotationGripSvg(grips.x2, grips.y1);
        }
        if (this.canDragPoint(EDraggingGripPoint.x1y2)) {
            svg += this.getAnnotationGripSvg(grips.x1, grips.y2);
        }
        svg += '</svg>';
        return svg;
    }
}
