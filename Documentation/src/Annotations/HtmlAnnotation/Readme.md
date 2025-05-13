# HTML Annotations

Here we will describe how to use the HTML-based annotations feature of SciChart.JS and its advantages.

## Description

### General Annotation Layer Types Overview

A surface of the SciChart.JS chart consists of several layers in DOM tree.
These are a combination of `canvas`, `div`, and `svg` nodes.

The annotations could be dived by the type of a node where they are rendered.

-   Native "Render Context" Annotations - rendered using WebGl and displayed on the canvas layer.
    Some examples are:

    -   [BoxAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#BoxAnnotation.html)
    -   [LineAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#LineAnnotation.html)
    -   [HorizontalLineAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#HorizontalLineAnnotation.html)
    -   [VerticalLineAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#VerticalLineAnnotation.html)
    -   [NativeTextAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#NativeTextAnnotation.html)
    -   [AxisMarkerAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#AxisMarkerAnnotation.html)

-   HTML Annotations - rendered as a `div` element placed within a DOM layer.
    For example:
    -   [CustomHtmlAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#CustomAnnotation.html)
    -   [HtmlTextAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#TextAnnotation.html)
-   SVG Annotations - rendered as an SVG element on one of the SVG layers.
    For example:
    -   [CustomAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#CustomAnnotation.html)
    -   [TextAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#TextAnnotation.html)

We refer to HTML and SVG Annotations as "DOM Annotations" since they share some similar logic and same rendering principles. Thus the common base class is **DomAnnotation**.

**NOTE** There are [isDomAnnotation](https://www.scichart.com/documentation/js/v4/typedoc/classes/annotationbase.html#isdomannotation) and [isSvgAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationbase.html#issvgannotation) properties on an annotation.

So, the significant difference between DOM Annotations and Native Annotations is
is that each DOM Annotation instance is added as a separate node to the DOM-tree

There might be multiple of layers of the same type to allow drawing DOM Annotations above or below the WebGl-drawn chart elements on the canvas.

## CustomHtmlAnnotation

The [CustomHtmlAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#CustomHtmlAnnotation.html) provides a basic functionality of an annotation and renders a `div` element on a chart at a specified position.  
And exposes a reference to this element via **CustomHtmlAnnotation.htmlElement**

The use case for this annotation is rendering an arbitrary HTML content within a chart.
This provides a great flexibility by allowing to apply standard JS APIs to work with the content and styling it with CSS.

So one can use the `htmlElement` reference and append content to it.

Example: **region ExampleA**

```ts
const customHtmlAnnotation = new CustomHtmlAnnotation({
    xCoordinateMode: ECoordinateMode.DataValue,
    yCoordinateMode: ECoordinateMode.DataValue,
    x1: 2,
    y1: 7,
    xCoordShift: 0,
    yCoordShift: 0
});
customHtmlAnnotation.htmlElement.classList.add("styledCustomAnnotation");
customHtmlAnnotation.htmlElement.innerHTML = `
        <label for="colorSelect">Choose a color:</label>
        <select id="colorSelect" name="colorSelect">
            <option value="red" style="background-color: red; color: white;">Red</option>
            <option value="green" style="background-color: green; color: white;">Green</option>
            <option value="blue" style="background-color: blue; color: white;">Blue</option>
            <option value="yellow" style="background-color: yellow; color: black;">Yellow</option>
            <option value="purple" style="background-color: purple; color: white;">Purple</option>
        </select>`;

sciChartSurface.annotations.add(customHtmlAnnotation);
```

where relevant CSS is:

```css
.styledCustomAnnotation {
    pointer-events: all;
    background-color: grey;
    padding: 4px;
}
```

This approach also allows the content to be rendered by UI frameworks.  
For more examples check [TODO reference HTML Annotations Demo]()

## HtmlTextAnnotation

The [HtmlTextAnnotation](https://www.scichart.com/documentation/js/current/webframe.html#HtmlTextAnnotation.html) extends the `CustomHtmlAnnotation` by providing a simple interface for adding textual annotations to a chart.

In form of constructor options:
[IHtmlTextAnnotationOptions](https://www.scichart.com/documentation/js/current/webframe.html#IHtmlTextAnnotationOptions.html)
and instance properties:

-   **HtmlTextAnnotation.text**
-   **HtmlTextAnnotation.textContainerStyle**

Example: **region ExampleB**

```ts
const textAnnotation = new HtmlTextAnnotation({
    xCoordinateMode: ECoordinateMode.DataValue,
    yCoordinateMode: ECoordinateMode.DataValue,
    x1: 4,
    y1: 5,
    x2: 7,
    xCoordShift: 0,
    yCoordShift: 0,
    text: "This annotation has X coordinates bound to data values. Try zooming or panning",
    // style object with CSSStyleDeclaration format. Supports camel-cased property names.
    // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
    textContainerStyle: {
        padding: "4px",
        fontSize: "1.5em",
        color: "white",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        border: "1px dotted black",
        borderRadius: "15px"
    }
});

sciChartSurface.annotations.add(textAnnotation);
```

## Positioning and Sizing

Similar to other annotation types CustomHtmlAnnotation and HtmlTextAnnotation could be positioned via
`x1` and `y1` properties.  
Additionally you can provide optional `x2` and `y2` values to bind the annotation size to specific coordinates.
These annotations also support different coordinate modes defined in ECoordinateMode.
xCoordinateMode, yCoordinateMode

So, for example, with the correct combination of the coordinates, coordinate modes, and CSS styles you can achieve either a static size annotation or make it responsive to visible range (zoom level), or chart size.  
And apply other cool features available in CSS.

## Performance considerations

This API is made to provide better annotations flexibility, simple and familiar setup in browser environment.  
However, depending on a use case you may find the Render Context annotations have a better performance compared to DOM Annotations.  
So consider trying them out first and if you can't achieve the desired result, switch to Dom Annotations.

As an example:
NativeTextAnnotations have a great performance and support features as background, multiline text, rotation, etc...  
But, if you need more advanced features, consider whether the `HtmlTextAnnotation` or `TextAnnotation` (based on SVG) fits better.
