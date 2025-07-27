import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "TreemapChart",
        id: "chart2D_v4Charts_TreemapChart",
        imagePath: "javascript-treemap-chart.jpg",
        description:
            "Creates a **Treemap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries** and **d3-hierarchy.js**'s layout algorithms to define rectangle positions based on total value",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Treemap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries** and **d3-hierarchy.js**'s layout algorithms to define rectangle positions based on total value",
                title: "JavaScript Treemap Chart",
                pageTitle: "JavaScript Treemap Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# TreeMap Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create a **TreeMap Chart** using SciChart.js in JavaScript, visualizing hierarchical data with rectangles sized by value. The implementation leverages [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) and integrates with D3.js for layout calculations.\n\n## Technical Implementation\nThe chart uses [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) to define rectangle bounds (x0,y0,x1,y1) and a custom [StockTreemapPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) to color-code rectangles based on percentage change. The layout is computed using D3's [stratify](https://github.com/d3/d3-hierarchy#stratify) and [treemap](https://github.com/d3/d3-hierarchy#treemap) functions.\n\n## Features and Capabilities\nThe example showcases dynamic labeling via [TreemapDataLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/rectangleseriesdatalabelprovider.html), which adjusts text based on rectangle size. Interactive features include zooming/panning with [ZoomPanModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/zoompanmodifier.html) and [MouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/mousewheelzoommodifier.html).\n\n## Integration and Best Practices\nThe implementation follows async initialization patterns and includes proper cleanup. For performance, it uses [EColumnMode.StartEnd](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnmode.html) for precise rectangle positioning.",
            },
            react: {
                subtitle:
                    "Creates a **React Treemap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries** and **d3-hierarchy.js**'s layout algorithms to define rectangle positions based on total value",
                title: "React Treemap Chart",
                pageTitle: "React Treemap Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# TreeMap Chart - React\n\n## Overview\nThis React example creates a **TreeMap Chart** using SciChart.js, wrapped in the [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component. It visualizes company valuations with color-coded performance metrics.\n\n## Technical Implementation\nThe chart initializes via `drawExample` passed to `initChart` prop. It combines [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with D3.js for hierarchical layout. The [StockTreemapPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) implements color interpolation for gains/losses.\n\n## Features and Capabilities\nDynamic labels adapt to rectangle size using [TreemapDataLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/rectangleseriesdatalabelprovider.html). The example includes React-specific lifecycle management through the SciChartReact wrapper component.\n\n## Integration and Best Practices\nThe implementation demonstrates React best practices with async chart initialization and CSS theming via `className` prop. For advanced use, see [React Charts with SciChart.js](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Treemap Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries** and **d3-hierarchy.js**'s layout algorithms to define rectangle positions based on total value",
                title: "Angular Treemap Chart",
                pageTitle: "Angular Treemap Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# TreeMap Chart - Angular\n\n## Overview\nThis Angular example creates a **TreeMap Chart** using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). It displays hierarchical financial data with interactive zooming capabilities.\n\n## Technical Implementation\nThe chart is initialized by passing `drawExample` to the `[initChart]` input. The implementation uses [XyxyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyxydataseries.html) with [EColumnMode.StartEnd](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnmode.html) for precise rectangle positioning. D3.js handles the treemap layout computation.\n\n## Features and Capabilities\nThe example features a custom [StockTreemapPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) for performance coloring and dynamic labels via [TreemapDataLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/rectangleseriesdatalabelprovider.html).\n\n## Integration and Best Practices\nThe standalone component demonstrates Angular best practices with async initialization. For memory management, see [SciChart Angular Documentation](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html)."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Treemap Chart documentation will help you to get started",
                linkTitle: "JavaScript Treemap Chart Documentation",
            },
        ],
        path: "treemap-chart",
        metaKeywords: "treemap, rectangle, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/TreemapChart",
        thumbnailImage: "javascript-treemap-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

const TreemapChartExampleInfo = createExampleInfo(metaData);
export default TreemapChartExampleInfo;
