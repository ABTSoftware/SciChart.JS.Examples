import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import exampleImage from "./javascript-spline-band-chart.jpg";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Band Charts fill a polygon between two high and low lines. The colour of the polygon changes depending on which line Y1 or Y2 is higher.`;
const description = `This variation on Band charts uses Spline interpolation (smoothing). This JS chart type can be used to draw thresholds, a fill between two lines or areas of interest on a chart.`;
const tips = [
    `If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
    confidence intervals, error margins or Bollinger Bands!`,
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to create a <strong>{frameworkName} Spline Band Chart</strong> or High-Low Fill using
        SciChart.js, our High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Chart Software
        </a>
    </p>
);

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlSplineBandChartDocumentation,
        title: ExampleStrings.urlTitleSplineBandChartDocumentation,
        linkTitle: "JavaScript Spline Band Documentation",
    },
];

export const splineBandSeriesChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleSplineBandChart,
    pageTitle: ExampleStrings.pageTitleSplineBandChart,
    path: ExampleStrings.urlSplineBandChart,
    filepath: "Charts2D/BasicChartTypes/SimpleBandSeriesChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `SciChart's ${frameworkName} Spline Band Chart makes it easy to draw thresholds or fills between two lines on a chart. Get your free demo today.`,
    metaKeywords: "band, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
