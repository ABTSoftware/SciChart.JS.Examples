import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates how to create a JavaScript Pie Chart. This is a circular chart type with a hole in the center
consisting of sectors which are proportional to the quantity it represents.`;
const tips = [
    `You can change the fill color of every segment and the style of its label.`,
    `Every segment can be highlighted by clicking on it or when selected in the legend.`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: "#",
        title: ExampleStrings.titlePieChart,
        linkTitle: "JavaScript Pie Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgDonutChart,
                title: ExampleStrings.titleDonutChart,
                seoTitle: ExampleStrings.urlTitleDonutChartDocumentation,
                examplePath: ExampleStrings.urlDonutChart
            },
            {
                imgPath: ExampleStrings.imgCandleStickChart,
                title: ExampleStrings.titleCandlestickChart,
                seoTitle: ExampleStrings.urlTitleCandlestickChart,
                examplePath: ExampleStrings.urlCandlestickChart
            },
            {
                imgPath: ExampleStrings.imgScatterChart,
                title: ExampleStrings.titleScatterChart,
                seoTitle: ExampleStrings.urlTitleScatterChart,
                examplePath: ExampleStrings.urlScatterChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how create a <strong>JavaScript Pie Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const pieChartExampleInfo: TExampleInfo = {
    title: "JavaScript Pie Chart",
    path: "/javascript-pie-chart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Pie Chart. This is a circular chart type with a hole in the center " +
        "consisting of sectors which are proportional to the quantity it represents.",
    seoKeywords: "pie, chart, javascript, canvas",
    thumbnailImage: "javascript-pie-chart.jpg"
};
