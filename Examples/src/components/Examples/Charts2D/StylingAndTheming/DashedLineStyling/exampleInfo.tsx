import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import stylingInCode from "../StylingInCode/javascript-chart-styling-theming-in-code.png";
import lineChart from "../../BasicChartTypes/LineChart/javascript-line-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `Demonstrates the Line series, Mountain series and Band series StrokeDashArray property which can be used to
style a dashed line, dotted line or solid line.`;
const tips = [
    `The StrokeDashArray property accepts a number array e.g. [2,3] which defines the length of the dash and the
    length of the gap.`
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
        href: ExampleStrings.urlLineChartDocumentation,
        title: ExampleStrings.urlTitleLineChartDocumentation,
        linkTitle: "The Line Series Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: stylingInCode,
                title: ExampleStrings.titleStylingInCode,
                seoTitle: ExampleStrings.urlTitleStylingInCode,
                examplePath: ExampleStrings.urlStylingInCode
            },
            {
                imgPath: lineChart,
                title: ExampleStrings.titleLineChart,
                seoTitle: ExampleStrings.urlTitleLineChartDocumentation,
                examplePath: ExampleStrings.urlLineChart
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how create <strong>JavaScript Charts with dashed lines</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription documentationLinks={documentationLinks} tips={tips} description={description} />
    </div>
);

export const dashedLineStylingExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDashedLineStyling,
    path: ExampleStrings.urlDashedLineStyling,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription: "Demonstrates dashed line series in JavaScript charts with SciChart.js",
    seoKeywords: "dash, dashed, dotted, line, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-dashed-dotted-lines.jpg"
};
