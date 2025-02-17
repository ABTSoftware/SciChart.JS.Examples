import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsFeatureDemosChartTitle",
        imagePath: "javascript-chart-title.jpg",
        description:
            "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "JavaScript Chart Title",
                pageTitle: "JavaScript Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent:
                    "# ChartTitle Example - Vanilla JS\n\n## Overview\nThis example demonstrates how to implement and customize chart titles using SciChart.js in a vanilla JavaScript environment. It outlines the process of initializing a SciChartSurface and applying custom styling to chart titles as described in the [Chart Styling - Chart Titles](https://www.scichart.com/documentation/js/current/ChartTitles.html) documentation.\n\n## Technical Implementation\nThe implementation leverages the Builder API with JSON configuration to set up the chart components efficiently. By directly initializing the SciChartSurface via vanilla JavaScript, developers can follow the patterns detailed in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). Performance aspects are optimized using WebGL rendering as covered in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html), while careful management of the canvas and WebGL context is ensured, referencing [WebGL context lost](https://www.scichart.com/questions/js/webgl-context-lost) for additional guidance.\n\n## Features and Capabilities\nThis example highlights several key capabilities: \n\n- **Real-time Data Integration**: Dynamic updates are achieved using event handling, enabling the chart to refresh in real-time as outlined in [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n\n- **Advanced Customization**: Developers can adjust chart titles and other visual elements through direct API calls to meet specific styling requirements, as detailed in the [Chart Styling - Chart Titles](https://www.scichart.com/documentation/js/current/ChartTitles.html) guide.\n\n- **WebGL Rendering Performance**: By utilizing techniques for efficient canvas management and optimizing WebGL contexts, the implementation ensures both high performance and stability.\n\n## Integration and Best Practices\nThe example adheres to best practices for initializing and managing a SciChart surface in a vanilla JavaScript setting. It avoids the complexities of additional frameworks such as React while still providing robust performance optimization strategies. Developers can reference the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) resource for initial setup tips and consult the [Debugging JavaScript and WebAssembly Memory Leaks](https://www.scichart.com/blog/debugging-javascript-webassembly-memory-leaks/) documentation for troubleshooting and optimization strategies. This approach ensures that the chart maintains optimal performance and stability even with continuous data updates and complex customizations.\n",
            },
            react: {
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "React Chart Title",
                pageTitle: "React Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent:
                    "# ChartTitle example in React\n\n## Overview\nThis example demonstrates the integration of SciChart.js into a React application by focusing on dynamic chart title management. The implementation leverages React’s state hooks and effect hooks to initialize, update, and clean up the chart title efficiently, ensuring that the UI reflects real-time changes.\n\n## Technical Implementation\nThe core of the implementation is the use of React state management to control the chart title. Using hooks such as useState and useEffect, the example dynamically updates the title while maintaining optimal performance. For developers looking to get started, the guide on [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) provides a step-by-step explanation for integrating SciChart.js with React. Additionally, the [Chart Styling - Chart Titles](https://www.scichart.com/documentation/js/current/ChartTitles.html) documentation is instrumental in understanding how to apply custom styles and configurations to the chart title.\n\n## Features and Capabilities\nThis example illustrates several advanced features: \n- **Real-time updates:** By harnessing React’s component state, the chart title responds to changes immediately, a concept further explored in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n- **Dynamic customization:** Developers can update the chart title and its styles on the fly, enabling interactive and highly customizable user interfaces.\n- **Efficient resource management:** The example demonstrates how to initialize and clean up resources within React’s lifecycle, ensuring that the application remains performant.\n\n## Integration and Best Practices\nIntegrating SciChart.js with React requires adherence to best practices for component lifecycle management. Utilizing hooks such as useEffect ensures that the chart and its annotations are properly initialized and disposed of, preventing memory leaks. The approach leverages [best practices for React integration](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) and follows advanced techniques discussed in [How to Make Charts in React from Scratch? - SciChart](https://www.scichart.com/blog/how-to-make-charts-in-react/).\n\nFurthermore, performance optimization is achieved by minimizing unnecessary re-renders and employing React refs for direct access to SciChart.js native methods. This method is crucial for complex applications where even minor performance inefficiencies can impact user experience. For an in-depth discussion on state management and data fetching, developers may refer to this [LinkedIn guide on managing state in React](https://www.linkedin.com/posts/shubham-singh-1471001a8_built-in-react-hooks-react-activity-7197339321446584320-bfz-).\n\nThis ChartTitle example in React serves as a robust template for developers seeking to implement dynamic, interactive charts with SciChart.js while following modern React practices.",
            },
            angular: {
                subtitle:
                    "A Chart Title can be placed above, below, or either side of the chart, and be left, center or right aligned.",
                title: "Angular Chart Title",
                pageTitle: "Angular Chart Title",
                metaDescription: "Demonstrates chart title with different position and alignment options",
                markdownContent:
                    "# ChartTitle - Angular\n\n## Overview\nThis example demonstrates the integration of SciChart.js within an Angular application to dynamically manage and update a chart title. It leverages Angular lifecycle management and dependency injection to ensure the chart remains responsive and maintainable.\n\n## Technical Implementation\nThe example utilizes Angular component lifecycle hooks to initialize the chart and update its title in real-time. By integrating SciChart.js through Angular services, developers can harness the benefits of dependency injection, as explained in the [Introduction to services and dependency injection](https://angular.io/guide/architecture-services) documentation. The chart configuration is driven by JSON data, which aligns with the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guidelines. Additionally, Angular’s change detection strategies are employed to manage dynamic updates effectively, drawing insights from the [Adding Realtime Updates | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) resource.\n\n## Features and Capabilities\nThe example showcases several advanced features including real-time updates and dynamic data binding. It makes use of RxJS for handling asynchronous data streams, ensuring the chart title reflects live data changes. This real-time capability is supported by techniques for dynamic data binding as seen in [How to Bind Data Of angular-Charts Dynamically](https://stackoverflow.com/questions/27792091/how-to-bind-data-of-angular-charts-dynamically). The implementation not only updates chart components on the fly but also provides a foundation for further customizations, similar to the capabilities highlighted in the [Advanced JavaScript Chart and Graph Library | SciChart JS](https://www.scichart.com/javascript-chart-features/) documentation.\n\n## Integration and Best Practices\nAdhering to best practices for Angular, the example demonstrates clean integration of third-party libraries with considerations for performance and maintainability. The use of dependency injection ensures that the SciChart.js services are modular and easily testable, while Angular's lifecycle hooks manage real-time updates efficiently. For performance optimization techniques related to real-time rendering and change detection, the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) guide provides valuable insights. Overall, the example serves as a robust starting point for developers looking to integrate advanced charting capabilities within Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
                title: "The SciChart.js documentation contains loads of useful information on how to use our High Performance JavaScript Charts",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "chart-title",
        metaKeywords: "title, text, alignment, multiline, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/FeatureDemos/ChartTitle",
        thumbnailImage: "javascript-chart-title.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const chartTitleExampleInfo = createExampleInfo(metaData);
