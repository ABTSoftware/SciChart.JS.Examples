import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "CustomTheme",
        id: "chart2D_stylingAndTheming_CustomTheme",
        imagePath: "javascript-chart-custom-themed.jpg",
        description:
            "Demonstrates how to create a **Custom Theme** for SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **Custom Theme** for SciChart.js, High Performance JavaScript Charts",
                title: "Create a Custom Theme for JavaScript Chart",
                pageTitle: "Create a Custom Theme for JavaScript Chart",
                metaDescription:
                    "Demonstrates how to create a Custom Theme for a SciChart.js JavaScript Chart using our Theming API",
                markdownContent:
                    "## Create A Custom Theme for JavaScript Chart\n\n### Overview\nThis example demonstrates how to create and apply a **custom theme** to a SciChart.js chart using JavaScript. The implementation focuses on leveraging SciChart.js's extensive theming API to modify the appearance of various chart components—including axes, grid lines, series, and interactive modifiers—while ensuring high-performance rendering through WebGL.\n\n### Technical Implementation\nThe chart is initialized asynchronously via the [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) method, which sets up the required WebGL context for optimal performance. Once the surface is created, a custom theme is applied using the `sciChartSurface.applyTheme()` method, where properties like axis borders, series colors, and annotation styles (conforming to the `IThemeProvider` type) are defined. The example instantiates high-performance renderable series such as `FastLineRenderableSeries`, `FastCandlestickRenderableSeries`, and `FastColumnRenderableSeries` to efficiently visualize complex datasets.\n\n### Features and Capabilities\nKey features of this example include asynchronous chart initialization and dynamic data binding using data series like `XyDataSeries` and `OhlcDataSeries`. An interactive `RolloverModifier` enhances the chart experience by providing tooltips on mouse hover, which is particularly useful for real-time data updates. The custom theme not only personalizes the visual style but also contributes to performance optimizations by maintaining consistent styling across different chart elements.\n\n### Integration and Best Practices\nAlthough this implementation is built with JavaScript, it follows best practices that are applicable to any modern web application. Asynchronous initialization using promises ensures that the WebGL context is loaded efficiently, while a dedicated cleanup function properly disposes of the `SciChartSurface` to avoid memory leaks. Developers are encouraged to explore further details in the [SciChart.js Custom Theme Documentation](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) and consult the [SciChart.js initialization guidelines](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) to ensure robust implementation and optimal performance.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **Custom Theme** for SciChart.js, High Performance JavaScript Charts",
                title: "Create a Custom Theme for React Chart",
                pageTitle: "Create a Custom Theme for React Chart",
                metaDescription:
                    "Demonstrates how to create a Custom Theme for a SciChart.js React Chart using our Theming API",
                markdownContent:
                    "## Create a Custom Theme for React Chart\n\n### Overview\nThis example demonstrates how to create and apply a **custom theme** to a SciChart.js chart within a React application. It shows how to initialize a SciChart surface using the [SciChartReact component](https://www.scichart.com/blog/react-charts-with-scichart-js/) and configure various chart elements, making it easy to tailor the appearance of axes, series, and interactive tools with a consistent style. For futher details please see [the theming API](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20ThemeManager%20API.html).\n\n### Technical Implementation\nWithin the example, the chart is initialized by an asynchronous function that creates a `SciChartSurface` along with its underlying WebGL context. The custom theming is applied using the method `sciChartSurface.applyTheme()`, where a comprehensive set of properties conforming to `IThemeProvider` are defined for elements like grid backgrounds, axis borders, series colors, and annotations. The chart setup includes the configuration of a `NumericAxis` for both the X and Y axes, with custom visible ranges and label formatting as defined in the [NumericAxis documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html). Moreover, performance is enhanced by using high-performance renderable series such as `FastLineRenderableSeries`, `FastCandlestickRenderableSeries`, and `FastColumnRenderableSeries` along with the interactive `RolloverModifier` to provide dynamic tooltips on hover.\n\n### Features and Capabilities\nThis example offers advanced capabilities including complete theme customization and efficient data visualization. The custom theme modifies properties like the background colors, stroke colors, and overlays across different chart parts, allowing developers to maintain brand consistency.\n\n### Integration and Best Practices\nThe integration leverages React by including the `<SciChartReact/>` component, ensuring that the chart creation logic is neatly wrapped in a React component for easy reuse and integration. Developers are encouraged to follow best practices for applying custom themes and performance optimizations, as demonstrated in this example and further detailed in the [Custom Theme Documentation](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html). This approach not only simplifies the chart configuration but also aligns with efficient rendering principles, which is critical for handling large datasets or interactive scenarios as described in various performance optimization guides available on the SciChart website.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Custom Theme** for SciChart.js, High Performance JavaScript Charts",
                title: "Create a Custom Theme for Angular Chart",
                pageTitle: "Create a Custom Theme for Angular Chart",
                metaDescription:
                    "Demonstrates how to create a Custom Theme for a SciChart.js Angular Chart using our Theming API",
                markdownContent:
                    "## Create a Custom Theme for Angular Chart\n\n### Overview\nThis example demonstrates how to create and apply a **custom theme** to a SciChart.js chart within an Angular application. Using an Angular standalone component with the `ScichartAngularComponent`, the example encapsulates chart initialization, theming, and data binding in a streamlined manner.\n\n### Technical Implementation\nThe chart is initialized asynchronously by calling `SciChartSurface.create()`, which sets up the required WebGL context for efficient rendering. The custom theme is applied via the `sciChartSurface.applyTheme()` method, where extensive styling properties conforming to `IThemeProvider` for axes, grid lines, series colors, and annotations are defined. This approach is detailed in the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation. Furthermore, `NumericAxis` objects are configured with custom visible ranges and label formatting, as described in the [NumericAxis documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html), ensuring precise axis behavior.\n\n### Features and Capabilities\nThe implementation incorporates high-performance renderable series including `FastLineRenderableSeries`, `FastCandlestickRenderableSeries`, and `FastColumnRenderableSeries` to efficiently manage complex datasets. An interactive `RolloverModifier` enhances the chart experience by providing dynamic tooltips on mouse hover. Additionally, the example demonstrates robust data binding using `XyDataSeries` and `OhlcDataSeries`, making it easy to update and visualize data in real-time.\n\n### Integration and Best Practices\nBuilt as an Angular standalone component, the example leverages best practices for asynchronous initialization and WebGL context management in Angular applications. This design simplifies bootstrapping and integrates seamlessly with Angular using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. By applying a comprehensive custom theme, developers are encouraged to explore advanced styling options and performance optimizations provided by SciChart.js. Overall, the example serves as an effective demonstration of integrating custom theming in Angular while maintaining high-performance rendering and dynamic data updates.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html",
                title: "SciChart.js Custom Theme Documentation",
                linkTitle: "Custom Theme documentation",
            },
        ],
        path: "chart-custom-themes",
        metaKeywords: "theming, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/StylingAndTheming/CreateACustomTheme",
        thumbnailImage: "javascript-chart-custom-themed.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

export const createACustomThemeExampleInfo = createExampleInfo(metaData);
export default createACustomThemeExampleInfo;
