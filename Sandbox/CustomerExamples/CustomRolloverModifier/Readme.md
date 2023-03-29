# SciChart.js Custom Rollover Modifier Demo

This example demonstrates an approach for creating a custom modifier by inheriting an existing one.
Also it shows how to implement an additional logic for handling mouse events and key modifiers to control the modifier's behavior.

Specifically in this example we created `CustomRolloverModifier` derived from the [RolloverModifier](https://www.scichart.com/documentation/js/current/RolloverModifier.html).

The idea is to add a functionality that will allow showing the rollover tooltip on a select trigger event.
The allowed trigger event options are described with the enum:
```typescript
enum EShowTooltipOptions {
    /*
     * Show tooltips when mouse is over a point
     */
    MouseOver = 'MouseOver',

    /*
     * Show tooltips when mouse hovers over the surface
     */
    MouseHover = 'MouseHover',

    /*
     * Always show tooltips
     */
    Always = 'Always',

    /*
     * Show tooltips when mouse left button is pressed
     */
    MouseLeftButtonDown = 'MouseLeftButtonDown',

    /*
     * Show tooltips when mouse right button is pressed
     */
    MouseRightButtonDown = 'MouseRightButtonDown',

    /*
     * Show tooltips when mouse middle button is pressed
     */
    MouseMiddleButtonDown = 'MouseMiddleButtonDown',

    /*
     * Show tooltips when left mouse button is double clicked
     */
    MouseDoubleClick = 'MouseDoubleClick',
}
```

Also we want an ability to combine these triggers with key modifiers defined below:
```typescript
enum EExecuteWhen {
    Always = 'Always',
    Shift = 'Shift',
    Alt = 'Alt',
    Ctrl = 'Ctrl',
    Meta = 'Meta',
}
```

The modifier should have properties to allow switching between these modes, which we added as `showTooltipOn` and `executeWhen`.

To implement the main functionality we added a `enableTooltip` flag and did overrides to the mouse events handling methods.  
In this example we tried to handle different corner cases related to switching between the modes, but the main methods we have to do the overrides to are:
- [modifierMouseDown](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifier.html#modifiermousedown)
- [modifierMouseUp](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifier.html#modifiermouseup)
- [modifierMouseMove](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifier.html#modifiermousemove)
- [modifierDoubleClick](https://www.scichart.com/documentation/js/current/typedoc/classes/rollovermodifier.html#modifierdoubleclick)

## Running the example 

```
npm install
npm start
```
