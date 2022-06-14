import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Demonstrates how to create Logarithmic X or Y axis in a JavaScript Chart.
SciChart supports axis with Logarithmic scale and scientific or engineering notation.
This example shows how to configure the logarithmic axis.`;
const tips = [`Try dragging an axis or the chart to zoom and pan around. Double clicking the chart resets the zoom!`];

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
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgMultipleXAxis,
                title: ExampleStrings.titleMultipleXAxis,
                seoTitle: ExampleStrings.urlTitleMultipleXAxis,
                examplePath: ExampleStrings.urlMultipleXAxis
            },
            {
                imgPath: ExampleStrings.imgVerticalCharts,
                title: ExampleStrings.titleVerticalCharts,
                seoTitle: ExampleStrings.urlTitleVerticalCharts,
                examplePath: ExampleStrings.urlVerticalCharts
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Chart with Logarithmic axis</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const logarithmicAxisExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLogarithmicAxis,
    pageTitle: ExampleStrings.titleLogarithmicAxis + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlLogarithmicAxis,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrates Logarithmic Axis on a JavaScript Chart using SciChart.js. SciChart supports logarithmic axis with scientific or engineering notation and positive and negative values",
    metaKeywords: "logarithmic, axis, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-with-logarithmic-axis.jpg"
};
