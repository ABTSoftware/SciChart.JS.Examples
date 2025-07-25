import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarColumnCategoryChart",
        id: "chart2D_polarCharts_PolarColumnCategoryChart",
        imagePath: "javascript-polar-column-category-chart.jpg",
        description:
            "Creates a **JavaScript Polar Column Category Chart** using SciChart.js, with a custom positive/negative threshold fill & stroke for each column.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Column Category Chart** using SciChart.js, with a custom positive/negative threshold fill & stroke for each column.",
                title: "JavaScript Polar Column Category Chart",
                pageTitle: "JavaScript Polar Column Category Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Column Category Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create a **Polar Column Chart** with category axis labels in JavaScript using SciChart.js. The visualization displays UK consumer price changes as radial columns with color-coded positive/negative values.\n\n## Technical Implementation\nThe chart uses a [PolarCategoryAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcategoryaxis.html) for angular positioning of food categories and a [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) for radial value display. Data is rendered via [PolarColumnRenderableSeries](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcolumnrenderableseries.html) with a custom [ColumnPaletteProvider](https://www.scichart.com/documentation/js/v4/2d-charts/chart-types/palette-provider-api/polar-column-renderable-series) that colors columns differently above/below a threshold.\n\n## Features and Capabilities\nKey features include:\n- Radial data labels with percentage formatting\n- Custom color thresholds using palette providers\n- Interactive modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarzoomextentsmodifier.html) and [PolarPanModifier](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarpanmodifier.html)\n- Wave animation effects on initial render\n\n## Integration and Best Practices\nThe implementation follows SciChart's async initialization pattern for optimal performance. Proper cleanup is handled via surface disposal. For production use, consider [data streaming techniques](https://www.scichart.com/documentation/js/v4/guides/adding-real-time-updates) for dynamic updates.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Column Category Chart** using SciChart.js, with a custom positive/negative threshold fill & stroke for each column.",
                title: "React Polar Column Category Chart",
                pageTitle: "React Polar Column Category Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Column Category Chart - React\n\n## Overview\nThis React example showcases a polar column chart visualizing UK consumer price changes. The component leverages SciChart's React integration for seamless chart lifecycle management.\n\n## Technical Implementation\nThe chart is initialized via the `<SciChartReact>` component's `initChart` prop, which creates a [SciChartPolarSurface](https://www.scichart.com/documentation/js/v4/typedoc/classes/scichartpolarsurface.html). The implementation uses React hooks pattern while maintaining SciChart's optimal WebAssembly rendering performance.\n\n## Features and Capabilities\nNotable features include:\n- Category-based angular axis with food labels\n- Value-based radial axis with percentage formatting\n- Custom palette provider for threshold-based coloring\n- Built-in [chart modifiers](https://www.scichart.com/documentation/js/v4/guides/chart-modifiers) for interactivity\n- Responsive design through CSS classes\n\n## Integration and Best Practices\nThe example demonstrates React best practices by:\n- Using SciChart's dedicated [React wrapper](https://www.scichart.com/documentation/js/v4/guides/react-charts)\n- Properly handling async initialization\n- Applying theme consistency through shared styles\n- Maintaining clean component separation",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Column Category Chart** using SciChart.js, with a custom positive/negative threshold fill & stroke for each column.",
                title: "Angular Polar Column Category Chart",
                pageTitle: "Angular Polar Column Category Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Column Category Chart - Angular\n\n## Overview\nThis Angular standalone component demonstrates a polar column chart with category axis, built using the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package. The chart visualizes UK consumer price data with interactive features.\n\n## Technical Implementation\nThe component initializes the chart through the `drawExample` function passed to `<scichart-angular>`. It configures a [PolarCategoryAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarcategoryaxis.html) for labels and [PolarNumericAxis](https://www.scichart.com/documentation/js/v4/typedoc/classes/polarnumericaxis.html) for values.\n\n## Features and Capabilities\nKey aspects include:\n- Standalone component architecture\n- Custom palette provider for conditional styling\n- [Polar chart modifiers](https://www.scichart.com/documentation/js/v4/guides/polar-charts) for zoom/pan\n- Data label formatting\n- Animation effects on load\n\n## Integration and Best Practices\nThe implementation shows Angular best practices:\n- Proper use of standalone components\n- Async chart initialization\n- Memory management via surface disposal\n- Type safety throughout\n- Theming integration"
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Column Category Chart documentation will help you to get started",
                linkTitle: "JavaScript Polar Column Category Chart Documentation",
            },
        ],
        path: "polar-column-category-chart",
        metaKeywords: "polar, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarColumnCategoryChart",
        thumbnailImage: "javascript-polar-column-cetegory-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
