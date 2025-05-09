# The Rectangle Series Type

Rectangle Series can be created using the [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/fastrectanglerenderableseries.html) type.

Here is simple Rectangle Series made using [XyxyDataSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/xyxydataseries.html):

```javascript 
    const xValues = [0, 6, 10, 17];
    const yValues = [0, 6, 2, 5];
    const x1Values = [5, 9, 15, 25];
    const y1Values = [5, 9, 8, 10];

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        columnXMode: EColumnMode.StartEnd, // x, x1
        columnYMode: EColumnYMode.TopBottom, // y, y1
        fill: "steelblue",
        stroke: "white",
        strokeThickness: 1,
        opacity: 1
    });
```

Rectangle Series could be used for displaying

- Gannt chart
- Histogram
- Range bars
- Waterfall chart
- Tree map
- Linear gauges
- Bar chart race

## Properties

- **columnXMode** ([EColumnMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnmode.html)) - This determines how the x values and optional x1 values are interpreted. 

    - EColumnMode.Mid - each column is centered on its X-value. This means the center of the column aligns directly with the X data point, rather than the left or right edge. This is typically the default and most intuitive way to display columns, as it visually associates each bar with its data value on the axis
    - EColumnMode.Start - each column is drawn so that its left edge aligns exactly with the X data value
    - EColumnMode.MidWidth - each column is centered on its X data value, but the centering takes into account the full width of the column
    - EColumnMode.StartWidth - each column (bar) should be positioned so its left edge aligns with the X data value, and the column's width extends to the right from that point. This means the X value marks the start (left boundary) of the column, and the entire width of the column is drawn to the right of this value
    - EColumnMode.StartEnd - each column’s left and right X positions are explicitly defined by two separate values-the "start" and "end" of the column. Instead of specifying a single X value and a width, you provide both the starting and ending X coordinates for each bar

- **columnYMode** ([EColumnYMode](https://www.scichart.com/documentation/js/v4/typedoc/enums/ecolumnymode.html)) - This determines how the y values and optional y1 values are interpreted. 

    - EColumnYMode.TopBottom - is a mode used to define the vertical positioning of columns (bars) by specifying both the top and bottom Y-values for each column. Instead of providing just a single Y-value (for example, the height or value of the bar), you provide two Y-values: one for the top edge and one for the bottom edge of the column
    - EColumnYMode.TopHeight - is a mode for defining the vertical positioning of columns (bars) where you specify the top Y-value and the height of each column, rather than the top and bottom Y-values
    - EColumnYMode.CenterHeight - is a mode that defines the vertical positioning of columns (bars) by specifying a center Y-value and a height for each column

- **dataPointWidth** - Sets a value used to calculate the width of rectangles in X direction. By default the value is treated as data range, since rectangle series do not tend to be evenly spaced. To specify if the value should be treated as relative, absolute, or based on range use dataPointWidthMode Note that Absolute mode does not work well with autoRange due to circularity between the range calculation and the axis layout.

- **dataPointWidthMode** - Sets the mode which determines how dataPointWidth in X direction is interpreted. Available values are EDataPointWidthMode. Default Relative.

    - EDataPointWidthMode.Range - Interprets Data Point Width as the x data range per column. This is useful if you are plotting sparse columns on a NumericAxis
    - EDataPointWidthMode.Absolute - Interprets Data Point Width as an absolute pixel value
    - EDataPointWidthMode.Relative - Interprets Data Point Width as a relative to the full width which is axis length / number of columns. This assumes that there are no gaps in the data. If you are plotting sparse columns on a NumericAxis, consider Range mode

- **stroke** - A Stroke for lines, outlines and edges of this RenderableSeries. Acceptable values include RGB format e.g. #FF0000, RGBA format e.g. #FF000077`` and RGBA format e.g. rgba(255,0,0,0.5)
- **strokeThickness** - The Stroke Thickness for lines, outlines and edges of this RenderableSeries
- **fill** - The column fill as an HTML color code
- **opacity** - An Opacity factor of the Series that controls its semi-transparency level, where value 1 means the Series is opaque; 0 - transparent.
- **defaultY1** - Sets a common y1 value for all rectangles if y1Values are not provided. Default 0
- **customTextureOptions** - Options that creates a custom texture brush
- **dataLabels** - Options to pass to the DataLabelProvider. Set a style with font and size to enable per-point text for this series. By default y value is dispayed here

    ```javascript
        dataLabels: {
            style: {
                fontSize: 16
            },
            color: "black"
        }
    ```
- **topCornerRadius** - Corner radius for top left and top right corners
- **bottomCornerRadius** - Corner radius for bottom left and bottom right corners
