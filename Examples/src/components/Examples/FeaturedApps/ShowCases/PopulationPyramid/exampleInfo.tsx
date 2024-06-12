import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-draggable-event-markers.jpg";

const Subtitle = (frameworkName: string) => (
    <p>
        Population Pyramid of Europe and Africa
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = ``;
const description = `Population Pyramid of Europe and Africa`;
const tips = [
    `Pay close attention to the way the 2 YAxes are stacked`,
    `Check out our new "Engineering" numeric formatter, which is used to format the xAxis and the dataLabels`,
];
const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home",
    },
];

export const populationPyramidExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titlePopulationPyramid,
    pageTitle: ExampleStrings.titlePopulationPyramid,
    path: ExampleStrings.urlPopulationPyramid,
    filepath: "FeaturedApps/ShowCases/PopulationPyramid",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Population Pyramid of Europe and Africa`,
    metaKeywords: "population, react, column, stacked, animation, labels, engineering, pyramid, europe, africa, javascript, chart, webgl, canvas",
    thumbnailImage: exampleImage,
};
