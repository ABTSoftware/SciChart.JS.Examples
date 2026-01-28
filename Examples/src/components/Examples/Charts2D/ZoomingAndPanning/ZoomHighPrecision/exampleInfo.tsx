import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "ZoomHighPrecision",
        id: "chart2D_zoomAndPanAChart_ZoomHighPrecision",
        imagePath: "javascript-zoom-high-precision.jpg",
        description:
            "Demonstrates the **DateTimeNumericAxis** with 64-bit precision, handling ranges from Nanoseconds to Billions of Years.",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "Demonstrates the **DateTimeNumericAxis** with 64-bit precision, handling ranges from Nanoseconds to Billions of Years.",
                title: "High Precision Date Axis",
                pageTitle: "High Precision Date Axis",
                metaDescription:
                    "Demonstrates 64-bit precision Date Axis in SciChart.js handling Nanoseconds to Billions of Years",
                markdownContent:
                    "## High Precision Date Axis Example - JavaScript\n\n### Overview\nThis example demonstrates the extreme precision capabilities of the [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) in SciChart.js. \n\nStandard WebGL rendering and many JavaScript charting libraries are limited to 32-bit floating-point coordinates. This limitation typically causes rendering artifacts (jitter) or precision loss when dealing with very large numbers (like astronomical dates) or very small increments (like nanoseconds). SciChart.js utilizes a proprietary **64-bit floating-point coordinate pipeline** to overcome this, allowing for visualization of data across vast timescales without loss of detail.\n\n### The 4 Precision Ranges\nThis demo allows you to toggle between four distinct datasets to showcase this flexibility:\n\n-  **Nanosecond Precision:** A range of 50 Days. Demonstrates extreme detail (1 unit = 1e-9 seconds). Suitable for high-frequency trading or scientific instrumentation.\n- **Microsecond Precision:** A range of 40 Years. (1 unit = 1e-6 seconds).\n- **Millisecond Precision:** A range of 70,000 Years. Standard Javascript Date precision, but pushed to historical limits.\n- **Seconds Precision:** A range of **1 Billion Years**. Demonstrates handling values that far exceed the limits of the standard JavaScript `Date` object (which is limited to approx. 270,000 years).\n\n### Technical Implementation\nThe [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) is key to this functionality. By setting the `datePrecision` property, we instruct the chart how to interpret the raw `Float64` data:\n\n* `EDatePrecision.Nanoseconds`: Divides input by 1,000,000,000 to get seconds.\n* `EDatePrecision.Microseconds`: Divides input by 1,000,000.\n\nFurthermore, the `highPrecisionLabelMode` allows formatting sub-millisecond data using:\n\n**Suffix** (e.g., '50ns'), \n\n**Fractional** (e.g., '.000000050')\n\n**Scientific**  (e.g., '5.0e-8') notation, ensuring labels remain readable even at maximum zoom depth.",
            },
            react: {
                subtitle:
                    "Demonstrates the **DateTimeNumericAxis** with 64-bit precision, handling ranges from Nanoseconds to Billions of Years.",
                title: "High Precision Date Axis",
                pageTitle: "High Precision Date Axis",
                metaDescription:
                    "Demonstrates 64-bit precision Date Axis in SciChart.js handling Nanoseconds to Billions of Years",
                markdownContent:
                    "## High Precision Date Axis Example - React\n\n### Overview\nThis example demonstrates the extreme precision capabilities of the [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) in SciChart.js within a React application.\n\nStandard WebGL rendering and many JavaScript charting libraries are limited to 32-bit floating-point coordinates. This limitation typically causes rendering artifacts (jitter) or precision loss when dealing with very large numbers (like astronomical dates) or very small increments (like nanoseconds). SciChart.js utilizes a proprietary **64-bit floating-point coordinate pipeline** to overcome this, allowing for visualization of data across vast timescales without loss of detail.\n\n### The 4 Precision Ranges\nThis demo allows you to toggle between four distinct datasets to showcase this flexibility:\n\n-  **Nanosecond Precision:** A range of 50 Days. Demonstrates extreme detail (1 unit = 1e-9 seconds). Suitable for high-frequency trading or scientific instrumentation.\n- **Microsecond Precision:** A range of 40 Years. (1 unit = 1e-6 seconds).\n- **Millisecond Precision:** A range of 70,000 Years. Standard Javascript Date precision, but pushed to historical limits.\n- **Seconds Precision:** A range of **1 Billion Years**. Demonstrates handling values that far exceed the limits of the standard JavaScript `Date` object (which is limited to approx. 270,000 years).\n\n### Technical Implementation\nThe [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) is key to this functionality. By setting the `datePrecision` property, we instruct the chart how to interpret the raw `Float64` data:\n\n* `EDatePrecision.Nanoseconds`: Divides input by 1,000,000,000 to get seconds.\n* `EDatePrecision.Microseconds`: Divides input by 1,000,000.\n\nFurthermore, the `highPrecisionLabelMode` allows formatting sub-millisecond data using:\n\n**Suffix** (e.g., '50ns'), \n\n**Fractional** (e.g., '.000000050')\n\n**Scientific**  (e.g., '5.0e-8') notation, ensuring labels remain readable even at maximum zoom depth.",
            },
            angular: {
                subtitle:
                    "Demonstrates the **DateTimeNumericAxis** with 64-bit precision, handling ranges from Nanoseconds to Billions of Years.",
                title: "High Precision Date Axis",
                pageTitle: "High Precision Date Axis",
                metaDescription:
                    "Demonstrates 64-bit precision Date Axis in SciChart.js handling Nanoseconds to Billions of Years",
                markdownContent:
                    "## High Precision Date Axis Example - Angular\n\n### Overview\nThis example demonstrates the extreme precision capabilities of the [DateTimeNumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/datetimenumericaxis.html) in SciChart.js within an Angular application.\n\nStandard WebGL rendering and many JavaScript charting libraries are limited to 32-bit floating-point coordinates. This limitation typically causes rendering artifacts (jitter) or precision loss when dealing with very large numbers (like astronomical dates) or very small increments (like nanoseconds). SciChart.js utilizes a proprietary **64-bit floating-point coordinate pipeline** to overcome this, allowing for visualization of data across vast timescales without loss of detail.\n\n### The 4 Precision Ranges\nThis demo allows you to toggle between four distinct datasets to showcase this flexibility:\n\n-  **Nanosecond Precision:** A range of 50 Days. Demonstrates extreme detail (1 unit = 1e-9 seconds). Suitable for high-frequency trading or scientific instrumentation.\n- **Microsecond Precision:** A range of 40 Years. (1 unit = 1e-6 seconds).\n- **Millisecond Precision:** A range of 70,000 Years. Standard Javascript Date precision, but pushed to historical limits.\n- **Seconds Precision:** A range of **1 Billion Years**. Demonstrates handling values that far exceed the limits of the standard JavaScript `Date` object (which is limited to approx. 270,000 years).\n\n### Technical Implementation\nThe [SmartDateLabelProvider](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html) is key to this functionality. By setting the `datePrecision` property, we instruct the chart how to interpret the raw `Float64` data:\n\n* `EDatePrecision.Nanoseconds`: Divides input by 1,000,000,000 to get seconds.\n* `EDatePrecision.Microseconds`: Divides input by 1,000,000.\n\nFurthermore, the `highPrecisionLabelMode` allows formatting sub-millisecond data using:\n\n**Suffix** (e.g., '50ns'), \n\n**Fractional** (e.g., '.000000050')\n\n**Scientific** (e.g., '5.0e-8') notation, ensuring labels remain readable even at maximum zoom depth.",
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
        path: "zoom-high-precision",
        metaKeywords: "date, time, nanoseconds, microseconds, precision, 64-bit, axis, zoom, javascript, webgl",
        onWebsite: true,
        filepath: "Charts2D/ZoomingAndPanning/ZoomHighPrecision",
        thumbnailImage: "javascript-zoom-high-precision.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
        isNew: true,
    };
//// End of computer generated metadata

export const zooomHighPrecisionExampleInfo = createExampleInfo(metaData);
export default zooomHighPrecisionExampleInfo;
