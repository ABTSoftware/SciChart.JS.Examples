import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "BuilderApiSharedData",
        imagePath: "javascript-shared-data.jpg",
        description:
            "Demonstrates how to use the Builder Api to create **Reusable Chart Templates** using SciChart.js Builder API. Use this method when you want to create a template for a chart and add data later.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create **Reusable Chart Templates** using SciChart.js Builder API. Use this method when you want to create a template for a chart and add data later.",
                title: "JavaScript Chart with Reusable Templates using Shared Data",
                pageTitle: "JavaScript Chart with Reusable Templates using Shared Data",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create Reusable Chart Templates.Data can be easily integrated into a definition and shared between series",
                markdownContent:
                    "## Shared Data - Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to create **reusable chart templates** using the SciChart.js Builder API in a vanilla JavaScript environment. The chart template is defined using a JSON object that outlines multiple series and SVG text annotations, while the actual data is applied later via a shared data structure. Developers can learn more about the JSON configuration capabilities in the [Intro to the Builder API | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).\n\n### Technical Implementation\nThe implementation leverages a JSON definition to configure various chart elements including a ColumnSeries, LineSeries, and SplineBandSeries. Data is injected asynchronously using async/await, ensuring efficient initialization. The shared data object enables the dynamic integration of x, column, and line data across multiple series, resonating with the practices outlined in the [Working with Data | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Working%20with%20Data.html). Additionally, the configuration includes SVG text annotations as described in the [Tutorial 06 - Adding Annotations | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) guide.\n\n### Features and Capabilities\nThis example offers advanced functionality such as multi-series rendering, real-time data update capabilities through shared data, and custom theming via an externally defined appTheme. These features allow developers to build dynamic and visually consistent charts. Further customization of themes can be explored in the [Chart Styling - Creating a Custom Theme - SciChart](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation.\n\n### Integration and Best Practices\nAlthough a React component is provided to showcase multi-framework integration, the focus here is on vanilla JavaScript implementation. The example emphasizes best practices such as asynchronous chart initialization and proper memory management through chart disposal, which are critical for optimizing performance. Developers looking to further refine performance should consult the [Memory Best Practices | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) and the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guides for comprehensive insights.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create **Reusable Chart Templates** using SciChart.js Builder API. Use this method when you want to create a template for a chart and add data later.",
                title: "React Chart with Reusable Templates using Shared Data",
                pageTitle: "React Chart with Reusable Templates using Shared Data",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create Reusable Chart Templates.Data can be easily integrated into a definition and shared between series",
                markdownContent:
                    "## React Chart with Reusable Templates using Shared Data\n\n### Overview\nThis example demonstrates how to create reusable chart templates with shared data in a React application using SciChart.js. The implementation uses the Builder API to define the chart configuration as a JSON object, which allows developers to create complex charts with multiple series and annotations, and then inject data later. The chart is rendered using the SciChartReact component, ensuring seamless integration with React.\n\n### Technical Implementation\nThe core of the example is based on a JSON definition that configures various chart elements such as a ColumnSeries, LineSeries, and SplineBandSeries. It also includes annotations to display textual elements on the chart. By using the Builder API (see [Builder API - SciChart](https://www.scichart.com/examples/builder-api/)) along with the shared data concept, the chart can be built asynchronously via an async function, making use of JavaScript’s async/await for efficient performance. The chart configuration leverages a custom theme defined externally, which facilitates consistent styling across components. For further details on setting up asynchronous chart initialization in React, refer to [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).\n\n### Features and Capabilities\nThis example highlights several advanced features such as:\n- **Reusable Chart Templates**: Define charts using a configuration object and input data at a later stage, enabling flexibility in dynamic applications, as shown in the [React Chart with Reusable Templates using Shared Data](https://demo.scichart.com/react/reusable-templates-using-shared-data) demo.\n- **Dynamic Shared Data Integration**: Shared data such as x, y, and additional data arrays are injected during chart creation, which allows for easy updates and real-time data streaming.\n- **Multi-series Rendering with Annotations**: Multiple series are rendered simultaneously along with SVG text annotations, providing clarity and additional information directly on the chart.\n\n### Integration and Best Practices\nThe integration uses the SciChartReact component, which encapsulates the initialization process, and demonstrates best practices for incorporating third-party charting libraries into React. Developers are encouraged to maintain modular and reusable code by separating the chart definition from its data, as this example does. Performance optimizations are achieved by leveraging asynchronous initialization and the inherent efficiency of the Builder API. For insights on React integration and performance tuning, see [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\nBy following these guidelines and leveraging the provided documentation, developers can build high-performance, feature-rich charts in their React applications using SciChart.js.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create **Reusable Chart Templates** using SciChart.js Builder API. Use this method when you want to create a template for a chart and add data later.",
                title: "Angular Chart with Reusable Templates using Shared Data",
                pageTitle: "Angular Chart with Reusable Templates using Shared Data",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create Reusable Chart Templates.Data can be easily integrated into a definition and shared between series",
                markdownContent:
                    "## Angular Chart with Reusable Templates using Shared Data\n\n### Overview\nThis example demonstrates how to create **reusable chart templates** in an Angular application using the SciChart.js Builder API. The chart configuration is defined as a JSON object, where the data is injected later using a shared data mechanism. Developers can dynamically embed data such as x, column, and line series values, thereby promoting modularity and reusability.\n\n### Technical Implementation\nThe core implementation leverages the SciChart.js Builder API to define a chart template with multiple series types including ColumnSeries, LineSeries, and SplineBandSeries and includes SVG text annotations for additional context. This JSON-based configuration enables asynchronous chart initialization via async/await, which is a recommended best practice as explained in [async/await in Angular ngOnInit](https://stackoverflow.com/questions/56092083/async-await-in-angular-ngoninit) and [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). Custom themes are applied to ensure consistent styling as shown in the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation. Furthermore, the JSON configuration approach aligns with the guidance found in the [Intro to the Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html), highlighting how to build complex charts with straightforward, declarative definitions.\n\n### Features and Capabilities\nThe example supports **multi-series rendering** by combining column, line, and spline band series, which enables developers to visualize data trends effectively. Shared data integration allows the template to be defined separately from the dataset, enhancing real-time update capabilities. This approach is ideal for applications requiring frequent data updates and can be compared with scenarios covered in [Working with Data | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/Working%20with%20Data.html). In addition, comprehensive annotations are added to the chart to offer contextual insights, reinforcing how annotations can be effectively used as per the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) guide.\n\n### Integration and Best Practices\nFor Angular applications, it is crucial to adopt both asynchronous initialization and proper memory management to ensure optimal performance. The design separates chart configuration from data, promoting code modularity. Developers are encouraged to clean up resources after chart destruction to prevent memory leaks, following best practices outlined in the [Memory Best Practices | JavaScript Chart Documentation - SciChart](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. Overall, by utilizing the Builder API for JSON chart configuration in Angular, this example provides a robust framework for developing scalable and dynamic charting solutions with SciChart.js, demonstrating efficient integration techniques and performance optimization methods.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html",
                title: "This specific page in the JavaScript Builder API documentation will help you to get started",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
        path: "reusable-templates-using-shared-data",
        metaKeywords: "template, chart, javascript, data, reuse",
        onWebsite: true,
        filepath: "BuilderApi/SharedData",
        thumbnailImage: "javascript-shared-data.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const sharedDataExampleInfo = createExampleInfo(metaData);
