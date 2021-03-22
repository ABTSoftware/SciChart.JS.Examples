import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import mountainImg from "../MountainChart/javascript-mountain-chart.jpg";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import stackedColumnChart from "../StackedColumnChart/javascript-stacked-column-chart.png";
import groupedColumnChart from "../StackedColumnSideBySide/javascript-stacked-grouped-column-chart-side-by-side.png";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `Demonstrates how to create a JavaScript Mountain Chart. An area or polygon is rendered from the Y-value to
the zeroLineY, a configurable property which defaults to zero.`;
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
        href: ExampleStrings.urlStackedMountainChartDocumentation,
        title: ExampleStrings.urlTitleStackedMountainChartDocumentation,
        linkTitle: "JavaScript Stacked Mountain Chart Documentation"
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
                imgPath: mountainImg,
                title: ExampleStrings.titleMountainChart,
                seoTitle: ExampleStrings.urlTitleStackedMountainChart,
                examplePath: ExampleStrings.urlStackedMountainChart
            },
            {
                imgPath: stackedColumnChart,
                title: ExampleStrings.titleStackedColumnChart,
                seoTitle: ExampleStrings.urlTitleStackedColumnChart,
                examplePath: ExampleStrings.urlStackedColumnChart
            },
            {
                imgPath: groupedColumnChart,
                title: ExampleStrings.titleGroupedColumnChart,
                seoTitle: ExampleStrings.urlTitleGroupedColumnChart,
                examplePath: ExampleStrings.urlGroupedColumnChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Stacked Mountain Chart</strong> using SciChart.js, High
        Performance{" "}
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
        />
    </>
);

export const stackedMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStackedMountainChart,
    path: ExampleStrings.urlStackedMountainChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Stacked Mountain Chart. Stacked Mountains support 100% stacking with optional gradient fills.",
    seoKeywords: "stacked, mountain, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-stacked-mountain-chart.jpg"
};
