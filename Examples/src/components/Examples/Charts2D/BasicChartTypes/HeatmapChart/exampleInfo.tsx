import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";
import contoursChart from "../ContoursChart/javascript-contours-chart.jpg";

const description = `Demonstrates how to create a JavaScript Heatmap Chart. The FastUniformHeatmapRenderableSeries accepts a 2D
array of data and has user-defined color map which can be used to color points by value.`;
const tips = [``];

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
        href: ExampleStrings.urlHeatmapChartDocumentation,
        title: ExampleStrings.urlTitleHeatmapChartDocumentation,
        linkTitle: "JavaScript Heatmap Chart Documentation"
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
                imgPath: contoursChart,
                title: ExampleStrings.titleContourChart,
                seoTitle: ExampleStrings.urlTitleContourChartDocumentation,
                examplePath: ExampleStrings.urlContourChart
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Heatmap Chart</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription documentationLinks={documentationLinks} description={description} seeAlso={seeAlso} />
    </div>
);

export const heatmapChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleHeatmapChart,
    path: ExampleStrings.urlHeatmapChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a Realtime JavaScript Heatmap Chart. The Heatmap series accepts a 2D array" +
        "of data and has user-defined color map which can be used to color points by value.",
    seoKeywords: "heatmap, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-heatmap-chart.jpg"
};
