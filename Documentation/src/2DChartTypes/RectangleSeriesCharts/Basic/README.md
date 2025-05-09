# The Rectangle Series Type

Rectangle Series can be created using the FastRectangleRenderableSeries type.

Rectangle Series could be used for displaying

- Gannt chart
- Histogram
- Range bars
- Waterfall chart
- Tree map
- Linear gauges
- Bar chart race

## Properties

- **columnXMode** - This determines how the x values and optional x1 values are interpreted

    - EColumnMode.Mid
    - EColumnMode.Start
    - EColumnMode.MidWidth
    - EColumnMode.StartWidth
    - EColumnMode.StartEnd

- **columnYMode** - This determines how the y values and optional y1 values are interpreted

    - EColumnYMode.TopBottom
    - EColumnYMode.TopHeight
    - EColumnYMode.CenterHeight

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
