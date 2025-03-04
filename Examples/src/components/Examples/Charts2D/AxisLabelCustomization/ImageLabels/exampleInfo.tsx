import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DAxisLabelCustomizationImageLabels",
        imagePath: "javascript-image-labels.jpg",
        description:
            "Demonstrates how to use **Images as Labels** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use **Images as Labels** using SciChart.js, High Performance JavaScript Charts",
                title: "Image labels",
                pageTitle: "Image labels",
                metaDescription: "Demonstrates how to use Images as Axis Labels",
                markdownContent:
                    "## Image Labels Example - Vanilla JavaScript\n\n### Overview\nThis example demonstrates how to integrate **SciChart.js** using vanilla JavaScript to create a high-performance column chart with custom image labels replacing traditional text labels on the X-axis. The chart visualizes mobile phone market share data by mapping numeric indices to asynchronously loaded images, creating an engaging and visually appealing representation.\n\n### Technical Implementation\nThe chart initialization is performed procedurally by creating a SciChartSurface with a themed context, as described in the [Image Labels Documentation](https://www.scichart.com/documentation/js/current/ImageLabels.html). A numeric X-axis is configured using the [NumericAxis](https://www.scichart.com/documentation/js/current/NumericAxis.html) and its label provider is customized by overriding the getLabelTexture and getLabelTextureAsync methods. This customization leverages the asynchronous helper function createImagesArrayAsync to load images efficiently and use the [TextureManager](https://www.scichart.com/documentation/js/current/ImageLabels.html) for dynamic texture creation. Furthermore, a gradient fill is applied to the column series using the PaletteFactory, which enhances visual transitions and overall aesthetics.\n\n### Features and Capabilities\nKey features include the real-time animation of the column series using [WaveAnimation](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html) and the implementation of custom palette providers for dynamic gradient colors. The asynchronous image loading and deferred texture creation optimize performance, ensuring that the chart runs smoothly even with multiple custom label textures.\n\n### Integration and Best Practices\nThis example follows best practices for vanilla JavaScript chart integration by using a procedural, step-by-step initialization approach instead of relying on framework-specific hooks or the Builder API. Developers benefit from explicit control over chart customization, as each component—from the axis configuration to the advanced label rendering—is directly managed. For further details on custom label rendering and performance optimization, consult the [Image Labels Documentation](https://www.scichart.com/documentation/js/current/ImageLabels.html) and review the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) in the SciChart.js documentation.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use **Images as Labels** using SciChart.js, High Performance JavaScript Charts",
                title: "Image labels",
                pageTitle: "Image labels",
                metaDescription: "Demonstrates how to use Images as Axis Labels",
                markdownContent:
                    "## Image Labels Example (React)\n\n### Overview\nThis example demonstrates how to use **images as axis labels** within a SciChart.js chart embedded in a React application. Instead of traditional text labels, images representing mobile phone manufacturers are used to provide a more engaging visualization of market share data.\n\n### Technical Implementation\nThe integration leverages the [SciChartReact component](https://www.scichart.com/blog/react-charts-with-scichart-js/) to initialize a high performance chart in React. A custom asynchronous function initializes the SciChartSurface, sets up Numeric axes, and adds a column series with gradient fills and animations. The example uses the asynchronous helper function createImagesArrayAsync to load images dynamically, a process that is key to efficient resource management as described in [Image Labels](https://www.scichart.com/documentation/js/current/ImageLabels.html. Customization is achieved by overriding the axis label provider’s getLabelTexture and getLabelTextureAsync methods, allowing image textures to be generated for each label based on corresponding index values.\n\n### Features and Capabilities\nThe chart features a real-time animated column series enhanced by a gradient fill, implemented using a palette provider and a [WaveAnimation](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html). Text annotations and dynamic scaling (using zoomExtents) further enhance the visualization by providing contextual information. The method of directly configuring the chart through a React component ensures a clear separation of concerns and maintains optimal performance.\n\n### Integration and Best Practices\nThis example follows best practices for React integration by encapsulating the SciChartSurface creation inside a functional component, ensuring seamless lifecycle management and asynchronous operation handling. Developers interested in advanced customization can refer to the [Tutorial on setting up a project with scichart-react](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html) and learn more about [custom label providers](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) to override default behaviors for enhanced chart aesthetics. The example purposefully avoids using the builder API, opting instead for direct procedural configuration to provide clear control over the chart’s customization and performance optimizations.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use **Images as Labels** using SciChart.js, High Performance JavaScript Charts",
                title: "Image labels",
                pageTitle: "Image labels",
                metaDescription: "Demonstrates how to use Images as Axis Labels",
                markdownContent:
                    "## Image Labels Example (Angular)\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular application using the scichart-angular component. The chart displays mobile phone market share data and replaces traditional axis labels with images, such as brand logos, to create a more engaging visualization.\n\n### Technical Implementation\nThe setup uses an Angular standalone component that initializes a SciChartSurface through a custom asynchronous function. This function configures numeric axes and overrides the label provider’s getLabelTexture and getLabelTextureAsync methods to load and render images as axis labels. Asynchronous image loading is handled through SciChart.js utilities, ensuring efficient asset management as detailed in the [Image Labels documentation](https://www.scichart.com/documentation/js/current/ImageLabels.html). The procedural configuration approach, instead of using a Builder API, allows explicit control over chart properties and performance.\n\n### Features and Capabilities\nKey features include an animated column series with WaveAnimation and gradient fills, which provide smooth transitions and visual depth. Custom palette providers are used for dynamic color rendering, while asynchronous image loading for axis labels improves both performance and user experience. This design demonstrates how to integrate advanced chart features in a high-performance setting.\n\n### Integration and Best Practices\nThe example leverages Angular’s standalone components and dependency injection to encapsulate all chart initialization logic. Developers can refer to the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) for integration details and best practices in managing assets as outlined in the [Angular Standalone Components guide](https://blog.angular-university.io/angular-standalone-components/). The custom label provider implementation, which transforms numeric labels to image textures, follows the techniques presented in the [Axis LabelProviders documentation](https://www.scichart.com/documentation/js/current/Axis%20Label%20Formatting%20-%20LabelProvider%20API.html), ensuring a high-quality, extensible solution.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/ImageLabels.html",
                title: "This specific page about JavaScript Chart Image Labels documentation will help you to get started",
                linkTitle: "SciChart.js Image Labels Documentation",
            },
        ],
        path: "image-labels",
        metaKeywords: "image, axis, label, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/AxisLabelCustomization/ImageLabels",
        thumbnailImage: "javascript-image-labels.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const imageLabelsExampleInfo = createExampleInfo(metaData);
