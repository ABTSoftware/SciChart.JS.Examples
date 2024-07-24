import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-band-chart.jpg";
import { TFrameworkName } from "../../../../../helpers/shared/Helpers/frameworkParametrization";

const previewDescription = `Band Charts fill a polygon between two high and low lines. The colour of the polygon changes depending on which line Y1 or Y2 is higher.`;
const description = `This JavaScript chart type can be used to draw thresholds, a fill between two lines or areas of interest on a chart.`;
const tips = [
    `If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
    confidence intervals, error margins or Bollinger Bands!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlBandChartDocumentation,
        title: ExampleStrings.urlTitleDigitalLineChartDocumentation,
        linkTitle: "JavaScript Band Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Band Chart</strong> or High-Low Fill using SciChart.js, our
        High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Framework">
            JavaScript Chart Framework
        </a>
    </p>
);

export const bandSeriesChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleBandChart,
    pageTitle: ExampleStrings.pageTitleBandChart,
    path: ExampleStrings.urlBandChart,
    filepath: "Charts2D/BasicChartTypes/BandSeriesChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: TFrameworkName) =>
        `Easily create a ${frameworkName} Band Chart or High-Low Fill with SciChart - high performance JavaScript Chart Library. Get your free trial now.`,
    metaKeywords: "band, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
