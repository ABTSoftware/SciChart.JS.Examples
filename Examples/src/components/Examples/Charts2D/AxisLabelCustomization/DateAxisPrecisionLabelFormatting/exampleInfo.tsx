import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "HighPrecisionDateAxis",
        id: "chart2D_axisLabelCustomization_DateAxisPrecisionLabelFormatting",
        imagePath: "javascript-date-axis-precision-formatting.jpg",
        description:
            "Demonstrates how to **customize specific label formats** on a High Precision Date Axis, using external libraries like **date-fns**.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates how to **customize specific label formats** on a High Precision Date Axis, using external libraries like **date-fns**.",
                title: "Custom High Precision Date Labels",
                pageTitle: "Custom High Precision Date Labels",
                metaDescription:
                    "Demonstrates how to use date-fns and custom logic to format High Precision Date Axes in SciChart.js",
                markdownContent:
                    "## High-Precision DateTimeNumericAxis with Custom Label Formatting - in Vanilla JS\n\n### Overview\nThis example demonstrates how to use **DateTimeNumericAxis** with **nanosecond-precision data** and the built-in **SmartDateLabelProvider**, while safely overriding date formatting logic using **date-fns**.\n\nIt highlights how SciChart dynamically switches between *wide* and *precise* date labels as you zoom, and how you can fully customize that behavior without breaking cursor labels, tick calculations, or high-precision rendering.\n\nUse the toggle above the chart to switch between SciChart’s default formatting and a custom `date-fns` implementation.\n\n### Key Concepts Demonstrated\n\n#### DateTimeNumericAxis with Nanosecond Precision\nThe X-axis is configured with:\n\n- `datePrecision = EDatePrecision.Nanoseconds`\n- A fixed `dateOffset` (Unix seconds)\n\n\nThis allows raw X values to represent **nanosecond ticks**, while still displaying full calendar dates and times on the axis. Each increment of `1` on the X-axis equals **1 nanosecond**, making this suitable for high-frequency sensor data, trading systems, or scientific signals.\n\n#### SmartDateLabelProvider\nThe `SmartDateLabelProvider` automatically adapts label formats based on the visible time range:\n\n- **Wide labels** provide context (e.g. `Jan 01, 2025 12:00:00`)\n- **Precise labels** show incremental detail (e.g. `59s345ms`, `123456ns`)\n\nAs you zoom in and out, the provider dynamically switches between:\n Nanoseconds, Microseconds, Milliseconds, Seconds, Minutes, Days / Months.\n\nThis logic is driven by internal **label thresholds** and the current visible range.\n\n### Custom Formatting with date-fns\nThis demo overrides two key methods on the `SmartDateLabelProvider`:\n\n- `formatDateWide`\n- `formatDatePrecise`\n\nInstead of replacing the entire label provider, the original SciChart implementations are preserved and can be restored instantly. This ensures:\n\n- Cursor and rollover labels remain correct\n- Tick spacing and delta calculations are unaffected\n- High-precision math stays intact\n\nThe toggle switches between:\n\n- **Default SciChart formatting**\n- **Custom date-fns formatting** for both wide and precise labels\n\nThis pattern is recommended when integrating third-party date libraries.\n\n### When to Use This Approach\nUse `DateTimeNumericAxis` with `SmartDateLabelProvider` when:\n\n- You need **sub-millisecond or nanosecond resolution**\n- You want automatic, readable date formatting\n- You need full control over label appearance\n- Cursor and tooltip accuracy is critical\n\nThis pattern is ideal for **high-frequency trading**, **telemetry**, **scientific measurement**, and **real-time monitoring** applications.\n\nRelated Documentation:\n- [DateTimeNumericAxis](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/date-time-numeric-axis/)\n- [SmartDateLabelProvider](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/label-provider-api/smart-date-label-provider/)",
            },
            react: {
                subtitle:
                    "Demonstrates how to **customize specific label formats** on a High Precision Date Axis, using external libraries like **date-fns**.",
                title: "Custom High Precision Date Labels",
                pageTitle: "Custom High Precision Date Labels",
                metaDescription:
                    "Demonstrates how to use date-fns and custom logic to format High Precision Date Axes in SciChart.js",
                markdownContent:
                    "## High-Precision DateTimeNumericAxis with Custom Label Formatting - in React\n\n### Overview\nThis example demonstrates how to use **DateTimeNumericAxis** with **nanosecond-precision data** and the built-in **SmartDateLabelProvider**, while safely overriding date formatting logic using **date-fns**.\n\nIt highlights how SciChart dynamically switches between *wide* and *precise* date labels as you zoom, and how you can fully customize that behavior without breaking cursor labels, tick calculations, or high-precision rendering.\n\nUse the toggle above the chart to switch between SciChart’s default formatting and a custom `date-fns` implementation.\n\n### Key Concepts Demonstrated\n\n#### DateTimeNumericAxis with Nanosecond Precision\nThe X-axis is configured with:\n\n- `datePrecision = EDatePrecision.Nanoseconds`\n- A fixed `dateOffset` (Unix seconds)\n\n\nThis allows raw X values to represent **nanosecond ticks**, while still displaying full calendar dates and times on the axis. Each increment of `1` on the X-axis equals **1 nanosecond**, making this suitable for high-frequency sensor data, trading systems, or scientific signals.\n\n#### SmartDateLabelProvider\nThe `SmartDateLabelProvider` automatically adapts label formats based on the visible time range:\n\n- **Wide labels** provide context (e.g. `Jan 01, 2025 12:00:00`)\n- **Precise labels** show incremental detail (e.g. `59s345ms`, `123456ns`)\n\nAs you zoom in and out, the provider dynamically switches between:\n Nanoseconds, Microseconds, Milliseconds, Seconds, Minutes, Days / Months.\n\nThis logic is driven by internal **label thresholds** and the current visible range.\n\n### Custom Formatting with date-fns\nThis demo overrides two key methods on the `SmartDateLabelProvider`:\n\n- `formatDateWide`\n- `formatDatePrecise`\n\nInstead of replacing the entire label provider, the original SciChart implementations are preserved and can be restored instantly. This ensures:\n\n- Cursor and rollover labels remain correct\n- Tick spacing and delta calculations are unaffected\n- High-precision math stays intact\n\nThe toggle switches between:\n\n- **Default SciChart formatting**\n- **Custom date-fns formatting** for both wide and precise labels\n\nThis pattern is recommended when integrating third-party date libraries.\n\n### When to Use This Approach\nUse `DateTimeNumericAxis` with `SmartDateLabelProvider` when:\n\n- You need **sub-millisecond or nanosecond resolution**\n- You want automatic, readable date formatting\n- You need full control over label appearance\n- Cursor and tooltip accuracy is critical\n\nThis pattern is ideal for **high-frequency trading**, **telemetry**, **scientific measurement**, and **real-time monitoring** applications.\n\nRelated Documentation:\n- [DateTimeNumericAxis](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/date-time-numeric-axis/)\n- [SmartDateLabelProvider](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/label-provider-api/smart-date-label-provider/)",
            },
            angular: {
                subtitle:
                    "Demonstrates how to **customize specific label formats** on a High Precision Date Axis, using external libraries like **date-fns**.",
                title: "Custom High Precision Date Labels",
                pageTitle: "Custom High Precision Date Labels",
                metaDescription:
                    "Demonstrates how to use date-fns and custom logic to format High Precision Date Axes in SciChart.js",
                markdownContent:
                    "## High-Precision DateTimeNumericAxis with Custom Label Formatting - in Angular\n\n### Overview\nThis example demonstrates how to use **DateTimeNumericAxis** with **nanosecond-precision data** and the built-in **SmartDateLabelProvider**, while safely overriding date formatting logic using **date-fns**.\n\nIt highlights how SciChart dynamically switches between *wide* and *precise* date labels as you zoom, and how you can fully customize that behavior without breaking cursor labels, tick calculations, or high-precision rendering.\n\nUse the toggle above the chart to switch between SciChart’s default formatting and a custom `date-fns` implementation.\n\n### Key Concepts Demonstrated\n\n#### DateTimeNumericAxis with Nanosecond Precision\nThe X-axis is configured with:\n\n- `datePrecision = EDatePrecision.Nanoseconds`\n- A fixed `dateOffset` (Unix seconds)\n\n\nThis allows raw X values to represent **nanosecond ticks**, while still displaying full calendar dates and times on the axis. Each increment of `1` on the X-axis equals **1 nanosecond**, making this suitable for high-frequency sensor data, trading systems, or scientific signals.\n\n#### SmartDateLabelProvider\nThe `SmartDateLabelProvider` automatically adapts label formats based on the visible time range:\n\n- **Wide labels** provide context (e.g. `Jan 01, 2025 12:00:00`)\n- **Precise labels** show incremental detail (e.g. `59s345ms`, `123456ns`)\n\nAs you zoom in and out, the provider dynamically switches between:\n Nanoseconds, Microseconds, Milliseconds, Seconds, Minutes, Days / Months.\n\nThis logic is driven by internal **label thresholds** and the current visible range.\n\n### Custom Formatting with date-fns\nThis demo overrides two key methods on the `SmartDateLabelProvider`:\n\n- `formatDateWide`\n- `formatDatePrecise`\n\nInstead of replacing the entire label provider, the original SciChart implementations are preserved and can be restored instantly. This ensures:\n\n- Cursor and rollover labels remain correct\n- Tick spacing and delta calculations are unaffected\n- High-precision math stays intact\n\nThe toggle switches between:\n\n- **Default SciChart formatting**\n- **Custom date-fns formatting** for both wide and precise labels\n\nThis pattern is recommended when integrating third-party date libraries.\n\n### When to Use This Approach\nUse `DateTimeNumericAxis` with `SmartDateLabelProvider` when:\n\n- You need **sub-millisecond or nanosecond resolution**\n- You want automatic, readable date formatting\n- You need full control over label appearance\n- Cursor and tooltip accuracy is critical\n\nThis pattern is ideal for **high-frequency trading**, **telemetry**, **scientific measurement**, and **real-time monitoring** applications.\n\nRelated Documentation:\n- [DateTimeNumericAxis](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/axis-types/date-time-numeric-axis/)\n- [SmartDateLabelProvider](https://www.scichart.com/documentation/js/v5/2d-charts/axis-api/label-provider-api/smart-date-label-provider/)",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html",
                title: "SmartDateLabelProvider API Documentation",
                linkTitle: "SmartDateLabelProvider API",
            },
            {
                href: "https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html",
                title: "DateTimeNumericAxis API Documentation",
                linkTitle: "DateTimeNumericAxis API",
            },
        ],
        path: "high-precision-date-axis",
        metaKeywords: "date, formatting, nanoseconds, date-fns, precision, axis, custom, javascript, webgl",
        onWebsite: true,
        filepath: "Charts2D/AxisLabelCustomization/DateAxisPrecisionLabelFormatting",
        thumbnailImage: "javascript-date-axis-precision-formatting.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {
            "date-fns": "^4.1.0",
        },
        isNew: true,
    };
//// End of computer generated metadata

export const precisionDateAxisLabelExampleInfo = createExampleInfo(metaData);
export default precisionDateAxisLabelExampleInfo;
