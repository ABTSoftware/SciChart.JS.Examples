# SciChart.JS Profiler

An internal tool to visualize data collected with PerformanceDebugHelper and MemoryDebugHelper.

## Startup

!!! Prerequisite: make sure the dependency [Addons](../Addons/package.json) package has its dependencies installed.
`cd ../Addons && npm i && cd ../Profiler`

Install dependencies
`npm i`

### Dev Mode

`npm run dev`

### Prod Mode

`npm start`

The service should run at localhost:3000
Then from internal demo (SciChartDemo), you can enable performance debug and click "open profiler" after the measurements.

Notice that some permissions are required to be set in webpack for this to work.

## Adding more marks

Standard marks:

-   Add a new mark type to EPerformanceMarkType in src/utils/performance.ts
-   a pair of mark types that defines an interval should have "Start" and "End" suffixes correspondingly;
-   add them around the desired block of code and pass options (debugLevel, contextId, parentContextId )

In Profiler

-   update switch statement `src/PerformanceMonitor/markRelationships.ts:10` depending on the contextId/parentContextId used with the mark
-   For event marks: add the mark type to one of `src/PerformanceMonitor/markTypeCategories.ts`
-   map the mark type to a color in `src/PerformanceMonitor/PerformanceMarkColors.ts`

---

## What This App Does

The profiler displays performance debug data collected with SciChart's PerformanceDebugHelper in an interactive chart visualization. Key functionality includes:

-   **Performance Mark Visualization**: Displays performance marks as colored segments on a timeline chart
-   **Interactive Mark Details**: Click on any mark to display its name and duration
-   **Surface Grouping**: Automatically groups marks by SciChart surface for organized viewing
-   **Mark Categories**: Organizes marks into hierarchical categories (standard operations, standard events, custom operations, custom events)
-   **Timeline Navigation**: Includes an overview chart for navigating large datasets
-   **Memory Tracking**: Separate charts for data series memory and deletable objects monitoring

## How to Import Data

-   Click the **Import** button in the app bar
-   Drag & Drop the JSON file with collected data Click **Browse File** in the modal header to open the file picker
-   Select a JSON file containing performance data
-   The data will be automatically validated and imported
    Or
-   Paste JSON data directly into the text area
-   Click **Import from Text** to load the data

## Using the Mark Type Selector Tree

The left panel contains a collapsible tree for managing mark type visibility:

### Tree Structure

-   **Root Categories**: Top-level folders organize marks into:
    -   Standard Operation Mark Types
    -   Standard Event Mark Types
    -   Custom Operation Mark Types
    -   Custom Event Mark Types
-   **Subcategories**: Each category contains folders grouping related mark types
-   **Individual Marks**: Leaf nodes represent specific performance mark types

### Tree Controls

**Checkboxes**:

-   Check/uncheck to show/hide marks in the chart
-   Parent checkboxes control all child marks
-   Partially checked state indicates some children are visible

**Eye Icon Buttons**:

-   Hover over a mark type to see the eye icon
-   Click to highlight that mark type in the chart (increases opacity)
-   Click again to return to normal opacity
-   Useful for focusing on specific mark types without hiding others

**Statistics Display**:

-   Click the arrow icon to expand/collapse categories
-   Each node shows the number of mark types within it, the number of series related to the mark types category and total data points (marks) in those series
-   Helps identify which mark types have the most activity
