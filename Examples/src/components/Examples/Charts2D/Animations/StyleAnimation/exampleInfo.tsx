import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DAnimationsStyleAnimation",
        imagePath: "javascript-style-animation.jpg",
        description:
            "Demonstrates how to run **Style Transition Animations** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to run **Style Transition Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Style Animation",
                pageTitle: "JavaScript Style Animation",
                metaDescription: "Demonstrates how to run Style Transition Animations with JavaScript.",
                markdownContent:
                    '# Style Animation - JavaScript\n\n### Overview\nThis example, "Style Animation", demonstrates how to implement dynamic style transition animations using SciChart.js with JavaScript. It focuses on animating both the data and visual properties of a band series to provide high-performance, real-time updates.\n\n### Technical Implementation\nThe implementation begins with asynchronous initialization of the `SciChartSurface` using a WebAssembly context, as detailed in the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) guide. Numeric axes are set up with custom `NumberRange` values, and data is generated using trigonometric functions in a standard JavaScript loop. A `FastBandRenderableSeries` is then created with an `XyyDataSeries`, and the style animation is executed through the `runAnimation` method of the `BandAnimation` class. This process smoothly transitions properties such as stroke, fill, and stroke thickness over a 1000ms duration, aligning with the techniques described in the [Style Transition Animations](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html) documentation.\n\n### Features and Capabilities\nKey features of this example include real-time updates of both chart data and styles, interactive enhancements such as `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier` modifiers, and efficient memory management by registering disposable data series via `addDeletable` in `SciChartSurface`. The configuration of the band series is aligned with the best practices highlighted within the [The Band Series type](https://www.scichart.com/documentation/js/current/The%20Band%20Series%20type.html) guide.\n\n### Integration and Best Practices\nBy relying solely on JavaScript, this example demonstrates how to integrate SciChart.js efficiently without additional frameworks or helpers. Developers are encouraged to follow the asynchronous initialization methods using WebAssembly for optimal performance and to use built-in interactive modifiers to boost user interactivity. Moreover, the example’s approach to managing temporary data via `SciChartSurface.addDeletable()` reflects recommended [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html) in SciChart.js. This ensures that resources are managed effectively even during intensive animation operations.\n',
            },
            react: {
                subtitle:
                    "Demonstrates how to run **Style Transition Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "React Style Animation",
                pageTitle: "React Style Animation",
                metaDescription: "Demonstrates how to run Style Transition Animations with JavaScript.",
                markdownContent:
                    '# React Style Animation\n\n### Overview\nThis example, "Style Animation", demonstrates how to implement smooth **style transition animations** within a SciChart-based React application. The purpose is to showcase dynamic updates of chart styles and data using the `<SciChartReact/>` component along with Material UI interactive controls.\n\n### Technical Implementation\nThe implementation begins with asynchronous initialization via the `<SciChartReact/>` component. A function called `drawExample` creates a `SciChartSurface`, adds numeric X and Y axes, and constructs a `FastBandRenderableSeries` using an `XyyDataSeries`. The example then uses the `BandAnimation` class to animate changes in both data and styles, toggling between two visual presets. This approach complies with the guidance provided in the [Style Transition Animations documentation](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html).\n\n### Features and Capabilities\nThe example features real-time style updates controlled by a Material UI ToggleButtonGroup that allows users to switch between animation presets. It integrates interactive modifiers such as `ZoomPanModifier`, `MouseWheelZoomModifier`, and `ZoomExtentsModifier` to enhance user engagement. The `onInit` callback of `<SciChartReact/>` is used to update the React state with external animation control callbacks, reflecting best practices for React state management as outlined in [Updating React component state from callback](https://stackoverflow.com/questions/56896416/updating-react-component-state-from-callback).\n\n### Integration and Best Practices\nDevelopers will appreciate the seamless integration of SciChart.js with React in this example. The initialization leverages asynchronous techniques with React hooks, ensuring that the chart and its animations are both efficient and responsive. Further insights into integrating SciChart with React can be found in the [React Charts with SciChart.js](https://www.scichart.com/blog/react-charts-with-scichart-js/) article. Additionally, the incorporation of Material UI controls demonstrates effective UI integration, as detailed in the [Toggle Button React component - Material UI](https://mui.com/material-ui/react-toggle-button/?srsltid=AfmBOopV9LqINE6JpF9Aq-Bw1baA3YWIZoOBkeyPsvO9UF2UE67-n1H1) guide. For overall performance considerations, developers are encouraged to review strategies for optimizing chart performance in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).',
            },
            angular: {
                subtitle:
                    "Demonstrates how to run **Style Transition Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Style Animation",
                pageTitle: "Angular Style Animation",
                metaDescription: "Demonstrates how to run Style Transition Animations with JavaScript.",
                markdownContent:
                    "## Angular Style Animation\n\n### Overview\nThis example demonstrates how to implement dynamic **style transition animations** using SciChart.js in an Angular standalone component. The example focuses on animating both chart data and style property transitions between two distinct visual presets, showcasing real-time visual feedback.\n\n### Technical Implementation\nThe implementation begins with asynchronous initialization of a `SciChartSurface` via the Angular component. The `drawExample` function creates numeric X and Y axes and generates data for a `FastBandRenderableSeries` using an `XyyDataSeries`. A `BandAnimation` is then used to transition chart properties such as stroke, fill, and stroke thickness over a duration of 1000ms. This approach follows the guidance provided in the [Style Transition Animations documentation](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html) and utilizes asynchronous patterns typical in Angular as outlined in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide.\n\n### Features and Capabilities\nThe example offers real-time chart updates by toggling between two style presets, allowing users to experience smooth transitions. It integrates interactive modifiers such as `ZoomExtentsModifier`, `ZoomPanModifier`, and `MouseWheelZoomModifier` to enhance user interactivity and navigation. Furthermore, the implementation demonstrates efficient memory management by registering a temporary data series with the chart’s surface for cleanup, ensuring high performance.\n\n### Integration and Best Practices\nBuilt as a standalone Angular component, this example leverages the [scichart-angular](https://www.npmjs.com/package/scichart-angular) package for seamless integration into Angular templates. Callback functions are passed to the component to trigger style animations dynamically, following recommended Angular practices for component interaction and asynchronous data handling. Developers interested in optimizing performance and understanding integration patterns in Angular applications are encouraged to review the [Angular Style Animation | SciChart.js Demo](https://demo.scichart.com/angular/style-animation) and further explore best practices in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html",
                title: "The specific page for the JavaScript Style Transition Animation documentation will help you to get started",
                linkTitle: "JavaScript Style Transition Animation Documentation",
            },
        ],
        path: "style-animation",
        metaKeywords: "style, animation, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/Animations/StyleAnimation",
        thumbnailImage: "javascript-style-animation.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const styleAnimationExampleInfo = createExampleInfo(metaData);
