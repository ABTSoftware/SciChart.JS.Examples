import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-subcharts-grid.jpg";

const previewDescription = `Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript`;
const description = ``;
const tips = [``, ``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlSubchartApiDocumentation,
        title: ExampleStrings.urlTitleSubCharstApiDocumentation,
        linkTitle: "Scichart.js SubCharts API Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Using the SubCharts API as part of{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            SciChart.js
        </a>
        , this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript.
    </p>
);

export const subchartsGridExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleChartGrid,
    pageTitle: ExampleStrings.titleChartGrid,
    path: ExampleStrings.urlChartGrid,
    filepath: "FeaturedApps/FeatureDemos/SubChartsAPI",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript`,
    metaKeywords: "javascript, multichart, dashboard, performance, grid, realtime, webgl, canvas",
    thumbnailImage: exampleImage,
};
