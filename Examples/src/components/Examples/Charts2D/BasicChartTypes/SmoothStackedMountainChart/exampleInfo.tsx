import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DBasicChartTypesSmoothStackedMountainChart",
        imagePath: "javascript-smooth-stacked-mountain-chart.jpg",
        description:
            "Learn how to make a **JavaScript Smooth Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Learn how to make a **JavaScript Smooth Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
                title: "JavaScript Smooth Stacked Mountain Chart",
                pageTitle: "JavaScript Smooth Stacked Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "Design a high performance JavaScript Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.",
                markdownContent:
                    "# Smooth Stacked Mountain Chart Example using Vanilla JavaScript\n\n## Overview\nThis example demonstrates how to create a high performance and interactive **Smooth Stacked Mountain Chart** using SciChart.js in a vanilla JavaScript environment. The chart showcases multiple smooth stacked mountain series with dynamic, randomized data, offering animated transitions and rich interactivity through various modifiers.\n\n## Technical Implementation\nThe chart is initialized asynchronously via [SciChartSurface.create](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html), ensuring efficient bootstrapping of the WebGL-based rendering engine. A **StackedMountainCollection** groups several **SmoothStackedMountainRenderableSeries**, each configured with randomized Y values and animated using [ScaleAnimation](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html) to achieve smooth state transitions. The series subscribe to visibility change events using the [Series isVisible and isVisibleChanged API](https://www.scichart.com/documentation/js/current/Series%20isVisible%20and%20isVisibleChanged%20API.html) for real-time updates.\n\n## Features and Capabilities\nThe implementation builds upon several advanced features:\n\n- The use of [StackedMountainCollection](https://www.scichart.com/documentation/js/current/typedoc/classes/stackedmountaincollection.html) allows for effective stacking of multiple series to form a combined visual representation.\n- Animated transitions ensure changes in series visibility and data updates are smooth and visually appealing through the application of [ScaleAnimation](https://www.scichart.com/documentation/js/current/Series%20Style%20Animations.html).\n- Interactive modifiers such as ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier offer enhanced user control over zooming and panning, making the chart highly responsive to user inputs.\n\n## Integration and Best Practices\nThe example leverages best practices for vanilla JavaScript integration by isolating the chart initialization logic and utilizing asynchronous loading for optimal performance. Developers are encouraged to explore the [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) for customizing interactivity and to follow performance optimization tips available in SciChart.js documentation when managing multiple animated series. This approach ensures that charts remain responsive and maintain high performance even under complex rendering scenarios.",
            },
            react: {
                subtitle:
                    "Learn how to make a **React Smooth Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
                title: "React Smooth Stacked Mountain Chart",
                pageTitle: "React Smooth Stacked Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "Design a high performance React Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.",
                markdownContent:
                    "# React Smooth Stacked Mountain Chart\n\n## Overview\nThis example demonstrates the creation of a **React Smooth Stacked Mountain Chart** using SciChart.js. The chart is designed to showcase stacking multiple smooth mountain series with interactive features such as zooming, panning, and toggling between normal and 100% stacked modes. The example leverages React functional components, hooks, and Material-UI controls to provide a modern and responsive charting experience.\n\n## Technical Implementation\nThe chart is initialized asynchronously using the SciChart.js API within a React component. The core chart is built by creating a SciChartSurface that hosts the x and y axes. A **StackedMountainCollection** is used to group multiple **SmoothStackedMountainRenderableSeries**. Each series is fed with randomized data and animated using the **ScaleAnimation** for smooth transitions. Series visibility changes trigger subscription-based events that run animations before updating the series state. For more details on initializing the SciChartSurface asynchronously and integrating with React hooks, refer to the [Creating a SciChart React Component from the Ground Up](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html) guide.\n\n## Features and Capabilities\nThis example highlights several advanced features and customizations including:\n- **Real-time updates:** Event subscriptions monitor visibility changes, triggering animations and ensuring smooth state transitions.\n- **Interactive legend and tooltips:** A legend modifier is added with customization options like checkboxes and series markers.\n- **Dynamic mode switching:** Users can toggle between standard stacked and 100% stacked modes via a Material-UI toggle button group.\nThese capabilities provide insights into building interactive financial and scientific charts, similar to approaches discussed in [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/).\n\n## Integration and Best Practices\nThe integration with React is achieved using the **SciChartReact** component, which encapsulates the initialization logic of the SciChartSurface. React hooks such as **useState** and **useRef** are employed to manage state and communicate with child components. The use of [Material-UI ToggleButtonGroup](https://mui.com/material-ui/react-toggle-button/?srsltid=AfmBOopHRhnDbbwNGA-pxWpXlN_dEzhLGKxaGMJPp4uAGYtIEk-BkCEi) for mode switching showcases how to blend interactive UI elements with advanced chart configuration. Additionally, the animation framework provided by SciChart.js, exemplified by **ScaleAnimation**, ensures that series transitions are smooth and performant. Developers are encouraged to review performance optimization techniques, as outlined in various SciChart.js documentation pages, to further enhance real-time interactions, as seen on the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) page.\n\nBy following these integration guidelines and embracing React best practices, developers can achieve efficient and highly interactive charting solutions with SciChart.js.",
            },
            angular: {
                subtitle:
                    "Learn how to make a **Angular Smooth Stacked Mountain Chart** using with SciChart's powerful JavaScript Charts and it's range of features.",
                title: "Angular Smooth Stacked Mountain Chart",
                pageTitle: "Angular Smooth Stacked Mountain Chart | JavaScript Chart Library",
                metaDescription:
                    "Design a high performance Angular Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.",
                markdownContent:
                    "# Angular Smooth Stacked Mountain Chart\n\n## Overview\nThis example demonstrates an **Angular Smooth Stacked Mountain Chart** that leverages SciChart.js within an Angular standalone component. The chart showcases the stacking of multiple smooth mountain series with dynamically generated data, interactive modifiers, animations, and event handling, all following Angular best practices.\n\n## Technical Implementation\nThe chart is initialized asynchronously by invoking the SciChartSurface.create method within the Angular component, ensuring that the chart loads efficiently. The standalone component defined in the example uses the [scichart-angular component](https://www.npmjs.com/package/scichart-angular) for seamless integration with Angular. Within the drawExample function, the chart is built by setting up NumericAxes and creating a StackedMountainCollection to group multiple SmoothStackedMountainRenderableSeries. Each series is animated using a ScaleAnimation and is subscribed to visibility change events via the [Series isVisibleChanged API](https://www.scichart.com/documentation/js/current/Series%20isVisible%20and%20isVisibleChanged%20API.html), ensuring smooth transitions and dynamic updates. For more details on chart initialization and Angular integration, developers can refer to [Getting Started with SciChart JS](https://www.scichart.com/getting-started/scichart-javascript/) and [Getting started with standalone components - Angular](https://angular.io/guide/standalone-components).\n\n## Features and Capabilities\nThe chart supports advanced interaction features such as zooming, panning, and mouse-wheel zoom through modifiers like ZoomExtentsModifier, ZoomPanModifier, and MouseWheelZoomModifier. A legend modifier enhances interactivity by providing checkboxes and series markers for toggling the visibility of individual series. Real-time updates are achieved by triggering animations when series visibility changes, which adds an additional layer of interactivity and smooth user experience.\n\n## Integration and Best Practices\nThis implementation exemplifies effective Angular integration by isolating the SciChart initialization logic in a standalone component. Asynchronous chart creation, combined with Angular event handling for series updates, ensures that the chart remains performant and responsive. Developers are encouraged to explore the use of event subscriptions for driving animations and maintaining UI reactivity, as showcased by the implementation of [Angular event handling documentation](https://www.scichart.com/documentation/js/current/Series%20isVisible%20and%20isVisibleChanged%20API.html). For a deeper understanding of performance optimizations and advanced chart features in SciChart.js, consult the [Advanced JavaScript Chart and Graph Library | SciChart JS](https://www.scichart.com/javascript-chart-features/) documentation.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Stacked%20Mountain%20Series%20Type.html",
                title: "The specific page for the JavaScript Stacked Mountain Chart documentation will help you to get started",
                linkTitle: "JavaScript Stacked Mountain Chart Documentation",
            },
        ],
        path: "smooth-stacked-mountain-chart",
        metaKeywords: "stacked, mountain, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/BasicChartTypes/SmoothStackedMountainChart",
        thumbnailImage: "javascript-smooth-stacked-mountain-chart.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const smoothStackedMountainChartExampleInfo = createExampleInfo(metaData);
