import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesDigitalLineChart",
        imagePath: "javascript-digital-line-chart.jpg",
        description:
            "Demonstrates how to create a **JavaScript Digital Line Chart** using SciChart.js, our powerful JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Digital Line Chart** using SciChart.js, our powerful JavaScript Charts",
                title: "JavaScript Digital Line Chart",
                pageTitle: "JavaScript Digital Line Chart | JavaScript Charts | View Now",
                metaDescription:
                    "Discover how to create a JavaScript Digital Line Chart with SciChart - your feature-rich JavaScript Chart Library. Get your free demo now.",
                markdownContent:
                    "# Digital Line Chart Example in Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a **Digital Line Chart** using SciChart.js in a vanilla JavaScript environment. It highlights the process of setting up a high-performance chart that renders a digital (step) line series with interactive capabilities and resource-efficient WebAssembly utilization.\n\n## Technical Implementation\nThe chart is initialized within an asynchronous function that creates a SciChartSurface along with its WebAssembly context as described in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Numeric axes are configured using the NumericAxis class and enhanced with a growBy value via a NumberRange object to ensure proper padding. The data is generated using a random walk algorithm and plotted using an XyDataSeries. The digital line series is implemented by setting the **isDigitalLine** flag to true in a FastLineRenderableSeries, and a custom EllipsePointMarker is applied to clearly display data points. For more on digital line configuration, refer to the [Digital (Step) Line Series documentation](https://www.scichart.com/documentation/js/current/The%20Digital%20(Step)%20Line%20Series.html).\n\n## Features and Capabilities\nThis example incorporates several advanced features. It utilizes [ScaleAnimation](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html) to animate the chart series for a dynamic visual effect and integrates interactive modifiers such as ZoomPanModifier, ZoomExtentsModifier, and the [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier.html) to allow users to zoom and pan seamlessly. The use of WebAssembly enables high-performance rendering, a key aspect in building responsive, real-time applications, as detailed in [WebAssembly performance optimization](https://www.scichart.com/blog/scichart-js-preview-creating-real-time-stock-charts-in-javascript/).\n\n## Integration and Best Practices\nThe integration in a vanilla JavaScript setup is designed for ease of use. The initialization function directly creates the chart and returns a cleanup (destructor) function to ensure proper resource disposal, aligning well with the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). This pattern not only streamlines the process of embedding SciChart.js into web projects but also optimizes performance by leveraging asynchronous initialization patterns as highlighted in the [Tutorial on setting up a project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html).",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Digital Line Chart** using SciChart.js, our powerful JavaScript Charts",
                title: "React Digital Line Chart",
                pageTitle: "React Digital Line Chart | JavaScript Charts | View Now",
                metaDescription:
                    "Discover how to create a React Digital Line Chart with SciChart - your feature-rich JavaScript Chart Library. Get your free demo now.",
                markdownContent:
                    '# React Digital Line Chart\n\n## Overview\nThis example demonstrates how to create a digital line chart using SciChart.js within a React framework. It showcases how to configure SciChart surfaces, axes, and a digital line renderable series with animations and interactive modifiers for zooming and panning.\n\n## Technical Implementation\nThe chart is initialized within an asynchronous function called drawExample that sets up a SciChartSurface and WebAssembly context. The function creates numeric X and Y axes and plots data generated from a custom RandomWalkGenerator. The digital line is implemented by setting the flag **isDigitalLine** to true on the renderable series, and it includes a custom point marker and a scale animation effect. Developers interested in the architectural details can refer to [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) for in-depth insights.\n\n## Features and Capabilities\nThis example highlights advanced chart features such as advanced series customization with digital line styling, efficient animations using ScaleAnimation, and interactive capabilities with modifiers including ZoomPan, ZoomExtents, and MouseWheelZoom. These features ensure an engaging user experience and are discussed in the [React Digital Line Chart Demo](https://demo.scichart.com/react/digital-line-chart) documentation.\n\n## Integration and Best Practices\nThe integration is streamlined through the use of the SciChartReact component which accepts an initChart prop pointing to the drawExample function. This approach simplifies embedding SciChart.js into React applications while ensuring optimal performance by leveraging WebAssembly for rendering. Best practices for React integration are further detailed in [React Charts with SciChart.js: Introducing "SciChart React"](https://www.scichart.com/blog/react-charts-with-scichart-js/) and the efficient use of WebAssembly is elaborated in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide.\n',
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Digital Line Chart** using SciChart.js, our powerful JavaScript Charts",
                title: "Angular Digital Line Chart",
                pageTitle: "Angular Digital Line Chart | JavaScript Charts | View Now",
                metaDescription:
                    "Discover how to create a Angular Digital Line Chart with SciChart - your feature-rich JavaScript Chart Library. Get your free demo now.",
                markdownContent:
                    "# Angular Digital Line Chart\n\n## Overview\nThis example demonstrates how to create an **Angular Digital Line Chart** using SciChart.js. Built with Angular standalone components, it integrates the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package to seamlessly embed a SciChart surface into an Angular application.\n\n## Technical Implementation\nThe chart is initialized via an asynchronous function that creates a SciChartSurface with a unique WebAssembly context for high-performance rendering. It configures numeric X and Y axes, generates data using a random walk generator, and plots the data with a FastLineRenderableSeries where the **isDigitalLine** flag is enabled to render a digital line. A custom point marker and a scale animation further enhance the visualization. For detailed configuration of digital line series, see the [Digital (Step) Line Series documentation](https://www.scichart.com/documentation/js/current/The%20Digital%20(Step)%20Line%20Series.html).\n\n## Features and Capabilities\nThe example includes advanced features such as interactive modifiers including **ZoomPan**, **ZoomExtents**, and **MouseWheelZoom** that enable dynamic panning and zooming. The use of WebAssembly ensures optimal performance, even with real-time data updates. Further details on interactivity can be found in the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) and performance considerations are outlined in the [Memory Best Practices guide](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html).\n\n## Integration and Best Practices\nIntegration is simplified by passing the chart initialization function as the initChart property of the SciChartAngularComponent, following best practices for Angular standalone components as described in the [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components) documentation. This structure not only promotes clean integration but also ensures proper management of the chart lifecycle and resource cleanup. For additional insights on integrating SciChart.js within Angular, developers are encouraged to review the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Digital%20(Step)%20Line%20Series.html",
                title: "The specific page for the JavaScript Digital Line Chart documentation will help you to get started",
                linkTitle: "JavaScript Digital Line Chart Documentation",
            },
        ],
        path: "digital-line-chart",
        metaKeywords: "digital, line, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/DigitalLineChart",
        thumbnailImage: "javascript-digital-line-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const digitalLineChartExampleInfo = createExampleInfo(metaData);
