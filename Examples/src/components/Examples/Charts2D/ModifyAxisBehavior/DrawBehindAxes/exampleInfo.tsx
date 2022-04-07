import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates a chart where the series can draw into the axes area.`;
const tips = [`You can also draw axes over the chart area, and in other positions, buy using Inner Axes`];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlInnerAxes,
        title: ExampleStrings.urlTitleInnerAxes,
        linkTitle: "SciChart.js Inner Axes"
    },
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgSecondaryYAxis,
                title: ExampleStrings.titleSecondaryYAxis,
                seoTitle: ExampleStrings.urlTitleSecondaryYAxis,
                examplePath: ExampleStrings.urlSecondaryYAxis
            },
            {
                imgPath: ExampleStrings.imgCentralAxes,
                title: ExampleStrings.titleCentralAxes,
                seoTitle: ExampleStrings.urlTitleCentralAxes,
                examplePath: ExampleStrings.urlCentralAxes
            },
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Chart with transparent axes</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const drawBehindAxesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDrawBehindAxes,
    path: ExampleStrings.urlDrawBehindAxes,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates the option of the transparent Axes customization on a JavaScript Chart using SciChart.js.",
    seoKeywords: "multiple, axis, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-draw-behind-axes.png"
};
