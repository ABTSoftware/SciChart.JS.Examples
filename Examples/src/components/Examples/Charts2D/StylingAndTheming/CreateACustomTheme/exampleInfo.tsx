import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        exampleId: "createacustomtheme",
        imagePath: "./javascript-chart-custom-themed.jpg",
        title: "createACustomTheme",
        description:
            "With our ThemeManager API you can create a custom theme. To do this, create a type that implements all the\r\nproperties of the IThemeProvider interface and pass to sciChartSurface.applyTheme.",
        path: "createacustomtheme",
        metaKeywords: "theming, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/StylingAndTheming/CreateACustomTheme",
        tips: ["It's also possible to style chart-parts in code!"],
        thumbnailImage: "javascript-chart-custom-themed.jpg",
        frameworks: {
            react: {
                component: "ReactChartComponent",
                subtitle:
                    "Demonstrates how to create a **React createACustomTheme** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "React createACustomTheme",
                pageTitle: "React createACustomTheme | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a React createACustomTheme with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            angular: {
                component: "AngularChartComponent",
                subtitle:
                    "Demonstrates how to create a **Angular createACustomTheme** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "Angular createACustomTheme",
                pageTitle: "Angular createACustomTheme | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create an Angular createACustomTheme with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
            javascript: {
                component: "JavaScriptChartComponent",
                subtitle:
                    "Demonstrates how to create a **JavaScript createACustomTheme** using SciChart.js, our High Performance [JavaScript Chart Framework](https://www.scichart.com/javascript-chart-features)",
                title: "JavaScript createACustomTheme",
                pageTitle: "JavaScript createACustomTheme | JavaScript Charts | View Examples",
                metaDescription:
                    "Easily create a JavaScript createACustomTheme with SciChart - high performance JavaScript Chart Library. Get your free trial now.",
                markdownContent: "",
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/current/webframe.html",
                title: "Documentation",
                linkTitle: "Custom Theme documentation",
            },
        ],
    };
//// End of computer generated metadata

export const createACustomThemeExampleInfo = createExampleInfo(metaData);
