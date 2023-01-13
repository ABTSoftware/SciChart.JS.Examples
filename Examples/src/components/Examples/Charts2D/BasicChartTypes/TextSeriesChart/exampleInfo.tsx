import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-text-chart.jpg";

const previewDescription = `Text series allows you to render large numbers of text labels very quickly.`;
const description = ``;
const tips = [
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
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        This example demonstrates <strong>FastTextRenderableSeries</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>.  The dataset is an AI analysis of 2100 tweets, extracting the organisations mentioned and the sentiment of the tweet. 
    </p>
);

export const textChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleTextChart,
    pageTitle: ExampleStrings.titleTextChart + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlTextChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Create JavaScript Text Chart with high performance SciChart.js.  ",
    metaKeywords: "text, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
