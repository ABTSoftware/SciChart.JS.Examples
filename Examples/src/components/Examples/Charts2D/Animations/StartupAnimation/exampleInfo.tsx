import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DAnimationsStartupAnimation",
        imagePath: "javascript-startup-animations.jpg",
        description:
            "Demonstrates how to run **Startup Animations** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to run **Startup Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Startup Animation",
                pageTitle: "JavaScript Startup Animation",
                metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
                markdownContent:
                    "## JavaScript Startup Animation - JavaScript\n\n### Overview\nThis example demonstrates how to implement a series of startup animations using SciChart.js in a JavaScript environment. The primary goal is to sequentially animate two types of renderable series—a bubble series and a spline line series—by applying four distinct animations: **Wave**, **Sweep**, **Scale**, and **Fade**. A custom typewriter effect is also created for a watermark annotation to display the current animation effect. This example showcases interactive chart modifiers for zooming and panning, ensuring a smooth and engaging user experience.\n\n### Technical Implementation\nThe chart is initialized by creating a SciChartSurface with numeric axes through an asynchronous function, utilizing the async/await pattern for proper resource initialization. Data for the chart is generated dynamically and fed into two renderable series using the standard SciChart.js data series objects. Animations are managed by enqueuing them on the renderable series and are cycled continuously via a looping mechanism implemented with setTimeout. A custom animation, based on the [GenericAnimation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) class, is used to create a typewriter text effect. Developers looking to understand the fundamentals of startup animations in this framework may refer to the [JavaScript Startup Animation - SciChart](https://www.scichart.com/example/javascript-chart/javascript-startup-animation/) documentation for detailed guidance.\n\n### Features and Capabilities\nThe example highlights several advanced features of SciChart.js such as real-time animation chaining and dynamic data binding. By sequentially applying different series animations, the visual entrance effects become more engaging. Interactive chart modifiers like ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier are incorporated to provide enhanced user interactivity. Performance is further optimized by leveraging the underlying WebAssembly contexts, as detailed in the [Performance Tips & Tricks](https://www.scichart.com/documentation/js/current/Performance%20Tips.html) documentation.\n\n### Integration and Best Practices\nAlthough parts of the example are integrated into a React component for demonstration purposes, the JavaScript implementation in the provided files is standalone and can be easily embedded into a basic HTML file. The design emphasizes clear separation of concerns through proper lifecycle management, ensuring that the SciChartSurface is appropriately deleted when no longer needed, as highlighted in the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) guide. Developers are encouraged to follow these best practices for resource cleanup and performance optimization, which are critical for building high-performance web applications. For additional interactive behavior, refer to the [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html) that explains how to integrate zoom and pan modifiers effectively.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how to run **Startup Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "React Startup Animation",
                pageTitle: "React Startup Animation",
                metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
                markdownContent:
                    "## React Startup Animation\n\n### Overview\nThis example demonstrates an interactive Chart Startup Animation built with SciChart.js in a React application. The implementation sequentially animates chart series using **Wave**, **Sweep**, **Scale**, and **Fade** animations, while a dynamic typewriter effect updates a watermark annotation. The example showcases both bubble and spline line renderable series, along with interactive zoom and pan modifiers.\n\n### Technical Implementation\nThe chart is initialized in a React component using the `<SciChartReact/>` element from the SciChart.js React integration, as described in the [SciChart React integration guide](https://www.scichart.com/blog/react-charts-with-scichart-js/). The primary animation logic is encapsulated in a function that alternates between different animations by enqueuing them on the renderable series. A custom typewriter effect is implemented through a GenericAnimation, following guidelines found in the [Generic Animations documentation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) please also see [Series Startup Animations](https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html). Furthermore, the example adds chart modifiers such as ZoomPanModifier, ZoomExtentsModifier, and MouseWheelZoomModifier to enhance interactivity; more details can be found in the [Zooming and Panning Tutorial](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n### Features and Capabilities\nThe example illustrates several advanced features including real-time animation chaining and dynamic data binding. The series startup animations provide a visually appealing entrance effect, while the typewriter-based watermark animation adds a layer of customizability. Additionally, interactive controls are implemented through built-in chart modifiers, demonstrating how to provide an enhanced user experience with minimal performance overhead.\n\n### Integration and Best Practices\nIntegrating SciChart.js with React is streamlined using the `<SciChartReact/>` component, ensuring that the chart lifecycle is properly managed within a React application. Developers are encouraged to follow the best practices for lifecycle management, such as clean-up on component unmount, as detailed in the [Reusable React Component tutorial](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html). The example not only provides performance optimization and interactive features but also serves as a guide for integrating complex animations and custom theming in React-based chart applications.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to run **Startup Animations** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Startup Animation",
                pageTitle: "Angular Startup Animation",
                metaDescription: "Demonstrates how to run Startup Animations with JavaScript.",
                markdownContent:
                    "## Angular Startup Animation\n\n### Overview\nThis example demonstrates how to implement **startup animations** in SciChart.js using Angular. It sequentially animates chart series with four distinct effects—**Wave**, **Sweep**, **Scale**, and **Fade**—while a custom typewriter animation updates a watermark annotation to display the current animation effect. This approach enhances chart visual appeal and interactivity in Angular applications.\n\n### Technical Implementation\nThe chart is initialized by creating a SciChartSurface with numeric axes and two primary series: a bubble series and a spline line series. Animation objects (WaveAnimation, SweepAnimation, ScaleAnimation, and FadeAnimation) are defined and applied sequentially by enqueuing them on the series. A custom typewriter effect is implemented using GenericAnimation, which gradually updates the watermark text. This chaining of animations ensures smooth transitions, and developers can explore similar techniques through the [Angular Startup Animation Demo](https://demo.scichart.com/angular/startup-animation) and the [Generic Animations documentation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html) for deeper insights.\n\n### Features and Capabilities\nThe example provides real-time animation updates through a continuous loop that alternates the animation state every two seconds. It also illustrates built-in interactivity with chart modifiers such as **ZoomPanModifier**, **ZoomExtentsModifier**, and **MouseWheelZoomModifier**, which enhance user experience by providing intuitive zooming and panning controls.\n\n### Integration and Best Practices\nFor Angular developers, managing component lifecycle and cleanup is essential. Although the example centralizes chart initialization in a shared function, proper integration in an Angular component would involve disposing of the SciChartSurface during the component’s ngOnDestroy lifecycle hook to prevent memory leaks. Best practices for Angular integration and lifecycle management can be found in resources like [Component Lifecycle Management in Angular: A Comprehensive Guide](https://javascript.plainenglish.io/component-lifecycle-management-in-angular-a-comprehensive-guide-badc0867a946) and the [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) documentation. Performance optimizations are achieved by leveraging WebAssembly contexts and minimizing excessive DOM updates, ensuring smooth animation even in data-intensive scenarios.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Series%20Startup%20Animations.html",
                title: "The specific page for the JavaScript Startup Animation documentation will help you to get started",
                linkTitle: "JavaScript Startup Animation Documentation",
            },
        ],
        path: "startup-animation",
        metaKeywords: "startup, on-start, animation, javascript",
        onWebsite: true,
        filepath: "Charts2D/Animations/StartupAnimation",
        thumbnailImage: "javascript-startup-animations.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const startupAnimationExampleInfo = createExampleInfo(metaData);
