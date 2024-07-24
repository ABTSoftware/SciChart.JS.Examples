import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-pie-chart.jpg";

const description = `Pie Charts in SciChart.js support selection, legends, different text labels, animated updates,
    gradient or solid fills and more.`;
const tips = [
    `You can change the fill color of every segment and the style of its label.`,
    `Every segment can be highlighted by clicking on it or when selected in the legend.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPieChartDocumentation,
        title: ExampleStrings.urlTitlePieChartDocumentation,
        linkTitle: "JavaScript Pie Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        For an example that demonstrates how create a <strong>{frameworkName} Pie Chart</strong>, our demo code teaches
        you how to do this with SciChart's{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Charting Library
        </a>
        .
    </p>
);

export const pieChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titlePieChart,
    pageTitle: ExampleStrings.pageTitlePieChart,
    path: ExampleStrings.urlPieChart,
    filepath: "Charts2D/BasicChartTypes/PieChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Easily create and customise a high performance ${frameworkName} Pie Chart with 5-star rated SciChart.js. Get your free trial now to access the whole library. `,
    metaKeywords: "pie, chart, javascript, canvas",
    thumbnailImage: exampleImage,
};
