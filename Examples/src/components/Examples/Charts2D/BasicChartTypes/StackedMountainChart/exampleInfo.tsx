import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-stacked-mountain-chart.jpg";

const description = `Stacked Mountain Charts can be created in JavaScript using SciChart.js. An mountain or area is rendered from the
    Y-value of each stacked mountain series to the Y-value of the next.
    Each area can have a different color and you can stack to 100% using our library.`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`
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
        href: ExampleStrings.urlStackedMountainChartDocumentation,
        title: ExampleStrings.urlTitleStackedMountainChartDocumentation,
        linkTitle: "JavaScript Stacked Mountain Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        Learn how to make a <strong>JavaScript Stacked Mountain Chart</strong> using with SciChart's{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="powerful JavaScript Charts">
            powerful JavaScript Charts
        </a>{" "}
        and it's range of features.
    </p>
);

export const stackedMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStackedMountainChart,
    pageTitle: ExampleStrings.pageTitleStackedMountainChart,
    path: ExampleStrings.urlStackedMountainChart,
    filepath: "Charts2D/BasicChartTypes/StackedMountainChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Design a high performance JavaScript Stacked Mountain Chart with SciChart.js - your one-stop JavaScript chart library. Get free demo now to get started.",
    metaKeywords: "stacked, mountain, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
