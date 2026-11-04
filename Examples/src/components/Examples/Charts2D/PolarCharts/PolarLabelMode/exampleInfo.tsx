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
                title: "JavaScript Polar Axis Label Modes",
                pageTitle: "JavaScript Polar Axis Label Modes",
                metaDescription:
                    "Create a JavaScript Polar Axis Label with SciChart. This demo shows the various label modes for Polar Axes – all optimised for pan, zoom, and mouse wheel.",
                markdownContent:
                    "## Polar Axis Label Modes in JavaScript\n\n### Overview\nThis example shows how `EPolarLabelMode` changes the angular labels on a polar chart. Switch between horizontal, perpendicular, and parallel labels, and move the axes inside or outside the plot.\n\n### How it works\nThe chart uses `SciChartPolarSurface` with radial and angular `PolarNumericAxis` instances. The angular axis sets `polarLabelMode`; the radial axis provides context for the plotted `PolarLineRenderableSeries`. See the [polar axis styling documentation](https://www.scichart.com/documentation/js/v6/2d-charts/axis-api/axis-styling/polar-axis-styling/#polar-labels) for the available label modes.\n\n### Try it\nUse the label-mode control to call `changePolarLabelMode` and update the angular axis. Toggle the inner-axis setting to change `isInnerAxis` on both axes. Drag to pan, scroll to zoom, or use the chart modifiers: `PolarPanModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier`.",
            },
            react: {
                subtitle:
                    "Creates a **React Polar Label Modes Chart** using SciChart.js, which demonstrates the different label modes we support for Polar Axes.",
                title: "React Polar Axis Label Modes",
                pageTitle: "React Polar Axis Label Modes",
                metaDescription:
                    "Create a React Polar Axis Label with SciChart. This demo shows the various label modes for Polar Axes – all optimised for pan, zoom, and mouse wheel.",
                markdownContent:
                    "## Polar Axis Label Modes in React\n\n### Overview\nThis React example shows how `EPolarLabelMode` changes the angular labels on a polar chart. Switch between horizontal, perpendicular, and parallel labels, then move the axes inside or outside the plot.\n\n### How it works\n`SciChartReact` renders a chart created with `SciChartPolarSurface` and radial and angular `PolarNumericAxis` instances. The angular axis sets `polarLabelMode`, while a `PolarLineRenderableSeries` provides a visual reference. See the [polar axis styling documentation](https://www.scichart.com/documentation/js/v6/2d-charts/axis-api/axis-styling/polar-axis-styling/#polar-labels) for the available label modes.\n\n### Try it\nThe label-mode control calls `changePolarLabelMode` to update the angular axis. Toggle the inner-axis setting to change `isInnerAxis` on both axes. The chart supports dragging to pan and scrolling to zoom with `PolarPanModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier`.",
            },
            angular: {
                subtitle:
                    "Creates a **Angular Polar Label Modes Chart** using SciChart.js, which demonstrates the different label modes we support for Polar Axes.",
                title: "Angular Polar Axis Label Modes",
                pageTitle: "Angular Polar Axis Label Modes",
                metaDescription:
                    "Create an Angular Polar Axis Label with SciChart. This demo shows the various label modes for Polar Axes – all optimised for pan, zoom, and mouse wheel.",
                markdownContent:
                    "## Polar Axis Label Modes in Angular\n\n### Overview\nThis Angular example shows how `EPolarLabelMode` changes the angular labels on a polar chart. Switch between horizontal, perpendicular, and parallel labels, then move the axes inside or outside the plot.\n\n### How it works\nThe `scichart-angular` component renders a chart created with `SciChartPolarSurface` and radial and angular `PolarNumericAxis` instances. The angular axis sets `polarLabelMode`, while a `PolarLineRenderableSeries` provides a visual reference. See the [polar axis styling documentation](https://www.scichart.com/documentation/js/v6/2d-charts/axis-api/axis-styling/polar-axis-styling/#polar-labels) for the available label modes.\n\n### Try it\nThe label-mode control calls `changePolarLabelMode` to update the angular axis. Toggle the inner-axis setting to change `isInnerAxis` on both axes. The chart supports dragging to pan and scrolling to zoom with `PolarPanModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier`.",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v6/2d-charts/axis-api/axis-styling/polar-axis-styling/#polar-labels",
                title: "This specific page in the JavaScript Polar Label Modes documentation will help you to get started",
                linkTitle: "JavaScript Polar Label Modes Documentation",
            },
        ],
        path: "polar-label-modes",
        metaKeywords: "polar, axis, label, polarLabelMode, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/PolarCharts/PolarLabelMode",
        thumbnailImage: "javascript-polar-label-modes.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false,
    };
//// End of computer generated metadata

export default createExampleInfo(metaData);
