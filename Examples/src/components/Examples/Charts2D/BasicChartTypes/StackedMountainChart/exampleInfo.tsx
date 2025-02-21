import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesStackedMountainChart",
        imagePath: "javascript-stacked-mountain-chart.jpg",
        description:
            "Learn how to make a **JavaScript Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Learn how to make a **JavaScript Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
                title: "JavaScript Stacked Mountain Chart",
                pageTitle: "JavaScript Stacked Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "Design a high performance JavaScript Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.",
                markdownContent:
                    "# Stacked Mountain Chart (Vanilla JavaScript)\n\n### Overview\nThis example demonstrates how to build a high performance **Stacked Mountain Chart** using SciChart.js with a vanilla JavaScript approach. The implementation uses native JavaScript to initialize a WebGL-powered chart and illustrates how to create multiple stacked mountain series representing different data groups such as Apples, Pears, Bananas, and Oranges.\n\n### Technical Implementation\nThe chart is created by instantiating a [SciChartSurface](https://www.scichart.com/documentation/js/current/SciChartSurface.html) with a custom theme and adding numeric X and Y axes via [NumericAxis](https://www.scichart.com/documentation/js/current/NumericAxis.html). Each data series is defined with an [XyDataSeries](https://www.scichart.com/documentation/js/current/Working%20with%20Data.html) and rendered using the [StackedMountainRenderableSeries](https://www.scichart.com/documentation/js/current/The%20Stacked%20Mountain%20Series%20Type.html). These series are grouped into a [StackedMountainCollection](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html) which supports smooth visual transitions through a [WaveAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/waveanimation.html). Interactive features such as zooming and panning are provided by modifiers including ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier as described in the [Tutorial on Adding Zooming and Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Features and Capabilities\nThe example highlights real-time update capabilities and advanced customization options. It demonstrates how multiple series can be visually integrated through grouping and animations, providing a rich user experience. The use of a smooth animation for data transitions and interactive chart modifiers ensures that users can explore the chart data dynamically while benefiting from WebGL based performance as discussed in [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html).\n\n### Integration and Best Practices\nWhile this example focuses on a vanilla JavaScript implementation, the code structure emphasizes best practices such as modular design and clear separation of chart initialization logic from DOM elements. Developers are encouraged to refer to the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for foundational setup and the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation to further customize the appearance of their charts. Advanced interactive features and performance optimizations are seamlessly integrated, making this implementation an excellent reference for building complex visualizations with SciChart.js using plain JavaScript.",
            },
            react: {
                subtitle:
                    "Learn how to make a **React Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
                title: "React Stacked Mountain Chart",
                pageTitle: "React Stacked Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "Design a high performance React Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.",
                markdownContent:
                    "# Stacked Mountain Chart Example with React\n\n### Overview\nThis example demonstrates a high performance stacked mountain chart built with SciChart.js in a React framework. It renders multiple data series representing different fruit categories such as Apples, Pears, Bananas, and Oranges, which are grouped together for a visually appealing chart presentation.\n\n### Technical Implementation\nThe chart is initialized by creating a SciChartSurface with custom theming and numeric axes. A collection of stacked mountain renderable series is created using data series for each category, and these series are grouped into a StackedMountainCollection. The implementation includes a smooth [WaveAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/waveanimation.html) for animated transitions and interactive modifiers such as ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier, ensuring rich chart interactivity. React state management and refs are utilized to toggle the 100% stacked mode, enabling real-time update capabilities. For more details on the StackedMountainCollection, refer to the [API documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html).\n\n### Features and Capabilities\nThe example offers advanced capabilities including grouping multiple series, animated transitions, and interactive features. With the integrated toggle for 100% mode, users can switch between standard and 100% stacked views, and the chart dynamically adapts its rendering. This approach emphasizes the use of React hooks for efficient state management and real-time interactive updates.\n\n### Integration and Best Practices\nIntegration with React is achieved using the SciChartReact component, ensuring a clean and modular implementation. Developers can explore best practices for combining React state management with SciChart.js as demonstrated in this example and learn more from the [SciChart React integration guide](https://www.scichart.com/blog/react-charts-with-scichart-js/). Additionally, performance optimization techniques, including efficient use of WebGL for rendering, are inherent in SciChart.js, which is well documented in the [Tutorial: Setting up a project with SciChartReact](https://www.scichart.com/documentation/js/current/TutorialSetupProjectWithSciChartReact.html). Custom theming further enhances the visual appeal by allowing the chart's appearance to be aligned with application styling, as discussed in the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation.",
            },
            angular: {
                subtitle:
                    "Learn how to make a **Angular Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
                title: "Angular Stacked Mountain Chart",
                pageTitle: "Angular Stacked Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "Design a high performance Angular Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.",
                markdownContent:
                    "# Angular Stacked Mountain Chart Example\n\n### Overview\nThis example demonstrates how to build a high performance **Stacked Mountain Chart** using SciChart.js within an Angular environment. The implementation leverages an Angular standalone component, specifically the SciChartAngularComponent, to initialize and render a WebGL-powered chart. Developers can refer to the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) and [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) for more details on integrating SciChart.js in Angular.\n\n### Technical Implementation\nThe chart is initialized via property binding in Angular, where the [initChart] attribute on the SciChartAngularComponent passes a reference to a custom draw function. Within this function, a SciChartSurface is created along with numeric X and Y axes. Four distinct stacked mountain series – representing data categories such as Apples, Pears, Bananas, and Oranges – are generated using the StackedMountainRenderableSeries and then grouped into a StackedMountainCollection. A smooth [WaveAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/waveanimation.html) provides animated transitions, and interactivity is enhanced through modifiers like ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier, as detailed in the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) guide. The use of Angular property binding is further clarified in the [Property binding - Angular](https://angular.io/guide/property-binding) documentation.\n\n### Features and Capabilities\nThis Angular implementation showcases advanced customization capabilities with features such as real-time updates, interactive zooming and panning, and animated transitions. The chart’s design takes full advantage of WebGL for optimal performance, ensuring smooth and responsive rendering even with dynamically updated data. The inclusion of a legend modifier provides clear series identification, while custom theming integrates seamlessly via an external theme configuration.\n\n### Integration and Best Practices\nBy utilizing Angular standalone components and property binding for chart initialization, this example illustrates a clean and modular integration approach. Developers are encouraged to explore the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for foundational setup practices and refer to the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) for tips on project configuration. Best practices for Angular interactive component design, state management, and WebGL performance optimization can help in building scalable and efficient web applications.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Stacked%20Mountain%20Series%20Type.html",
                title: "The specific page for the JavaScript Stacked Mountain Chart documentation will help you to get started",
                linkTitle: "JavaScript Stacked Mountain Chart Documentation",
            },
        ],
        path: "stacked-mountain-chart",
        metaKeywords: "stacked, mountain, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/StackedMountainChart",
        thumbnailImage: "javascript-stacked-mountain-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const stackedMountainChartExampleInfo = createExampleInfo(metaData);
