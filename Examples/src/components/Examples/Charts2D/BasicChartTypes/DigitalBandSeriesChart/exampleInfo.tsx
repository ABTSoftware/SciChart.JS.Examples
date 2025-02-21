import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesDigitalBandSeriesChart",
        imagePath: "javascript-digital-band-chart.jpg",
        description:
            "Demonstrates how to create a **JavaScript Digital Band Chart** or High-Low Fill using SciChart.js. This is our High Performance JavaScript Chart Library",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Digital Band Chart** or High-Low Fill using SciChart.js. This is our High Performance JavaScript Chart Library",
                title: "JavaScript Digital Band Chart",
                pageTitle: "JavaScript Digital Band Chart | JavaScript Chart Library",
                metaDescription:
                    "Learn how to create a JavaScript Digital Band Chart or High-Low Fill Chart with SciChart's easy-to-follow demos. Get your free trial today.",
                markdownContent:
                    "## Digital Band Series Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create a high-performance digital band chart using SciChart.js in vanilla JavaScript. The implementation renders a digital band series with upper and lower fill effects, leveraging the capabilities of the [XyyDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xyydataseries.html) to handle X, Y, and Y1 values.\n\n### Technical Implementation\nThe chart is initialized asynchronously using modern async/await patterns to create a SciChartSurface and configure numeric axes with [NumericAxis](https://www.scichart.com/documentation/js/current/NumericAxis.html) in conjunction with a [NumberRange](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html) for dynamic growth. The digital band series is constructed using [FastBandRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html) combined with an XyyDataSeries, with the digital styling enabled via the **isDigitalLine** property. A smooth animated transition is achieved using [SweepAnimation](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html). Unlike approaches using a Builder API, this example relies solely on direct JavaScript calls to configure the chart.\n\n### Features and Capabilities\nThe example showcases high-performance rendering of digital band series with customized styling through specific fill and stroke options, using contrasting colors for the high and low sections. It integrates interactive modifiers such as [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html), [ZoomExtentsModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html), and MouseWheelZoomModifier, ensuring a responsive user experience with real-time zooming and panning capabilities.\n\n### Integration and Best Practices\nThis vanilla JavaScript implementation highlights best practices for chart lifecycle management by asynchronously initializing the SciChartSurface and providing a cleanup function for proper disposal. Developers are encouraged to explore additional performance optimizations and integration strategies as detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Moreover, the use of asynchronous patterns and modular configuration paves the way for scalable and maintainable charting solutions in production environments.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Digital Band Chart** or High-Low Fill using SciChart.js. This is our High Performance JavaScript Chart Library",
                title: "React Digital Band Chart",
                pageTitle: "React Digital Band Chart | JavaScript Chart Library",
                metaDescription:
                    "Learn how to create a React Digital Band Chart or High-Low Fill Chart with SciChart's easy-to-follow demos. Get your free trial today.",
                markdownContent:
                    "## Digital Band Series Chart - React\n\n### Overview\n\nThis example demonstrates how to create a high-performance **Digital Band Series Chart** using SciChart.js within a React application. The chart showcases digital band rendering with high and low fill effects, animated transitions using a sweep animation, and interactive modifiers for zooming and panning.\n\n### Technical Implementation\n\nThe chart is initialized asynchronously through the SciChartReact component by providing an initChart function. Within this function, a SciChartSurface is created along with numeric axes and a specialised data series (XyyDataSeries) that handles X, Y, and Y1 values. The series is configured with properties such as **isDigitalLine** and employs a [SweepAnimation](https://www.scichart.com/documentation/js/current/DigitalBandSeriesType.html) for smooth animated transitions. Interactive modifiers like ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier enhance user interaction with the chart. The asynchronous setup and integration are in line with [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) guidelines.\n\n### Features and Capabilities\n\nThe example showcases several advanced features including digital band rendering where different styles are applied to the upper and lower sections of the series. It leverages animated rendering and interactive zooming/panning to provide a responsive and dynamic user experience. Detailed configuration of the digital band is demonstrated based on [The Digital (Step) Band Series Type](https://www.scichart.com/documentation/js/current/DigitalBandSeriesType.html) documentation.\n\n### Integration and Best Practices\n\nIntegration with React is achieved by using the SciChartReact component, which simplifies the chart lifecycle management. Developers are encouraged to follow best practices for async initialization and resource cleanup as outlined in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). The example also adheres to performance optimization techniques by ensuring proper disposal of the SciChartSurface when necessary, a crucial aspect covered in the sciChart documentation. Additionally, the implementation and use of interactive chart modifiers reflect common techniques described in [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Digital Band Chart** or High-Low Fill using SciChart.js. This is our High Performance JavaScript Chart Library",
                title: "Angular Digital Band Chart",
                pageTitle: "Angular Digital Band Chart | JavaScript Chart Library",
                metaDescription:
                    "Learn how to create a Angular Digital Band Chart or High-Low Fill Chart with SciChart's easy-to-follow demos. Get your free trial today.",
                markdownContent:
                    "## Digital Band Series Chart - Angular\n\n### Overview\nThis example demonstrates how to create a SciChart chart within an Angular standalone component. It renders a digital band series using the specialized XyyDataSeries, which provides two Y-values to create a band between them. The chart is initialized asynchronously with a WebAssembly context for high performance while leveraging Angular’s standalone component features. For more details on integrating SciChart with Angular, see the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package and the [guide to standalone components](https://angular.io/guide/standalone-components).\n\n### Technical Implementation\nThe chart is configured by calling SciChartSurface.create to establish a WebAssembly context and render the chart surface. Numeric axes are added, and data is programmatically generated to simulate sine and cosine waveforms attenuated by a decay factor. A FastBandRenderableSeries is then instantiated with the XyyDataSeries to display the digital band, featuring distinct stroke and fill colors along with a SweepAnimation for a smooth startup effect. Interactive modifiers such as ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier are incorporated to enhance user interactivity. Further technical details can be consulted in the [SciChartSurface.create documentation](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) and the [FastBandRenderableSeries API](https://www.scichart.com/documentation/js/current/typedoc/classes/fastbandrenderableseries.html).\n\n### Features and Capabilities\nThe example highlights advanced features such as digital band series rendering with animated transitions, interactive zooming and panning behavior, and real-time data update potential that can be leveraged in high-performance applications. The clear separation of data generation, series configuration, and modifier setup underscores how SciChart.js enables granular customization and high visual performance.\n\n### Integration and Best Practices\nThe implementation employs asynchronous programming with async/await to ensure that the chart initializes efficiently without blocking the Angular application. It also demonstrates proper resource cleanup by providing a destructor function that calls sciChartSurface.delete(), in line with best practices outlined in the [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) guide and discussions on [async/await in Angular](https://stackoverflow.com/questions/56092083/async-await-in-angular-ngoninit). Developers are encouraged to explore further customization, theming, and performance optimization techniques as detailed in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/DigitalBandSeriesType.html",
                title: "Digital Band Chart example",
                linkTitle: "JavaScript Digital Band Documentation",
            },
        ],
        path: "digital-band-chart",
        metaKeywords: "digital, band, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/DigitalBandSeriesChart",
        thumbnailImage: "javascript-digital-band-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const digitalBandSeriesChartExampleInfo = createExampleInfo(metaData);
