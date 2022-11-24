import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-digital-band-chart.jpg";

const previewDescription = `Step bands or Digital bands are created in SciChart.js using the FastBandRenderableSeries. By setting the property IsDigitalLine=true the line is drawn as a step function.`;
const description = `Band series (also known as High-Low fill or Poylgon Fill) can be used to draw thresholds, a fill between two lines or areas of interest on a chart.`;
const tips = [
    `If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
    confidence intervals, error margins or Bollinger Bands!`
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
        href: ExampleStrings.urlDigitalBandChartDocumentation,
        title: ExampleStrings.urlTitleDigitalBandChart,
        linkTitle: "JavaScript Digital Band Documentation"
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
                imgPath: ExampleStrings.imgMultiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
            },
            {
                imgPath: ExampleStrings.imgFanChart,
                title: ExampleStrings.titleFanChart,
                seoTitle: ExampleStrings.urlTitleFanChartDocumentation,
                examplePath: ExampleStrings.urlFanChart
            },
            {
                imgPath: ExampleStrings.imgHeatMapChart,
                title: ExampleStrings.titleHeatmapChart,
                seoTitle: ExampleStrings.urlTitleHeatmapChart,
                examplePath: ExampleStrings.urlHeatmapChart
            },
            {
                imgPath: ExampleStrings.imgContourChart,
                title: ExampleStrings.titleContourChart,
                seoTitle: ExampleStrings.urlTitleContourChartDocumentation,
                examplePath: ExampleStrings.urlContourChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Digital Band Chart</strong> or High-Low Fill using SciChart.js.{" "}
        This is our High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Chart Library
        </a>
    </p>
);

export const digitalBandSeriesChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDigitalBandChart,
    pageTitle: ExampleStrings.pageTitleDigitalBandChart,
    path: ExampleStrings.urlDigitalBandChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Learn how to create a JavaScript Digital Band Chart or High-Low Fill Chart with SciChart's easy-to-follow demos. Get your free trial today.",
    metaKeywords: "digital, band, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
