import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesPieChart",
        imagePath: "javascript-pie-chart.jpg",
        description:
            "For an example that demonstrates how create a **JavaScript Pie Chart**, our demo code teaches you how to do this with SciChart's JavaScript Charting Library.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "For an example that demonstrates how create a **JavaScript Pie Chart**, our demo code teaches you how to do this with SciChart's JavaScript Charting Library.",
                title: "JavaScript Pie Chart",
                pageTitle: "JavaScript Pie Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Easily create and customise a high performance JavaScript Pie Chart with 5-star rated SciChart.js. Get your free trial now to access the whole library. ",
                markdownContent:
                    "# JavaScript Pie Chart Example (Vanilla JavaScript)\n\n## Overview\nThis example demonstrates how to create a high performance, animated pie chart using SciChart.js with vanilla JavaScript. The implementation transforms a raw dataset into individual pie segments with dynamic gradient fills and adjustable segment radii, making it ideal for visualizing data such as market share statistics.\n\n## Technical Implementation\nThe core of the example is the asynchronous initialization of the chart using the SciChartPieSurface, which is created by calling an async function that returns a promise. This pattern, detailed in tutorials like [Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html), ensures that the WebGL context is fully ready before the chart is rendered. Additionally, the example leverages the GradientParams class to apply smooth gradient fills to each pie segment as shown in [The Pie Chart Type Documentation](https://www.scichart.com/documentation/js/current/The%20Pie%20Chart%20Type.html). Data transformation is handled by mapping raw dataset values into PieSegment instances (see [PieSegment API Documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/piesegment.html)) with conditional label rendering based on segment values.\n\n## Features and Capabilities\nThis pie chart supports animated transitions for both the chart segments and the legend. The legend is configured for horizontal orientation and placed at the bottom left to optimize the display area. The implementation also demonstrates advanced visual customization through dynamic gradient fills and relative radius adjustments for each segment, providing an engaging and informative user experience. Furthermore, the chart is optimized for performance by leveraging WebGL rendering for smooth animations and efficient resource usage.\n\n## Integration and Best Practices\nDesigned for a vanilla JavaScript environment, the example follows modern asynchronous patterns and includes a cleanup mechanism that calls the delete() method on the SciChartPieSurface, ensuring proper disposal of WebGL resources. This approach aligns with recommended best practices for resource management as outlined in [Deleting DataSeries Memory](https://www.scichart.com/documentation/js/current/DataSeries_DeletingMemory.html). Developers can further refine their implementations by studying these techniques and integrating similar patterns in their projects, ensuring robust and maintainable charting applications.",
            },
            react: {
                subtitle:
                    "For an example that demonstrates how create a **React Pie Chart**, our demo code teaches you how to do this with SciChart's JavaScript Charting Library.",
                title: "React Pie Chart",
                pageTitle: "React Pie Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Easily create and customise a high performance React Pie Chart with 5-star rated SciChart.js. Get your free trial now to access the whole library. ",
                markdownContent:
                    "# React Pie Chart Example\n\n## Overview\nThis example demonstrates how to create a high performance **React Pie Chart** using SciChart.js in a React application. The example visualizes market share data of mobile phone manufacturers for 2022 and focuses on delivering an animated, responsive pie chart with advanced styling options such as gradient fills and dynamically adjusted segment radii.\n\n## Technical Implementation\nThe chart is initialized asynchronously using a callback pattern within the React component. In the main component, the SciChartReact component from the SciChart-React package is utilized to encapsulate the chart configuration and rendering. The asynchronous initialization approach, detailed in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html), ensures that the chart is properly rendered once the underlying webgl context is ready. The example leverages the SciChartPieSurface to configure properties such as animation, legend layout, series spacing, and gradient colors for each pie segment.\n\n## Features and Capabilities\nThe example showcases several advanced features including animated transitions, customizable gradient fills using linear gradients, and relative radius adjustments per segment. Each pie segment is constructed programmatically from a dataset to highlight the flexibility in handling real-world data. The chart also includes interactive elements like legends with configurable orientation and placement, enhancing the overall user experience. Additionally, performance optimizations are inherent through efficient canvas rendering, a subject discussed in detail in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n## Integration and Best Practices\nThis example exemplifies best practices for integrating SciChart.js with React. It uses the SciChartReact component for seamless integration of asynchronous chart initialization and relies on callback functions to manage the chart lifecycle. Resource cleanup is handled elegantly to ensure optimal performance and stability over time. Developers looking to further optimize their projects can refer to [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) for more guidance on managing component lifecycle and [React Chart Data Animation | SciChart.js Demo](https://demo.scichart.com/react/data-animation) for insights on implementing smooth animations.\n",
            },
            angular: {
                subtitle:
                    "For an example that demonstrates how create a **Angular Pie Chart**, our demo code teaches you how to do this with SciChart's JavaScript Charting Library.",
                title: "Angular Pie Chart",
                pageTitle: "Angular Pie Chart | JavaScript Chart Examples | SciChart",
                metaDescription:
                    "Easily create and customise a high performance Angular Pie Chart with 5-star rated SciChart.js. Get your free trial now to access the whole library. ",
                markdownContent: null,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Pie%20Chart%20Type.html",
                title: "The specific page for the JavaScript Pie Chart documentation will help you to get started",
                linkTitle: "JavaScript Pie Chart Documentation",
            },
        ],
        path: "pie-chart",
        metaKeywords: "pie, chart, javascript, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/PieChart",
        thumbnailImage: "javascript-pie-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const pieChartExampleInfo = createExampleInfo(metaData);
