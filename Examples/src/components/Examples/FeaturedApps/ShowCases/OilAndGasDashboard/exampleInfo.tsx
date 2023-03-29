import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-oil-gas-explorer-dashboard-charts.jpg";

const Subtitle = () => (
    <p>
        This is an example of the kind of complex, multi-chart dashboards used in the oil and gas industry.
    </p>
);

const previewDescription = ``;
const description = `Todo description`;
const tips = [`Todo Tips.`];

const documentationLinks: TDocumentationLink[] = [{
    href: ExampleStrings.urlDocumentationHome,
    title: ExampleStrings.titleDocumentationHome,
    linkTitle: "SciChart.js Documentation Home"
}];

export const oilAndGasExplorerDashboard: TExampleInfo = {
    title: ExampleStrings.titleOilAndGasExplorerDashboard,
    pageTitle: ExampleStrings.titleOilAndGasExplorerDashboard + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlOilAndGasExplorerDashboard,
    filepath: "FeaturedApps/ShowCases/OilAndGasDashboard",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription: "Todo meta",
    metaKeywords: "Todo keywords",
    thumbnailImage: exampleImage
};
