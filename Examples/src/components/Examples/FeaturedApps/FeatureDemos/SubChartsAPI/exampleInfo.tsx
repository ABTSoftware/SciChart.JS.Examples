import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-subcharts-grid.jpg";

const previewDescription = `Demonstrates the usage of SubCharts API in Scichart.`;
const description = ``;
const tips = [
    ``,
    ``
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
        href: ExampleStrings.urlSubchartApiDocumentation,
        title: ExampleStrings.urlTitleSubCharstApiDocumentation,
        linkTitle: "Scichart.js SubCharts API Documentation"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates the Subcharts API for drawing multiple charts and series using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const subchartsGridExampleInfo: TExampleInfo = {
    title: "Subcharts Grid",
    pageTitle: "Subcharts Grid" + ExampleStrings.exampleGenericTitleSuffix,
    path: "/javascript-subcharts-grid",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Demonstrates how to create a multi-chart grid, using the Subcharts API",
    metaKeywords: "javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
