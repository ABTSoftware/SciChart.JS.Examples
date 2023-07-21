import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-realtime-mountain-chart.jpg";

const description = `This variation on Mountain or Area charts in SciChart.js uses dynamic updates to show how easy it is to achieve
    animated realtime charts with our library.`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlMountainChartDocumentation,
        title: ExampleStrings.urlTitleMountainChart,
        linkTitle: "Mountain (Area) Chart Documentation"
    }
];

const Subtitle = () => (
    <p>
        This example demonstrates how create a <strong>JavaScript Mountain Chart</strong> with animated realtime updates
        using SciChart.js, our High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Charts">
            JavaScript Charts
        </a>
        .
    </p>
);

export const realTimeMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeMountainChart,
    pageTitle: ExampleStrings.pageTitleRealtimeMountainChart,
    path: ExampleStrings.urlRealtimeMountainChart,
    filepath: "Charts2D/BasicChartTypes/RealTimeMountainChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "JavaScript Realtime Mountain Chart made easy. Add animated, real-time updates with SciChart.js - high performance JavaScript Charts. Get free trial now. ",
    metaKeywords: "mountain, chart, realtime, animated, javascript, canvas",
    thumbnailImage: exampleImage
};
