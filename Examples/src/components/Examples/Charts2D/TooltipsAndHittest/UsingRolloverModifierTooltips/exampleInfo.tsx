import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DTooltipsAndHittestUsingRolloverModifierTooltips",
        imagePath: "javascript-chart-rollovermodifier-tooltips.jpg",
        description:
            "Demonstrates how to create **tooltips on mouse-over** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create **tooltips on mouse-over** using SciChart.js, High Performance JavaScript Charts",
                title: "Using Rollover Modifier Tooltips",
                pageTitle: "Using Rollover Modifier Tooltips",
                metaDescription:
                    "Demonstrates adding Tooltips on mouse-move to a JavaScript Chart with SciChart.js RolloverModifier",
                markdownContent:
                    "## Using Rollover Modifier Tooltips with JavaScript\n\n### Overview\nThis example demonstrates how to create an interactive chart using SciChart.js in a pure JavaScript environment. It showcases the creation of a `SciChartSurface` with customized numeric axes, data series rendered from Fourier series data, and advanced interactivity through custom tooltip behaviors.\n\n### Technical Implementation\nThe chart is initialized by asynchronously creating a `SciChartSurface` and setting up numeric axes with properties such as `growBy`, `labelFormat`, and `labelPrecision` (see the [NumericAxis documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html) for more details). Three separate `FastLineRenderableSeries` are added, each using an `EllipsePointMarker` to draw data points. Custom tooltip templates and legends are implemented by configuring a `RolloverModifier`, which overrides the default tooltip behavior as detailed in the [RolloverModifier documentation](https://www.scichart.com/documentation/js/current/RolloverModifier.html). Additional interactive behaviors are provided with zooming and panning modifiers such as `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` (refer to the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) for implementation guidance). WebAssembly is leveraged via the `wasmContext` to enhance performance, with more optimization techniques described in the [Performance Tips & Tricks documentation](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Features and Capabilities\nThis example highlights advanced features including real-time tooltip customization and dynamic legend templates. The custom tooltips display formatted x and y values along with a tailored legend rendered using inline SVG, enhancing data readability. Such capabilities are critical for interactive data analysis and can be further explored in the [Adding Tooltips and Legends tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2007%20-%20Adding%20Tooltips%20and%20Legends.html).\n\n### Integration and Best Practices\nThe implementation follows best practices in resource management by providing a dedicated destructor that calls `sciChartSurface.delete()` to properly dispose of the chart instance, as recommended in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. By integrating Fourier series data with custom point markers and interactivity through various chart modifiers, the example offers a comprehensive solution without relying on any framework-specific hooks or builder APIs. Developers can refer to the [SciChart.js User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html) for further insights on extending these techniques.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create **tooltips on mouse-over** using SciChart.js, High Performance JavaScript Charts",
                title: "Using Rollover Modifier Tooltips",
                pageTitle: "Using Rollover Modifier Tooltips",
                metaDescription:
                    "Demonstrates adding Tooltips on mouse-move to a React Chart with SciChart.js RolloverModifier",
                markdownContent:
                    "## Using Rollover Modifier Tooltips - React\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into a React application to create high performance 2D charts with advanced tooltip functionality. The implementation leverages the `<SciChartReact/>` component to initialize a chart with multiple line series and custom rollover tooltips, providing an interactive experience for users by displaying detailed information on mouse-over events.\n\n### Technical Implementation\nThe chart is created by calling an asynchronous function that sets up a `SciChartSurface` with X and Y numeric axes using a WebAssembly context for optimal performance. The example adds several `FastLineRenderableSeries` with custom point markers and applies a `RolloverModifier` to display tooltips. The `RolloverModifier` is configured with properties such as showing a vertical rollover line and custom tooltip templates provided via helper functions (`getTooltipDataTemplate` and `getTooltipLegendTemplate`). For a detailed guide on the RolloverModifier, refer to the [RolloverModifier documentation](https://www.scichart.com/documentation/js/current/RolloverModifier.html). The integration builds on the best practices for React as shown in the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) article and the [Tutorial 01 - Setting up a project with scichart-react and config object](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html).\n\n### Features and Capabilities\nThe example incorporates several advanced features including:\n- **Custom Tooltips:** Overriding the default tooltip behavior with custom data and legend templates allows flexible display of data details on hover.\n- **Interactive Modifiers:** In addition to the custom rollover tooltips, zoom and pan interactions are implemented using `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` to deliver a rich interactive experience. Check out the [ZoomPanModifier documentation](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) for more details on these interactions.\n- **Series Customization:** Individual series configuration is further enhanced by setting unique tooltip titles and colors for each data series, ensuring clarity and visual distinction.\n\n### Integration and Best Practices\nDesigned specifically for React, the example utilizes the `<SciChartReact/>` component to manage the chart lifecycle, ensuring proper initialization and cleanup. This approach follows [best practices for React integration](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) and aids in maintaining performance by leveraging WebAssembly for rendering efficiency. Developers can adopt the custom tooltip and legend patterns demonstrated here, and further optimize performance by reviewing the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation. This comprehensive use of chart modifiers and React integration techniques showcases how to build interactive and responsive chart components using SciChart.js in a React environment.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create **tooltips on mouse-over** using SciChart.js, High Performance JavaScript Charts",
                title: "Using Rollover Modifier Tooltips",
                pageTitle: "Using Rollover Modifier Tooltips",
                metaDescription:
                    "Demonstrates adding Tooltips on mouse-move to a Angular Chart with SciChart.js RolloverModifier",
                markdownContent:
                    '## Using Rollover Modifier Tooltips in Angular\n\n### Overview\nThis example, "Using Rollover Modifier Tooltips," demonstrates how to integrate high performance 2D charts with custom tooltip functionality into an Angular application using the `ScichartAngularComponent`. The application leverages Angular’s standalone component capability and utilizes the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for seamless integration.\n\n### Technical Implementation\nThe chart is initialized asynchronously using `SciChartSurface` in the Angular component, ensuring proper lifecycle management and optimized performance. The example creates numeric X and Y axes and adds multiple line series with custom point markers. It then integrates the `RolloverModifier` to provide dynamic tooltips and a custom SVG legend template, enabling detailed data display on mouse-over. For more details on the customization of tooltips, refer to the [Rollover Modifier](https://www.scichart.com/documentation/js/current/RolloverModifier.html) documentation.\n\n### Features and Capabilities\nThis example showcases several advanced features including: \n- **Custom Tooltip Templates:** Overriding default `tooltipDataTemplate` and `tooltipLegendTemplate` with functions to format both individual data point details and custom legend displays.\n- **Interactive Chart Modifiers:** Integration of zooming and panning features using modifiers like `ZoomPanModifier`, `ZoomExtentsModifier`, and `MouseWheelZoomModifier` ensures a rich user experience.\n- **Series Customization:** Each line series is configured with custom tooltip titles and distinct color settings, allowing for clear data differentiation.\n\n### Integration and Best Practices\nBy using Angular’s standalone components and third-party library integration best practices, this implementation demonstrates how to efficiently manage asynchronous initialization and cleanup of the `SciChartSurface`. Developers are encouraged to  explore [RolloverModifier Tooltips](https://www.scichart.com/documentation/js/current/RolloverModifier.html) documentation for additional customization. This example serves as a blueprint for deploying high-performance, interactive charts in Angular environments with advanced customizations and performance tuning built in.\n',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/RolloverModifier.html",
                title: "SciChart.js RolloverModifier Documentation",
                linkTitle: "RolloverModifier documentation",
            },
        ],
        path: "chart-rollovermodifier-tooltips",
        metaKeywords: "rollover, modifier, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/UsingRolloverModifierTooltips",
        thumbnailImage: "javascript-chart-rollovermodifier-tooltips.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const usingRolloverModifierTooltipsExampleInfo = createExampleInfo(metaData);
