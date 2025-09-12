import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "PolarLabelMode",
        id: "chart2D_polarCharts_PolarLabelMode",
        imagePath: "javascript-polar-label-modes.jpg",
        description:
            "Creates a **JavaScript Polar Label Modes Chart** using SciChart.js, which demonstrates the different label modes we support for Polar Axes.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Creates a **JavaScript Polar Label Modes Chart** using SciChart.js, which demonstrates the different label modes we support for Polar Axes.",
                title: "JavaScript Polar Label Modes",
                pageTitle: "JavaScript Polar Label Modes | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## JavaScript Polar Label Mode Chart\n\n### Overview\nThis example demonstrates how to create a polar chart with configurable label modes using SciChart.js. The implementation showcasePolarNumericAxis with angular and radial configurations, highlighting the EPolarLabelMode options for angular axis label orientations.\n\n### Technical Implementation\nThe chart utilizes SciChartPolarSurface for polar rendering with both angular and radial axes. The angular axis implements polar label modes including Horizontal, Perpendicular, and Parallel Interactive modifiers including PolarPanModifier, PolarZoomExtentsModifier, and PolarMouseWheelZoomModifier enable seamless navigation. The implementation follows polar chart layout best practices with proper axis configuration and data series setup.\n\n### Features and Capabilities\nThe example provides dynamic label mode switching through the changePolarLabelMode function, allowing real-time updates to angular axis label orientation. It includes PolarLineRenderableSeries with EllipsePointMarker for data visualization and supports inner axis positioning through the isInnerAxis toggle functionality.\n\n### Integration and Best Practices\nThe JavaScript implementation emphasizes proper resource management with WebAssembly context handling and provides a clean API for dynamic chart configuration. The use of specialized polar modifiers ensures optimal user interaction within the circular coordinate system.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Label Modes Chart** using SciChart.js, which demonstrates the different label modes we support for Polar Axes.",
                title: "React Polar Label Modes",
                pageTitle: "React Polar Label Modes | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## React Polar Label Mode Chart\n\n### Overview\nThis example demonstrates creating a polar chart with configurable label modes in React using SciChart.js. The implementation leverages the SciChartReact component to render a PolarNumericAxis with dynamic EPolarLabelMode configurations for angular axis labels.\n\n### Technical Implementation\nThe chart is initialized through the SciChartReact component using an initChart function that creates a SciChartPolarSurface with WebAssembly context. The angular axis supports polar label modes including Horizontal, Perpendicular, and Parallel orientations. The implementation follows polar chart layout principles with proper radial and angular axis configuration, enhanced by interactive polar modifiers for pan, zoom, and mouse wheel operations.\n\n### Features and Capabilities\nThe example provides runtime label mode switching through the changePolarLabelMode control function, enabling dynamic updates to angular axis label presentation. It includes PolarLineRenderableSeries with point markers for data visualization and supports inner axis positioning toggle functionality for flexible chart layouts.\n\n### Integration and Best Practices\nReact integration utilizes the SciChartReact wrapper component for seamless lifecycle management, ensuring proper chart initialization and cleanup. The modular design separates chart logic in drawExample.ts from React component structure, following React best practices for chart integration and component reusability.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Label Modes Chart** using SciChart.js, which demonstrates the different label modes we support for Polar Axes.",
                title: "Angular Polar Label Modes",
                pageTitle: "Angular Polar Label Modes | JavaScript Charts",
                metaDescription: null,
                markdownContent: "## Angular Polar Label Mode Chart\n\n### Overview\nThis example demonstrates creating a polar chart with configurable label modes in Angular using SciChart.js. The implementation uses Angular's standalone component architecture with the scichart-angular component to render a PolarNumericAxis featuring dynamic EPolarLabelMode configurations.\n\n### Technical Implementation\nThe chart leverages SciChartPolarSurface with WebAssembly context for high-performance polar rendering. The angular axis implements polar label modes supporting Horizontal, Perpendicular, and Parallel label orientations. Following polar chart layout guidelines, the implementation configures both radial and angular axes with appropriate visible ranges and styling. Interactive polar modifiers enable seamless navigation including pan, zoom extents, and mouse wheel zoom functionality.\n\n### Features and Capabilities\nThe example provides dynamic label mode switching through the changePolarLabelMode function, allowing real-time updates to angular axis label presentation. It includes PolarLineRenderableSeries with EllipsePointMarker for data visualization and supports inner axis positioning through the toggleIsInnerAxis control function.\n\n### Integration and Best Practices\nAngular integration uses the standalone scichart-angular component with proper initChart function binding, ensuring efficient chart lifecycle management. The architecture separates chart logic from Angular component structure, following Angular best practices for external library integration and component design patterns.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html",
                title: "This specific page in the JavaScript Polar Label Modes documentation will help you to get started",
                linkTitle: "JavaScript Polar Label Modes Documentation",
            },
        ],
        path: "polar-label-modes",
        metaKeywords: "polar, label, polarLabelMode, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarLabelMode",
        thumbnailImage: "javascript-polar-label-modes.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
