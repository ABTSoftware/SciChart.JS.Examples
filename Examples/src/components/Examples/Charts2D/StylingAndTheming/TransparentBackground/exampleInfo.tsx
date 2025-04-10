import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "TransparentBackground",
        id: "chart2D_stylingAndTheming_TransparentBackground",
        imagePath: "javascript-chart-transparent-background.jpg",
        description:
            "Demonstrates how to create a **Chart with Transparent Background** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **Chart with Transparent Background** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Background Image with Transparency",
                pageTitle: "Chart Background Image with Transparency",
                metaDescription:
                    "Demonstrates how to create a JavaScript Chart with background image using transparency in SciChart.js",
                markdownContent:
                    '## Charts with Transparent Backgrounds Example using JavaScript\n\n### Overview\nThis example demonstrates how to create a SciChart.js chart with a fully transparent background. By setting the chart\'s background to "Transparent", the underlying DOM—such as a CSS background image—can be seen, enabling rich visual integrations for custom-themed web applications.\n\n### Technical Implementation\nImplemented in JavaScript, the chart is initialized asynchronously using the `SciChartSurface.create()` method. Performance is optimized through the use of WebAssembly (wasmContext), ensuring fast rendering and high responsiveness. The numeric axes are configured with custom grid lines, band fills, and label styles as detailed in the [Axis Styling: Title, Labels, Gridlines and Axis Band Style](https://www.scichart.com/documentation/js/current/Axis%20Styling%20-%20Title,%20Labels,%20Gridlines%20and%20Axis%20Bands.html) documentation. The transparent background is applied by setting `sciChartSurface.background` to `"Transparent"`, a technique explained in the [Transparent Background documentation](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Images%20in%20Background.html).\n\n### Features and Capabilities\nThe chart incorporates several renderable series including a spline line, bubble, and column series. Each series utilizes dynamic animations—such as `SweepAnimation` and `WaveAnimation` — to create engaging visual effects, a concept described in the [Series Startup Animations documentation](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html). Additionally, interactive modifiers like `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier` are added to enable smooth real-time navigation and user interaction.\n\n### Integration and Best Practices\nThis example follows best practices for high-performance charting by leveraging the WebAssembly context for rendering efficiency. Data series are configured using clear JSON-style setups, making it straightforward to modify and extend the chart\'s functionality as needed. Developers can refer to the [Working with Data documentation](https://www.scichart.com/documentation/js/current/Working%20with%20Data.html) for more details on customizing series and interactivity. Overall, this transparent background example serves as a solid reference for integrating SciChart.js into JavaScript projects requiring advanced styling and seamless background integration.',
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **Chart with Transparent Background** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Background Image with Transparency",
                pageTitle: "Chart Background Image with Transparency",
                metaDescription:
                    "Demonstrates how to create a React Chart with background image using transparency in SciChart.js",
                markdownContent:
                    '## Chart Transparent Background Example in React\n\n### Overview\nThis example demonstrates how to create a chart with a **transparent background** using SciChart.js in a React application. In this setup, `sciChartSurface.background` is explicitly set to `"Transparent"` so that an underlying CSS background image applied to the React component can show through, offering designers extensive custom styling opportunities.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the `SciChartSurface.create()` method within the context of a React component. This initialization is managed by the `<SciChartReact/>` component, which takes an `initChart` function to instantiate and configure the high-performance WebAssembly-based chart. For an in-depth look at this pattern, refer to the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) guide.\n\n### Features and Capabilities\nThe implementation includes interactive features such as zooming and panning, achieved by integrating interactive modifiers like `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier`. Additionally, the example leverages animated series using `SweepAnimation` and `WaveAnimation` to enhance visual engagement. Numeric axes are configured with consistent styling for grid lines, labels, and titles to ensure a clean display. Detailed information on the animation features can be found in the [Series Startup Animations](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html) documentation.\n\n### Integration and Best Practices\nFrom a React integration perspective, the `<SciChartReact/>` component simplifies the lifecycle management of the chart, making it easy to incorporate into existing applications. The example illustrates how to combine in-line CSS styling, such as a full background image, with transparent chart backgrounds to create visually appealing and interactive charts. This approach aligns well with best practices discussed in [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) and the officially documented [Chart Styling - Image, Transparent or Blurred Backgrounds](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Images%20in%20Background.html) guide. Additionally, the use of WebAssembly (wasmContext) ensures that performance is optimized even when complex interactions are used. For more on integrating interactive charts in React, developers may find the [scichart-react GitHub repository](https://github.com/ABTSoftware/scichart-react) useful.',
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Chart with Transparent Background** using SciChart.js, High Performance JavaScript Charts",
                title: "Chart Background Image with Transparency",
                pageTitle: "Chart Background Image with Transparency",
                metaDescription:
                    "Demonstrates how to create a Angular Chart with background image using transparency in SciChart.js",
                markdownContent:
                    '## Chart with Transparent Background Example in Angular\n\n### Overview\nThis example demonstrates how to create a SciChart.js chart with a **transparent background** in an Angular application. By setting the `sciChartSurface.background` to `"Transparent"`, the underlying DOM (such as a background image styled via CSS) can show through, allowing developers to seamlessly integrate rich visual designs into their Angular apps.\n\n### Technical Implementation\nThe chart is initialized asynchronously using the `SciChartSurface.create()` method, which leverages WebAssembly (`wasmContext`) for optimal performance. The example configures numeric axes with custom gridlines, labels, and axis bands, ensuring that the transparent background is clearly visible. Interactive modifiers, including `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier`, are added to enhance user interactivity. For more details on styling with transparent backgrounds, developers can refer to the [Chart Styling - Image, Transparent or Blurred Backgrounds](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Images%20in%20Background.html) documentation.\n\n### Features and Capabilities\nMultiple renderable series such as a spline line series, bubble series, and column series are integrated into the chart. Each series employs animations like `SweepAnimation` and `WaveAnimation` to create dynamic visual effects. Furthermore, meticulous axis styling is applied—covering grid line colors, axis bands, and label styling—as outlined in the [Title, Labels, Gridlines and Axis Band Style](https://www.scichart.com/documentation/js/current/Axis%20Styling%20-%20Title,%20Labels,%20Gridlines%20and%20Axis%20Bands.html) guide.\n\n### Integration and Best Practices\nThis example illustrates effective Angular integration by asynchronously initializing the chart, managing the lifecycle within Angular components, and applying interactive behaviors for better user experience. Setup instructions for integrating SciChart.js to Angular can be found in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Additionally, the incorporation of zoom and pan functionalities adheres to recommendations found in [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html), making this example a robust reference for high-performance and visually appealing chart implementations in Angular.',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Images%20in%20Background.html",
                title: "How to add a background image with transparency documentation",
                linkTitle: "Custom Theme documentation",
            },
        ],
        path: "chart-transparent-background",
        metaKeywords: "styling, transparent, background, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/TransparentBackground",
        thumbnailImage: "javascript-chart-transparent-background.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const transparentBackgroundExampleInfo = createExampleInfo(metaData);
export default transparentBackgroundExampleInfo;
