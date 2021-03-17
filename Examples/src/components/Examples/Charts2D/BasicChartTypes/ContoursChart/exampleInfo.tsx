import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import heatmapChart from "../HeatmapChart/javascript-heatmap-chart.jpg";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import Gallery from "../../../../Gallery/Gallery";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `Demonstrates how to create a JavaScript Contour map Chart. The UniformContoursRenderableSeries accepts a 2D
array of data and calculates contour lines at a specified step value and draws them on the chart.`;
const tips = [
    `Contours are calculated using GPU Shader programs so are very fast, but require some tweaking of properties
on UniformContoursRenderableSeries to get a good visual.`
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
        href: ExampleStrings.urlContourChartDocumentation,
        title: ExampleStrings.urlTitleContourChartDocumentation,
        linkTitle: "JavaScript Contours Chart Documentation"
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
                imgPath: heatmapChart,
                title: ExampleStrings.titleHeatmapChart,
                seoTitle: ExampleStrings.urlTitleHeatmapChart,
                examplePath: ExampleStrings.urlHeatmapChart
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Contour-map Chart</strong> using SciChart.js, High Performance{" "}
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
            seeAlso={seeAlso}
        />
    </div>
);

export const contourChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleContourChart,
    path: ExampleStrings.urlContourChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a Realtime JavaScript Contour-map Chart. The Contours series accepts a 2D array" +
        "of data and calculates contour lines at a specified step value and draws them on the chart.",
    seoKeywords: "contour, contours, heatmap, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-contours-chart.jpg"
};
