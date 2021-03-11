import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import classes from "../../../Examples.module.scss";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";
import { TSeeAlso } from "../../../../ExampleDescription/ExampleDescriptionTypes";

const seeAlso: TSeeAlso[] = [
    {
        href: ExampleStrings.urlRealtimeJavaScriptChartDemo,
        title: ExampleStrings.urlTitleRealtimeJavaScriptChartDemo,
        exampleTitle: "Realtime JavaScript Chart Example"
    },
    {
        href: ExampleStrings.urlRealtimeGhostedTracesDemo,
        title: ExampleStrings.urlTitleRealtimeGhostedTracesDemo,
        exampleTitle: "Realtime Ghosted Traces Example"
    }
];

const documentationLinks: any[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,

        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,

        linkTitle: " SciChart.js Tutorials"
    }
];

const previewDescription = `This demo showcases the loading or startup time of SciChart.js with many series by appending 500 series to a chart, each with 500 points and rendering instantly!`;
const description = `This kind of plot can be used in statistical analysis such as rendering the output of Monte Carlo
simulations. Anywhere you need hundreds (or even thousands) of line series on a chart, SciChart.js can
help!`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`
];
// (
//     <>
//         <a href={ExampleStrings.urlRealtimeGhostedTracesDemo} title={ExampleStrings.urlTitleRealtimeGhostedTracesDemo}>
//             Realtime Ghosted Traces Example
//         </a>
//     </>

const Description = () => (
    <div>
        <div className={classes.ExampleInfoText}></div>

        <div className={classes.Tips}></div>

        <div className={classes.Tips}>
            <h4>Documentation Links</h4>
            <ul>
                <li>
                    <a
                        href={ExampleStrings.urlDocumentationHome}
                        title={ExampleStrings.titleDocumentationHome}
                        target="_blank"
                    >
                        SciChart.js Documentation Home
                    </a>
                </li>
                <li>
                    <a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
                        SciChart.js Tutorials
                    </a>
                </li>
                <li>
                    <a
                        href={ExampleStrings.urlPerformanceTipsDocumentation}
                        target="_blank"
                        title={ExampleStrings.urlTitlePerformanceTipsDocumentation}
                    >
                        SciChart.js Performance Tips and Tricks
                    </a>
                </li>
            </ul>
        </div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}
            seeAlso={seeAlso}
        />
    </div>
);
const Subtitle = () => (
    <p>
        Demonstrates loading <strong>250k points instantly</strong> using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const load500By500ExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleLoad500By500,
    path: ExampleStrings.urlLoad500By500,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `This demo showcases the incredible performance of our JavaScript Chart by loading 500 series with 500 points (250k points) instantly!`,
    seoKeywords: "performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-load-500-series-by-500-points.jpg"
};
