import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import pointMarkers from "../../StylingAndTheming/UsePointMarkers/javascript-chart-custom-poinmarkers.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `Demonstrates how to create a JavaScript Bubble Chart. This is a chart type which draws point-marker
(Ellipse, Square, Triangle or Custom) at X,Y locations.`;
const description = `The FastBubbleRenderableSeries requires an XyzDataSeries, which contains X,Y,Z data. The size or scale of
the point is defined by a Z-point.`;
const tips = [
    `If you share a single XyzDataSeries between Line and Bubble Renderable Series, the line will render the X-Y
    points while the Bubble will render the X-Y-Z points.`
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
        href: ExampleStrings.urlBubbleChartDocumentation,
        title: ExampleStrings.urlTitleBubbleChartDocumentation,
        linkTitle: "JavaScript Bubble Chart Documentation"
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
                imgPath: pointMarkers,
                title: ExampleStrings.titlePointMarkers,
                seoTitle: ExampleStrings.urlTitlePointMarkersDocumentation,
                examplePath: ExampleStrings.urlPointMarkers
            }
        ]
    }
];



const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Bubble Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}
        />
    </div>
);

export const bubbleChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBubbleChart,
    path: ExampleStrings.urlBubbleChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Bubble Chart. This is a chart type which draws point-marker (Ellipse, " +
        "Square, Triangle or Custom) at X,Y locations.",
    seoKeywords: "bubble, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-bubble-chart.jpg"
};
