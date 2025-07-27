import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarRadialColumnChart",
        id: "chart2D_polarCharts_PolarStackedRadialColumnChart",
        imagePath: "javascript-polar-stacked-radial-column-chart.jpg",
        description:
            "Creates a **JavaScript Stacked Radial Column Chart** representing Olympic medals per country, using SciChart.js",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Stacked Radial Column Chart** representing Olympic medals per country, using SciChart.js",
                title: "JavaScript Stacked Radial Column Chart",
                pageTitle: "JavaScript Stacked Radial Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Stacked Radial Column Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create a **Polar Stacked Radial Column Chart** using SciChart.js, visualizing Winter Olympic medals per country with stacked columns in a polar coordinate system. The chart uses [PolarStackedColumnCollection](https://www.scichart.com/documentation/js/current/typedoc/classes/polarstackedcolumncollection.html) to display medal counts as radial columns.\n\n## Technical Implementation\nThe chart initializes a [SciChartPolarSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpolarsurface.html) with radial (x) and angular (y) axes. The x-axis is configured with [EPolarAxisMode.Radial](https://www.scichart.com/documentation/js/current/globals.html#epolaraxismode) and uses a [TextLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/textlabelprovider.html) for country names. Three [PolarStackedColumnRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/polarstackedcolumnrenderableseries.html) represent gold, silver, and bronze medals with gradient fills.\n\n## Features and Capabilities\nThe example includes interactive modifiers like [PolarZoomExtentsModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polarzoomextentsmodifier.html) and [PolarLegendModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polarlegendmodifier.html) for user interaction. The [WaveAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/waveanimation.html) provides smooth series initialization.\n\n## Integration and Best Practices\nThe implementation follows async initialization patterns and includes proper cleanup. The radial layout with [flippedCoordinates](https://www.scichart.com/documentation/js/current/typedoc/interfaces/ipolarnumericaxisoptions.html#flippedcoordinates) ensures optimal data presentation.",
            },
            react: {
                subtitle:
                    "Creates a **React Stacked Radial Column Chart** representing Olympic medals per country, using SciChart.js",
                title: "React Stacked Radial Column Chart",
                pageTitle: "React Stacked Radial Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Stacked Radial Column Chart - React\n\n## Overview\nThis React example showcases a **Polar Stacked Radial Column Chart** using SciChart's [SciChartReact](https://www.scichart.com/documentation/react/current/typedoc/classes/SciChartReact.html) component. It visualizes Olympic medal data with stacked radial columns, demonstrating React integration with SciChart's polar charts.\n\n## Technical Implementation\nThe chart is initialized via the `initChart` prop passed to `<SciChartReact/>`, creating a [SciChartPolarSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartpolarsurface.html) with radial columns. The implementation uses React's component structure while leveraging SciChart's WebAssembly core for high performance.\n\n## Features and Capabilities\nThe chart features medal data grouped by country with [PolarStackedColumnRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/polarstackedcolumnrenderableseries.html) for each medal type. Interactive elements include [PolarMouseWheelZoomModifier](https://www.scichart.com/documentation/js/current/typedoc/classes/polarmousewheelzoommodifier.html) and a configurable legend.\n\n## Integration and Best Practices\nThe example demonstrates proper React integration patterns using SciChart's dedicated React component. The async initialization and theme application follow React best practices for data visualization components.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Stacked Radial Column Chart** representing Olympic medals per country, using SciChart.js",
                title: "Angular Stacked Radial Column Chart",
                pageTitle: "Angular Stacked Radial Column Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent: "# Polar Stacked Radial Column Chart - Angular\n\n## Overview\nThis Angular example demonstrates a **Polar Stacked Radial Column Chart** using the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). The chart displays Olympic medal data with stacked radial columns in a polar coordinate system.\n\n## Technical Implementation\nThe chart is implemented as an Angular standalone component, passing the `drawExample` function to the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular) via property binding. The polar surface configuration matches the JavaScript implementation, utilizing [PolarCategoryAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/polarcategoryaxis.html) for radial positioning.\n\n## Features and Capabilities\nThe chart maintains all features of the JavaScript version including stacked columns, gradient fills, and interactive modifiers. The Angular integration preserves the high-performance characteristics of SciChart's WebAssembly core.\n\n## Integration and Best Practices\nThe example showcases Angular-specific patterns like standalone components and property binding. Resource cleanup is handled automatically by the SciChart Angular component, following Angular's component lifecycle.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Stacked Radial Column Chart documentation will help you to get started",
                linkTitle: "JavaScript Stacked Radial Column Chart Documentation",
            },
        ],
        path: "polar-stacked-radial-column-chart",
        metaKeywords: "polar, stacked, radial, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarRadialColumnChart",
        thumbnailImage: "javascript-polar-stacked-radial-column-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
