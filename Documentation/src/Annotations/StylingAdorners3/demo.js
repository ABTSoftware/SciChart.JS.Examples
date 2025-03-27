const {
    BoxAnnotation,
    CustomAnnotation,
    LineAnnotation,
    TextAnnotation,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    SciChartJsNavyTheme,
    EDraggingGripPoint,
} = SciChart;

// #region ExampleA
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
        svg += "</svg>";
        return svg;
    }
}
// #endregion

// or for npm import { SciChartSurface, ... } from "scichart"

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(2, 8) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(2, 8) }));

    // Add the custom box annotation to the chart
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

addAnnotationToChart("scichart-root");
