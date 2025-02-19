import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "Charts2DStylingAndThemingStylingInCode",
        imagePath: "javascript-chart-styling-theming-in-code.jpg",
        description:
            "Demonstrates how to **style or theme a JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to **style or theme a JavaScript Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Styling a JavaScript Chart in Code",
                pageTitle: "Styling a JavaScript Chart in Code",
                metaDescription:
                    "Demonstrates how to style a JavaScript Chart entirely in code with SciChart.js themeing API",
                markdownContent:
                    "# Styling in Code (Vanilla JavaScript)\n\n## Overview\nThis example demonstrates how to apply **in-code chart styling** using SciChart.js in a vanilla JavaScript environment. The code programmatically customizes various chart elements such as the background, numeric axes (including title, label, grid lines, and ticks), as well as annotations and interactive modifiers. This approach provides a clear and flexible way to style charts without relying on external themes or frameworks.\n\n## Technical Implementation\nThe chart is initialized asynchronously using the SciChartSurface.create method, which leverages WebAssembly for optimal performance. Developers can refer to the [Creating a new SciChartSurface and loading Wasm](https://www.scichart.com/documentation/js/current/SciChartSurface.create%20and%20createSingle.html) documentation for more details on this initialization pattern. The implementation focuses on detailed **custom axis styling**, where NumericAxis properties are configured for both the X and Y axes. Specific styling options like axis bands, custom dash arrays for grid lines, and bespoke tick settings are applied to enhance the visual presentation. The configuration of these properties is explained in the [NumericAxis | API Documentation for SciChart.js - v3.5.723](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html). Interactive modifiers such as ZoomPanModifier and MouseWheelZoomModifier are integrated to allow users to pan and zoom within the chart. More on these interactivity features can be found in [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n## Features and Capabilities\nThis example highlights several advanced features including:\n- Detailed customization of axis styling with tailored fonts, colors, grid line dash patterns, and axis borders.\n- The use of a text annotation, configured with relative coordinate modes, to serve as a styled chart title. For additional information on annotations, visit the [TextAnnotation Documentation](https://www.scichart.com/documentation/js/current/TextAnnotation.html).\n- Interactive chart modifiers that provide smooth zooming and panning functionality.\n- A proper resource management strategy where the SciChartSurface is disposed of when no longer needed, ensuring optimal memory usage as discussed in [Memory Best Practices](https://www.scichart.com/documentation/js/current/MemoryBestPractices.html).\n\n## Integration and Best Practices\nBy integrating SciChart.js directly with vanilla JavaScript, this example establishes a modular and maintainable approach without the overhead of additional frameworks. Developers can get started quickly by following guidance from the [Tutorial 01 - Including SciChart.js in an HTML Page using CDN](https://www.scichart.com/documentation/js/current/Tutorial01IncludingSciChartjsHTMLPage.html). Furthermore, the in-code styling method promotes a clear separation between configuration and presentation, ensuring that chart appearance can be easily updated without altering core functionality. For those interested in expanding the customization further, the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation provides additional insights on applying custom color schemes and theme settings.\n",
            },
            react: {
                subtitle:
                    "Demonstrates how to **style or theme a React Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Styling a React Chart in Code",
                pageTitle: "Styling a React Chart in Code",
                metaDescription:
                    "Demonstrates how to style a React Chart entirely in code with SciChart.js themeing API",
                markdownContent:
                    "# Styling in Code (React)\n\n## Overview\nThis example demonstrates how to apply custom styling to a SciChart.js chart entirely in code within a **React** application. The implementation focuses on programmatically setting colors, fonts, and grid styles to enhance the visual appearance of the chart. It serves as a practical reference for developers looking to implement [custom theming and styling](https://demo.scichart.com/javascript/chart-styling-theming-in-code) directly within their application code.\n\n## Technical Implementation\nThe chart is initialized asynchronously using the SciChartSurface.create method within an async function, leveraging modern JavaScript async/await patterns for smooth and efficient chart creation. Integration into the React application is achieved through the **SciChartReact** component, ensuring that the chart setup remains clean and modular. Developers can learn more about integrating SciChart with React in the [React Charts with SciChart.js: Introducing “SciChart React”](https://www.scichart.com/blog/react-charts-with-scichart-js/) article. The example applies custom styles directly to numeric axes, grid lines, tick markers, and annotations, providing precise control over the chart aesthetics.\n\n## Features and Capabilities\nKey features include advanced chart customizations such as styled axes with tailored title and label styles, customized grid lines with dash arrays, and a text annotation that functions as the chart title. Interactive modifiers like **ZoomPanModifier** and **MouseWheelZoomModifier** are integrated to enhance chart interactivity, allowing users to efficiently navigate and explore the data. Further details on these interactive features can be found in [Tutorial 03 - Adding Zooming, Panning Behavior](https://www.scichart.com/documentation/js/current/Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html).\n\n## Integration and Best Practices\nThe example adheres to best practices for React integration by utilizing the **SciChartReact** component, ensuring a seamless incorporation into the React ecosystem. Asynchronous initialization not only optimizes performance but also guarantees efficient management of the WebAssembly context. For additional insights into performance optimization in React charts, refer to [How to Make Charts in React from Scratch? - SciChart](https://www.scichart.com/blog/how-to-make-charts-in-react/). Moreover, the explicit in-code styling promotes a clear separation of concerns, making future maintenance and updates more straightforward. Comprehensive details on performance and resource management are available in the [SciChart.js JavaScript Charts User Manual](https://www.scichart.com/documentation/js/current/SciChart_JS_User_Manual.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to **style or theme a Angular Chart** using SciChart.js, High Performance JavaScript Charts",
                title: "Styling a Angular Chart in Code",
                pageTitle: "Styling a Angular Chart in Code",
                metaDescription:
                    "Demonstrates how to style a Angular Chart entirely in code with SciChart.js themeing API",
                markdownContent:
                    "# Styling In Code (Angular)\n\n## Overview\nThis example demonstrates how to style and theme a SciChart.js chart entirely in code within an Angular application. It focuses on programmatically applying custom colors, fonts, grid styles, and annotations to create a visually distinctive chart without relying on external themes or a builder API.\n\n## Technical Implementation\nThe chart is integrated using an Angular standalone component with the [scichart-angular](https://classic.yarnpkg.com/en/package/scichart-angular) package. The initialization is performed asynchronously by calling SciChartSurface.create, which leverages WebAssembly for optimal performance; further details can be found in this [WebAssembly integration guide](https://stackoverflow.com/questions/56216125/implement-webassembly-in-my-angular-project). The example configures numeric axes with custom styles such as title fonts, grid line dash arrays, and tick marks, and it adds interactive modifiers like [ZoomPanModifier](https://www.scichart.com/documentation/js/current/ZoomPanModifier.html) and MouseWheelZoomModifier to enhance user interactivity.\n\n## Features and Capabilities\nThe example illustrates advanced customizations including detailed styling for both X and Y axes, complete with bespoke title styles, axis bands, and grid line definitions. A text annotation serves as a chart title, demonstrating how annotations can be styled directly in code. Interactive features allow users to pan and zoom, highlighting the flexibility and high performance of SciChart.js in handling real-time chart modifications.\n\n## Integration and Best Practices\nUtilizing Angular standalone components ([see documentation](https://angular.io/guide/standalone-components)), this example provides a modular approach to chart integration that ensures maintainability and performance. By managing chart initialization asynchronously and applying in-code styling, developers can achieve a clear separation of concerns while optimizing rendering performance. For additional insights on in-code chart theming, consult the [Chart Styling - Creating a Custom Theme](https://www.scichart.com/documentation/js/current/Chart%20Styling%20-%20Creating%20a%20Custom%20Theme.html) documentation.\n",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#Chart%20Styling%20-%20Style%20Chart%20Parts%20in%20Code.html",
                title: "How to style chart parts in code documentation",
                linkTitle: "Custom Theme documentation",
            },
        ],
        path: "chart-styling-theming-in-code",
        metaKeywords: "styling, in, code, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/StylingInCode",
        thumbnailImage: "javascript-chart-styling-theming-in-code.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

export const stylingInCodeExampleInfo = createExampleInfo(metaData);
