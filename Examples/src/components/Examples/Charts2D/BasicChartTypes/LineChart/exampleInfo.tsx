import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-line-chart.jpg";

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates all the permutations of JavaScript Line Chart using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            SciChart.js
        </a>
        , including Digital Line chart, Tooltips, Dashed lines, Gradient lines, Hovering/selecting lines, vertical lines
        and paletted lines.
    </p>
);

const previewDescription = `The FastLineRenderableSeries can be used to render an
XyDataSeries, XyyDataSeries (uses Y1 only) or OhlcDataSeries (renders Close).`;
const description = `The scatter chart uses the PointMarker API to define the marker shape and size. Point-markers available out
of the box include Ellipse (circle), Triangle, Square, Cross and CustomPointMarker, which renders an image.`;
const tips = [
    ` As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.`,
    ` You can add data-point markers to a line series using the PointMarker API. This is very performant and uses
    the same WebGL rendering as our Scatter Charts.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlLineChartDocumentation,
        title: ExampleStrings.urlTitleLineChartDocumentation,
        linkTitle: "JavaScript Line Chart Documentation",
    },
];

export const lineChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleLineChart,
    pageTitle: ExampleStrings.pageTitleLineChart,
    path: ExampleStrings.urlLineChart,
    filepath: "Charts2D/BasicChartTypes/LineChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Discover how to create a high performance ${frameworkName} Line Chart with SciChart - the leading JavaScript library. Get your free demo now.`,
    metaKeywords: "line, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
