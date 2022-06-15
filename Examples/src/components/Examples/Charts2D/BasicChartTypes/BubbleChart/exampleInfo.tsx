import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Bubble charts are created in SciChart.js using the FastBubbleRenderableSeries. `;
const description = `The JS Bubble chart type can be animated, have varying point colours and sizes and supports a variety of point types: circle, square, and custom shapes are possible.`;
const tips = [
    `If you share a single XyzDataSeries between Line and Bubble Renderable Series, the line will render the X-Y
    points while the Bubble will render the X-Y-Z points.`
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
        href: ExampleStrings.urlBubbleChartDocumentation,
        title: ExampleStrings.urlTitleBubbleChartDocumentation,
        linkTitle: "JavaScript Bubble Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
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
                imgPath: ExampleStrings.imgLineChart,
                title: ExampleStrings.titleLineChart,
                seoTitle: ExampleStrings.urlTitleLineChartDocumentation,
                examplePath: ExampleStrings.urlLineChart
            },
            {
                imgPath: ExampleStrings.imgPointMarkers,
                title: ExampleStrings.titlePointMarkers,
                seoTitle: ExampleStrings.urlTitlePointMarkers,
                examplePath: ExampleStrings.urlPointMarkers
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Bubble Chart</strong>{" "}
        This is a{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Charts">
            JavaScript Chart
        </a>{" "}
        type which draws point-markers (Ellipse, Square, Triangle, Circle) at X,Y locations
    </p>
);

export const bubbleChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBubbleChart,
    pageTitle: ExampleStrings.pageTitleBubbleChart,
    path: ExampleStrings.urlBubbleChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates how to create a JavaScript Bubble Chart. This is a chart type which draws point-marker (Ellipse, " +
        "Square, Triangle or Custom) at X,Y locations.",
    metaKeywords: "bubble, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-bubble-chart.jpg"
};
