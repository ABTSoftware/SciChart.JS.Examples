import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "CustomTooltips",
        id: "chart2D_tooltipsAndHittest_CustomTooltips",
        imagePath: "javascript-chart-custom-tooltip.jpg",
        description:
            "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
                title: "Using Custom Tooltips",
                pageTitle: "Using Custom Tooltips",
                metaDescription:
                    "Demonstrates adding a Cursor (Crosshair) to a JavaScript Chart with SciChart.js CursorModifier",
                markdownContent:
                    "# Custom Tooltips Example - JavaScript\n\n## Overview\nThis JavaScript example demonstrates advanced custom tooltip implementations using SciChart.js. It showcases three distinct tooltip modes: cursor tooltips, rollover tooltips, and interactive vertical slice tooltips with dynamic color interpolation and click-to-add functionality.\n\n## Technical Implementation\nThe implementation creates a SciChartSurface with multiple FastLineRenderableSeries using EllipsePointMarkers for visual enhancement. The core innovation lies in the custom tooltip templates that generate dynamic SVG content. The cursorSvgTemplate creates multi-series tooltips with color interpolation based on Y-values, while the verticalSliceTooltipTemplate includes interactive close buttons. A custom ClickVerticalSliceModifier extends ChartModifierBase2D to handle mouse interactions for adding draggable vertical slices programmatically.\n\n## Features and Capabilities\nThe example features real-time color interpolation using the interpolateColor function that transitions between colors based on data values. Interactive vertical slices can be added via mouse clicks and removed through tooltip buttons. The implementation leverages adjustTooltipPosition for automatic tooltip placement and uses SeriesInfo objects to access real-time chart data. Multiple chart modifiers including CursorModifier, RolloverModifier, and ZoomPanModifier provide comprehensive interaction capabilities as documented in the [Chart Modifier API](https://www.scichart.com/documentation/js/v4/2d-charts/chart-modifier-api/).\n\n## Integration and Best Practices\nThis vanilla JavaScript implementation demonstrates proper lifecycle management through async initialization and cleanup functions. The modular approach separates data generation, tooltip templating, and interaction handling into reusable components. Performance is optimized through efficient SVG generation and proper use of the WebAssembly context for high-speed rendering.",
            },
            react: {
                subtitle:
                    "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
                title: "Using Custom Tooltips",
                pageTitle: "Using Custom Tooltips",
                metaDescription:
                    "Demonstrates adding a Cursor (Crosshair) to a React Chart with SciChart.js CursorModifier",
                markdownContent:
                    "# Custom Tooltips Example - React\n\n## Overview\nThis React example showcases sophisticated custom tooltip implementations using SciChartReact components. It provides three interactive tooltip modes with seamless React state integration, demonstrating how to bridge SciChart's rendering capabilities with React's reactive data flow.\n\n## Technical Implementation\nThe component uses SciChartReact with an initChart function that returns callback methods for React state synchronization. The implementation features useState hooks for managing tooltip type selection and useRef hooks for preserving chart control functions. Custom tooltip templates leverage SVG generation with dynamic color interpolation and integrate click handlers that trigger React state updates. The vertical slice implementation includes a custom ClickVerticalSliceModifier that extends ChartModifierBase2D for adding interactive slices on click events.\n\n## Features and Capabilities\nThe example demonstrates real-time state synchronization where tooltip data flows into React components for display. Color interpolation dynamically adjusts tooltip text colors based on data values relative to series min/max ranges. Interactive vertical slices feature draggable behavior and removable tooltips with close buttons. The implementation uses multiple chart modifiers including CursorModifier with custom tooltipSvgTemplate and RolloverModifier with per-series tooltip customization as detailed in the [Rollover Modifier documentation](https://www.scichart.com/documentation/js/v4/2d-charts/chart-modifier-api/rollover-modifier/).\n\n## Integration and Best Practices\nThis example follows React best practices by separating chart initialization logic from presentation components. It demonstrates proper use of useEffect for side effects and useRef for preserving imperative handles. The implementation showcases effective patterns for integrating SciChart's imperative API with React's declarative paradigm, ensuring optimal performance through controlled re-renders and efficient state management.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to create **crosshairs on mouseover** using SciChart.js, High Performance JavaScript Charts",
                title: "Using Custom Tooltips",
                pageTitle: "Using Custom Tooltips",
                metaDescription:
                    "Demonstrates adding a Cursor (Crosshair) to a Angular Chart with SciChart.js CursorModifier",
                markdownContent:
                    "# Custom Tooltips Example - Angular\n\n## Overview\nThis Angular example demonstrates custom tooltip implementations using the scichart-angular package within a standalone component. It features three distinct tooltip interaction modes with dynamic SVG generation and interactive vertical slice management.\n\n## Technical Implementation\nThe implementation uses Angular's standalone component architecture with ScichartAngularComponent imported directly. The drawExample function provides the chart initialization logic, creating a SciChartSurface with multiple data series and custom tooltip templates. The component leverages Angular's template syntax for the UI controls while delegating chart rendering to SciChart's optimized WebAssembly engine. Custom tooltip templates generate dynamic SVG content with color interpolation and interactive elements.\n\n## Features and Capabilities\nThe example showcases advanced tooltip customization including multi-series cursor tooltips with formatted data displays, rollover tooltips with series-specific styling, and interactive vertical slices that can be added via click and removed through tooltip buttons. The color interpolation function dynamically adjusts text colors based on data values, providing visual feedback about data magnitude. The implementation uses various chart modifiers including CursorModifier, RolloverModifier, and ZoomPanModifier for comprehensive chart interaction as covered in the [Chart Modifier API guide](https://www.scichart.com/documentation/js/v4/2d-charts/chart-modifier-api/).\n\n## Integration and Best Practices\nThis Angular implementation follows modern standalone component patterns and demonstrates proper integration with the scichart-angular package. It maintains separation between Angular's component lifecycle and SciChart's rendering engine, ensuring optimal performance. The example provides clear patterns for handling asynchronous chart initialization and proper resource cleanup through the returned destructor function, aligning with Angular best practices for external library integration."
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/CursorModifier.html",
                title: "The specific page for the SciChart.js API documentation for the CursorModifier to help you to get started",
                linkTitle: "CursorModifier documentation",
            },
        ],
        path: "chart-cursormodifier-customtooltip",
        metaKeywords: "cursor, modifier, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/TooltipsAndHittest/CustomTooltips",
        thumbnailImage: "javascript-chart-custom-tooltip.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: false
    };
//// End of computer generated metadata

export const CustomTooltipsExampleInfo = createExampleInfo(metaData);
export default CustomTooltipsExampleInfo;
