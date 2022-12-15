import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-pie-chart.jpg";

const description = `Pie Charts in SciChart.js support selection, legends, different text labels, animated updates,
    gradient or solid fills and more.`;
const tips = [
    `You can change the fill color of every segment and the style of its label.`,
    `Every segment can be highlighted by clicking on it or when selected in the legend.`
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
        href: ExampleStrings.urlPieChartDocumentation,
        title: ExampleStrings.urlTitlePieChartDocumentation,
        linkTitle: "JavaScript Pie Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        For an example that demonstrates how create a <strong>JavaScript Pie Chart</strong>, our demo code teaches you how to do this with SciChart's{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Charting Library
        </a>.
    </p>
);

export const pieChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titlePieChart,
    pageTitle: ExampleStrings.pageTitlePieChart,
    path: ExampleStrings.urlPieChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Easily create and customise a high performance JavaScript Pie Chart with 5-star rated SciChart.js. Get your free trial now to access the whole library. ",
    metaKeywords: "pie, chart, javascript, canvas",
    thumbnailImage: exampleImage
};
