import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "FeaturedAppsMedicalChartsVitalSignsMonitorDemo",
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
                markdownContent: null,
            },
            react: {
                subtitle:
                    "Showcases how SciChart.js can be used in a **Medical context**, drawing ECGs with our High Performance JavaScript Charts",
                title: "React Vital Signs ECG/EKG Medical Demo",
                pageTitle: "React Vital Signs ECG/EKG Medical Demo",
                metaDescription:
                    "In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time\n        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood\n        oxygen, volumetric flow and more.",
                markdownContent:
                    "# VitalSignsMonitorDemo - React Integration\n\n## Overview\n\nThe VitalSignsMonitorDemo example showcases how to integrate SciChart.js within a React application to display real-time and highly interactive health monitoring charts. The example demonstrates initialization, real-time data updates, and advanced customization of chart components using React’s functional components and hooks.\n\n## Technical Implementation\n\nThis implementation leverages React’s **useEffect** hook for initializing and cleaning up the SciChart.js chart components, ensuring that resources are properly managed during the component lifecycle. Developers can refer to [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) to see a similar approach. The example also incorporates **useRef** to directly interact with DOM elements like canvas elements required by the third-party charting library, as explained in various discussions on integrating React with external libraries.\n\nAdditionally, real-time data streaming is managed via JSON-based configuration, allowing flexible updates and efficient state management within the React component. This pattern is similar to approaches described in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n## Features and Capabilities\n\nThe demo includes the following key features:\n\n- **Real-time Updates:** Continuous data streaming and efficient state management enable responsive updates to the chart without performance degradation. For insights on handling real-time data, see [Creating a React Dashboard with SciChart.js, SciChart-React and DeepSeek](https://www.scichart.com/blog/creating-a-react-dashboard-with-scichart-js-scichart-react-and-deepseek-r1/).\n\n- **Advanced Customization:** The use of JSON configuration allows developers to customize interaction patterns, tooltips, and event handling, ensuring a rich and interactive user experience.\n\n- **High-Performance Visualization:** Utilizing WebGL for chart rendering, the example achieves high rendering performance necessary for displaying large streams of data. Learn more about this technique in [SciChart.js Javascript 3D Charts with WebGL & WebAssembly](https://www.scichart.com/blog/scichart-js-fast-javascript-3d-charts-update-june-2020/).\n\n## Integration and Best Practices\n\nThe integration of SciChart.js into a React environment is managed using modern React hooks such as **useEffect**, **useRef**, **useCallback**, and **useMemo** to optimize rendering performance and handle event listeners effectively. For a deeper understanding of these optimization techniques, developers may consult [Optimizing Render Performance in React with Hooks: A Deep Dive into useMemo and useCallback](https://www.pullrequest.com/blog/optimizing-render-performance-in-react-with-hooks-a-deep-dive-into-usememo-and-usecallback/).\n\nBy following these practices and the guidelines presented in [React Component Lifecycle Methods – Explained with Examples](https://www.freecodecamp.org/news/react-component-lifecycle-methods/), the example ensures a clean component lifecycle with proper initialization and disposal of event listeners and other resources.\n\nOverall, the VitalSignsMonitorDemo example not only demonstrates the robust capabilities of SciChart.js for real-time data visualization but also serves as a practical guide for seamlessly integrating such powerful libraries within modern React applications.",
            },
            angular: {
                subtitle:
                    "Showcases how SciChart.js can be used in a **Medical context**, drawing ECGs with our High Performance JavaScript Charts",
                title: "Angular Vital Signs ECG/EKG Medical Demo",
                pageTitle: "Angular Vital Signs ECG/EKG Medical Demo",
                metaDescription:
                    "In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time\n        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood\n        oxygen, volumetric flow and more.",
                markdownContent:
                    "# VitalSignsMonitorDemo - Angular\n\n## Overview\nThis example demonstrates an Angular implementation of the SciChart.js VitalSignsMonitorDemo, a sophisticated solution for monitoring and visualizing medical grade data in real-time. Leveraging Angular's robust framework, this demo integrates SciChart.js to produce high-performance charts ideal for applications that require rapid data updates and detailed interactivity.\n\n## Technical Implementation\nThe application makes strategic use of Angular lifecycle hooks, such as those detailed in [Component Lifecycle - Angular](https://angular.io/guide/lifecycle-hooks), to manage chart initialization, updates, and disposal seamlessly. The Builder API is employed alongside dynamic JSON configurations to construct and manage chart properties. This approach ensures that each component remains decoupled and maintainable. Furthermore, Angular's dependency injection is utilized to provide data services, a pattern well-articulated in [Telehealth: Medical Grade Charting & Dashboards - SciChart](https://www.scichart.com/telehealth/), streamlining data flow throughout the application.\n\n## Features and Capabilities\nThis demo supports real-time data updates by integrating Angular's RxJS streams. These streams enable the charts to reflect live data changes efficiently, in a fashion similar to the strategies covered in [Adding Realtime Updates | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Tutorial%2004%20-%20Adding%20Realtime%20Updates.html). Additionally, the implementation incorporates advanced WebGL rendering for smooth, high-frequency redraws, as described in [SciChart.js Javascript 3D Charts with WebGL & WebAssembly](https://dev.to/andyb1979/scichartjs-javascript-3d-charts-with-webgl-webassembly-5gle). Optimizations for handling high data rates are also implemented, ensuring the application remains performant under demanding conditions, with further best practices available in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).\n\n## Integration and Best Practices\nThe integration follows Angular best practices by incorporating tested patterns for component reusability and efficient change detection. The demo leverages Angular's structured event handling and zone management to ensure that asynchronous operations like live chart updates do not compromise the application's performance. Additionally, using Angular directives to wrap SciChart.js components enhances modularity and scalability. Developers looking to expand on these patterns are encouraged to explore additional resources such as [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) for further integration strategies.\n\nOverall, the VitalSignsMonitorDemo in Angular serves as a comprehensive reference for building robust, real-time charting solutions that combine the power of SciChart.js with modern Angular development techniques.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html",
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
    };
//// End of computer generated metadata

export const vitalSignsMonitorDemoExampleInfo = createExampleInfo(metaData);
