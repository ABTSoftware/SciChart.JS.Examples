import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "EditableAnnotations",
        id: "chart2D_chartAnnotations_EditableAnntations",
        imagePath: "javascript-chart-editable-annotations.jpg",
        description:
            "Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) to a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) to a **JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Chart Editable Annotations",
                pageTitle: "JavaScript Chart Editable Annotations",
                metaDescription:
                    "Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) over a JavaScript Chart using SciChart.js Annotations API",
                markdownContent:
                    "## Editable Annotations - JavaScript\n\n### Overview\nThis example demonstrates how to create an interactive 2D chart using SciChart.js with a focus on editable annotations such as text, lines, boxes, and custom SVG image annotations. The implementation is built using JavaScript and leverages the high-performance capabilities of SciChart.js with a WebAssembly context.\n\n### Technical Implementation\nThe chart is initialized using the `SciChartSurface` API with a WebAssembly context, as outlined in the [SciChart.js Web Tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html). Numeric X and Y axes are created and configured using the `NumericAxis` class. Various annotation types are then programmatically added to the chart by directly instantiating classes such as `TextAnnotation`, `HorizontalLineAnnotation`, `VerticalLineAnnotation`, LineAnnotation, `BoxAnnotation`, and even a `CustomAnnotation` created via an SVG string. Each annotation’s editability is controlled through the `isEditable` property, allowing users to click, drag, and resize annotations in real time. Custom behavior is introduced using event handlers like `onHover` within the annotations and the `AnnotationHoverModifier` for interactive tooltip feedback, as described in the [Editable Annotations](https://www.scichart.com/documentation/js/current/EditableAnnotations.html) and [Annotation Hover](https://www.scichart.com/documentation/js/current/AnnotationHover.html). Coordinate transformation functions such as `translateFromCanvasToSeriesViewRect()` and `translateToNotScaled()` are used to accurately position tooltips relative to the chart.\n\n### Features and Capabilities\nThe example provides real-time update capabilities where annotations can be immediately modified by the user. Advanced features include: \n- **Editable Annotations:** Annotations can be interactively moved and resized with simple mouse operations.\n- **Custom SVG Annotations:** A custom annotation is created using an SVG overlay, showcasing the flexibility of the [CustomAnnotation](https://www.scichart.com/documentation/js/current/CustomAnnotation.html) API.\n- **Chart Modifiers:** `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier` are used to enable smooth zooming and panning functionalities.\n- **Native Text Annotation Enhancements:** Editable `NativeTextAnnotations` support word-wrap and scale on resize, enhancing responsiveness as described in the [NativeTextAnnotation Documentation](https://www.scichart.com/documentation/js/current/NativeTextAnnotation.html).\n- **Animated Tooltips:** Tooltips are animated using the `GenericAnimation` class combined with easing functions, which helps provide dynamic feedback to the user. Detailed animation capabilities can be explored in the [Generic Animations Documentation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html).\n\n### Integration and Best Practices\nAlthough implemented in JavaScript, the example demonstrates a modular and maintainable architecture. Chart initialization, axis configuration, annotation creation, and modifier registration are clearly separated for clarity and performance. The use of a WebAssembly context greatly enhances rendering performance, as noted in the [WebAssembly Performance](https://www.scichart.com/blog/surpassing-limits-javascript-bigdata-webassembly/) resources. Developers following this approach can achieve a high level of interactivity and responsiveness in their applications by leveraging these best practices and detailed documentation links provided for each key technical concept.",
            },
            react: {
                subtitle:
                    "Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) to a **React Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "React Chart Editable Annotations",
                pageTitle: "React Chart Editable Annotations",
                metaDescription:
                    "Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) over a React Chart using SciChart.js Annotations API",
                markdownContent:
                    "## React Chart Editable Annotations\n\n### Overview\nThis example demonstrates how to create an interactive chart using SciChart.js integrated within a React application. It focuses on editable annotations including `TextAnnotation`, `LineAnnotation`, `VerticalLineAnnotation`, `HorizontalLineAnnotation`, `BoxAnnotation`, `NativeTextAnnotation` and `CustomAnnotation` SVG image annotations that users can drag, resize, and interact with dynamically. The strategy aligns with the guidelines from the [SciChart React integration guide](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact/>` component via the `initChart` property, which provides a seamless way to integrate high-performance charts into React. The annotations are programmatically added to the `SciChartSurface`, featuring a variety of types such as horizontal and vertical line annotations, box annotations, and both standard and native text annotations. The annotation editability, combined with event handling for hover effects and tooltips provided by `AnnotationHoverModifier`, leverages the capabilities outlined in [Editable Annotations documentation](https://www.scichart.com/documentation/js/current/EditableAnnotations.html).\n\n### Features and Capabilities\nThe example provides real-time update and interaction capabilities, allowing users to click, drag, and resize annotations directly on the chart. It also includes advanced features such as responsive text scaling using `NativeTextAnnotation` and interactive tooltips, which enhance user engagement. These capabilities are complemented by performance optimizations through WebAssembly integration and best practices that ensure the chart remains highly responsive, as discussed in the [Annotation Hover documentation](https://www.scichart.com/documentation/js/current/AnnotationHover.html).\n\n### Integration and Best Practices\nIntegrating SciChart.js with React is streamlined by using the `<SciChartReact/>` wrapper, which encapsulates chart initialization and lifecycle management. This approach enables developers to build highly interactive charts by following best practices detailed in [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/). Moreover, leveraging advanced configuration of text annotations for responsive design, as illustrated in the [NativeTextAnnotation guide](https://www.scichart.com/documentation/js/current/NativeTextAnnotation.html), further enhances the chart's usability and performance in complex applications.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) to a **Angular Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Chart Editable Annotations",
                pageTitle: "Angular Chart Editable Annotations",
                metaDescription:
                    "Demonstrates how to edit Annotations (shapes, boxes, lines, text, horizontal and vertical line) over a Angular Chart using SciChart.js Annotations API",
                markdownContent:
                    "## Angular Chart Editable Annotations\n\n### Overview\nThis example demonstrates how to create an interactive 2D chart using SciChart.js integrated into an Angular standalone component. It focuses on providing editable annotations that allow users to click, drag, and resize various types of annotations including text, lines, boxes, and custom SVG image annotations.\n\n### Technical Implementation\nThe implementation is built around a standalone Angular component that imports the `ScichartAngularComponent`, initializing the chart via the `drawExample` function. Within this function, the chart is instantiated by calling `SciChartSurface.create()` with a WebAssembly context for high performance, as detailed in the [SciChart.js for Web](https://www.scichart.com/scichart-js-for-web-a-fast-realtime-2d-3d-chart-component-for-html5-javascript-apps/) documentation. The example configures numeric X and Y axes, adds a range of annotation types (such as `TextAnnotation`, `LineAnnotation`, `HorizontalLineAnnotation`, `VerticalLineAnnotatio`n, `BoxAnnotation`, and a `CustomAnnotation` SVG or image annotation), and enables editability by setting the `isEditable` property. Interactive behaviors such as zooming and panning are facilitated by chart modifiers like `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier`. Event handlers enable advanced interactions like annotation hover effects are provided by the `AnnotationHoverModifier`, which are explained in the [Annotation Hover documentation](https://www.scichart.com/documentation/js/current/AnnotationHover.html).\n\n### Features and Capabilities\nThe example showcases real-time update capabilities where annotations can be dynamically edited on the chart. Advanced features include editable text annotations with support for word wrap and scaling on resize via `NativeTextAnnotation`, as covered in the [NativeTextAnnotation documentation](https://www.scichart.com/documentation/js/current/NativeTextAnnotation.html). Additionally, tooltip animations using `GenericAnimation` provide visual feedback on hover, further enhancing user interactivity.\n\n### Integration and Best Practices\nBy leveraging Angular's standalone components, the chart integration remains modular and intuitive. Developers can utilize the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package along with guidance from the [Getting started with SciChart.js](https://www.scichart.com/getting-started/scichart-javascript/) documentation to efficiently integrate SciChart.js into Angular applications. The code exemplifies best practices by optimizing performance through WebAssembly and using interactive chart modifiers for a responsive user experience. Editable annotations are implemented following the guidelines described in the [Editable Annotations documentation](https://www.scichart.com/documentation/js/current/EditableAnnotations.html), ensuring a robust and adaptable charting solution.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/EditableAnnotations.html",
                title: "The specific page for the SciChart.js Annotations documentation will help you to get started",
                linkTitle: "Annotations API Documentation",
            },
        ],
        path: "editable-annotations",
        metaKeywords: "annotations, chart, api, javascript, webgl, canvas, drag and drop",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/EditableAnnotations",
        thumbnailImage: "javascript-chart-editable-annotations.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "max-width",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

const editableAnnotationsExampleInfo = createExampleInfo(metaData);
export default editableAnnotationsExampleInfo;
