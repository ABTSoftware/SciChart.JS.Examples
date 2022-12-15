import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-bubble-chart.jpg";

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
    githubUrl,
    metaDescription:
        "Create a high performance JavaScript Bubble Chart with Sci-Chart. Demo shows how to draw point-markers at X,Y locations. Get your free demo now.",
    metaKeywords: "bubble, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
