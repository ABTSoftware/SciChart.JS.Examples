import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesDonutChart",
        imagePath: "javascript-donut-chart.jpg",
        description:
            "This demo demonstrates how create a **JavaScript Donut Chart** with our powerful JavaScript library, SciChart.js.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This demo demonstrates how create a **JavaScript Donut Chart** with our powerful JavaScript library, SciChart.js.",
                title: "JavaScript Donut Chart",
                pageTitle: "JavaScript Donut Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create JavaScript Donut Chart with 5-star rated SciChart.js chart library. Supports legends, text labels, animated updates and more. Get free trial now.",
                markdownContent:
                    '# Donut Chart - Vanilla JavaScript\n\n### Overview\nThis example illustrates the creation of an animated **donut chart** using SciChart.js with vanilla JavaScript. It demonstrates how to visualize market share data using dynamic, gradient-filled segments and configurable legends. The chart is constructed asynchronously to ensure smooth rendering and maximal performance in web applications.\n\n### Technical Implementation\nThe chart is built by creating a new instance of SciChartPieSurface configured as a donut chart with a relative hole radius and animated transitions. Each segment is generated from a dataset by transforming data objects into PieSegment instances with custom linear gradients. The asynchronous initialization in the function "drawExample" ensures the chart is set up efficiently. For detailed guidance on initializing SciChart.js charts asynchronously, please refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.\n\n### Features and Capabilities\nKey features of this implementation include real-time animated updates, advanced gradient color configuration for each pie segment, dynamic legend orientation and placement, and relative radius adjustments for enhanced visual differentiation of data segments. These capabilities are essential for building interactive visualizations, as detailed in the [JavaScript Donut Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Donut%20Chart%20Type.html).\n\n### Integration and Best Practices\nThis example follows best practices by using efficient asynchronous initialization and properly managing resources through a returned destructor function, enabling safe cleanup of the chart instance when no longer needed. Such optimizations are in line with recommendations from the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. Additionally, the use of gradient configurations and dynamic legends simplifies further customization and integration of SciChart.js into standard vanilla JavaScript projects. For more technical insights on animated configurations and gradient customization, developers can also explore practical examples in the [JavaScript Donut Chart Demo](https://demo.scichart.com/javascript/donut-chart).',
            },
            react: {
                subtitle:
                    "This demo demonstrates how create a **React Donut Chart** with our powerful JavaScript library, SciChart.js.",
                title: "React Donut Chart",
                pageTitle: "React Donut Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create React Donut Chart with 5-star rated SciChart.js chart library. Supports legends, text labels, animated updates and more. Get free trial now.",
                markdownContent:
                    "# React Donut Chart\n\n### Overview\nThis example demonstrates how to implement a **React Donut Chart** using the SciChart.js library. The primary goal of the example is to visualize data as a donut chart with animated segments, legends, and gradient color configurations. It showcases how to integrate SciChart.js in a React application using the SciChartReact component from the scichart-react package.\n\n### Technical Implementation\nThe example initializes the chart asynchronously in a React functional component. The main chart creation happens in the drawExample function, where a SciChartPieSurface instance is created and configured to render a donut chart. Key configurations include setting the pie type to donut, defining the hole radius, enabling animations, and customizing the legend placement. The configuration of linear gradient fills for each pie segment demonstrates how to create visually appealing charts. For detailed guidelines on setting up SciChart with React, refer to the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) documentation.\n\n### Features and Capabilities\nThe implementation leverages advanced features such as animated updates, dynamic gradient configurations for pie segments, and the inclusion of a legend with series markers that animate into place. Each segment of the donut chart is generated dynamically from a dataset, with custom color gradients defined by specifying start and end colors. Detailed information on the donut chart type and its configurations is available in the [Donut Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Donut%20Chart%20Type.html).\n\n### Integration and Best Practices\nThe React integration is achieved through the SciChartReact component, which simplifies rendering and updating the chart within the React component lifecycle. The asynchronous initialization pattern used in the drawExample function ensures that the chart is created efficiently and can be cleaned up when the component unmounts. Developers are encouraged to apply best practices for styling by using CSS modules and inline styles, as demonstrated in the index.tsx file. For additional best practices on React component lifecycle management and cleanup, the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) resource is highly recommended.\n",
            },
            angular: {
                subtitle:
                    "This demo demonstrates how create a **Angular Donut Chart** with our powerful JavaScript library, SciChart.js.",
                title: "Angular Donut Chart",
                pageTitle: "Angular Donut Chart | JavaScript Charts | SciChart.js",
                metaDescription:
                    "Create Angular Donut Chart with 5-star rated SciChart.js chart library. Supports legends, text labels, animated updates and more. Get free trial now.",
                markdownContent:
                    "# Angular Donut Chart\n\n### Overview\nThis example demonstrates how to integrate a **SciChart.js Donut Chart** into an Angular application using a standalone Angular component. The example leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to embed the chart directly into the Angular template. The primary goal is to visualize market share data with animated, gradient-filled segments and configurable legends.\n\n### Technical Implementation\nThe donut chart is created with an asynchronous initialization pattern inside the Angular standalone component. The chart is rendered using the SciChart library by invoking the `drawExample` function, which creates a `SciChartPieSurface` configured for a donut chart with a relative hole radius, custom gradient fills defined by linear gradients, and animated transitions. Resource management and efficient cleanup are handled in accordance with best practices as outlined in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation.\n\n### Features and Capabilities\nKey features include animated chart transitions, dynamic segmentation based on a provided dataset, and advanced visual customizations such as gradient color configurations for each pie segment. The example also supports interactive legends with configurable orientation and placement. Further details on these capabilities can be found in the [SciChart.js Donut Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Donut%20Chart%20Type.html).\n\n### Integration and Best Practices\nThe integration follows modern Angular practices by using standalone components and property binding for dynamic chart creation. This approach simplifies the initialization process and fits well within Angular’s component-driven architecture. Developers can refer to [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) to understand the underlying implementation and explore additional guidelines on using standalone components as described in [Angular Standalone Components](https://angular.io/guide/standalone-components). These resources provide further insights into performance optimization and proper resource management when working with high-performance JavaScript charts in Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Donut%20Chart%20Type.html",
                title: "Donut Chart",
                linkTitle: "JavaScript Donut Chart Documentation",
            },
        ],
        path: "donut-chart",
        metaKeywords: "donut, chart, javascript, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/DonutChart",
        thumbnailImage: "javascript-donut-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const donutChartExampleInfo = createExampleInfo(metaData);
