import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ChartLegendsAPI",
        id: "chart2D_legends_ChartLegendsAPI",
        imagePath: "javascript-chart-legends.jpg",
        description:
            "Demonstrates how to add a legend to a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to add a legend to a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Legends API",
                pageTitle: "Chart Legends API",
                metaDescription:
                    "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add a LegendModifier type to the sciChartSurface.chartModifiers collection.",
                markdownContent:
                    "## Chart Legends API Example (JavaScript)\n\n### Overview\nThis example demonstrates how to integrate an interactive legend into a high performance 2D chart using SciChart.js in a JavaScript environment. The example sets up a `SciChartSurface` with numeric axes, multiple line series, and a dynamic legend that can be customized through properties like placement, orientation, checkboxes, and series markers. Developers can get started with this approach by exploring the [LegendModifier Documentation](https://www.scichart.com/documentation/js/current/LegendModifier.html) documentation.\n\n### Technical Implementation\nThe chart is initialized by calling `SciChartSurface.create()`, which returns a WebAssembly context (`wasmContext`) used to optimize rendering performance. Numeric axes are configured using the `NumericAxis` class with custom label formatting and precision. Multiple `FastLineRenderableSeries` are added each using an `XyDataSeries`. `dataSeriesName` is set which is passed through to the legend. The dynamic legend is created by instantiating a `LegendModifier` and adding to `sciChartSurface.chartModifiers` collection with configurable properties such as placement (using `ELegendPlacement`) and orientation (using `ELegendOrientation`), enabling advanced legend customization as detailed in the [Legend Modifier docs](https://www.scichart.com/documentation/js/current/LegendModifier.html).\n\n### Features and Capabilities\nThis example highlights several advanced features including the ability to dynamically update legend properties such as visibility, checkbox display, and series markers. Additionally, the configuration of chart theming through `appTheme` indicates how developers can maintain consistent styling across the chart, as described in the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) guide.\n\n### Integration and Best Practices\nAlthough this example is implemented using JavaScript, it follows best practices by encapsulating chart creation logic within a dedicated function and leveraging modular design for setting up axes, series, and modifiers. The integration of WebAssembly to enhance rendering performance is a key strategy for efficient real-time data visualization, as explained in [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html). Developers are encouraged to explore these techniques to build responsive and high performance chart applications.",
            },
            react: {
                subtitle:
                    "Demonstrates how to add a legend to a **React Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Legends API",
                pageTitle: "Chart Legends API",
                metaDescription:
                    "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add a LegendModifier type to the sciChartSurface.chartModifiers collection.",
                markdownContent:
                    "## Chart Legends API - React\n\n### Overview\nThis example demonstrates how to integrate a dynamic legend into a SciChart.js chart within a React application. The example creates multiple line series and attaches a customizable legend using the SciChart.js `LegendModifier`, enabling interactive control over the legend's visibility, placement, and orientation.\n\n### Technical Implementation\nThe chart is initialized in a dedicated function that uses `SciChartSurface.create()` along with react components from the `<SciChartReact/>` package. The created chart contains several renderable series, each provided with its own data series, and the legend is configured by adding a `LegendModifier` to the `sciChartSurface.chartModifiers` collection. Key to this implementation is the setting of `XyDataSeries.dataSeriesName` which allows the legend to identify the series, as well as the `LegendModifier` properties such as `placement`, `orientation` and `showCheckboxes`, `showSeriesMarkers` which help configure the placement and behaviour of the legend.\n\n### Features and Capabilities\nThe example highlights several advanced features including real-time update capabilities for the legend through dynamic state management. Users can toggle the legend's visibility, enable or disable checkboxes, and alter both the placement and orientation of the legend on the chart. This dynamic interactivity leverages React’s state and event handling mechanisms to update the SciChart.js `LegendModifier` seamlessly. More details can be found in the [Legend Modifier Documentation](https://www.scichart.com/documentation/js/current/LegendModifier.html).\n\n### Integration and Best Practices\nThe implementation follows best practices for integrating third-party WebGL charts into React by utilizing the `<SciChartReact/>` component to manage chart lifecycles and performance. By using React refs and state, the application efficiently synchronizes user interactions with the underlying chart, ensuring optimal performance and responsiveness. This approach not only streamlines the dynamic update of the chart’s legend but also facilitates a clear separation between the chart logic and the React component UI, an important principle in modern React development.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to add a legend to a **Angular Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Legends API",
                pageTitle: "Chart Legends API",
                metaDescription:
                    "Demonstrates how to add a Legends to a JavaScript Line Chart using SciChart.js. The legend is created when you add a LegendModifier type to the sciChartSurface.chartModifiers collection.",
                markdownContent:
                    "## Chart Legends API for Angular\n\n### Overview\nThis example demonstrates how to seamlessly integrate SciChart.js's `LegendModifier` within an Angular application. The sample sets up a `SciChartSurface` with numeric axes and multiple line series, then dynamically adds an interactive legend to the chart. Developers can leverage Angular's data binding and event handling to toggle legend visibility, checkboxes, and series markers. For a detailed overview of the legend functionality, refer to the [Legend Modifier Documentation](https://www.scichart.com/documentation/js/current/LegendModifier.html).\n\n### Technical Implementation\nIn this example, the chart is initialized by creating a `SciChartSurface` and adding numeric axes along with several line series that represent Fourier series data. The integration focuses on adding a `LegendModifier` to the `sciChartSurface.chartModifiers` collection to handle dynamic updating of legend properties such as placement and orientation. Key to this implementation is setting `XyDataSeries.dataSeriesName` which allows the legend to identify the series, and setting of properties such as `LegendModifier.placement`, `orientation` and `showCheckboxes`, `showSeriesMarkers` to configure the legend appearance and behaviour. Angular’s event binding techniques are used to capture user interactions and update the chart dynamically.\n\n### Features and Capabilities\nThe example highlights several advanced features including **real-time updates** of legend properties. Users can modify the legend placement via `ELegendPlacement` (`TopLeft`, `TopRight`, `BottomLeft`, `BottomRight`) and `ELegendOrientation` (`Vertical`, `Horizontal`) dynamically. Additional interactive controls allow the toggling of series markers and checkboxes within the legend. This flexibility enables developers to create highly customizable and interactive charting experiences.\n\n### Integration and Best Practices\nEfficient integration of SciChart.js with Angular is achieved by leveraging Angular’s robust event handling and lifecycle management. Initializing the `SciChartSurface` using the `ScichartAngularComponent`, a part of the open source [scichart-angular](https://www.npmjs.com/package/scichart-angular) package ensures optimal performance, while using Angular reactive techniques helps in the dynamic update of legend properties without negatively impacting the application’s responsiveness.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/LegendModifier.html",
                title: "The specific page for the SciChart.js Legends documentation will help you to get started",
                linkTitle: "Legend API Documentation",
            },
        ],
        path: "chart-legends",
        metaKeywords: "legend, api, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Legends/ChartLegendsAPI",
        thumbnailImage: "javascript-chart-legends.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const chartLegendsAPIExampleInfo = createExampleInfo(metaData);
export default chartLegendsAPIExampleInfo;
