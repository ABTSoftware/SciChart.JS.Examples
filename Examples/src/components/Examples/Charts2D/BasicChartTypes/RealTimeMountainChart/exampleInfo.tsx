import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import mountainImg from "../MountainChart/javascript-mountain-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `>Demonstrates how to create a JavaScript Mountain Chart with animated realtime updates.`;
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
                imgPath: mountainImg,
                title: ExampleStrings.titleMountainChart,
                seoTitle: ExampleStrings.urlTitleStackedMountainChart,
                examplePath: ExampleStrings.urlStackedMountainChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how create a <strong>JavaScript Mountain Chart with animated realtime updates</strong> using
        SciChart.js, High Performance{" "}
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
        />
    </>
);

export const realTimeMountainChartExampleInfo: TExampleInfo = {
    title: "JavaScript Realtime Mountain Chart",
    path: "/javascript-realtime-mountain-chart",
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to create a JavaScript Mountain Chart with animated realtime updates.",
    seoKeywords: "mountain, chart, realtime, animated, javascript, canvas",
    thumbnailImage: "javascript-animated-mountain-chart.jpg"
};
