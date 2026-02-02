import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "StackedColumnChart",
        id: "chart2D_basicCharts_StackedColumnChart",
        imagePath: "javascript-stacked-column-chart.jpg",
        description:
            "The example on this page demonstrates how to create a **JavaScript Stacked Column Chart** using our feature-rich JavaScript Chart Library, SciChart.js.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "The example on this page demonstrates how to create a **JavaScript Stacked Column Chart** using our feature-rich JavaScript Chart Library, SciChart.js.",
                title: "JavaScript Stacked Column Chart",
                pageTitle: "JavaScript Stacked Column Chart | Online JavaScript Charts",
                metaDescription:
                    "Discover how to create a JavaScript Stacked Column Chart using our feature-rich JavaScript Chart Library, SciChart.js. Get your free demo today!",
                markdownContent:
                    "## Stacked Column Chart - JavaScript\n\n### Overview\nThis example demonstrates how to create an interactive **Stacked Column Chart** using SciChart.js with JavaScript. The chart visualizes multiple data series by stacking individual columns, and it allows users to toggle between standard stacked mode and 100% stacked mode, as well as dynamically show or hide data labels.\n\n### Technical Implementation\nThe chart is initialized asynchronously using async/await, as described in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. The implementation creates a `SciChartSurface` with configured `NumericAxis` objects for both the X and Y axes. Data series are constructed using the `XyDataSeries` and rendered as stacked columns via `StackedColumnRenderableSeries`. These series are grouped into a `StackedColumnCollection` to enable proper stacking, as outlined in the [Stacked Column Series Type](https://www.scichart.com/documentation/js/current/The%20Stacked%20Column%20Series%20Type.html) documentation. In addition, interactive modifiers such as `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier` are added to enhance user engagement.\n\n### Features and Capabilities\nThe example includes several advanced features: \n- **Real-time Update Capabilities:** Callback functions enable toggling between 100% stacked mode and standard stacked mode as well as dynamically controlling the visibility of data labels.\n- **Animated Transitions:** The use of [WaveAnimation](https://www.scichart.com/documentation/js/current/Animations%20API.html) provides smooth, visually appealing transitions when the chart is rendered or updated.\n- **Dynamic Data Label Control:** Developers can adjust data label styling and positioning dynamically, following techniques discussed in [Adding DataLabels to a Chart Series](https://www.scichart.com/documentation/js/current/AddingDataLabels.html).\n\n### Integration and Best Practices\nBy leveraging JavaScript, this implementation adheres to best practices for asynchronous initialization and modular configuration of high-performance WebGL charts. Developers are encouraged to explore the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html) and [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html) for additional insights on integrating and optimizing SciChart.js in a JavaScript environment.",
            },
            react: {
                subtitle:
                    "The example on this page demonstrates how to create a **React Stacked Column Chart** using our feature-rich JavaScript Chart Library, SciChart.js.",
                title: "React Stacked Column Chart",
                pageTitle: "React Stacked Column Chart | Online JavaScript Charts",
                metaDescription:
                    "Discover how to create a React Stacked Column Chart using our feature-rich JavaScript Chart Library, SciChart.js. Get your free demo today!",
                markdownContent:
                    "## Stacked Column Chart React\n\n### Overview\nThis example demonstrates how to create an interactive **Stacked Column Chart** using SciChart.js within a React application. The chart is designed to exhibit features such as toggling between standard stacked mode and 100% stacked mode as well as dynamically showing or hiding data labels, providing a robust visualization tool that leverages React’s component architecture.\n\n### Technical Implementation\nThe example integrates the [SciChartReact component](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) to initialize the chart inside the React lifecycle. Initialization is handled asynchronously through an `<SciChartReact onInit={}/>` callback that returns control methods for later updates. These controls allow for real-time updates of chart properties such as stack mode and data label visibility. Additionally, advanced configuration options like [WaveAnimation](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html) enhance the renderable series with smooth, animated transitions while interactive chart modifiers (`ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier`) provide an engaging user experience.\n\n### Features and Capabilities\nKey features include the ability to toggle between regular stacked and 100% stacked modes and to configure data labels directly on each series. The example makes extensive use of React’s state management with hooks like `useState`, ensuring that UI controls immediately reflect changes in the chart’s appearance. Custom styling using Material UI components alongside [tss-react/mui’s makeStyles](https://docs.tss-react.dev/api/makestyles) guarantees a responsive and visually appealing interface.\n\n### Integration and Best Practices\nDevelopers can leverage this example as a reference for integrating SciChart.js into React applications. As the chart is initialized and controlled via asynchronous callbacks, it adheres to best practices in React for managing complex, state-driven components. For a deeper technical dive into these concepts, one can examine the [Tutorial 02 - Creating a Chart with scichart-react](https://www.scichart.com/documentation/js/current/Tutorial02CreatingChartsWithInitChart.html) and [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) documentation, which provide comprehensive insights into performance optimization and interactive chart behavior in React.",
            },
            angular: {
                subtitle:
                    "The example on this page demonstrates how to create a **Angular Stacked Column Chart** using our feature-rich JavaScript Chart Library, SciChart.js.",
                title: "Angular Stacked Column Chart",
                pageTitle: "Angular Stacked Column Chart | Online JavaScript Charts",
                metaDescription:
                    "Discover how to create a Angular Stacked Column Chart using our feature-rich JavaScript Chart Library, SciChart.js. Get your free demo today!",
                markdownContent:
                    "## Angular Stacked Column Chart\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular application using a standalone Angular component. The visualization displays a stacked column chart that can be toggled between a standard stacked mode and a 100% stacked mode, while also providing options to show or hide data labels. The implementation leverages Angular Material components for its user interface, ensuring a responsive and modern design.\n\n### Technical Implementation\nThe Angular component initializes the SciChart.js chart asynchronously using an `onInit` callback. The chart is created in the `drawExample` function where the `SciChartSurface`, XAxis, and YAxis are configured, and a series of `StackedColumnRenderableSeries` are added as part of a `StackedColumnCollection`. Each series is bound to its data using `XyDataSeries`, and a `WaveAnimation` enhances the visual presentation. Interactive modifiers such as `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier` ensure the chart is responsive to user interactions. Developers can explore the setup of SciChart.js in Angular via the [scichart-angular package](https://www.npmjs.com/package/scichart-angular) and the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide for further technical details.\n\n### Features and Capabilities\nThe example provides real-time update capabilities by linking Angular Material UI controls with the chart’s state. Users can easily switch between regular stacked mode and 100% stacked mode, and dynamically toggle data labels. The asynchronous initialization pattern, which is similar to practices discussed in [Angular asynchronous onInit callbacks](https://stackoverflow.com/questions/56092083/async-await-in-angular-ngoninit), ensures that UI events are seamlessly communicated to the chart instance. Moreover, the use of interactive modifiers provides advanced zooming and panning features, adding to the overall data exploration capabilities.\n\n### Integration and Best Practices\nThis implementation demonstrates effective Angular integration patterns for third-party libraries. By utilizing standalone Angular components and leveraging Angular Material controls such as Toggle Buttons and Switches (as detailed in [Angular Material Button Toggle](https://material.angular.io/components/button-toggle)), the example shows how to encapsulate dynamic chart updates within Angular’s component lifecycle. Developers are encouraged to adopt these asynchronous initialization techniques and event handling patterns to maintain clean state management and optimal performance when working with WebGL-rendered charts. For more insights on integrating such libraries, check out the [Tutorial 01 - Setting up a npm Project with SciChart.js](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html).",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/The%20Stacked%20Column%20Series%20Type.html",
                title: "The specific page for the JavaScript Stacked Column Chart documentation will help you to get started",
                linkTitle: "JavaScript Stacked Column Chart Documentation",
            },
        ],
        path: "stacked-column-chart",
        metaKeywords: "stacked, column, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/StackedColumnChart",
        thumbnailImage: "javascript-stacked-column-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

export const stackedColumnChartExampleInfo = createExampleInfo(metaData);
export default stackedColumnChartExampleInfo;
