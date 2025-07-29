import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ResponsiveHtmlAnnotations",
        id: "chart2D_chartAnnotations_ResponsiveHtmlAnnotations",
        imagePath: "javascript-responsive-html-annotations.jpg",
        description:
            "Demonstrates how to use the **HtmlCustomAnnotation** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to use the **HtmlCustomAnnotation** using SciChart.js, High Performance JavaScript Charts",
                title: "Responsive HTML Annotations",
                pageTitle: "Responsive HTML Annotations",
                metaDescription: "",
                markdownContent: "# Responsive HTML Annotations Example - JavaScript\n\n## Overview\nThis example demonstrates **responsive HTML annotations** in SciChart.js, creating an interactive schedule visualization with time-bound annotations. It showcases [HtmlCustomAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/htmlcustomannotation.html) and [HtmlTextAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/htmltextannotation.html) to display employee schedules with CSS container queries for responsive text layout.\n\n## Technical Implementation\nThe implementation uses [CategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/categoryaxis.html) with [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) for time-based data. Annotations are positioned using [ECoordinateMode](https://www.scichart.com/documentation/js/current/typedoc/enums/ecoordinatemode.html) with responsive CSS that adapts text orientation based on container size. An [AnnotationHoverModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html) provides interactive tooltips with time formatting.\n\n## Features and Capabilities\nKey features include: dynamic annotation sizing, CSS-based responsive text layout, interactive hover tooltips, and multi-lane schedule visualization. The example leverages modern CSS features like container queries and viewport units for responsive behavior.\n\n## Integration and Best Practices\nThe implementation shows best practices for time-based data visualization, including proper axis configuration and annotation layering using [EAnnotationLayer](https://www.scichart.com/documentation/js/current/typedoc/enums/eannotationlayer.html). Performance is maintained by limiting DOM updates during interactions.",
            },
            react: {
                subtitle:
                    "Demonstrates how to use the **HtmlCustomAnnotation** using SciChart.js, High Performance JavaScript Charts",
                title: "Responsive HTML Annotations",
                pageTitle: "Responsive HTML Annotations",
                metaDescription: "",
                markdownContent: "# Responsive HTML Annotations Example - React\n\n## Overview\nThis React example demonstrates **responsive schedule visualization** using SciChart's HTML annotations. It combines SciChart's high-performance rendering with React's component model to create an interactive employee schedule with time-bound annotations.\n\n## Technical Implementation\nThe chart is initialized via [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component. Annotations use [HtmlCustomAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/htmlcustomannotation.html) with advanced CSS container queries for responsive text layout. The implementation includes custom hover behavior using [AnnotationHoverModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html) with smooth animations.\n\n## Features and Capabilities\nNotable features include: responsive text orientation changes, interactive time range tooltips, multi-employee schedule lanes, and CSS-powered adaptive layouts. The example showcases how to combine SciChart's annotation system with modern CSS features.\n\n## Integration and Best Practices\nThe solution demonstrates proper React-SciChart integration patterns, including async chart initialization and responsive design techniques. Performance considerations for DOM-based annotations are addressed through efficient event handling and CSS optimizations.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to use the **HtmlCustomAnnotation** using SciChart.js, High Performance JavaScript Charts",
                title: "Responsive HTML Annotations",
                pageTitle: "Responsive HTML Annotations",
                metaDescription: "",
                markdownContent: "# Responsive HTML Annotations Example - Angular\n\n## Overview\nThis Angular example illustrates **responsive schedule visualization** using SciChart's HTML annotations. It demonstrates how to create time-bound annotations with adaptive layouts in an Angular component.\n\n## Technical Implementation\nThe chart is initialized through [SciChart Angular](https://www.npmjs.com/package/scichart-angular) component binding. Annotations are configured using [HtmlCustomAnnotation](https://www.scichart.com/documentation/js/current/typedoc/classes/htmlcustomannotation.html) with responsive CSS container queries. The implementation includes [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) for time formatting and [AnnotationHoverModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/annotationhovermodifier.html) for interactive tooltips.\n\n## Features and Capabilities\nKey features include: adaptive text layout based on container size, interactive time range display, multi-lane schedule organization, and CSS-powered responsive design. The example showcases Angular integration with SciChart's annotation system.\n\n## Integration and Best Practices\nThe implementation follows Angular best practices with standalone components and proper chart lifecycle management. Responsive design is achieved through modern CSS features while maintaining performance with efficient DOM updates."
            },
        },
        documentationLinks: [],
        path: "responsive-html-annotations",
        metaKeywords: "custom, chart, javascript, annotation",
        onWebsite: true,
        filepath: "Charts2D/ChartAnnotations/ResponsiveHtmlAnnotations",
        thumbnailImage: "javascript-responsive-html-annotations.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export const customTypesExampleInfo = createExampleInfo(metaData);
export default customTypesExampleInfo;
