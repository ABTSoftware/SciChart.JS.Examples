import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `This variation on Mountain or Area charts in SciChart.js uses dynamic updates to show how easy it is to achieve
    animated realtime charts with our library.`;
const tips = [
    `By setting the stroke property you alter the line color, and fill alters the fill. The Mountain-series also
    supports semi-transparent and linear gradient brush fills and looks great!.`
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
                imgPath: ExampleStrings.imgMountainChart,
                title: ExampleStrings.titleMountainChart,
                seoTitle: ExampleStrings.urlTitleStackedMountainChart,
                examplePath: ExampleStrings.urlStackedMountainChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        This example demonstrates how create a <strong>JavaScript Mountain Chart</strong>{" "}
        with animated realtime updates using SciChart.js, our High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Charts">
            JavaScript Charts
        </a>.
    </p>
);

export const realTimeMountainChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeMountainChart,
    pageTitle: ExampleStrings.pageTitleRealtimeMountainChart,
    path: ExampleStrings.urlRealtimeMountainChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription: "Demonstrates how to create a JavaScript Mountain Chart with animated realtime updates.",
    metaKeywords: "mountain, chart, realtime, animated, javascript, canvas",
    thumbnailImage: ExampleStrings.imgRealtimeMountainChart
};
