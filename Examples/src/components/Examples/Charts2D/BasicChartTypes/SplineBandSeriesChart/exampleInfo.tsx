import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesSplineBandSeriesChart",
        imagePath: "javascript-spline-band-chart.jpg",
        description:
            "Demonstrates how to create a **JavaScript Spline Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Software",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Spline Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Software",
                title: "JavaScript Spline Band Chart",
                pageTitle: "JavaScript Spline Band Chart | JavaScript Charts | SciChart",
                metaDescription:
                    "SciChart's JavaScript Spline Band Chart makes it easy to draw thresholds or fills between two lines on a chart. Get your free demo today.",
                markdownContent:
                    "# Spline Band Series Chart Example in Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a **Spline Band Series Chart** using SciChart.js in a Vanilla JavaScript environment. The implementation visualizes two spline band series with high-low fills, utilizing dual Y axes for comparing different data ranges. It leverages custom styling, smooth interpolation, and interactive annotations to deliver an engaging charting experience.\n\n## Technical Implementation\nThe chart is initialized asynchronously using the SciChartSurface.create method as described in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation. Two NumericAxes are configured for distinct visual zones with custom styles, as detailed in the [Numeric Axis Documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html). Data for the spline band is managed by the **XyyDataSeries** which stores dual-line datasets, and is rendered using the **SplineBandRenderableSeries**. Smooth spline curves are achieved by setting interpolation points and applying the [XyyBezierRenderDataTransform](https://www.scichart.com/documentation/js/current/typedoc/classes/xyybezierrenderdatatransform.html) with customizable curvature.\n\n## Features and Capabilities\nKey features include real-time update capabilities via an interactive **AxisMarkerAnnotation** that allows dynamic adjustment of the Bezier transform curvature. The series incorporate smooth animations using the **ScaleAnimation** for a refined rendering effect. Advanced spline interpolation is enabled by specifying interpolation points, ensuring that the chart curves are rendered with high visual fidelity, as explained in [The Spline (Smoothed) Band Series Type](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Band%20Series%20Type.html). Interactive m odifiers, such as the YAxisDragModifier and MouseWheelZoomModifier, further enhance the user experience by providing intuitive controls for data navigation and zooming.\n\n## Integration and Best Practices\nThis example follows best practices for asynchronous initialization and proper disposal in a vanilla JavaScript context. After creation, the chart instance is disposed using the sciChartSurface.delete() method to manage resources effectively, as recommended in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide. Developers are encouraged to explore the use of custom data series (such as **XyyDataSeries**), configurable animations, and interactive annotations to build high-performance and responsive charting applications in vanilla JavaScript. The approach demonstrated here provides a clear model for integrating SciChart.js into non-framework-specific environments, ensuring optimal performance and ease of customization.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Spline Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Software",
                title: "React Spline Band Chart",
                pageTitle: "React Spline Band Chart | JavaScript Charts | SciChart",
                metaDescription:
                    "SciChart's React Spline Band Chart makes it easy to draw thresholds or fills between two lines on a chart. Get your free demo today.",
                markdownContent:
                    "# Spline Band Series Chart Example - React\n\n## Overview\nThis example demonstrates how to render a **Spline Band Series Chart** using SciChart.js in a React environment. The chart displays two spline band series with smooth interpolations and dynamic annotations, enabling the visualization of overlapping high-low filled areas. The example leverages asynchronous initialization for efficient resource loading and incorporates interactive features for enhanced user engagement.\n\n## Technical Implementation\nThe chart is implemented using a React functional component that integrates the SciChart.js library through the `SciChartReact` component. The asynchronous initialization of the SciChartSurface is achieved with async/await in the custom `drawExample` function, following practices outlined in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). The series data is constructed using the **XyyDataSeries** which is then visualized via a **SplineBandRenderableSeries**. In addition, a Bezier transform, implemented through the **XyyBezierRenderDataTransform**, enables smooth interpolation of data points, enhancing the visual quality of the chart.\n\n## Features and Capabilities\nThe example showcases several advanced features including real-time updates via draggable annotations (AxisMarkerAnnotation) and interactive chart modifiers like **YAxisDragModifier** and **MouseWheelZoomModifier**. The inclusion of [ScaleAnimation](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html) provides smooth transition effects when the chart is rendered. Moreover, multiple Y-axes are configured with custom styling to compare different data ranges side-by-side. For more details on spline band chart specifics, refer to [The Spline (Smoothed) Band Series Type](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Band%20Series%20Type.html).\n\n## Integration and Best Practices\nReact integration is streamlined by using the dedicated [SciChart React component](https://www.scichart.com/blog/react-charts-with-scichart-js/), which encapsulates the complexity of chart initialization and rendering. The asynchronous model not only improves load times but also facilitates better resource management and cleanup. Developers are encouraged to explore advanced features such as interactive annotations and custom transforms for enhanced data visualization, while following best practices for component lifecycle and performance optimization as highlighted in the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) documentation. Additionally, using built-in chart modifiers improves interactivity and usability, contributing to modern, responsive charting solutions.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Spline Band Chart** or High-Low Fill using SciChart.js, our High Performance JavaScript Chart Software",
                title: "Angular Spline Band Chart",
                pageTitle: "Angular Spline Band Chart | JavaScript Charts | SciChart",
                metaDescription:
                    "SciChart's Angular Spline Band Chart makes it easy to draw thresholds or fills between two lines on a chart. Get your free demo today.",
                markdownContent:
                    "# Angular Spline Band Series Chart Example\n\n## Overview\nThis example demonstrates how to create an **Angular Spline Band Chart** using SciChart.js. The chart visualizes two spline band series with high-low fills and smooth interpolations, leveraging advanced features such as real-time interactive annotations and multiple Y-axes. The sample is built as an Angular standalone component and utilizes the [scichart-angular](https://www.npmjs.com/package/scichart-angular) integration, ensuring seamless embedding of SciChart within an Angular application.\n\n## Technical Implementation\nThe chart is initialized asynchronously by calling the SciChartSurface.create method, which is integrated within an Angular component. This pattern follows asynchronous initialization best practices, as described in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation. The example sets up two NumericAxes (one on the left and a secondary axis on the right) and populates data using the **XyyDataSeries** to represent two datasets for the spline band. A **SplineBandRenderableSeries** is configured with custom styling for strokes, fills, and point markers, and enhanced with a **ScaleAnimation** to provide smooth render transitions. Additionally, a **XyyBezierRenderDataTransform** is applied to one of the series to perform smooth spline interpolation with adjustable curvature, as referenced in the [XyyBezierRenderDataTransform](https://www.scichart.com/documentation/js/current/typedoc/classes/xyybezierrenderdatatransform.html) documentation.\n\n## Features and Capabilities\nThe example showcases several key features including the ability to update chart parameters in real time. An interactive **AxisMarkerAnnotation** is implemented, allowing users to adjust the Bezier curvature dynamically. Furthermore, interactive modifiers such as **YAxisDragModifier** and **MouseWheelZoomModifier** enable intuitive mouse-based interactions, enhancing the user experience. Multiple Y-axes are configured with distinct visual styles, allowing users to compare different data ranges side-by-side; additional technical details can be found in the [Tutorial 08 - Adding Multiple Axis](https://www.scichart.com/documentation/js/current/Tutorial%2008%20-%20Adding%20Multiple%20Axis.html) guide.\n\n## Integration and Best Practices\nThe integration is designed following Angular best practices by implementing a standalone component which encapsulates the SciChart setup. Efficient performance optimization is achieved through asynchronous resource loading and careful memory management, as recommended in the [Memory Best Practices | JavaScript Chart Documentation](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html). Developers can further explore interactive chart modifications and custom theming—such as configuring interpolation points and applying custom fill and stroke styles—to create highly responsive and visually appealing charts. The use of [interactive modifiers](https://www.scichart.com/documentation/js/current/MouseWheelZoomModifier.html) and [smooth animations](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html) illustrates the powerful capabilities provided by SciChart.js when integrated with Angular.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Spline%20(Smoothed)%20Band%20Series%20Type.html",
                title: "This specific page in the JavaScript Spline Band Chart documentation will help you to get started",
                linkTitle: "JavaScript Spline Band Documentation",
            },
        ],
        path: "spline-band-chart",
        metaKeywords: "band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/SplineBandSeriesChart",
        thumbnailImage: "javascript-spline-band-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const splineBandSeriesChartExampleInfo = createExampleInfo(metaData);
