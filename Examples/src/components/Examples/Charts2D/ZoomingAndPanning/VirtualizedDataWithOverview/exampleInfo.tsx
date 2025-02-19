import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DZoomingAndPanningVirtualizedDataWithOverview",
        imagePath: "virtualized-data-javascript-chart.jpg",
        description:
            "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
                title: "Virtualized JavaScript Charts: Load Data on Zoom/Pan",
                pageTitle: "Virtualized JavaScript Charts: Load Data on Zoom/Pan",
                metaDescription:
                    "shows how to load data on zoom/pan and how to create an overview chart for this case.",
                markdownContent:
                    "# Virtualized Data With Overview and Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to build a high-performance chart using SciChart.js with a virtualized data approach in vanilla JavaScript. The implementation includes a main chart that dynamically loads data based on the visible range and an overview chart that provides context for the current view.\n\n## Technical Implementation\nThe chart is initialized via the SciChartSurface.create() method, where numeric axes with defined visible ranges are configured. Large datasets are efficiently managed using XyDataSeries and rendered with FastLineRenderableSeries. Data is fetched from REST endpoints using the fetch API, and the number of loaded data points is adjusted based on the chart's DOM canvas width, thus optimizing performance as described in the [JavaScript Chart with Virtualized Data 10 Million Points](https://www.scichart.com/example/javascript-chart/javascript-chart-with-virtualized-data/) example. Visible range updates are handled by subscribing to changes on the x-axis and debouncing these events using RxJS’s debounceTime operator, ensuring that data updates occur smoothly. For more insight on debouncing, refer to [Debounce With Vanilla JavaScript or RxJS](https://medium.com/better-programming/debounce-with-vanilla-javascript-or-rxjs-70f29c58ca80).\n\n## Features and Capabilities\nThe example offers real-time update capabilities through dynamic data fetching whenever the user pans or zooms the chart. Smooth animated transitions are achieved using easing functions (e.g., easing.outExpo) for axis updates. In addition, error handling is managed by displaying an error message on the chart using NativeTextAnnotation when data fetching fails; further details can be found in the [NativeTextAnnotation documentation](https://www.scichart.com/documentation/js/current/NativeTextAnnotation.html).\n\n## Integration and Best Practices\nEven though this example is built using vanilla JavaScript, it integrates interactive features such as zooming and panning through modifiers like ZoomExtentsModifier, ZoomPanModifier, XAxisDragModifier, and YAxisDragModifier. This aligns with best practices for creating responsive and interactive charts. Developers are encouraged to review the [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) and [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/ZoomExtentsModifier.html) documentation to fully leverage these features. Performance optimization techniques, as discussed in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) guide, further enhance the chart’s responsiveness when dealing with large datasets.\n\nOverall, this example showcases an effective approach to rendering large datasets with virtualized data, real-time updates, and robust interactivity, providing a strong foundation for building advanced visualizations with SciChart.js in a vanilla JavaScript environment.",
            },
            react: {
                subtitle:
                    "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
                title: "Virtualized React Charts: Load Data on Zoom/Pan",
                pageTitle: "Virtualized React Charts: Load Data on Zoom/Pan",
                metaDescription:
                    "shows how to load data on zoom/pan and how to create an overview chart for this case.",
                markdownContent:
                    "# Virtualized Data With Overview - React\n\n## Overview\nThis example demonstrates a high performance, virtualized charting solution implemented with React and SciChart.js. The application dynamically loads a subset of data based on the current zoom and pan state of the main chart while concurrently displaying an overview chart that represents the entire dataset to provide context.\n\n## Technical Implementation\nThe implementation utilizes the SciChartReact component within a functional React component using hooks. The main chart initializes with a numeric x-axis and y-axis, and uses a [FastLineRenderableSeries](https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html) to render data fetched asynchronously via the fetch API. To optimize performance and avoid unnecessary data requests, RxJS's [debounceTime](https://medium.com/@sushilm2011/debouncing-events-like-a-pro-mastering-the-debouncetime-operator-in-rxjs-f41d2da6d848) operator is used to throttle updates triggered by visible range changes. The overview chart is created manually using SciChartOverview with its own data series, highlighting a master-detail chart synchronization pattern.\n\n## Features and Capabilities\nThis solution delivers real-time updates through efficient asynchronous data loading and utilizes advanced interaction modifiers such as zoom, pan, and drag for an engaging user experience. The overview chart efficiently represents the full data range, while the main chart focuses on a detailed view with optimized data rendering. Developers can further explore robust [React chart integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) and techniques for [virtualized data rendering](https://www.scichart.com/example/javascript-chart/javascript-chart-with-virtualized-data/) for handling high data rates.\n\n## Integration and Best Practices\nThe example leverages React hooks for state management and lifecycle handling to ensure charts are only rendered after full initialization. It follows best practices for asynchronous data fetching, handling errors with user notifications directly on the chart. The responsive layout is achieved using Flexbox, enabling dynamic resizing of the chart components as described in [responsive UI design with ReactJS and Flexbox](https://medium.com/@getaprogrammer7/building-responsive-user-interfaces-with-reactjs-and-flexbox-5c6ede42c98e). Techniques for asynchronous data management are further demonstrated and can be cross-referenced with [asynchronous data fetching in React](https://www.geeksforgeeks.org/how-to-fetch-data-from-apis-using-asynchronous-await-in-reactjs/).",
            },
            angular: {
                subtitle:
                    "Whenever the visible range changes, the chart requests data from the server, which returns a reduced view of the dataset, in this case using a very simple `take every nth point` method. The overview is created manually because it does not share data with the main chart but has a reduced view of the entire dataset.",
                title: "Virtualized Angular Charts: Load Data on Zoom/Pan",
                pageTitle: "Virtualized Angular Charts: Load Data on Zoom/Pan",
                metaDescription:
                    "shows how to load data on zoom/pan and how to create an overview chart for this case.",
                markdownContent:
                    "# Virtualized Data With Overview - Angular\n\n## Overview\nThis example demonstrates a high performance, virtualized data visualization solution using Angular and SciChart.js. It dynamically loads a reduced subset of data based on the current zoom and pan state while providing an overview chart that displays a condensed view of the full dataset for contextual insight.\n\n## Technical Implementation\nThe main chart is created by initializing a SciChartSurface with numeric axes and a fast line renderable series. Data is fetched asynchronously via the fetch API from a server endpoint and loaded into the chart using a custom function. To enhance performance, RxJS’s [debounceTime](https://dev.to/mana95/how-to-use-rxjs-debounce-time-with-angular-4aj5) operator is used to throttle visible range change events from the x-axis, ensuring that expensive data requests occur only after interactions have settled. Interaction modifiers such as **ZoomExtentsModifier**, **XAxisDragModifier**, **YAxisDragModifier**, **ZoomPanModifier**, and **MouseWheelZoomModifier** provide intuitive chart navigation, as outlined in the [SciChart.js documentation](https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html).\n\n## Features and Capabilities\nThis solution supports real-time updates by asynchronously loading only the necessary portion of data when the visible range changes. The independent overview chart, created using [SciChartOverview](https://www.scichart.com/documentation/js/current/SciChartOverview.html), offers a reduced view of the entire dataset, enabling users to quickly navigate large data sets. The virtualized data rendering approach ensures that performance remains optimal even when dealing with extensive datasets, a strategy supported by techniques demonstrated in resources like the [Angular Charts Panning and Zooming example](https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo/Charts/ZoomingAndScrolling/).\n\n## Integration and Best Practices\nThe implementation leverages Angular’s component lifecycle by initializing the main chart before setting up the overview chart, ensuring that dependent chart components are rendered only after the necessary data and configurations are in place. This method aligns with Angular's best practices for lifecycle management, as described in the [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks) documentation. Additionally, performance optimization through RxJS and asynchronous data handling is crucial for maintaining responsiveness, making the example a solid reference for integrating high performance SciChart.js components in Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "chart-with-virtualized-data",
        metaKeywords: "zoom, pan, virtualize, server, overview, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview",
        thumbnailImage: "virtualized-data-javascript-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {
            rxjs: "^7.5.6",
        },
    };
//// End of computer generated metadata

export const virtualizedDataOverviewExampleInfo = createExampleInfo(metaData);
