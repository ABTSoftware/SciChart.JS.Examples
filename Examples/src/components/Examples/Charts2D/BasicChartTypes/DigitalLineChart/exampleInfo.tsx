import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpers/types/types";
import exampleImage from "./javascript-digital-line-chart.jpg";

const previewDescription = `Step Lines or Digital Lines are created in SciChart.js using the FastLineRenderableSeries. By setting the property IsDigitalLine=true the line is drawn as a step function.`;
const description = `In SciChart.js lines can be stepped, continuous or spline interpolated (smoothed) using our flexible JS Chart Library.`;
const tips = [
    `As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.`,
    `You can add data-point markers to a line series using the PointMarker API. This is very performant and uses
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
        href: ExampleStrings.urlDigitalLineChartDocumentation,
        title: ExampleStrings.urlTitleDigitalLineChartDocumentation,
        linkTitle: "JavaScript Digital Line Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Digital Line Chart</strong> using SciChart.js, our powerful{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Charts">
            JavaScript Charts
        </a>
    </p>
);

export const digitalLineChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDigitalLineChart,
    pageTitle: ExampleStrings.pageTitleDigitalLineChart,
    path: ExampleStrings.urlDigitalLineChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    code,
    githubUrl,
    metaDescription:
        "Discover how to create a JavaScript Digital Line Chart with SciChart - your feature-rich JavaScript Chart Library. Get your free demo now.",
    metaKeywords: "digital, line, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
