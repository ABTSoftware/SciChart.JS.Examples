import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Line Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = `Demonstrates how to create a JavaScript Line Chart. The FastLineRenderableSeries can be used to render an
XyDataSeries, XyyDataSeries (uses Y1 only) or OhlcDataSeries (renders Close).`;
const description = `The scatter chart uses the PointMarker API to define the marker shape and size. Point-markers available out
of the box include Ellipse (circle), Triangle, Square, Cross and CustomPointMarker, which renders an image.`;
const tips = [
    ` As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.`,
    ` You can add data-point markers to a line series using the PointMarker API. This is very performant and uses
    the same WebGL rendering as our Scatter Charts.`
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
        href: ExampleStrings.urlLineChartDocumentation,
        title: ExampleStrings.urlTitleLineChartDocumentation,
        linkTitle: "JavaScript Line Chart Documentation"
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
                imgPath: ExampleStrings.imgPointMarkers,
                title: ExampleStrings.titlePointMarkers,
                seoTitle: ExampleStrings.urlTitlePointMarkers,
                examplePath: ExampleStrings.urlPointMarkers
            },
            {
                imgPath: ExampleStrings.imgStackedMountainChart,
                title: ExampleStrings.titleStackedMountainChart,
                seoTitle: ExampleStrings.urlTitleStackedMountainChart,
                examplePath: ExampleStrings.urlStackedMountainChart
            },
            {
                imgPath: ExampleStrings.imgMultiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
            }
        ]
    }
];

export const lineChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLineChart,
    path: ExampleStrings.urlLineChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Line Chart. " +
        "The Line Series also supports gradient-coloring and per-point coloring via our PaletteProvider API.",
    seoKeywords: "line, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-line-chart.jpg"
};
