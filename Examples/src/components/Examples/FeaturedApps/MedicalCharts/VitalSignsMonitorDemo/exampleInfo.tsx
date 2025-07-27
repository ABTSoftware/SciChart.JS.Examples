import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "VitalSignsMonitorDemo",
        id: "featuredApps_medicalCharts_VitalSignsMonitorDemo",
        imagePath: "javascript-vital-signs-ecg-medical-chart-example.jpg",
        description:
            "Showcases how SciChart.js can be used in a **Medical context**, drawing ECGs with our High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Showcases how SciChart.js can be used in a **Medical context**, drawing ECGs with our High Performance JavaScript Charts",
                title: "JavaScript Vital Signs ECG/EKG Medical Demo",
                pageTitle: "JavaScript Vital Signs ECG/EKG Medical Demo",
                metaDescription:
                    "In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time\n        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood\n        oxygen, volumetric flow and more.",
                markdownContent:
                    "## Vital Signs Monitor Demo in JavaScript\n\n### Overview\nThis example, titled **Vital Signs Monitor Demo**, showcases how to build a high-performance real-time medical chart using SciChart.js with JavaScript. It simulates multiple medical signals including ECG, blood pressure, blood volume, and blood oxygenation, and is optimized for continuous data streaming and efficient updates.\n\n### Technical Implementation\nThe demo initializes a `SciChartSurface` with a hidden shared `CategoryAxis` for cyclic data management, which is essential for using FIFO-sweeping mode. Data is continuously appended to multiple `XyDataSeries` via the `appendRange()` method, ensuring smooth real-time updates. The use of `fifoCapacity` and `fifoSweeping` mode (see [DataSeries Realtime Updates](https://www.scichart.com/documentation/js/current/DataSeries_RealtimeUpdates.html)) allows the series to wrap around once the specified capacity is reached, optimizing performance. Additionally, a recursive `setTimeout` loop simulates real-time data streaming, while a custom `EventHandler` is used to update an information panel with computed metrics. For more detail on real-time updates, refer to [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n\n### Features and Capabilities\n**Real-Time Data Streaming:**\nThe demo employs a `setTimeout` loop to periodically fetch and append data points, demonstrating efficient real-time updating using JavaScript.\n\n**Performance Optimization:**\nBy configuring properties like `fifoCapacity` and `fifoSweeping`, the example highlights how FIFO buffers improve performance and simplify code for ECG style wrap-around charts when handling large volumes of data. For further insights, see the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) guide.\n\n**Axis Configuration and Layout:**\nThe example uses a hidden `CategoryAxis` on the X-axis and multiple `NumericAxis` Y-axes that are vertically stacked with the `RightAlignedOuterVerticallyStackedAxisLayoutStrategy`. This approach simplifies the synchronization of multiple data series. More information is available in the [Vertically Stacked Axis](https://www.scichart.com/documentation/js/current/Axis%20Layout%20-%20Vertically%20Stacked%20Axis.html) documentation.\n\n**Custom Event Handling and Memory Management:**\nCustom event handlers are implemented using the `EventHandler` class to update the UI with the latest metrics. Additionally, `sciChartSurface.addDeletable()` is used to automatically clean up these subscriptions, ensuring optimal resource management during the chart's lifecycle.\n\n### Integration and Best Practices\nEven though this demo is built using JavaScript, the underlying principles and performance optimizations can be applied across various frameworks. It emphasizes best practices for real-time data visualization including efficient data appending, optimized axis configurations, and sustainable memory management. By following these techniques, developers can create responsive, high-performance charting applications using SciChart.js.",
            },
            react: {
                subtitle:
                    "Showcases how SciChart.js can be used in a **Medical context**, drawing ECGs with our High Performance JavaScript Charts",
                title: "React Vital Signs ECG/EKG Medical Demo",
                pageTitle: "React Vital Signs ECG/EKG Medical Demo",
                metaDescription:
                    "In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time\n        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood\n        oxygen, volumetric flow and more.",
                markdownContent:
                    "## Vital Signs Monitor Demo - React Integration\n\n### Overview\nThis example demonstrates a real-time monitoring demo for vital signs such as ECG, blood pressure, blood volume, and blood oxygenation using SciChart.js integrated into a React application. The demo leverages the power of React hooks for state management and component lifecycle, providing a dynamic and interactive user experience.\n\n### Technical Implementation\nThe core of the implementation is based on the `<SciChartReact/>` component from the [scichart-react](https://www.scichart.com/blog/react-charts-with-scichart-js/) library which initializes the chart using a dedicated draw function. This function configures the `SciChartSurface` by setting up axes, renderable series, and data series with FIFO sweeping for continuous real-time updates. The React component makes extensive use of `useRef` and `useState` to manage external chart controls and to subscribe to real-time data updates. The initialization callback subscribes to the data update events and properly starts the real-time data stream. Developers interested in building similar components can refer to [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for further guidance.\n\n### Features and Capabilities\nThe demo showcases several key features including real-time data updates, efficient state management, and high-performance rendering using WebGL acceleration. Dynamic info panels update in sync with the chart data, illustrating how asynchronous data streams are handled natively in the React environment. The use of optimized data series with `fifoCapacity` and `fifoSweeping` mode enabled ensures smooth and continuous chart updates even under high data frequency, similar to the techniques described in [Adding Realtime Updates | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n\n### Integration and Best Practices\nIntegration with React is achieved by employing best practices such as using React hooks for managing state and references to external library controls. The `onInit` callback initializes the chart and starts the live data updates while also returning a cleanup function to stop updates upon component unmounting, thereby preventing potential memory leaks. This approach of handling third-party libraries within React applications is explained in detail in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) and further elaborated in [Creating a React Dashboard with SciChart.js, SciChart-React and DeepSeek](https://www.scichart.com/blog/creating-a-react-dashboard-with-scichart-js-scichart-react-and-deepseek-r1/). Moreover, the example demonstrates how asynchronous data handling and event-driven updates can be neatly integrated with React's component lifecycle, ensuring an efficient, high-performance application.\n",
            },
            angular: {
                subtitle:
                    "Showcases how SciChart.js can be used in a **Medical context**, drawing ECGs with our High Performance JavaScript Charts",
                title: "Angular Vital Signs ECG/EKG Medical Demo",
                pageTitle: "Angular Vital Signs ECG/EKG Medical Demo",
                metaDescription:
                    "In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time\n        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood\n        oxygen, volumetric flow and more.",
                markdownContent:
                    "## Vital Signs Monitor Demo - Angular\n\n### Overview\nThis example demonstrates an Angular implementation of a real-time medical monitoring chart using SciChart.js. The demo visualizes multiple vital signs data channels including ECG, blood pressure, blood volume, and blood oxygenation. By leveraging the `ScichartAngularComponent` provided by [scichart-angular](https://www.npmjs.com/package/scichart-angular), it delivers high-performance chart rendering suitable for demanding real-time applications.\n\n### Technical Implementation\nThe Angular component initializes the `SciChartSurface` using SciChart.js’s API, configuring multiple axes and renderable series to display the various vital signs. Key aspects include the use of Angular lifecycle hooks as detailed in [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks) to manage initialization and cleanup, and dynamic styling through Angular’s [ngStyle](https://ultimatecourses.com/blog/using-ngstyle-in-angular-for-dynamic-styling) to create responsive info panels. Real-time data updates are implemented via a timer-based update mechanism with an event subscription model, ensuring that all data series and their corresponding info displays remain synchronized.\n\n### Features and Capabilities\nThe demo supports **real-time chart updates**, dynamically plotting data from multiple channels with advanced WebGL rendering for smooth, high-frequency refreshes. It manages four separate renderable series, each corresponding to different vital signs, and updates detailed info panels using the [Vertically Stacked Axis](https://www.scichart.com/documentation/js/current/Axis%20Layout%20-%20Vertically%20Stacked%20Axis.html) feature to reflect the latest measurements continuously. The use of dataSeries with `fifoCapacity` and `fifoSweeping` mode enable wrap-around charts, which is common when rendering ECG style applications. This provides an engaging and immediate visualization experience crucial for medical monitoring scenarios.\n\n### Integration and Best Practices\nThe implementation follows Angular best practices; it effectively incorporates Angular dependency injection and lifecycle management to integrate with third-party libraries like SciChart.js. Developers are encouraged to review [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) and [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) for guidance on initial setup. Moreover, by utilizing robust event handling and efficient subscription management—as is further explained in [Performance Optimization Techniques in Angular](https://www.xenonstack.com/blog/performance-optimization-in-angular)—this demo illustrates how Angular applications can integrate third-party tools effectively while maintaining optimal performance in a real-time data environment.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "vital-signs-ecg-medical-chart-example",
        metaKeywords: "ecg, ekg, realtime, medical, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/MedicalCharts/VitalSignsMonitorDemo",
        thumbnailImage: "javascript-vital-signs-ecg-medical-chart-example.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

export const vitalSignsMonitorDemoExampleInfo = createExampleInfo(metaData);
export default vitalSignsMonitorDemoExampleInfo;
