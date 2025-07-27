import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "LineSplittingThresholds",
        id: "chart2D_stylingAndTheming_LineSplittingThresholds",
        imagePath: "javascript-chart-line-splitting-thresholds.jpg",
        description:
            "Demonstrates how to split lines into multiple segments so they can be individually colored according to thresholds, using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add additional points.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to split lines into multiple segments so they can be individually colored according to thresholds, using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add additional points.",
                title: "JavaScript Chart with lines split by thresholds",
                pageTitle: "JavaScript Chart with lines split by thresholds",
                metaDescription:
                    "Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds",
                markdownContent:
                    "## Line Splitting Thresholds - JavaScript Example\n\n### Overview\nThis example demonstrates how to split a line series into multiple segments based on defined threshold values using SciChart.js in JavaScript. The approach allows each segment to be individually colored by detecting where the data crosses specified thresholds and then applying interpolation to insert new points.\n\n### Technical Implementation\nThe core of this example is a custom `RenderDataTransform` that calculates intersections between data points and thresholds. This technique follows the guidelines outlined in the [RenderDataTransforms API documentation](https://www.scichart.com/documentation/js/current/RenderDataTransform%20API.html). In addition, a custom `PaletteProvider` is implemented to assign different colors to each segment based on the current threshold level, as described in the [PaletteProvider API documentation](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html). Observable arrays provided by SciChart.js, particularly [ObservableArrayBase](https://www.scichart.com/documentation/js/current/typedoc/classes/observablearraybase.html), are used to detect changes in threshold values and trigger re-rendering of the chart. The interpolation logic responsible for calculating the exact intersection points leverages standard linear interpolation techniques.\n\n### Features and Capabilities\nThe example showcases several advanced features: \n- **Real-Time Updates:** Updating threshold values via draggable horizontal annotations instantly recalculates the line segments.\n- **Dynamic Coloring:** The custom palette provider assigns different colors to each segment, enhancing visual clarity.\n- **Rendering Performance:** Utilizing the high-performance `FastLineRenderableSeries` ensures the chart remains responsive even with additional points created through interpolation. Developers interested in optimizing rendering can refer to the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Integration and Best Practices\nBuilt with pure JavaScript, this example follows best integration practices for SciChart.js without relying on additional frameworks or builder APIs. Developers looking to integrate SciChart.js into standard web applications can benefit from the comprehensive guide available in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). The modular structure and use of custom render transforms and palette providers make this example an excellent starting point for developing interactive, high-performance charts with dynamic data transformation capabilities.",
            },
            react: {
                subtitle:
                    "Demonstrates how to split lines into multiple segments so they can be individually colored according to thresholds, using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add additional points.",
                title: "React Chart with lines split by thresholds",
                pageTitle: "React Chart with lines split by thresholds",
                metaDescription:
                    "Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds",
                markdownContent:
                    "## Line Splitting Thresholds - React\n\n### Overview\nThis example demonstrates how to split a line into multiple segments that are individually colored based on threshold values. Built using SciChart.js in a React application, it enables dynamic, real-time updates as users interact with the chart through draggable threshold annotations.\n\n### Technical Implementation\nThe core of this example lies in extending the `BaseRenderDataTransform` to create a custom render data transform that integrates coordinate interpolation for threshold intersections. This transform calculates where the line data crosses predefined thresholds and injects additional points to enable segmented coloring. The implementation leverages [The RenderDataTransform API](https://www.scichart.com/documentation/js/current/RenderDataTransform%20API.html) for its advanced transformation capabilities. In addition, a custom `PaletteProvider` is implemented to assign colors dynamically based on the current threshold level. This approach to per-point coloring follows [The PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html) guidelines and ensures smooth visual transitions. Performance optimizations are addressed through the use of `FastLineRenderableSeries`, which ensures high rendering performance even when managing additional points for threshold intersections.\n\n### Features and Capabilities\nThe example provides several advanced features and capabilities including: \n- **Real-Time Updates:** As users drag the horizontal threshold annotations, the render data transform recalculates intersections and updates the line segments instantly.\n- **Dynamic Coloring:** The custom palette provider assigns colors to the line segments based on the current threshold levels, enabling clear visual delineation between data segments.\n- **Interactive Annotations:** The use of draggable [HorizontalLineAnnotation](https://www.scichart.com/documentation/js/current/HorizontalLineAnnotation.html) components allows for intuitive threshold adjustments, further enhancing user interactivity.\n- **Efficient Data Handling:** Utilizing observable arrays, the code efficiently manages threshold updates through the `collectionChanged` event of `ObservableArrayBase`. For more on observable arrays, see the [ObservableArrayBase documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/observablearraybase.html).\n\n### Integration and Best Practices\nIntegration in a React environment is achieved via the `<SciChartReact/>` component, making it easy to embed SciChart.js charts within modern React applications. The example follows [best practices for React integration](https://www.scichart.com/blog/react-charts-with-scichart-js/) by encapsulating chart initialization and using modular components for a clean, maintainable architecture. Developers are encouraged to review the provided documentation on interactive annotations and performance optimization techniques when adapting these patterns for their own applications. Furthermore, the threshold interpolation logic demonstrated here serves as an excellent guide for implementing more complex data transformation and real-time update scenarios in a React-based charting environment.\n",
            },
            angular: {
                subtitle:
                    "Demonstrates how to split lines into multiple segments so they can be individually colored according to thresholds, using SciChart.js, High Performance JavaScript Charts. This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add additional points.",
                title: "Angular Chart with lines split by thresholds",
                pageTitle: "Angular Chart with lines split by thresholds",
                metaDescription:
                    "Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds",
                markdownContent:
                    "## Line Splitting Thresholds - Angular Chart Example\n\n### Overview\nThis example demonstrates an Angular implementation of SciChart.js where a line series is split into multiple segments to enable individual coloring based on specific threshold values. The solution leverages a custom `RenderDataTransform` to calculate and interpolate the intersections between the original data and defined thresholds, allowing for dynamic, real-time updates.\n\n### Technical Implementation\nThe core functionality is implemented by extending the SciChart.js API with a custom `RenderDataTransform` that detects when the line series crosses threshold levels and injects additional points using linear interpolation. This allows the visualization to precisely mark the threshold crossings. In addition, a custom PaletteProvider is implemented to assign colors to each segment based on its current threshold. For detailed guidance on creating custom render transforms in Angular, developers can check out the [RenderDataTransforms API Documentation](https://www.scichart.com/documentation/js/current/RenderDataTransform%20API.html).\n\n### Features and Capabilities\nThe example includes several advanced features:\n- **Real-Time Updates:** Draggable horizontal line annotations allow threshold adjustments on the fly, with observable arrays handling threshold changes and triggering a rerun of the interpolation logic.\n- **Dynamic Coloring:** The custom `PaletteProvider` dynamically assigns colors to line segments based on their threshold levels using the [PaletteProvider API](https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html).\n- **Efficient Rendering:** By using the high-performance `FastLineRenderableSeries` and efficient observable event handling, the chart maintains excellent rendering performance even with added interpolation points.\n- **Interactive Annotations:** Users can adjust thresholds interactively via horizontal line annotations. More details on implementing interactive annotations can be found in the [Tutorial 06 - Adding Annotations](https://www.scichart.com/documentation/js/current/Tutorial%2006%20-%20Adding%20Annotations.html) documentation.\n\n### Integration and Best Practices\nThis Angular example demonstrates how to integrate SciChart.js seamlessly within an Angular application without relying on additional APIs like hooks or builder APIs. High-performance practices are emphasized through the use of `FastLineRenderableSeries` and observable arrays for efficient data handling. Developers are encouraged to review performance optimization strategies as detailed in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation and adopt similar patterns in their own Angular integrations. By combining custom render transforms with interactive annotations and dynamic color assignment, the example serves as a comprehensive guide to implementing advanced charting features in Angular using SciChart.js.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20PaletteProvider%20API.html",
                title: "The PaletteProvider API documentation",
                linkTitle: "SciChart.js PaletteProvider documentation",
            },
        ],
        path: "line-splitting-thresholds",
        metaKeywords: "thresholds, coloring, chart, javascript, webgl, canvas",
        onWebsite: false,
        filepath: "Charts2D/StylingAndTheming/LineSplittingThresholds",
        thumbnailImage: "javascript-chart-line-splitting-thresholds.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

export const lineSplittingThresholdsExampleInfo = createExampleInfo(metaData);
export default lineSplittingThresholdsExampleInfo;
