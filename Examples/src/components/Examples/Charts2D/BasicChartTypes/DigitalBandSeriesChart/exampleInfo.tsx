import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-digital-band-chart.jpg";

const previewDescription = `Step bands or Digital bands are created in SciChart.js using the FastBandRenderableSeries. By setting the property IsDigitalLine=true the line is drawn as a step function.`;
const description = `Band series (also known as High-Low fill or Poylgon Fill) can be used to draw thresholds, a fill between two lines or areas of interest on a chart.`;
const tips = [
    `If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
    confidence intervals, error margins or Bollinger Bands!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDigitalBandChartDocumentation,
        title: ExampleStrings.urlTitleDigitalBandChart,
        linkTitle: "JavaScript Digital Band Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Digital Band Chart</strong> or High-Low Fill using
        SciChart.js. This is our High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Chart Library
        </a>
    </p>
);

export const digitalBandSeriesChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleDigitalBandChart,
    pageTitle: ExampleStrings.pageTitleDigitalBandChart,
    path: ExampleStrings.urlDigitalBandChart,
    filepath: "Charts2D/BasicChartTypes/DigitalBandSeriesChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Learn how to create a ${frameworkName} Digital Band Chart or High-Low Fill Chart with SciChart's easy-to-follow demos. Get your free trial today.`,
    metaKeywords: "digital, band, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
