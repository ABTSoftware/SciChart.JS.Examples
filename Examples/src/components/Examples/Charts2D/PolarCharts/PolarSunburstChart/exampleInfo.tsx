import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarSunburstChart",
        id: "chart2D_polarCharts_PolarSunburstChart",
        imagePath: "javascript-polar-sunburst-chart.jpg",
        description:
            "Creates a **JavaScript Polar Sunburst Chart** using SciChart.js, with multiple levels and interaction driven animations.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Sunburst Chart** using SciChart.js, with multiple levels and interaction driven animations.",
                title: "JavaScript Polar Sunburst Chart",
                pageTitle: "JavaScript Polar Sunburst Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Sunburst Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create an interactive **Polar Sunburst Chart** using SciChart.js in JavaScript. The chart visualizes hierarchical data through concentric rings of [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/polarcolumnrenderableseries.html), where each segment represents a node in the tree structure.\n\n## Technical Implementation\nThe implementation processes hierarchical JSON data into level-wise flat arrays using `getDataById()`. Each level is rendered as a separate [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/polarcolumnrenderableseries.html) with angular size corresponding to value and radial distance encoding depth. The chart uses [GenericAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/genericanimation.html) for smooth drill-down transitions between hierarchy levels.\n\n## Features and Capabilities\nThe example features interactive drill-down/up functionality via [PolarDataPointSelectionModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polardatapointselectionmodifier.html). Custom [SunburstPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) dynamically adjusts segment colors based on selection state. Data labels display node metadata using a custom formatter.\n\n## Integration and Best Practices\nThe chart showcases efficient memory management by properly disposing series during navigation. The async initialization pattern ensures optimal performance when loading the WebAssembly context.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Sunburst Chart** using SciChart.js, with multiple levels and interaction driven animations.",
                title: "React Polar Sunburst Chart",
                pageTitle: "React Polar Sunburst Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Sunburst Chart - React\n\n## Overview\nThis React example demonstrates how to integrate SciChart.js's **Polar Sunburst Chart** using the [SciChartReact](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartreact.html) component. The chart displays hierarchical data through animated polar columns with interactive drill-down capabilities.\n\n## Technical Implementation\nThe implementation uses React hooks pattern with the `SciChartReact` wrapper component. The core chart logic in `drawExample.ts` creates a [SciChartPolarSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpolarsurface.html) and configures polar axes. The recursive `drawSeriesFn` handles dynamic series generation for each hierarchy level.\n\n## Features and Capabilities\nThe chart features smooth animated transitions between levels using [GenericAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/genericanimation.html). Interactive selection is implemented via [PolarCursorModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polarcursormodifier.html) with custom tooltips. The [SunburstPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ifillpaletteprovider.html) dynamically updates segment colors.\n\n## Integration and Best Practices\nThe example follows React best practices by encapsulating chart logic in a separate module. The `SciChartReact` component handles proper cleanup of WebAssembly resources when unmounting.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Sunburst Chart** using SciChart.js, with multiple levels and interaction driven animations.",
                title: "Angular Polar Sunburst Chart",
                pageTitle: "Angular Polar Sunburst Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Sunburst Chart - Angular\n\n## Overview\nThis Angular example demonstrates how to create a **Polar Sunburst Chart** using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). The chart visualizes hierarchical data through animated polar columns with interactive drill-down navigation.\n\n## Technical Implementation\nThe standalone Angular component imports `ScichartAngularComponent` and passes the `drawExample` function via input binding. The chart surface is created asynchronously using [SciChartPolarSurface.create()](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpolarsurface.html). The recursive `drawSeriesFn` handles dynamic series generation for each hierarchy level.\n\n## Features and Capabilities\nThe implementation features smooth animated transitions between hierarchy levels using [GenericAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/genericanimation.html). Interactive selection is handled by [PolarDataPointSelectionModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polardatapointselectionmodifier.html). The custom [SunburstMetadata](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipointmetadata.html) class manages node-specific visual properties.\n\n## Integration and Best Practices\nThe example follows Angular best practices by using standalone components and proper dependency injection. The `ScichartAngularComponent` automatically manages chart lifecycle including WebAssembly resource cleanup.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Sunburst Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Sunburst Chart Documentation",
            },
        ],
        path: "polar-sunburst-chart",
        metaKeywords: "polar, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarSunburstChart",
        thumbnailImage: "javascript-polar-sunburst-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
