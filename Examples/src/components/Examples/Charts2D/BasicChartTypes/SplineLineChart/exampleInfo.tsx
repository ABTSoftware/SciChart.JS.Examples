import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpes/types/types";
import splineMountain from "../SplineMountainChart/javascript-spline-mountain-chart.jpg";
import splineBand from "../SplineBandSeriesChart/javascript-band-chart.jpg";
import Gallery from "../../../../Gallery/Gallery";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `This example demonstrates how a JavaScript Spline Line chart can be created using the
SplineLineRenderableSeries type.`;
const description = `SciChart's Spline Line type includes a spline-interpolation algorithm to smooth the line, when you have a
few data-points and want a nicer looking, smoothed line series in your chart applications and dashboards`;
const tips = [
    `As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.`,
    `You can add data-point markers to a line series using the PointMarker API. This is very performant and uses the
    same WebGL rendering as our Scatter Charts.`
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
        href: ExampleStrings.urlSplineLineChartDocumentation,
        title: ExampleStrings.titleSplineLineChart,
        linkTitle: "JavaScript Spline Line Chart Documentation"
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
                imgPath: splineMountain,
                title: ExampleStrings.titleSplineMountainChart,
                seoTitle: ExampleStrings.urlTitleMountainChart,
                examplePath: ExampleStrings.urlSplineMountainChart
            },
            {
                imgPath: splineBand,
                title: ExampleStrings.titleSplineBandChart,
                seoTitle: ExampleStrings.urlTitleSplineBandChartDocumentation,
                examplePath: ExampleStrings.urlSplineBandChart
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Spline Line Chart</strong> using SciChart.js, High Performance{" "}
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

export const splineLineChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleSplineLineChart,
    path: ExampleStrings.urlSplineLineChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Spline (smoothed) Line Chart. " +
        "The Spline Line Series also supports gradient-coloring and per-point coloring via our PaletteProvider API.",
    seoKeywords: "spline, smoothed, line, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-spline-smoothed-line-chart.jpg"
};
