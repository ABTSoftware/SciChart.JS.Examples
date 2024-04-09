import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-bubble-chart.jpg";

const previewDescription = `Bubble charts are created in SciChart.js using the FastBubbleRenderableSeries. `;
const description = `The JS Bubble chart type can be animated, have varying point colours and sizes and supports a variety of point types: circle, square, and custom shapes are possible.`;
const tips = [
    `If you share a single XyzDataSeries between Line and Bubble Renderable Series, the line will render the X-Y
    points while the Bubble will render the X-Y-Z points.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlBubbleChartDocumentation,
        title: ExampleStrings.urlTitleBubbleChartDocumentation,
        linkTitle: "JavaScript Bubble Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Bubble Chart</strong> This is a{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Charts">
            JavaScript Chart
        </a>{" "}
        type which draws point-markers (Ellipse, Square, Triangle, Circle) at X,Y locations
    </p>
);

export const bubbleChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleBubbleChart,
    pageTitle: ExampleStrings.pageTitleBubbleChart,
    path: ExampleStrings.urlBubbleChart,
    filepath: "Charts2D/BasicChartTypes/BubbleChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Create a high performance ${frameworkName} Bubble Chart with Sci-Chart. Demo shows how to draw point-markers at X,Y locations. Get your free demo now.`,
    metaKeywords: "bubble, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
