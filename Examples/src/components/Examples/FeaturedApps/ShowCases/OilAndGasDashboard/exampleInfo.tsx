import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpers/types/types";

const Subtitle = () => (
    <p>
        TODO Subtitle
    </p>
);

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: []
    }
];

const previewDescription = ``;
const description = `Todo description`;
const tips = [`Todo Tips.`];

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
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks"
    }
];

export const oilAndGasExplorerDashboard: TExampleInfo = {
    title: ExampleStrings.titleOilAndGasExplorerDashboard,
    pageTitle: ExampleStrings.titleOilAndGasExplorerDashboard + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlOilAndGasExplorerDashboard,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription: "Todo meta",
    metaKeywords: "Todo keywords",
    thumbnailImage: "javascript-chart-oil-and-gas-explorer-dashboard.jpg"
};
