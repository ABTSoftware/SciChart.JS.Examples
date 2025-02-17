import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsFeatureDemosAxisTypes",
        imagePath: "javascript-axis-types.jpg",
        description:
            "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "# AxisTypes Example - React\n\n## Overview\nThis example demonstrates the integration of SciChart.js within a React application. The **AxisTypes** example showcases various axis types along with dynamic customization and real-time updates, providing a clear illustration of how to build high-performance charts with React.\n\n## Technical Implementation\nThe implementation leverages SciChart.js using a JSON-based configuration to define chart behavior dynamically. React lifecycle methods and hooks, particularly **useEffect**, are employed to initialize the SciChart Surface, update it with new data, and clean up resources upon component unmount. This approach follows [best practices for managing SciChart.js components with useEffect in React](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) and aligns with insights on [React component cleanup](https://stackoverflow.com/questions/55020041/react-hooks-useeffect-cleanup-for-only-componentwillunmount).\n\nThe Builder API seamlessly translates JSON configurations into specific chart settings, allowing developers to easily modify chart properties and behaviors at runtime. For advanced integration patterns, consider reviewing [Creating a React Dashboard with SciChart.js, SciChart-React and Deepseek](https://www.scichart.com/blog/creating-a-react-dashboard-with-scichart-js-scichart-react-and-deepseek-r1/).\n\n## Features and Capabilities\nThe **AxisTypes** example includes several key capabilities:\n- **Real-time Updates:** Leveraging React state management alongside SciChart.js enables dynamic chart updates, as described in the [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html) documentation.\n- **Advanced Customizations:** The example allows comprehensive customization of axis types, empowering developers to implement features like custom tooltips, zoom, and more. Additional insights are provided in [How to Make Charts in React from Scratch? - SciChart](https://www.scichart.com/blog/how-to-make-charts-in-react/).\n- **Performance Optimizations:** By utilizing WebGL rendering and efficient data processing methods, the implementation maintains high performance even with dynamic data. More information on performance strategies can be found in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n## Integration and Best Practices\nThe example showcases several best practices for integrating SciChart.js with React:\n- **React Lifecycle Integration:** The initialization and teardown of the SciChart Surface are tightly coupled with React lifecycle events. Learn more from [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n- **React Hooks Usage:** Proper use of React hooks like **useEffect** ensures that resources are allocated and cleaned up correctly, reducing memory leaks and ensuring a responsive UI. Refer to [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for additional details.\n- **Scalable Component Design:** The modular design promotes reusability and scalability, allowing developers to seamlessly integrate multiple chart components within a larger React application.\n\nOverall, the **AxisTypes** example demonstrates how to efficiently combine SciChart.js capabilities with React to achieve highly customizable, performant, and interactive charting solutions.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance JavaScript Charts",
                title: "Axis Types",
                pageTitle: "Axis Types",
                metaDescription:
                    "Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider",
                markdownContent:
                    "# AxisTypes Angular\n\n## Overview\nThis example demonstrates the integration of SciChart.js with Angular components to create highly customizable and interactive charts. The implementation focuses on advanced axis configurations and multi-axis setups while leveraging Angular's component lifecycle and dependency injection for efficient resource management.\n\n## Technical Implementation\nThe example is built using Angular, taking full advantage of **Angular dependency injection** to manage SciChart.js instances. By using Angular lifecycle hooks such as ngOnInit and ngOnDestroy, the chart initialization and cleanup follow best practices as outlined in the [Angular Component Lifecycle Hooks](https://angular.io/guide/lifecycle-hooks). Custom axis configurations are implemented to adjust the visual presentation and behavior of the axes, as detailed in the [Custom AxisMarkerAnnotation documentation](https://www.scichart.com/documentation/js/current/CustomAxisLabelAnnotation.html).\n\nDynamic updates are handled via JSON-based configurations, allowing the Builder API to seamlessly update the chart in real time. This approach is especially beneficial for high-frequency data updates and aligns with performance strategies described in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n## Features and Capabilities\n- **Real-time Updates:** The integration supports real-time data streaming using Angular's reactive programming patterns, as shown in [Adding Realtime Updates](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html).\n- **Custom Axis Configurations:** Developers can tailor the chart's axes through flexible JSON configurations to meet specialized visualization demands.\n- **Advanced Multi-Axis Support:** The example demonstrates multiple axis configurations for displaying complex data sets, similar to the approaches in [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html).\n\n## Integration and Best Practices\nThe integration leverages the [scichart-angular package](https://classic.yarnpkg.com/en/package/scichart-angular) to simplify embedding SciChart.js charts within Angular projects. Angular directives enable dynamic component rendering ensuring smooth updates and minimal performance overhead.\n\nEfficient management of Angular change detection is critical for maintaining performance during high-frequency data updates. This implementation follows the best practices discussed in [Angular Change Detection guidelines](https://angular.io/guide/change-detection) to ensure that only the necessary parts of the component tree are refreshed.\n\nIn summary, the AxisTypes Angular example is a robust demonstration of combining SciChart.js with Angular. It highlights the effective use of Angular lifecycle management, dependency injection, and dynamic configuration updates to achieve high-performance, real-time charting capabilities.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#StartHere-AxisOverview.html",
                title: "SciChart.js Axis Documentation",
                linkTitle: "Scichart.js Axis Documentation",
            },
        ],
        path: "axis-types",
        metaKeywords: "text, axis, date, logarithmic, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "FeaturedApps/FeatureDemos/AxisTypes",
        thumbnailImage: "javascript-axis-types.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const axisTypesExampleInfo = createExampleInfo(metaData);
