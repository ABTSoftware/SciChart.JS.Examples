# SciChart.js Example - Range Selection on mouse move

This example showcases how to use the ChartModifierBase API in SciChart.js to listen to mouse events. 

## Running the Example

To run the tutorial, open this folder in VSCode, and run the following commands:

> npm install
> npm start 

Then visit https://localhost:8080 in your web browser! 

## What it does

This example adds range-selection behaviour to the chart, by creating a custom ChartModifier

![Range selection in SciChart.js](https://www.scichart.com/wp-content/uploads/2020/10/2020-10-28-19.32.53.gif)

## How it works

The ChartModifier requires that we use TypeScript (JavaScript ES6 may also work) as we need to extend a class: ChartModifierBase2D. 

We extend the class like this:

```typescript
// Create a TypeScript class which inherits ChartModifierbase2D to insert into SciChartSurface.chartModifiers collection
export class RangeSelectionChartModifier extends ChartModifierBase2D {

    private startPoint: Point;
    private endPoint: Point;
    private readonly selectionAnnotation: BoxAnnotation;
    private isSelecting: boolean;

    constructor() {
        super();

        // Create an annotation with YCoordinateMode Relative, and Y1, Y2 = 0,1
        // This stretches the annotation to fit the viewport in the Y-direction
        // Below in modifierMouseMove we will be updating the annotation X-values as the mouse is moved.
        this.selectionAnnotation = new BoxAnnotation({
            yCoordinateMode: ECoordinateMode.Relative,
            y1: 0,
            y2: 1,
            xCoordinateMode: ECoordinateMode.Pixel,
            fill: "#ffffff33",
            strokeThickness: 0
        });
    }

    // Called when mouse-down on the chart
    public modifierMouseDown(args: ModifierMouseArgs): void{
        super.modifierMouseDown(args);
        this.startPoint = args.mousePoint;
        this.endPoint = args.mousePoint;

        this.selectionAnnotation.x1 = this.startPoint.x;
        this.selectionAnnotation.x2 = this.endPoint.x;
        this.isSelecting = true;

        this.parentSurface.annotations.add(this.selectionAnnotation);
    }

    // Called when mouse-move on the chart
    public modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);

        if (this.isSelecting) {
            this.endPoint = args.mousePoint;
            this.selectionAnnotation.x2 = this.endPoint.x;
        }
    }

    // Called when mouse-up on the chart
    public modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);

        this.isSelecting = false;
        this.parentSurface.annotations.remove(this.selectionAnnotation);
    }
}
```

This ChartModifierBase2D derived class has functions modifierMouseDown, modifierMouseMove, modifierMouseUp, which are called when the user mouse down/move/up on the chart. 

We add an Annotation (a BoxAnnotation) onto the parent SciChartSurface on mousedown, and position it as the user moves the mouse

This lets us display a selection rectangle on the chart with mouse move. 

TODO: 

 - You can modify this sample to perform some action on selection
 - Perhaps you want to keep the BoxAnnotation on the chart? In which case do not remove it in modifierMouseUp
 - Perhaps you want to report on the data-values selected? You can use the Coordinate Calculator API in SciChart to convert from pixel to data-coordinates
 
Give us your feedback about what else you want to do with the selection-range example.

