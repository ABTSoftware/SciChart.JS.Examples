import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "HTML Annotations and Custom in-chart Controls",
        id: "chart2D_chartAnnotations_HtmlAnnotations",
        imagePath: "javascript-html-annotations.jpg",
        description:
            "Showcases what's possible with **HTML Annotations** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Showcases what's possible with **HTML Annotations** using SciChart.js, High Performance JavaScript Charts",
                title: "HTML Annotations and Custom in-chart Controls",
                pageTitle: "HTML Annotations and Custom in-chart Controls",
                metaDescription: "",
                markdownContent:
                    "# HTML Annotations Example - JavaScript\n\n## Overview\nThis example demonstrates how to use **HTML-based annotations** in SciChart.js to create interactive, stylable elements within a chart. It showcases various annotation types including [HtmlTextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/htmltextannotation.html) and [HtmlCustomAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/htmlcustomannotation.html), which leverage native HTML/CSS for flexible content rendering.\n\n## Technical Implementation\nThe chart initializes with numeric axes and adds multiple HTML annotations with different coordinate modes ([ECoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html)). Styling is applied both via inline CSS (using `textContainerStyle`) and external stylesheets. The example includes a nested chart implementation within an annotation and an interactive range selector control.\n\n## Features and Capabilities\nKey features include: dynamic positioning using data/value coordinates, CSS styling of annotation content, embedding interactive controls, and portal-based React component rendering. The example also demonstrates performance considerations when using DOM-based annotations versus native WebGL rendering.\n\n## Integration and Best Practices\nThe implementation shows proper resource cleanup by marking nested charts as deletable. For optimal performance, consider using native annotations when possible and reserve HTML annotations for complex UI requirements.",
            },
            react: {
                subtitle:
                    "Showcases what's possible with **HTML Annotations** using SciChart.js, High Performance JavaScript Charts",

                title: "HTML Annotations and Custom in-chart Controls",
                pageTitle: "HTML Annotations and Custom in-chart Controls",
                metaDescription: "",
                markdownContent:
                    "# HTML Annotations Example - React\n\n## Overview\nThis React example demonstrates advanced **HTML annotation** integration using SciChart.js, including rendering React components within charts via [createPortal](https://react.dev/reference/react-dom/createPortal). It showcases how to combine SciChart's high-performance rendering with React's component model.\n\n## Technical Implementation\nThe example uses [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component for chart initialization. HTML annotations are created in the `drawExample` function, while React components are injected into annotations using portals. The implementation includes both CSS-in-JS and external stylesheet approaches for annotation styling.\n\n## Features and Capabilities\nNotable features include: dynamic React component rendering within chart coordinates, responsive annotation positioning, and interactive form controls. The example also demonstrates how to create nested charts within annotations and implement two-way data binding between chart ranges and UI controls.\n\n## Integration and Best Practices\nThe solution showcases proper React-SciChart integration patterns, including state management for chart APIs and cleanup handling. When using HTML annotations with React, consider performance implications and use portals judiciously for dynamic content.",
            },
            angular: {
                subtitle:
                    "Showcases what's possible with **HTML Annotations** using SciChart.js, High Performance JavaScript Charts",
                title: "HTML Annotations and Custom in-chart Controls",
                pageTitle: "HTML Annotations and Custom in-chart Controls",
                metaDescription: "",
                markdownContent:
                    "# HTML Annotations Example - Angular\n\n## Overview\nThis Angular example illustrates how to implement **HTML annotations** in SciChart.js within an Angular component. It demonstrates annotation positioning, styling, and embedding interactive content while leveraging Angular's component architecture.\n\n## Technical Implementation\nThe chart is initialized through the [SciChart Angular](https://www.npmjs.com/package/scichart-angular) component binding. The `drawExample` function creates various HTML annotations including text elements and container annotations for custom content. Coordinate modes are configured using [ECoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) for flexible positioning.\n\n## Features and Capabilities\nThe example highlights: dynamic HTML content rendering at chart coordinates, CSS styling approaches, and interactive range selection. It also shows how to implement nested charts within annotations and handle visibility range changes through DOM events.\n\n## Integration and Best Practices\nThe implementation follows Angular best practices by separating chart logic into a service-like function. For production use, consider creating reusable annotation components and implementing proper change detection strategies to optimize performance.",
            },
        },
        documentationLinks: [],
        path: "html-annotations",
        metaKeywords: "custom, chart, javascript, annotation",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/HtmlAnnotations",
        thumbnailImage: "javascript-html-annotations.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const customTypesExampleInfo = createExampleInfo(metaData);
export default customTypesExampleInfo;
