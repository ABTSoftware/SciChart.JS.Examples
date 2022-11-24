import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-error-bars-chart.jpg";

const description = `Error Bars on JavaScript Charts are useful to display uncertainty or statistical confidence of a data-point.
    In SciChart.js Error Bars can have custom error values per point or a fixed percentage error value. Error bars can be horizontal or vertical.`;
const tips = [
    `To change the size of the cap, use the dataPointWidth and dataPointWidthMode properties.`,
    `It is possible to change orientation of error bars.`,
    `You can also configure visibility of different part of an error bar.`,
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
        href: ExampleStrings.urlImpulseChartDocumentation,
        title: ExampleStrings.urlTitleImpulseChartDocumentation,
        linkTitle: "JavaScript Impulse Chart Documentation"
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
                imgPath: ExampleStrings.imgColumnChart,
                title: ExampleStrings.titleColumnChart,
                seoTitle: ExampleStrings.urlTitleColumnChart,
                examplePath: ExampleStrings.urlColumnChart
            },
            {
                imgPath: ExampleStrings.imgStackedColumnChart,
                title: ExampleStrings.titleStackedColumnChart,
                seoTitle: ExampleStrings.urlTitleStackedColumnChart,
                examplePath: ExampleStrings.urlStackedColumnChart
            },
            {
                imgPath: ExampleStrings.imgGroupedColumnChart,
                title: ExampleStrings.titleGroupedColumnChart,
                seoTitle: ExampleStrings.urlTitleGroupedColumnChart,
                examplePath: ExampleStrings.urlGroupedColumnChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        This SciChart demo demonstrates how to create a <strong>JavaScript Error Bars Chart</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>{" "}
        our High Performance JavaScript Chart component.
    </p>
);

export const errorBarsChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleErrorBarsChart,
    pageTitle: ExampleStrings.pageTitleErrorBarsChart,
    path: ExampleStrings.urlErrorBarsChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Create JavaScript Error Bars Chart using high performance SciChart.js. Display uncertainty or statistical confidence of a data-point. Get free demo now.",
    metaKeywords: "error, bars, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
