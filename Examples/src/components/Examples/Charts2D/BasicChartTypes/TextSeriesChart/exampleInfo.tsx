import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-text-chart.jpg";

const previewDescription = `Text series allows you to render large numbers of text labels very quickly.`;
const description = ``;
const tips = [``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlTextSeriesDocumentation,
        title: ExampleStrings.urlTitleTextSeriesDocumentation,
        linkTitle: "SciChart.js Documentation Home",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This example demonstrates <strong>FastTextRenderableSeries</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>
        . The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the
        tweet.
    </p>
);

export const textChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleTextChart,
    pageTitle: ExampleStrings.titleTextChart,
    path: ExampleStrings.urlTextChart,
    filepath: "Charts2D/BasicChartTypes/TextSeriesChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Create ${frameworkName} Text Chart with high performance SciChart.js.  `,
    metaKeywords: "text, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
