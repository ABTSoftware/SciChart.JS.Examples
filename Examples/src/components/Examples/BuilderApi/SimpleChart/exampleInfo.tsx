import { createExampleInfo } from "../../exampleInfoUtils";
import { IExampleMetadata } from "../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "BuilderApiSimpleChart",
        imagePath: "javascript-builder-simple.jpg",
        description:
            "Demonstrates how to use the Builder Api to create a **Simple Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Simple Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Simple Chart using Builder API",
                pageTitle: "Simple Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create a simple chart using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent:
                    "# Simple Chart with Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to construct a high-performance chart using SciChart.js with a declarative JSON configuration approach via the Builder API. By leveraging a well-defined JSON object, developers can quickly set up numeric axes, a smoothed spline line series, and custom SVG text annotations while focusing directly on vanilla JavaScript integration. For more information on using the Builder API, see the [Intro to the Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).\n\n### Technical Implementation\nThe chart is created using the Builder API in a straightforward manner by calling the function chartBuilder.build2DChart and providing a JSON configuration. This configuration specifies key details such as: \n\n- **Axes Configuration:** Numeric x and y axes are set with padding using NumberRange, ensuring that data points are not clipped. Refer to techniques in axis configuration in the [Chart Styling - Margin and Padding](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Margin%20and%20Padding.html) documentation.\n\n- **Series and Animations:** A SplineLineSeries is defined with custom properties including stroke thickness, an interpolation factor for line smoothing, and a scale animation (500ms duration) that enhances visual engagement. Explore details on series animations in the [Class ScaleAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/scaleanimation.html) documentation.\n\n- **Annotations:** Two SVG text annotations are added to the chart, utilizing relative coordinate modes and configurable anchor points for precise placement. This method of annotation customization is further explained in the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) guide.\n\n### Features and Capabilities\nThe example showcases several advanced features: \n\n- **Declarative Charting:** Using JSON configuration streamlines the process of chart creation so that each element (axes, series, and annotations) is easily modifiable and maintainable.\n\n- **Smooth Series Rendering:** The SplineLineSeries with interpolation points produces a visually appealing smoothed line effect which can be crucial for data visualization tasks.\n\n- **Dynamic Animations:** Integrated scale animations and stroke customization contribute to an engaging, real-time update experience when data changes.\n\n- **Optimized Performance:** Built upon WebGL, SciChart.js leverages hardware-accelerated rendering, ensuring that charts update rapidly even with complex visual elements.\n\n### Integration and Best Practices\nIn this pure vanilla JavaScript setup, the integration strategy is focused on asynchronous initialization and proper lifecycle management. The chart is created by invoking a function that returns a cleanup method, ensuring that any allocated resources are properly disposed of when the chart is no longer needed. For guidance on integrating SciChart.js into an HTML environment, consult the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). This example emphasizes best practices by ensuring that the SciChartSurface is deleted appropriately to prevent memory leaks, a crucial consideration in high-performance charting scenarios.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Simple Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Simple Chart using Builder API",
                pageTitle: "Simple Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create a simple chart using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent:
                    "# Simple Chart using React\n\n### Overview\nThis example demonstrates how to create a high-performance chart using SciChart.js and its Builder API within a React environment. The chart is defined using a declarative JSON configuration that sets up numeric x and y axes, a spline line series with smooth animations, and SVG text annotations with relative coordinate positioning. This approach simplifies complex chart creation as detailed in the [JavaScript Builder API Documentation](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).\n\n### Technical Implementation\nThe chart is implemented using the Builder API through the function chartBuilder.build2DChart. This function accepts a JSON object that describes the chart elements such as axes (configured with growBy settings using NumberRange), a spline line series (with stroke properties, interpolation points, and a Scale animation effect with a 500ms duration), and annotations configured with relative coordinates. More insights into configuring charts declaratively in React can be found in the [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).\n\n### Features and Capabilities\nThe example leverages advanced features including a **spline line series** that uses built-in animation for enhanced visual engagement and SVG text annotations that are centrally positioned using relative coordinates. These capabilities enable developers to rapidly build interactive and visually compelling chart experiences. For additional details on annotations and their configuration, refer to the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html).\n\n### Integration and Best Practices\nReact integration is seamlessly achieved through the SciChartReact component, which encapsulates the chart initialization logic (via the initChart property) within a React component structure. This component-based approach not only streamlines the integration process but also ensures efficient resource management and cleanup, adhering to best practices in modern React development. Developers seeking further guidance can review [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for more details on crafting reusable React components for charting.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the Builder Api to create a **Simple Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Simple Chart using Builder API",
                pageTitle: "Simple Chart using Builder API",
                metaDescription:
                    "Demonstrates how to use the Builder Api to create a simple chart using a definition object. The builder api is designed to make it easier to discover the types and options available in SciChart JS.",
                markdownContent:
                    "# Simple Chart using Builder API in Angular\n\n### Overview\nThis example demonstrates how to create a high-performance chart in an Angular application using SciChart.js. By leveraging the Builder API with a declarative JSON configuration, developers can define numeric axes, a spline line series with smooth animations, and SVG text annotations effortlessly.\n\n### Technical Implementation\nThe chart is constructed via the function chartBuilder.build2DChart which accepts a JSON configuration object. This configuration sets up numeric x and y axes with growBy options, a **spline line series** that employs a scale animation (500ms duration) for smooth transitions, and SVG text annotations with relative coordinate positioning. For more details on configuring charts using JSON, refer to the [Intro to the Builder API](https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html).\n\n### Features and Capabilities\nThe example showcases advanced features including customizable animations and precise annotation placements. The series animation creates an engaging visual experience, while the use of relative coordinates for SVG text annotations allows for flexible layout adjustments. Additional insights into managing annotations are available in the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) documentation.\n\n### Integration and Best Practices\nWithin an Angular environment, it is essential to employ proper resource management and performance optimization. The Builder API simplifies chart configuration, enabling seamless integration into Angular components. Developers should ensure the proper disposal of SciChart surfaces as detailed in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. Moreover, integration with Angular is further supported by packages like [scichart-angular](https://www.npmjs.com/package/scichart-angular), and advanced animation techniques can be explored via the [Angular Chart Data Animation](https://demo.scichart.com/angular/data-animation) demo.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Intro%20to%20the%20Builder%20API.html",
                title: "This specific page in the JavaScript Builder API documentation will help you to get started",
                linkTitle: "JavaScript Builder API Documentation",
            },
        ],
        path: "builder-simple",
        metaKeywords: "definition, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "BuilderApi/SimpleChart",
        thumbnailImage: "javascript-builder-simple.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const simpleChartExampleInfo = createExampleInfo(metaData);
