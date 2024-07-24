import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-scatter-chart.jpg";

const previewDescription = `Scatter Charts in SciChart.js can render a number of pre-defined point types (Circle, Square, Triangle, Cross). Custom shapes are also possible.`;
const description = `Each Scatter-chart point can have varying color using our PaletteProvider API. Varying sizes are also possible with the Bubble Chart type.`;
const tips = [
    `Perhaps you wanted a scatter point with a line? If so, you can do this using the Line Series type and by
    setting the pointMarker property.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlScatterChartDocumentation,
        title: ExampleStrings.urlTitleScatterChartDocumentation,
        linkTitle: "JavaScript Scatter Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        We have created an example that demonstrates how to create a <strong>{frameworkName} Scatter Chart</strong>{" "}
        using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>
    </p>
);

export const scatterChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleScatterChart,
    pageTitle: ExampleStrings.pageTitleScatterChart,
    path: ExampleStrings.urlScatterChart,
    filepath: "Charts2D/BasicChartTypes/ScatterChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Create ${frameworkName} Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. `,
    metaKeywords: "scatter, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
