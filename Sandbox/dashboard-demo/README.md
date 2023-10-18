## Running the Example

Open this folder in terminal and run the following commands:

-   `npm install`
-   `npm run dev`

Then visit https://localhost:8080 in your web browser!

## Features

The demo shows an example of using different SciChart features by creating a dashboard for displaying mocked data. The data has information about network requests to servers over a period of time and contains additional data as an origin location of the request, requested page (URL), which server was requested and request duration.

The example implements the following common features:

-   Visible Range Synchronization
-   Tooltip Modifier synchronization between several charts by X Value
-   Synchronized Data Filtering and Updating
-   Usage with React (lifecycle, API, data update, binding to UI controls, cross chart sync).

The dashboard consists of several charts. Each chart is configured using a component in **SciChart.tsx** file and an appropriate initialization function. Also some of them have other custom UI components which demonstrate 2 approaches of using the chart API and bounding it to the controls:

-   using an object returned by initialization function via _onInit_ callback of SciChart component
-   or using React Context API

Here is more detailed description of features used on the charts:

### Main Chart

Top chart displays a Mountain Series representing number of requests per time period.

It demonstrates _Point Markers with Custom Palette Provider_ and _Data Labels_ which both highlight data points with an average duration being greater than a threshold value set by the slider at the top right corner.

Also there is "Sync X Axis" checkbox, which if checked will synchronize XAxes on first 3 charts as an example of how ChartModifiers could be customized.

Other features used on the chart include:

-   Inner axis
-   Cursor wth a Custom Tooltip
-   Interaction modifiers (Zoom/Pan)
-   Overview Control

### Page statistics chart

The chart shows the same data but grouped by _page_ field in form of **Stacked Columns**. As well there are the interaction modifiers.
It also has a Legend and a checkbox to toggle the **Stacked Collection** to _100% mode_.

### Server load chart

On this chart we display data grouped by _server_ field, and display it as a separate **Renderable Series**.

-   Each series uses style animations on hover and select events.

-   Series could be hidden from the chart by deselecting a checkbox in the chart legend. This will also filter out the corresponding data on other charts.

-   The checkbox toggle "is Grid Layout" changes the view by splitting the chart into a grid of sub-charts each containing a separate series.

-   Interaction modifiers are applied to the chart in both modes.

### Location statistics charts

This chart aggregates number of requests grouped by the origin location.

-   It demonstrates usage of custom Image Labels and ticks generation

-   Columns are using Custom Palette Provider to highlight hovered and selected data points.

-   Clicking on a column filters the data on other charts accordingly to the selected location

-  The Pie Chart displays the same data as the previous chart but as a percentage of aggregated data
