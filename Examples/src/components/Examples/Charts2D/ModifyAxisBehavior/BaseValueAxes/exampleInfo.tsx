import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "BaseValueAxes",
        id: "chart2D_modifyAxisBehavior_BaseValueAxes",
        imagePath: "javascript-basevalue-axes.jpg",
        description:
            "Demonstrates how to create a **JavaScript Chart with BaseValue axes** using SciChart.js, High Performance JavaScript Charts.  ",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create a **JavaScript Chart with BaseValue axes** using SciChart.js to build non-linear and custom-scaled axes",
                title: "JavaScript Chart with BaseValue Axes",
                pageTitle: "JavaScript Chart with BaseValue Axes",
                metaDescription:
                    "Demonstrates BaseValue Axes on a JavaScript Chart using SciChart.js to create non-linear and custom-scaled axes such as log-like scales",
                markdownContent:
                    "## BaseValue Axes – JavaScript\n\n### Overview\nThis example demonstrates how to use the **BaseValueAxis** in SciChart.js to create **non-linear, index-based axes** that allow full control over how data is distributed along an axis. Unlike a standard `NumericAxis`, a `BaseValueAxis` spaces data points evenly by index while still preserving their original numeric values for labels, cursors, and annotations.\n\nThis approach makes it possible to compress, expand, or distort sections of the axis dynamically—enabling advanced visualization techniques such as log-linear scales, adaptive magnification, and gap compression.\n\n### How the BaseValueAxis Works\nThe `BaseValueAxis` operates by mapping data values to an internal **index space** defined by a set of base values. These base values:\n\n- Are spaced evenly along the axis (by index)\n- Define how real numeric values are interpolated between ticks\n- Can be dynamically changed at runtime\n\nInstead of plotting points by their numeric distance, SciChart converts data values into indices using an `IndexCalculator`. This allows multiple data series with different sampling densities or clustered values to coexist on the same axis without distortion or gaps.\n\n### Technical Implementation\nIn this example, a `BaseValueAxis` is used for both the X and Y axes. The X-axis is initialized with an explicit array of base values, while the Y-axis dynamically generates base values using a power-law function to create a logarithmic-style scale.\n\nThe Y-axis base values are updated whenever the visible range changes, ensuring that tick marks and labels remain meaningful at all zoom levels. Custom tick providers are used to precisely control major and minor tick placement, demonstrating how the axis can be tailored for advanced numeric scales.\n\nA hidden `NumericAxis` is synchronized with the BaseValue X-axis to allow precise placement of annotations. A draggable vertical line annotation dynamically modifies the base values, effectively creating a **local magnification lens** that expands detail around the cursor position while compressing the surrounding regions.\n\n### Features and Capabilities\n**Custom Non-Linear Scales:** Create log-like, exponential, or irregular axes without sacrificing numeric accuracy or interaction support.\n\n**Dynamic Axis Warping:** Modify base values in real time to zoom into specific regions while keeping the full dataset visible.\n\n**Precise Interaction Support:** Cursor tooltips, annotations, and zooming remain accurate because numeric values are preserved internally.\n\n**High-Performance Rendering:** All transformations are handled by SciChart’s WebAssembly engine, ensuring smooth interaction even with thousands of points.\n\n### Integration and Best Practices\nThe `BaseValueAxis` is ideal for advanced scientific, financial, or engineering charts where traditional linear or logarithmic axes are insufficient. It is especially useful for datasets with clustered values, uneven sampling, or where contextual magnification is required. For more details, see the [BaseValue Axis documentation](https://www.scichart.com/documentation/js/v4/BaseValueAxis.html) and related axis customization guides.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create a **React Chart with BaseValue axes** using SciChart.js to build non-linear and adaptive scales",
                title: "React Chart with BaseValue Axes",
                pageTitle: "React Chart with BaseValue Axes",
                metaDescription:
                    "Demonstrates BaseValue Axes on a React Chart using SciChart.js to create non-linear and custom-scaled axes",
                markdownContent:
                    "## BaseValue Axes – React\n\n### Overview\nThis example demonstrates how to implement **BaseValueAxis** within a React application using SciChart.js. BaseValue axes enable advanced, non-linear scaling by mapping numeric values to evenly spaced index positions, allowing developers to dynamically reshape how data is distributed along an axis.\n\nThis technique is particularly useful for visualizing datasets with clustered values, logarithmic behavior, or regions requiring focused magnification.\n\n### Technical Implementation\nThe chart is initialized using the `<SciChartReact />` component, which invokes a custom draw function to create the `SciChartSurface`, axes, series, and modifiers. A `BaseValueAxis` is configured for both X and Y dimensions, with base values supplied either as arrays or as dynamic `IDataSeries` instances.\n\nFor the Y-axis, base values are generated using a power-law function and updated automatically when the visible range changes. Custom major and minor tick logic is implemented via the axis tick provider, giving precise control over tick placement.\n\nA draggable vertical line annotation modifies the X-axis base values in real time, creating a magnification effect around the annotation position. This demonstrates how BaseValue axes can be used for interactive data exploration and contextual zooming.\n\n### Features and Capabilities\n**React-Friendly Architecture:** Axis behavior is fully encapsulated in the draw function, avoiding conflicts with React’s render lifecycle.\n\n**Dynamic Base Value Updates:** Base values can be recalculated and reapplied at runtime without reinitializing the chart.\n\n**Advanced Cursor and Annotation Support:** Despite the non-linear layout, cursor readouts and annotations remain numerically accurate.\n\n**WebAssembly Performance:** All index calculations and transformations are handled efficiently, ensuring responsive interaction.\n\n### Integration and Best Practices\nWhen integrating BaseValue axes into React, it is recommended to isolate chart logic within the SciChart initialization callback and manage base value updates through axis events. This example provides a strong foundation for building advanced analytical tools and scientific visualizations. For further reading, see the [SciChart React Tutorials](https://www.scichart.com/documentation/js/v4/get-started/tutorials-react/) and the [BaseValue Axis documentation](https://www.scichart.com/documentation/js/v4/BaseValueAxis.html).",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create a **Angular Chart with BaseValue axes** using SciChart.js to build non-linear and adaptive scales",
                title: "Angular Chart with BaseValue Axes",
                pageTitle: "Angular Chart with BaseValue Axes",
                metaDescription:
                    "Demonstrates BaseValue Axes on an Angular Chart using SciChart.js to create non-linear and custom-scaled axes",
                markdownContent:
                    "## BaseValue Axes – Angular\n\n### Overview\nThis example demonstrates how to use **BaseValueAxis** in an Angular application to create non-linear and adaptive chart axes using SciChart.js. BaseValue axes decouple numeric values from physical spacing, allowing developers to reshape the axis scale while preserving accurate numeric interaction.\n\n### Technical Implementation\nThe chart is hosted inside an Angular component using the `scichart-angular` integration. A custom initialization function creates a `SciChartSurface` and configures `BaseValueAxis` instances for both the X and Y axes.\n\nThe X-axis uses explicitly defined base values, while the Y-axis dynamically generates base values using a power-law algorithm. Custom tick providers are implemented to control major and minor tick placement, enabling precise logarithmic-style scaling.\n\nA draggable vertical annotation dynamically modifies the X-axis base values, effectively expanding the scale around the annotation while compressing other regions. This illustrates how BaseValue axes can be used to implement interactive magnification and adaptive scaling techniques.\n\n### Features and Capabilities\n**Non-Linear Axis Control:** Build logarithmic, exponential, or irregular scales without relying on fixed log axes.\n\n**Dynamic Data-Driven Scaling:** Base values can be updated in response to user interaction or data changes.\n\n**Accurate Interaction Model:** Cursor labels, zooming, and annotations remain consistent with the underlying numeric values.\n\n**Enterprise-Grade Performance:** SciChart’s WebAssembly engine ensures smooth rendering and interaction even with complex axis logic.\n\n### Integration and Best Practices\nThis example follows best practices for integrating advanced axis behavior into Angular applications, including safe lifecycle management and dynamic axis updates. Developers building engineering, financial, or scientific dashboards can use this pattern as a foundation. For more information, refer to the [SciChart Angular documentation](https://www.scichart.com/documentation/js/v4/get-started/tutorials-angular/) and the [BaseValue Axis documentation](https://www.scichart.com/documentation/js/v4/BaseValueAxis.html).",
            },
        },

        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v4/BaseValueAxis.html",
                title: "SciChart.js BaseValue Axis Documentation page",
                linkTitle: "BaseValue Axis documentation",
            },
        ],
        path: "basevalue-axes",
        metaKeywords: "non-linear, basevalue, axis, axes, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/BaseValueAxes",
        thumbnailImage: "javascript-basevalue-axes.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const BaseValueAxesExampleInfo = createExampleInfo(metaData);
export default BaseValueAxesExampleInfo;
