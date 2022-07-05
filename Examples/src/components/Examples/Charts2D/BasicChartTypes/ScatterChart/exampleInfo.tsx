import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Scatter Charts in SciChart.js can render a number of pre-defined point types (Circle, Square, Triangle, Cross). Custom shapes are also possible.`;
const description = `Each Scatter-chart point can have varying color using our PaletteProvider API. Varying sizes are also possible with the Bubble Chart type.`;
const tips = [
    `Perhaps you wanted a scatter point with a line? If so, you can do this using the Line Series type and by
    setting the pointMarker property.`
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
        href: ExampleStrings.urlScatterChartDocumentation,
        title: ExampleStrings.urlTitleScatterChartDocumentation,
        linkTitle: "JavaScript Scatter Chart Documentation"
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
                imgPath: ExampleStrings.imgBubbleChart,
                title: ExampleStrings.titleBubbleChart,
                seoTitle: ExampleStrings.urlTitleBubbleChart,
                examplePath: ExampleStrings.urlBubbleChart
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
        We have created an example that demonstrates how to create a <strong>JavaScript Scatter Chart</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>
    </p>
);

export const scatterChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleScatterChart,
    pageTitle: ExampleStrings.pageTitleScatterChart,
    path: ExampleStrings.urlScatterChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Create JavaScript Scatter Chart with high performance SciChart.js. Easily render pre-defined point types. Supports custom shapes. Get your free trial now. ",
    metaKeywords: "scatter, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-scatter-chart.jpg"
};
