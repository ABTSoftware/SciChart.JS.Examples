import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Our Heatmap is highly dynamic and enables display of Sonar, MRI/medical imagery, Spectrograms or Audio/Radio analysis in JavaScript.
    The entire heatmap is represented by a 2D array and is color-mapped to a numeric value.
    Contour lines are calculated at a specified step value and drawn over the chart automatically.`;
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
                imgPath: ExampleStrings.imgHeatMapChart,
                title: ExampleStrings.titleHeatmapChart,
                seoTitle: ExampleStrings.urlTitleHeatmapChart,
                examplePath: ExampleStrings.urlHeatmapChart
            },
            {
                imgPath: ExampleStrings.imgRealtimeTickingStockCharts,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            },
            {
                imgPath: ExampleStrings.imgScatterChart,
                title: ExampleStrings.titleScatterChart,
                seoTitle: ExampleStrings.urlTitleScatterChart,
                examplePath: ExampleStrings.urlScatterChart
            },
            {
                imgPath: ExampleStrings.imgPointMarkers,
                title: ExampleStrings.titlePointMarkers,
                seoTitle: ExampleStrings.urlTitlePointMarkers,
                examplePath: ExampleStrings.urlPointMarkers
            },
        ]
    }
];

const Subtitle = () => (
    <p>
        Our Contours Chart example demonstrates how to create a <strong>JavaScript Contour-map Chart</strong> using our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="powerful JavaScript Chart Library">
            powerful JavaScript Chart Library
        </a>.
    </p>
);

export const contourChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleContourChart,
    pageTitle: ExampleStrings.pageTitleContourChart,
    path: ExampleStrings.urlContourChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Design a highly dynamic JavaScript Heatmap Chart With Contours with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.",
    metaKeywords: "contour, contours, heatmap, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-contours-chart.jpg"
};
