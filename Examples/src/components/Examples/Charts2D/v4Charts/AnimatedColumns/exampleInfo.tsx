import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "AnimatedColumns",
        id: "chart2D_v4Charts_AnimatedColumns",
        imagePath: "atp-top-ten-animation.jpg",
        description:
            "Creates a **JavaScript ATP Top Ten animation** using SciChart.js that displays animated ATP Year-end Top Ten rankings from 1990 to 2024.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Animated Bar Chart** using SciChart.js that displays animated ATP Year-end Top Ten rankings from 1990 to 2024.",
                title: "JavaScript Animated Bar Chart",
                pageTitle: "JavaScript Animated Bar Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Animated Columns Chart - JavaScript\n\n## Overview\nThis example demonstrates how to create an animated column chart visualizing ATP tennis rankings over time using SciChart.js. The implementation uses [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with custom coloring by country and smooth animations between yearly data updates.\n\n## Technical Implementation\nThe chart initializes with a [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) and configures a flipped [NumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html) for rankings display. Data is loaded from a structured dataset containing player rankings by year. The [ColumnAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/columnanimation.html) handles transitions between years with easing functions for smooth movement.\n\n## Features and Capabilities\nThe example showcases dynamic data updates with player position changes animated over time. A custom [CountryPaletteProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/defaultpaletteprovider.html) assigns colors based on player nationality, while data labels display player names and countries. The chart title updates automatically to reflect the current year being displayed.\n\n## Integration and Best Practices\nThe vanilla JavaScript implementation demonstrates proper resource management with surface disposal. For performance, the animation uses efficient data series updates rather than recreating the entire chart. The example could be extended with interactive features using [Chart Modifiers](https://www.scichart.com/documentation/js/current/Chart%20Modifier%20APIs.html).",
            },
            react: {
                subtitle:
                    "Creates a **React Animated Bar Chart** using SciChart.js that displays animated ATP Year-end Top Ten rankings from 1990 to 2024.",
                title: "React Animated Bar Chart",
                pageTitle: "React Animated Bar Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Animated Columns Chart - React\n\n## Overview\nThis React example creates an animated visualization of ATP tennis rankings using SciChart.js. The component leverages the [SciChartReact](https://www.npmjs.com/package/scichart-react) wrapper for seamless integration with React's lifecycle.\n\n## Technical Implementation\nThe chart is initialized via the `initChart` prop which creates a [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) with a [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html). The implementation uses [EColumnMode.StartEnd](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnmode.html) for precise column positioning and a custom palette provider for country-based coloring.\n\n## Features and Capabilities\nThe component automatically animates between yearly ranking data using [ColumnAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/columnanimation.html) with easing functions. Data labels show player information, and the chart title updates dynamically. The flipped Y-axis properly displays rankings with #1 at the top.\n\n## Integration and Best Practices\nThe example demonstrates React best practices by encapsulating chart logic in the `drawExample` function. The [SciChartReact](https://www.npmjs.com/package/scichart-react) component handles surface creation and cleanup automatically. For larger datasets, consider implementing virtualized data loading.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Animated Bar Chart** using SciChart.js that displays animated ATP Year-end Top Ten rankings from 1990 to 2024..",
                title: "Angular Animated Bar Chart",
                pageTitle: "Angular Animated Bar Chart | JavaScript Charts | SciChart.js",
                metaDescription: null,
                markdownContent:
                    "# Animated Columns Chart - Angular\n\n## Overview\nThis Angular standalone component demonstrates an animated tennis rankings visualization using SciChart.js. The implementation uses the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for seamless integration with Angular's component system.\n\n## Technical Implementation\nThe chart is configured through the `drawExample` function passed to the [ScichartAngularComponent](https://www.npmjs.com/package/scichart-angular). It creates a [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) with a [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) using [EColumnYMode.CenterHeight](https://www.scichart.com/documentation/js/current/typedoc/enums/ecolumnymode.html) for proper column sizing.\n\n## Features and Capabilities\nThe component animates yearly ranking changes with smooth transitions using [ColumnAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/columnanimation.html). A custom palette provider colors columns by player nationality, and data labels display player information. The flipped Y-axis correctly represents ranking positions.\n\n## Integration and Best Practices\nThe example follows Angular best practices by using standalone components and proper dependency management. The [scichart-angular](https://www.npmjs.com/package/scichart-angular) wrapper handles chart lifecycle management, including WebAssembly context creation and cleanup.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Histogram Chart documentation will help you to get started",
                linkTitle: "JavaScript Histogram Chart Documentation",
            },
        ],
        path: "animated-columns",
        metaKeywords: "histogram, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/AnimatedColumns",
        thumbnailImage: "atp-top-ten-animation.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

const exampleInfo = createExampleInfo(metaData);
export default exampleInfo;
