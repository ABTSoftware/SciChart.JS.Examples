import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DAxisLabelCustomizationRotatedLabels",
        imagePath: "javascript-rotated-labels-chart.jpg",
        description:
            "Demonstrates how to use **Rotation and Alignment of Axis Labels** with SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use **Rotation and Alignment of Axis Labels** with SciChart.js, High Performance JavaScript Charts",
                title: "Rotated Axis Labels and Alignment",
                pageTitle: "Rotated Axis Labels and Alignment",
                metaDescription: "Rotate to create vertical axis labels and fit more on an axis",
                markdownContent:
                    "## Rotated Axis Labels and Alignment in JavaScript\n\n### Overview\nThis example demonstrates how to customize and rotate axis labels using SciChart.js in a pure JavaScript setting. The main objective is to rotate the X-Axis labels by 90 degrees and apply custom date formatting, which allows more labels to be displayed without overlap when visualizing time series data.\n\n### Technical Implementation\nThe chart is asynchronously initialized by creating a `SciChartSurface` along with its WebAssembly context. A `NumericAxis` is configured for the X-Axis with properties such as `axis.labelFormat` (using the date format `ENumericFormat.Date_DDMMYYYY`), increased tick counts, and a `axis.rotation` value set to 90 degrees. Dynamic time series data is generated and rendered using a `SplineMountainRenderableSeries` that incorporates both gradient fills and a wave animation effect. Developers looking for advanced axis customization can refer to the [Rotating Axis Labels](https://www.scichart.com/documentation/js/current/RotatingAxisLabels.html) documentation, while additional details about date formatting are available in [The DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/DateTimeNumericAxis.html) guide.\n\n### Features and Capabilities\nThe implementation highlights several advanced features, including real-time chart updates due to dynamic data generation, visually appealing gradient fills, and smooth transition animations provided by the wave animation effect. For more insights into how such spline mountain charts are constructed, you can review the [JavaScript Spline Mountain Area Chart](https://www.scichart.com/example/javascript-chart/javascript-spline-mountain-chart/) documentation.\n\n### Integration and Best Practices\nIn this JavaScript example, the asynchronous initialization not only enhances performance through WebAssembly integration but also ensures proper resource management. A destructor function is provided to clean up the `SciChartSurface` when the chart is no longer needed, aligning with best practices detailed in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). Moreover, developers interested in configuring animation effects will benefit from the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html), which explains how to fine-tune parameters such as duration and fade effects for an optimal display.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use **Rotation and Alignment of Axis Labels** with SciChart.js, High Performance JavaScript Charts",
                title: "Rotated Axis Labels and Alignment",
                pageTitle: "Rotated Axis Labels and Alignment",
                metaDescription: "Rotate to create vertical axis labels and fit more on an axis",
                markdownContent:
                    "## Rotated Axis Labels and Alignment with React\n\n### Overview\nThis example demonstrates how to implement **rotated axis labels** within a React application using SciChart.js. It focuses on configuring the primary axes with customized label formatting, rotation, and alignment to provide better readability and space utilization. The rotating of the X-Axis labels to 90 degrees enables the display of more labels without overlapping, which is particularly useful when working with date-based data.\n\n### Technical Implementation\nThe example initializes the `SciChartSurface` asynchronously using the React component `<SciChartReact/>`. The chart is set up with a `NumericAxis` for both the X and Y axes. The X-Axis is configured with  `axis.rotation` set to 90 degrees and a custom date format `axis.labelFormat` set to `ENumericFormat.Date_DDMMYYYY` to support date-based values. Data is generated to simulate a time series and is rendered using a `SplineMountainRenderableSeries` with gradient fill and a wave animation effect. Developers interested in how to implement rotated labels can refer to the [Rotating Axis Labels documentation](https://www.scichart.com/documentation/js/current/RotatingAxisLabels.html) for more details.\n\n### Features and Capabilities\nThis example highlights several advanced features of SciChart.js in a React context, including: \n- **Axis Label Rotation and Alignment**: Customization of axis labels for improved layout.\n- **Gradient Fills and Animations**: The use of a gradient linear fill combined with a wave animation that enhances visual appeal.\n- **Dynamic Data Generation**: Demonstrating how to simulate time-series data for a mountain chart.\nThe mountain series implementation can be explored further in the [JavaScript Mountain Area Chart example](https://www.scichart.com/example/javascript-chart/javascript-mountain-chart/).\n\n### Integration and Best Practices\nThe integration leverages the `<SciChartReact/>` component, which simplifies embedding high-performance charts into a React application. The asynchronous initialization using async/await ensures that the WebAssembly context is properly handled, as detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. For optimal performance and resource management, the example also demonstrates best practices for cleaning up the `SciChartSurface`. Developers can learn more about efficient component integration from the article [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\nFor further reading on configuring the `NumericAxis` and tick customization, visit the [Numeric Axis documentation](https://www.scichart.com/documentation/js/current/NumericAxis.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use **Rotation and Alignment of Axis Labels** with SciChart.js, High Performance JavaScript Charts",
                title: "Rotated Axis Labels and Alignment",
                pageTitle: "Rotated Axis Labels and Alignment",
                metaDescription: "Rotate to create vertical axis labels and fit more on an axis",
                markdownContent:
                    "## Rotated Axis Labels and Alignment in Angular\n\n### Overview\nThis example demonstrates how to implement **rotated axis labels** using SciChart.js within an Angular application. The primary goal is to enhance the readability of the X-Axis labels by rotating them 90 degrees, which allows more date-based data points to be displayed without overlap.\n\n### Technical Implementation\nThe chart is initialized asynchronously by creating a `SciChartSurface` and a WebAssembly context. A `NumericAxis` is configured for the X-Axis with a custom date format and a rotation value of 90 degrees, while additional properties such as increased major tick counts ensure optimal spacing. Dynamic time series data is generated and visualized using a `SplineMountainRenderableSeries` with gradient fill and a wave animation effect. This implementation follows best practices described in the [Spline Mountain Chart Documentation](https://www.scichart.com/documentation/js/current/The%20Spline%20(Smoothed)%20Mountain%20Series%20Type.html) and leverages axis customization techniques detailed in the [SciChart.js Axis Label Formatting Documentation](https://www.scichart.com/documentation/js/current/RotatingAxisLabels.html).\n\n### Features and Capabilities\nKey features of this example include:\n- **Axis Label Rotation and Alignment**: The X-Axis labels are rotated 90 degrees for better spacing and readability by setting `axis.rotation`.\n- **Dynamic Data Binding**: Time series data is generated on the fly for rendering in a Spline Mountain chart.\n- **Advanced Visual Effects**: The use of gradient fills and wave animation demonstrates enhanced visual customization as outlined in the [Animations API](https://www.scichart.com/documentation/js/current/Animations%20API.html).\n\n### Integration and Best Practices\nIn an Angular setting, integration involves embedding the chart creation within Angular components and properly managing resources. Developers are encouraged to initialize `SciChartSurface` in lifecycle hooks like `ngAfterViewInit` and dispose of it in `ngOnDestroy`, following recommendations from the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) documentation. For further customization and theming, refer to the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) guide. This example provides a robust foundation for integrating high-performance SciChart.js charts with advanced axis label customization in Angular applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/RotatingAxisLabels.html",
                title: "The SciChart.js rotated labels documentation page",
                linkTitle: "SciChart.js Axis Label Formatting Documentation",
            },
        ],
        path: "rotated-labels",
        metaKeywords: "Axis, label, rotated, vertical, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/AxisLabelCustomization/RotatedLabels",
        thumbnailImage: "javascript-rotated-labels-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const rotatedLabelsExampleInfo = createExampleInfo(metaData);
