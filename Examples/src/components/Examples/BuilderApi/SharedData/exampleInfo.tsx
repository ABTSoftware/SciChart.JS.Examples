import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";
import { GalleryItem } from "../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to use the Builder Api to create <strong>Reusable Chart Templates</strong>
         using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `The Builder Api offers a way to pass data to the chart that cleanly separates the data from the chart definition.`;
const description = `This allows data to be reused in the chart, but more importantly allows the data and the chart definition to be built separately and then combined with ease.`;
const tips = [
    ` When using this method in code, you don't need to pass a json string.  You can construct an object and get the benefit of intellisense`,
    ` See the documentation links for the types and options you can specify`
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
        href: ExampleStrings.urlChartFromJSONDocumentation,
        title: ExampleStrings.urlTitleChartFromJSONDocumentation,
        linkTitle: "JavaScript Builder API Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgScatterChart,
                title: ExampleStrings.titleScatterChart,
                seoTitle: ExampleStrings.urlTitleScatterChart,
                examplePath: ExampleStrings.urlScatterChart
            },
            {
                imgPath: ExampleStrings.imgPointMarkers,
                title: ExampleStrings.titlePointMarkers,
                seoTitle: ExampleStrings.urlTitlePointMarkers,
                examplePath: ExampleStrings.urlPointMarkers
            },
            {
                imgPath: ExampleStrings.imgStackedMountainChart,
                title: ExampleStrings.titleStackedMountainChart,
                seoTitle: ExampleStrings.urlTitleStackedMountainChart,
                examplePath: ExampleStrings.urlStackedMountainChart
            },
            {
                imgPath: ExampleStrings.imgMultiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
            }
        ]
    }
];

export const sharedDataExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSharedData,
    path: ExampleStrings.urlSharedData,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Line Chart. " +
        "The Line Series also supports gradient-coloring and per-point coloring via our PaletteProvider API.",
    seoKeywords: "line, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-line-chart.jpg"
};
