import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DAnimationsGenericAnimation",
        imagePath: "javascript-generic-animation.jpg",
        description:
            "Demonstrates how to run **Generic Animation** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to run **Generic Animation** using SciChart.js, High Performance JavaScript Charts",
                title: "JavaScript Generic Animation",
                pageTitle: "JavaScript Generic Animation",
                metaDescription: "Demonstrates how to run Generic Animation with JavaScript.",
                markdownContent:
                    "## JavaScript Generic Animation Example\n\n### Overview\nThis example demonstrates how to leverage SciChart.js with JavaScript to create dynamic and interactive 2D charts enhanced with smooth animations. The focus is on using the **GenericAnimation** class to create effects such as a typewriter reveal for the chart title, seamless annotation fade-ins, and fluid transitions between different bubble series.\n\n### Technical Implementation\nThe implementation begins with asynchronous initialization of the SciChartSurface as described in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/). The chart is constructed by setting up numeric axes, bubble series with **XyzDataSeries** and **FastBubbleRenderableSeries**, and integrating annotations directly into the visualization. Custom animations are created using the **GenericAnimation** class, which offers granular control over the animation progress. For example, a custom typewriter effect is implemented to reveal the chart title gradually, a technique that aligns with approaches covered in [Javascript Beginner Tutorial - Typewriter Effect with Vanilla JS](https://www.youtube.com/watch?v=sApSxcqwgd8). The example also employs axis animations via the animateVisibleRange method to smoothly adjust axis ranges, as detailed in [Axis Ranging - Set Range and Zoom to Fit - SciChart](https://www.scichart.com/documentation/js/current/Axis%20Ranging%20-%20Setting%20and%20Getting%20VisibleRange.html).\n\n### Features and Capabilities\nKey features include real-time update animations that manage opacity transitions between annotations and bubble series, dynamic changes to axis titles, and coordinated delays that sequence various animations over time. These capabilities allow for visually engaging transitions and offer developers a template for implementing sophisticated interactive charts.\n\n### Integration and Best Practices\nBuilt purely with JavaScript, this example avoids reliance on frameworks and demonstrates clean, efficient code management. It emphasizes asynchronous chart initialization, proper resource cleanup using sciChartSurface.delete(), and detailed control over animation timing. Additionally, performance optimization techniques are applied, ensuring responsiveness even during complex animation sequences. Developers can further explore performance strategies in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).",
            },
            react: {
                subtitle:
                    "Demonstrates how to run **Generic Animation** using SciChart.js, High Performance JavaScript Charts",
                title: "React Generic Animation",
                pageTitle: "React Generic Animation",
                metaDescription: "Demonstrates how to run Generic Animation with JavaScript.",
                markdownContent:
                    '# React Generic Animation Example\n\n### Overview\nThis example demonstrates how to integrate advanced chart animations into a React application using `<SciChartReact/>`. The "Generic Animation" example showcases smooth and dynamic animations including a typewriter effect for the chart title, animated annotations, and data series transitions, all rendered using SciChart.js.\n\n### Technical Implementation\nThe implementation initializes the chart asynchronously through the `<SciChartReact/>` component\'s initChart prop. Multiple animations are defined using the GenericAnimation class, delivering staged transitions such as fading in annotations and performing a typewriter effect on the title. This setup is aligned with [best practices for React integration](https://www.scichart.com/blog/creating-a-react-dashboard-with-scichart-js-scichart-react-and-deepseek-r1/) and asynchronous initialization as explained in [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html).\n\n### Features and Capabilities\nKey features include real-time updates and advanced animation sequencing. For instance, the example employs a custom typewriter effect to sequentially reveal the chart title, and coordinated animations to transition between bubble series and annotations. Developers can further explore the [GenericAnimation documentation](https://www.scichart.com/documentation/js/current/typedoc/classes/genericanimation.html) for deeper customization of these effects.\n\n### Integration and Best Practices\nThe React integration is achieved by using the `<SciChartReact/>` component to encapsulate the chart rendering logic within a React component, ensuring efficient lifecycle management and performance optimization. Animation sequencing with built-in delays demonstrates how to manage complex state transitions while keeping the user interface responsive. Additional performance tuning insights can be found in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/), and for further enhancements such as the typewriter effect, resources like [Creating a typewriter effect in React](https://stackoverflow.com/questions/77869504/creating-a-typewriter-effect-in-react-using-js) provide practical guidance.',
            },
            angular: {
                subtitle:
                    "Demonstrates how to run **Generic Animation** using SciChart.js, High Performance JavaScript Charts",
                title: "Angular Generic Animation",
                pageTitle: "Angular Generic Animation",
                metaDescription: "Demonstrates how to run Generic Animation with JavaScript.",
                markdownContent:
                    '# Angular Generic Animation\n\n### Overview\nThis example demonstrates how to integrate SciChart.js into an Angular standalone component using the scichart-angular package. The "Generic Animation" example showcases how to animate various chart elements including the chart title, annotations, and data series. By leveraging asynchronous initialization and the powerful **GenericAnimation** class, developers can create dynamic, interactive charts that engage users with smooth animation transitions.\n\n### Technical Implementation\nThe implementation is centered around the asynchronous initialization of the SciChartSurface in an Angular component. The drawExample function sets up the chart by creating axes, bubble series, and annotations, then applies custom animations using the **GenericAnimation** class. One animation implements a typewriter effect to reveal the chart title, while others gradually fade in annotations and manage transitions between different bubble series. Developers can dive deeper into customizing these animations in the [Generic Animations documentation](https://www.scichart.com/documentation/js/current/Generic%20Animations.html). The asynchronous setup follows best practices outlined in [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) and integrates seamlessly with Angular via the [scichart-angular package](https://www.npmjs.com/package/scichart-angular).\n\n### Features and Capabilities\nThe example features several advanced capabilities including real-time update effects and dynamic annotation management. Notable features include:\n- A typewriter animation for the chart title that provides a step-by-step reveal.\n- Coordinated opacity transitions for annotations and bubble series to smoothly transition between different data states.\n- Dynamic updates of axis titles and visible ranges to reflect data series transitions.\nThese features enable the creation of charts that are not only visually appealing but also highly interactive and responsive.\n\n### Integration and Best Practices\nIntegration into Angular is achieved through a standalone component that encapsulates the SciChart initialization and animation logic. This design approach ensures efficient lifecycle management and optimal performance. The timing and sequencing of animations are managed using precise delays and duration settings within the **GenericAnimation** instances, exemplifying best practices for handling dynamic animations in Angular. Further insights into similar animation techniques can be found in the [Angular Startup Animation](https://scichart.com/demo/angular/startup-animation) demo, while performance considerations are well documented in [Performance Optimisation of JavaScript Applications & Charts](https://www.scichart.com/blog/performance-optimisation-of-javascript-applications-charts/).',
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/Generic%20Animations.html",
                title: "The specific page for the JavaScript Generic Animation documentation will help you to get started",
                linkTitle: "Generic Animation Documentation",
            },
        ],
        path: "generic-animation",
        metaKeywords: "generic, animation, javascript",
        onWebsite: true,
        filepath: "Charts2D/Animations/GenericAnimation",
        thumbnailImage: "javascript-generic-animation.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const genericAnimationExampleInfo = createExampleInfo(metaData);
