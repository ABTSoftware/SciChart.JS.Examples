const {
    AxisMarkerAnnotation,
    NumericAxis,
    SciChartSurface,
    SciChartJsNavyTheme,
    AnnotationDragDeltaEventArgs,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    Point,
} = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

// #region ExampleA
class DiscreteAxisMarker extends AxisMarkerAnnotation {
    stepSize = 1;
    minValue = 0;
    maxValue = 10;

    constructor(options) {
        super(options);
    }

    onDragAdorner(args) {
        super.onDragAdorner(args);
        const xyValues = this.getValuesFromCoordinates(args.mousePoint, true);
        if (xyValues) {
            let { x, y } = xyValues;
            if (this.x1 !== undefined) {
                x = Math.floor(x / this.stepSize) * this.stepSize;
            } else if (this.y1 !== undefined) {
                y = Math.floor(y / this.stepSize) * this.stepSize;
            }
            this.calcDragDistance(new Point(x, y));
            if (this.x1 !== undefined) {
                this.x1 = Math.min(Math.max(this.x1, this.minValue), this.maxValue);
            } else if (this.y1 !== undefined) {
                this.y1 = Math.min(Math.max(this.y1, this.minValue), this.maxValue);
            }
        }
        this.dragDelta.raiseEvent(new AnnotationDragDeltaEventArgs());
    }
}

// Now add to the SciChartSurface
// sciChartSurface.annotations.add(new DiscreteAxisMarker({ y1: 5, formattedValue: "Drag Me!" }));
// #endregion

async function addAnnotationToChart(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    sciChartSurface.annotations.add(
        new DiscreteAxisMarker({
            isEditable: true,
            y1: 5,
            formattedValue: "Drag Me!",
        })
    );

    const addChartTitle = (sciChartSurface, titleText, subTitleText) => {
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: titleText,
                x1: 0.5,
                y1: 0.5,
                yCoordShift: -50,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                opacity: 0.5,
                fontSize: 32,
                fontWeight: "Bold",
                textColor: "White",
            })
        );
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: subTitleText,
                x1: 0.5,
                y1: 0.5,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                opacity: 0.4,
                fontSize: 17,
                textColor: "White",
            })
        );
    };

    addChartTitle(
        sciChartSurface,
        "Discrete Draggable Annotations",
        "Drag the axis marker annotation to see the value update"
    );
}

addAnnotationToChart("scichart-root");
