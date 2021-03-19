import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import bubbleChart from "../../BasicChartTypes/BubbleChart/javascript-bubble-chart.jpg";
import scatterChart from "../../BasicChartTypes/ScatterChart/javascript-scatter-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `Demonstrates how to use the FastLineRenderableSeries and the Data-Point Markers API to apply fast
WebGL-rendered data point markers to a line series.`;
const description = `The Point-markers are created using the HTML Canvas or custom images, but applied to the line as a WebGL
Texture, so it’s possible to render tens or hundreds of thousands of point-markers using this method.`;

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
        href: ExampleStrings.urlPointMarkersDocumentation,
        title: ExampleStrings.urlTitlePointMarkersDocumentation,
        linkTitle: "Point-Markers API documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: scatterChart,
                title: ExampleStrings.titleScatterChart,
                seoTitle: ExampleStrings.urlTitleScatterChart,
                examplePath: ExampleStrings.urlScatterChart
            },
            {
                imgPath: bubbleChart,
                title: ExampleStrings.urlTitleBubbleChart,
                seoTitle: ExampleStrings.titleBubbleChart,
                examplePath: ExampleStrings.urlBubbleChart
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to create <strong>custom data-point markers</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription
            previewDescription={previewDescription}
            documentationLinks={documentationLinks}
            description={description}
        />
    </div>
);
export const usePointMarkersExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleUsePointMarkers,
    path: ExampleStrings.urlUsePointMarkers,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates the different point-marker types for JavaScript Scatter charts (Square, Circle, Triangle and Custom image point-marker)",
    seoKeywords: "data, point, marker, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-custom-poinmarkers.jpg"
};
