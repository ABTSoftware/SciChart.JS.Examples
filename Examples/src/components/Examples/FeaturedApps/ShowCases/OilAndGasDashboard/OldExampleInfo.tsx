import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-oil-gas-explorer-dashboard-charts.jpg";
import { EPageLayout } from "../../../../../helpers/types/types";

const Subtitle = (frameworkName: string) => (
    <p>This is an example of the kind of complex, multi-chart dashboards used in the oil and gas industry.</p>
);

const previewDescription = ``;
const description = `Todo description`;
const tips = [`Todo Tips.`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home",
    },
];

const markdownContent: string = undefined;

export const oilAndGasExplorerDashboard: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleOilAndGasExplorerDashboard,
    pageTitle: ExampleStrings.titleOilAndGasExplorerDashboard,
    path: ExampleStrings.urlOilAndGasExplorerDashboard,
    filepath: "FeaturedApps/ShowCases/OilAndGasDashboard",
    subtitle: Subtitle,

    metaDescription: (frameworkName: string) => `Demonstrates how to create Oil and Gas Dashboard`,
    metaKeywords: "oil gas vertical chart javascript chart performance",
    thumbnailImage: exampleImage,
    markdownContent,
    documentationLinks,
    pageLayout: EPageLayout.MaxWidth,
};
