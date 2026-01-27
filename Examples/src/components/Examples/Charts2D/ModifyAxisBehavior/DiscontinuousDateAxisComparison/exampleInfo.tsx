import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "DiscontinuousDateAxis",
        id: "chart2D_modifyAxisBehavior_DiscontinuousDateAxisComparison",
        imagePath: "javascript-chart-axis-comparison.jpg",
        description:
            "Compares the features of the new **DiscontinuousDateAxis** to Numeric and Category Axis in SciChart.js, High Performance JavaScript Charts.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Compares the features of the new **DiscontinuousDateAxis** to Numeric and Category Axis in SciChart.js, High Performance JavaScript Charts.  This axis can collapse gaps like a category axis, but still allow varying point counts and multiple points at the same x value.",
                title: "DiscontinuousDateAxis Comparison with Javascript",
                pageTitle: "JavaScript Chart with DiscontinuousDateAxis Comparison",
                metaDescription: 
                    "",
                markdownContent: 
                    "## DiscontinuousDateAxis Comparison – JavaScript\n\n### Overview\nThis example compares three different X-axis types in SciChart.js—**NumericAxis**, **CategoryAxis**, and the new **DiscontinuousDateAxis**—using the same financial-style dataset. The goal is to highlight how each axis handles **gaps in time**, **uneven sampling**, and **multiple data points at the same timestamp**.\n\nThis comparison is mirrored in the official SciChart.js documentation, which lays out key differences between these axis types: https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/discontinuous-date-axis/#comparison-discontinuousdateaxis-vs-categoryaxis-vs-numericaxis. :contentReference[oaicite:1]{index=1}\n\n### Axis Comparison\n\n#### NumericAxis (Date Values)\nThe `NumericAxis` treats date values as continuous numbers. This means:\n\n- All time gaps (weekends, holidays, missing data) are rendered as empty space\n- Large gaps can compress useful areas of the chart\n- Unevenly sampled data may appear misleading\n\nWhile numerically accurate, this axis may not be ideal for financial or trading data.\n\n#### CategoryAxis\nThe `CategoryAxis` treats points by index, completely collapsing time gaps:\n\n- Removes empty space between dates\n- All data points are evenly spaced regardless of time differences\n\nHowever, it cannot support multiple points at the same X value or varying point densities without distortion.\n\n#### DiscontinuousDateAxis ⭐\nThe `DiscontinuousDateAxis` combines the benefits of both:\n\n- Collapses gaps such as weekends and holidays\n- Supports multiple points at the same timestamp\n- Handles uneven or differing sample counts between series\n- Maintains relative time positioning *within* segments of data\n\nIn short, it collapses gaps like the `CategoryAxis` but still supports true time-series behavior like the `NumericAxis`. This improved axis type is especially useful in financial or trading visualizations where non-trading periods should be hidden. :contentReference[oaicite:2]{index=2}\n\n### Technical Implementation\nIn this demo, the `DiscontinuousDateAxis` uses base X values derived from the first series (such as an OHLC candlestick series) and a fixed `dataGap` to control spacing between session values. Optional custom tick formatting shows how advanced label control can be applied using a `NumericLabelProvider`. Cursor and rollover modifiers display accurate date-time information even when gaps are collapsed.\n\n### Features and Capabilities\n**Financial-Grade Time Axis:** Hide weekends and non-trading periods without loss of temporal meaning.\n\n**Supports Complex Data Shapes:** Multiple points per date and uneven sampling are correctly handled.\n\n**Accurate Interaction:** Cursor labels, rollover modifiers, and zooming work as expected.\n\n**WebAssembly Performance:** Axis and series calculations are fast, even with multiple series.\n\n### Best Practices\nUse `DiscontinuousDateAxis` when visual space optimization and true date semantics are both required. For full details on axis comparison and configuration, see the official docs: https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/discontinuous-date-axis/#comparison-discontinuousdateaxis-vs-categoryaxis-vs-numericaxis. :contentReference[oaicite:3]{index=3}",
            },
            react: {
                subtitle:
                    "Compares the features of the new **DiscontinuousDateAxis** to Numeric and Category Axis in SciChart.js, High Performance JavaScript Charts.  This axis can collapse gaps like a category axis, but still allow varying point counts and multiple points at the same x value.",
                title: "DiscontinuousDateAxis Comparison with React",
                pageTitle: "React Chart with DiscontinuousDateAxis Comparison",
                metaDescription: 
                    "",
                markdownContent: 
                    "## DiscontinuousDateAxis Comparison – React\n\n### Overview\nThis example demonstrates how `DiscontinuousDateAxis` compares to `NumericAxis` and `CategoryAxis` in a React application using SciChart.js. Identical datasets are displayed using each axis type to show how gaps and uneven sampling are handled.\n\nYou can review the official axis comparison guide here: https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/discontinuous-date-axis/#comparison-discontinuousdateaxis-vs-categoryaxis-vs-numericaxis. :contentReference[oaicite:4]{index=4}\n\n### Axis Comparison\n\n#### NumericAxis\n`NumericAxis` plots date values continuously, meaning weekends and missing periods appear as empty space. This often compresses actual data segments and can distort visual insights.\n\n#### CategoryAxis\n`CategoryAxis` collapses all gaps by plotting points by index. While this removes empty space, it does not preserve true date spacing and cannot support multiple points at the same X value.\n\n#### DiscontinuousDateAxis\n`DiscontinuousDateAxis` collapses gaps like `CategoryAxis`, but also:\n\n- Allows multiple points at the same date\n- Preserves relative time positioning within each segment\n- Handles series with different numbers of points\n\nThis makes it ideal for financial and irregular time-series data. :contentReference[oaicite:5]{index=5}\n\n### Technical Implementation\nIn React, each chart instance uses the same data and renderable series setup, but a different axis type. The `DiscontinuousDateAxis` uses baseValues from the first data series and a fixed `dataGap` to define the coordinate system. Optional tick and label customizations demonstrate how to create intuitive date labels using custom providers.\n\nFor interactive exploration, rollover modifiers display correct date/time labels and zoom/pan modifiers respect the collapsed gaps while maintaining accurate value interpretation.\n\n### Features and Best Practices\n**React-Friendly Integration:** Chart creation logic is isolated from component rendering.\n\n**Accurate Guides and Interactions:** Cursor and rollover labels show accurate date values even when gaps are collapsed.\n\n**Configuration Flexibility:** Major and minor ticks can be customized manually.\n\n**High Performance:** Driven by SciChart’s WebAssembly engine.\n\nRefer to the official axis comparison docs for more details: https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/discontinuous-date-axis/#comparison-discontinuousdateaxis-vs-categoryaxis-vs-numericaxis. :contentReference[oaicite:6]{index=6}",
            },
            angular: {
                subtitle:
                    "Compares the features of the new **DiscontinuousDateAxis** to Numeric and Category Axis in SciChart.js, High Performance JavaScript Charts.  This axis can collapse gaps like a category axis, but still allow varying point counts and multiple points at the same x value.",
                title: "DiscontinuousDateAxis Comparison with Angular",
                pageTitle: "Angular Chart with DiscontinuousDateAxis  Comparison",
                metaDescription: 
                    "",
                markdownContent: 
                    "## DiscontinuousDateAxis Comparison – Angular\n\n### Overview\nThis example contrasts `NumericAxis`, `CategoryAxis`, and `DiscontinuousDateAxis` in an Angular application using SciChart.js. Each chart uses the same data so you can clearly see how each axis type behaves.\n\nOfficial documentation also provides a comparison of these axis types here: https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/discontinuous-date-axis/#comparison-discontinuousdateaxis-vs-categoryaxis-vs-numericaxis. :contentReference[oaicite:7]{index=7}\n\n### Axis Comparison\n\n#### NumericAxis\nA value-based axis that displays dates continuously, including weekends and other gaps.\n\n#### CategoryAxis\nCollapses gaps by plotting points by index, but does not support multiple values at the same position or uneven sample counts.\n\n#### DiscontinuousDateAxis\nCollapses gaps while preserving relative time positions within segments and supporting uneven/duplicate data.\n\nThis makes it the best choice for financial-style charts where missing periods should not waste visual space. :contentReference[oaicite:8]{index=8}\n\n### Technical Implementation\nIn the Angular integration, each axis type is instantiated on a separate `SciChartSurface`. The `DiscontinuousDateAxis` automatically derives baseValues from the first series and uses a fixed `dataGap` to space segments. Custom tick logic and label providers demonstrate advanced formatting.\n\nInteractive modifiers such as zoom, pan, and rollover provide accurate date-time interaction despite the axis collapsing gaps.\n\n### Features and Capabilities\n**Enterprise Performance:** WebAssembly-powered axis math for smooth interaction.\n\n**Flexible Customization:** Custom tick labels and optional settings improve readability.\n\n**Accurate Interaction:** Cursor and rollover modifiers reflect true date values regardless of gap compression.\n\nFor complete axis details and comparison, see the official docs: https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/discontinuous-date-axis/#comparison-discontinuousdateaxis-vs-categoryaxis-vs-numericaxis. :contentReference[oaicite:9]{index=9}",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v4/DiscontinuousDateAxis.html",
                title: "SciChart.js LDiscontinuous Date Axis Documentation",
                linkTitle: "SciChart.js Documentation Home",
            },
        ],
        path: "chart-axis-comparison",
        metaKeywords: "discontinuous, date, axis, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/ModifyAxisBehavior/DiscontinuousDateAxisComparison",
        thumbnailImage: "javascript-chart-axis-comparison.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const axisTypeComparisonExampleInfo = createExampleInfo(metaData);
export default axisTypeComparisonExampleInfo;
