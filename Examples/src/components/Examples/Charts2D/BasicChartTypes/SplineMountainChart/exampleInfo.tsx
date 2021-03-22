import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import stackedMountainImg from "../StackedMountainChart/javascript-stacked-mountain-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `Demonstrates how to create a JavaScript Spline Mountain Chart. An area or polygon is rendered from the
Y-value to the zeroLineY, a configurable property which defaults to zero.`;
const description = `This chart type features a spline or smoothed line which beautifies the datavizualization where there are
few points on the chart.`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`
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
        href: ExampleStrings.urlMountainChartDocumentation,
        title: ExampleStrings.titleMountainChart,
        linkTitle: "JavaScript Mountain Chart Documentation"
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
                imgPath: stackedMountainImg,
                title: ExampleStrings.titleStackedMountainChart,
                seoTitle: ExampleStrings.urlTitleStackedMountainChart,
                examplePath: ExampleStrings.urlStackedMountainChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Mountain Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}
        />
    </>
);

export const splineMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSplineMountainChart,
    path: ExampleStrings.urlSplineMountainChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Mountain Chart. An area or polygon is rendered with a gradient fill to configurable zero-line.",
    seoKeywords: "mountain, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-mountain-chart.jpg"
};
