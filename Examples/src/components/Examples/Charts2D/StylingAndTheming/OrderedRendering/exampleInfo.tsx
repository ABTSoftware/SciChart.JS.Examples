import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "OrderedRendering",
        id: "chart2D_stylingAndTheming_OrderedRendering",
        imagePath: "javascript-ordered-rendering.jpg",
        description:
            "Demonstrates the new **Ordered Rendering** feature in SciChart.js Javascript charts which allows for full control of the draw order of series and annotations",
        tips: [],
        alsoKnownAs: "Also Known As: **Z-Index**, **Z-Ordering**, **Draw Order**, **Layering**",
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates the new **Ordered Rendering** feature in SciChart.js Javascript charts which allows for full control of the draw order of series and annotations",
                title: "JavaScript Order of Rendering Example",
                pageTitle: "JavaScript Order of Rendering",
                metaDescription:
                    "The JavaScript Order of Rendering example gives you full control of the draw order of series and annotations for charts. Try SciChart's advanced customizations.",
                markdownContent:
                    "## Ordered Rendering Chart - JavaScript\n\n### Overview\nThis example demonstrates **ordered rendering** capabilities in SciChart.js, showing how to dynamically control the draw order of series and annotations. It features three band series with labels that can be reordered via a programmatic API.\n\n### Technical Implementation\nThe chart uses [FastBandRenderableSeries](https://www.scichart.com/documentation/js/v5/typedoc/classes/fastbandrenderableseries.html) with [XyyDataSeries](https://www.scichart.com/documentation/js/v5/typedoc/classes/xyydataseries.html) to create filled bands. Annotations are placed on the [EDefaultRenderLayer.SeriesLayer](https://www.scichart.com/documentation/js/v5/typedoc/enums/edefaultrenderlayer.html) to render between series. The [GenericAnimation](https://www.scichart.com/documentation/js/v5/typedoc/classes/genericanimation.html) API animates renderOrder values from 0.5 to 4.0.\n\n### Features and Capabilities\nKey features include dynamic reordering via [setRenderOrder](https://www.scichart.com/documentation/js/v5/typedoc/classes/iannotation.html#renderorder), relative positioning with [ECoordinateMode.Relative](https://www.scichart.com/documentation/js/v5/typedoc/enums/ecoordinatemode.html), and annotation-series binding through [renderNextTo](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/irendernextto.html). The example includes standard interactivity modifiers like [ZoomPanModifier](https://www.scichart.com/documentation/js/v5/typedoc/classes/zoompanmodifier.html).\n\n### Integration and Best Practices\nThe vanilla JS implementation shows proper async initialization and cleanup. For production use, consider the [Memory Management Guide](https://www.scichart.com/documentation/js/v5/2d-charts/performance-tips/memory-best-practices/) when implementing similar ordered rendering scenarios.",
            },
            react: {
                subtitle:
                    "Demonstrates the new **Ordered Rendering** feature in SciChart.js React charts which allows for full control of the draw order of series and annotations",
                title: "React Order of Rendering Example",
                pageTitle: "React Order of Rendering",
                metaDescription:
                    "The React Order of Rendering example gives you full control of the draw order of series and annotations for charts. Try SciChart's advanced customizations.",
                markdownContent:
                    "## Ordered Rendering Chart - React\n\n### Overview\nThis React example showcases dynamic **render order control** in SciChart.js, using the [SciChartReact](https://www.scichart.com/blog/react-charts-with-scichart-js/) component. It demonstrates how to toggle series order and render annotations between series layers.\n\n### Technical Implementation\nThe component uses React hooks ([useState](https://react.dev/reference/react/useState), [useRef](https://react.dev/reference/react/useRef)) to manage render order state. The [initChart](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/iscichartreactprops.html#initchart) prop passes the drawing logic, while [onInit](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/iscichartreactprops.html#oninit) captures the order-changing function.\n\n### Features and Capabilities\nThe example highlights React-specific patterns for controlling SciChart's [renderOrder](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/irenderable.html#renderorder) property. The UI includes a styled button that toggles between series orders, demonstrating how to integrate SciChart with React's state management.\n\n### Integration and Best Practices\nFor React integration, follow the [SciChart React Tutorial](https://www.scichart.com/documentation/js/v5/get-started/tutorials-react/tutorial-01-setting-up-project-with-scichart-react/). The example shows proper cleanup via SciChartReact's built-in disposal. Consider using [useMemo](https://react.dev/reference/react/useMemo) for complex chart configs in production apps.",
            },
            angular: {
                subtitle:
                    "Demonstrates the new **Ordered Rendering** feature in SciChart.js React charts which allows for full control of the draw order of series and annotations",
                title: "Angular Order of Rendering Example",
                pageTitle: "Angular Order of Rendering",
                metaDescription:
                    "The Angular Order of Rendering example gives you full control of the draw order of series and annotations for charts. Try SciChart's advanced customizations.",
                markdownContent:
                    "## Ordered Rendering Chart - Angular\n\n### Overview\nThis Angular example demonstrates **dynamic render ordering** using the [SciChart Angular](https://www.npmjs.com/package/scichart-angular) component. It shows how to programmatically control series and annotation draw order in a standalone component.\n\n### Technical Implementation\nThe chart is initialized through the [initChart] input binding. The example uses Angular's [standalone component](https://angular.io/guide/standalone-components) architecture with direct imports of [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular#usage).\n\n### Features and Capabilities\nThe implementation highlights Angular-specific patterns for working with SciChart's [renderLayer](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/irenderable.html#renderlayer) and [renderOrder](https://www.scichart.com/documentation/js/v5/typedoc/interfaces/irenderable.html#renderorder) APIs. The reactive nature of Angular components pairs well with SciChart's animation system.\n\n### The example follows Angular's change detection best practices by handling animations within SciChart's rendering system rather than Angular's zone.js.",
            },
        },
        documentationLinks: [],
        path: "ordered-rendering",
        metaKeywords: "series, annotation, z-index, order, rendering, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/OrderedRendering",
        thumbnailImage: "javascript-band-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const eampleInfo = createExampleInfo(metaData);
export default eampleInfo;
