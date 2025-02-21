import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsShowCasesWebsocketBigData",
        imagePath: "javascript-streaming-data.jpg",
        description:
            "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Client/Server Websocket Data Streaming",
                pageTitle: "Client/Server Websocket Data Streaming",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Websocket Big Data Example - Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a high performance real-time chart using SciChart.js integrated with websocket streaming data in a vanilla JavaScript environment. It showcases efficient handling and visualization of massive datasets by employing data buffering and a sliding window pattern to update the chart dynamically.\n\n## Technical Implementation\nThe chart is initialized using the native SciChart.js API via the call to [SciChartSurface.create](https://www.scichart.com/getting-started/scichart-javascript/), which sets up the rendering surface with WebGL acceleration. Data management is handled by appending new data points using methods like appendRange and removing older data using removeRange, thereby implementing a sliding window for continuous updates. For more information on these techniques, refer to the [Append, Insert, Update, Remove](https://www.scichart.com/documentation/js/current/DataSeries_AppendInsertUpdateRemove.html) documentation and the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n## Features and Capabilities\nThe example supports multiple chart series types—including Line, Column, Stacked Mountain, Band, Scatter, and Candlestick charts—that can be dynamically selected. It also implements logarithmic scaling through custom slider components built with Math.log10, as detailed in the [Math.log10() - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10) resource. Real-time data updates are achieved using [socket.io](https://stackoverflow.com/questions/56707417/how-to-import-socket-io-from-client-side-in-vanilla-javascript), which streams data from a backend websocket server. Additionally, performance metrics such as load time and render time are captured using preRender and rendered event subscriptions, enabling calculation of the maximum frames per second (FPS).\n\n## Integration and Best Practices\nBuilt entirely with vanilla JavaScript, this example offers an in-depth look at integrating real-time websocket data with SciChart.js without any additional frameworks. Developers interested in leveraging similar techniques can start with the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. For robust websocket handling—including reconnection strategies and buffer management—practices are illustrated in discussions such as [How to reconnect to websocket after close connection](https://stackoverflow.com/questions/13797262/how-to-reconnect-to-websocket-after-close-connection).\n\nThis example stands as a comprehensive resource for integrating high performance real-time charting with scattered and rapid data updates in a lightweight, framework-free JavaScript environment.",
            },
            react: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Client/Server Websocket Data Streaming",
                pageTitle: "Client/Server Websocket Data Streaming",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Websocket Big Data Demo in React\n\n## Overview\nThis example demonstrates a high-performance real-time charting application using SciChart.js in a React environment. The demo handles massive streaming datasets via a WebSocket connection and dynamically updates charts with millions of data points. It is designed to showcase the capabilities of SciChart.js when integrated as a React component, providing a robust solution for real-time data visualization.\n\n## Technical Implementation\nThe implementation leverages the SciChartReact component from the scichart-react package to create and render the chart. Key parts of the implementation include initializing the chart with custom axes, dynamically updating settings via React state, and handling data streaming from a WebSocket. Chart updates are efficiently managed by invoking methods to append and remove data points on the fly, ensuring that the chart remains responsive. For a deeper understanding of how to integrate SciChartSurface with React, developers can refer to the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) blog post.\n\n## Features and Capabilities\nThe demo implements several advanced features including real-time updates, dynamic series type selection via dropdown controls, and performance monitoring (load times, render times, and maximum FPS calculations). Real-time data streaming is managed through socket.io, where incoming data is batched and processed to update the chart continuously. This efficient handling of large data streams is discussed in detail in the [Client/Server Websocket Data Streaming](https://demo.scichart.com/react/chart-websocket-bigdata-demo) demo and helps illustrate best practices for real-time charting with WebGL rendering.\n\n## Integration and Best Practices\nThe example makes extensive use of React hooks such as useState and useRef to manage state and access imperative chart control methods. Dynamic configuration of the chart is achieved with Material UI sliders that incorporate logarithmic scaling for precise control over parameters like series count and data point limits. This approach follows [best practices for managing real-time chart updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) in React and illustrates how to integrate complex chart control logic seamlessly into a React component. Performance optimization is also a key focus, ensuring that heavy data loads do not hamper the user experience. Developers looking to deepen their understanding of these techniques can consult resources on [performance optimization for large-scale React applications](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).",
            },
            angular: {
                subtitle:
                    "Demonstrates handling realtime big data with different chart types using SciChart.js, High Performance JavaScript Charts",
                title: "Client/Server Websocket Data Streaming",
                pageTitle: "Client/Server Websocket Data Streaming",
                metaDescription:
                    "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
                markdownContent:
                    "# Websocket Big Data Angular Integration\n\n## Overview\nThis example demonstrates a high-performance real-time charting application using SciChart.js within an Angular standalone component. The application streams massive datasets via a WebSocket connection and allows users to dynamically choose different chart types such as line, column, mountain, band, scatter, and candlestick charts using Angular Material controls.\n\n## Technical Implementation\nThe solution leverages Angular’s two-way data binding with ngModel to update chart configurations on the fly. The SciChart chart is implemented using the scichart-angular component, which initializes the chart and exposes control methods to update settings and start/stop data streaming. Events from Angular Material sliders, radio buttons, and buttons are used to modify parameters like series count and point updates, while ChangeDetectorRef is employed to trigger efficient UI refreshes in response to real-time data changes as described in [Angular ChangeDetectorRef](https://angular.dev/api/core/ChangeDetectorRef). Additionally, the WebSocket integration via Socket.IO manages the live data feed, in line with best practices from [WebSockets in Angular: A Comprehensive Guide](https://medium.com/@saranipeiris17/websockets-in-angular-a-comprehensive-guide-e92ca33f5d67).\n\n## Features and Capabilities\nThe application supports real-time data streaming with dynamic updates, enabling the chart to continuously append and remove points to maintain performance while handling millions of data points. Users can adjust parameters such as the number of series, initial points, points per update, and the data sending interval using Angular Material sliders with logarithmic scaling. This precise control mechanism makes use of Angular’s data binding and event handling techniques, echoing the concepts covered in [Angular Two-Way Binding](https://angular.dev/guide/templates/two-way-binding).\n\n## Integration and Best Practices\nThis example exemplifies how to integrate SciChart.js into an Angular environment by combining the power of the scichart-angular component with Angular Material’s robust UI elements. For guidance on setting up projects with SciChart.js, developers can refer to [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) and the [scichart-angular package on Yarn](https://www.npmjs.com/package/scichart-angular). Moreover, insights into optimizing Angular performance and change detection can be found in [Angular Change Detection and Runtime Optimization](https://angular.io/guide/change-detection), which is crucial for maintaining responsiveness in high-frequency data update scenarios.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "chart-websocket-bigdata-demo",
        metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/ShowCases/WebsocketBigData",
        thumbnailImage: "javascript-streaming-data.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const websocketBigDataDemoExampleInfo = createExampleInfo(metaData);
