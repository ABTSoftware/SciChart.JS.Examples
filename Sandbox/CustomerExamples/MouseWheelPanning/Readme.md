# SciChart.js Example - Mouse Wheel Panning and X-Zooming on drag

This example showcases how to use the ChartModifierBase API in SciChart.js to perform the following 
zooming and panning operations. 

1. On Mousewheel, scroll (pan) in the X-direction
2. On Mouse Down/Move/Up zoom in the X-direction only 

For the operation (2) we want to show a rectangle where the user drags but stretch this to fit the viewport in the Y-direction.

## Running the Example

To run the tutorial, open this folder in VSCode, and run the following commands:

> npm install
> npm start 

Then visit https://localhost:8080 in your web browser! 

## How it Works

To add the MouseWheel panning behaviour to the chart, we start off with a MouseWheelZoomModifier, but we override the function modifierMouseWheel.

In here we perform a scroll on the X-Axis using the mouseWheelDelta value:

```javascript
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { EClipMode } from "scichart/Charting/Visuals/Axis/AxisBase2D";

const mouseWheelModifier = new MouseWheelZoomModifier();
mouseWheelModifier.modifierMouseWheel = (args) => {
    const delta = args.mouseWheelDelta * 0.1;
    mouseWheelModifier.parentSurface.xAxes.asArray().forEach(x => {
        x.scroll(delta, EClipMode.None);
    });
};
```
Next, we add a RubberBandXyZoomModifier to the chart, but set the xyDirection property to X-Direction to achieve requirement (2)

```javascript
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
sciChartSurface.chartModifiers.add(new RubberBandXyZoomModifier( { xyDirection: EXyDirection.XDirection }));
```

This results in the following action 

![MouseWheel Panning in SciChart.js](https://www.scichart.com/wp-content/uploads/2021/05/mousewheel-panning.gif)
