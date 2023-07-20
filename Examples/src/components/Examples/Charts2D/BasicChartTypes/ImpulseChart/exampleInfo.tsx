import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
const exampleImage = "javascript-impulse-chart.jpg";

const description = `An Impulse Chart (otherwise known as Stem Chart, Lollipop Chart) displays a single point at the top of a thin stem.
    In SciChart.js these can be customised with different color points or shapes.`;
const tips = [
    `To change the size of the impulse point, set the size property. Default value is 10.0.`
];

const documentationLinks: TDocumentationLink[] = [{
    href: ExampleStrings.urlImpulseChartDocumentation,
    title: ExampleStrings.urlTitleImpulseChartDocumentation,
    linkTitle: "JavaScript Impulse Chart Documentation"
}];

const Subtitle = () => (
    <p>
        Use this demonstration to learn how to create a <strong>JavaScript Impulse Chart</strong> using SciChart.js, our own High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Library">
            JavaScript Chart Library
        </a>.
    </p>
);

export const impulseChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleImpulseChart,
    pageTitle: ExampleStrings.pageTitleImpulseChart,
    path: ExampleStrings.urlImpulseChart,
    filepath: "Charts2D/BasicChartTypes/ImpulseChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Easily create JavaScript Impulse Chart or Stem Chart using SciChart.js - our own high performance JavaScript Chart Library. Get your free trial now. ",
    metaKeywords: "impulse, lollipop, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
