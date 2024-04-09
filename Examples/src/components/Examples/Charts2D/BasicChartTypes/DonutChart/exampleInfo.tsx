import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-donut-chart.jpg";

const description = `Donut Charts in SciChart.js support selection, legends, different text labels, animated updates,
    gradient or solid fills and more.`;
const tips = [
    `You can change the fill color of every segment and the style of its label.`,
    `Every segment can be highlighted by clicking on it or when selected in the legend.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDonutChartDocumentation,
        title: ExampleStrings.titleDonutChart,
        linkTitle: "JavaScript Donut Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This demo demonstrates how create a <strong>{frameworkName} Donut Chart</strong> with our powerful JavaScript
        library,{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>
        .
    </p>
);

export const donutChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDonutChart,
    pageTitle: ExampleStrings.pageTitleDonutChart,
    path: ExampleStrings.urlDonutChart,
    filepath: "Charts2D/BasicChartTypes/DonutChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Create ${frameworkName} Donut Chart with 5-star rated SciChart.js chart library. Supports legends, text labels, animated updates and more. Get free trial now.`,
    metaKeywords: "donut, chart, javascript, canvas",
    thumbnailImage: exampleImage,
};
