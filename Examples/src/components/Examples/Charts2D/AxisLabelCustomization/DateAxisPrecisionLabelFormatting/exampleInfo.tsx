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
                    "## Custom High Precision Date Labels - JavaScript\n\n### Overview\nThis example demonstrates advanced customization of the [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) in SciChart.js. While SciChart provides powerful built-in formatting for high-precision dates (Nanoseconds, Microseconds), specific business requirements often dictate custom formats or the use of standard libraries like **date-fns** or **moment.js**.\n\n### The Challenge: Precision vs. Standard Libraries\nStandard JavaScript `Date` objects and associated libraries are limited to **millisecond** precision. When using SciChart's `EDatePrecision.Nanoseconds`, a direct conversion to a Date object results in the loss of the sub-millisecond component.\n\n### The Solution\nThis example shows how to override the [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) methods to achieve the best of both worlds:\n\n1.  **Use `date-fns` for the 'Wide' labels:** The Context labels (e.g., \"Jan 01, 2025\") don't require nanosecond precision, so we can leverage the robust localization and formatting of `date-fns`.\n2.  **Hybrid Approach for 'Precise' labels:** For the tick labels (e.g., \"12:00:00.000000500\"), we manually extract the sub-millisecond ticks from the raw axis value and append them to the formatted string, ensuring no precision is lost.\n\n### Key Implementation Details\nWe override two key methods on the `SmartDateLabelProvider`:\n* `formatDateWide(labelRange, valueInSeconds)`: Handles the context label (usually the first label or when the date changes).\n* `formatDatePrecise(labelRange, valueInSeconds, rawValue)`: Handles the dynamic tick labels. Note the use of `rawValue` to calculate the exact nanosecond offset that standard Date libraries cannot see.",
            },
            react: {
                subtitle:
                    "Demonstrates how to **customize specific label formats** on a High Precision Date Axis, using external libraries like **date-fns**.",
                title: "Custom High Precision Date Labels",
                pageTitle: "Custom High Precision Date Labels",
                metaDescription:
                    "Demonstrates how to use date-fns and custom logic to format High Precision Date Axes in SciChart.js",
                markdownContent:
                    "## Custom High Precision Date Labels - React\n\n### Overview\nThis example demonstrates advanced customization of the [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) in SciChart.js within a React application. While SciChart provides powerful built-in formatting for high-precision dates (Nanoseconds, Microseconds), specific business requirements often dictate custom formats or the use of standard libraries like **date-fns**.\n\n### The Challenge: Precision vs. Standard Libraries\nStandard JavaScript `Date` objects and associated libraries are limited to **millisecond** precision. When using SciChart's `EDatePrecision.Nanoseconds`, a direct conversion to a Date object results in the loss of the sub-millisecond component.\n\n### The Solution\nThis example shows how to override the [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) methods to achieve the best of both worlds:\n\n1.  **Use `date-fns` for the 'Wide' labels:** The Context labels (e.g., \"Jan 01, 2025\") don't require nanosecond precision, so we can leverage the robust localization and formatting of `date-fns`.\n2.  **Hybrid Approach for 'Precise' labels:** For the tick labels (e.g., \"12:00:00.000000500\"), we manually extract the sub-millisecond ticks from the raw axis value and append them to the formatted string, ensuring no precision is lost.\n\n### Interactive Example\nThe example allows you to toggle between SciChart's default high-precision formatter and the custom `date-fns` implementation using a React state control, demonstrating how to dynamically update axis label providers at runtime.",
            },
            angular: {
                subtitle:
                    "Demonstrates how to **customize specific label formats** on a High Precision Date Axis, using external libraries like **date-fns**.",
                title: "Custom High Precision Date Labels",
                pageTitle: "Custom High Precision Date Labels",
                metaDescription:
                    "Demonstrates how to use date-fns and custom logic to format High Precision Date Axes in SciChart.js",
                markdownContent:
                    "## Custom High Precision Date Labels - Angular\n\n### Overview\nThis example demonstrates advanced customization of the [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) in SciChart.js within an Angular application. While SciChart provides powerful built-in formatting for high-precision dates (Nanoseconds, Microseconds), specific business requirements often dictate custom formats or the use of standard libraries like **date-fns**.\n\n### The Challenge: Precision vs. Standard Libraries\nStandard JavaScript `Date` objects and associated libraries are limited to **millisecond** precision. When using SciChart's `EDatePrecision.Nanoseconds`, a direct conversion to a Date object results in the loss of the sub-millisecond component.\n\n### The Solution\nThis example shows how to override the [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) methods to achieve the best of both worlds:\n\n1.  **Use `date-fns` for the 'Wide' labels:** The Context labels (e.g., \"Jan 01, 2025\") don't require nanosecond precision, so we can leverage the robust localization and formatting of `date-fns`.\n2.  **Hybrid Approach for 'Precise' labels:** For the tick labels (e.g., \"12:00:00.000000500\"), we manually extract the sub-millisecond ticks from the raw axis value and append them to the formatted string, ensuring no precision is lost.\n\n### Key Implementation Details\nWe override two key methods on the `SmartDateLabelProvider`:\n* `formatDateWide(labelRange, valueInSeconds)`: Handles the context label (usually the first label or when the date changes).\n* `formatDatePrecise(labelRange, valueInSeconds, rawValue)`: Handles the dynamic tick labels. Note the use of `rawValue` to calculate the exact nanosecond offset that standard Date libraries cannot see.",
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
        filepath: "Charts2D/AxisLabelCustomization/HighPrecisionDateAxis",
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
