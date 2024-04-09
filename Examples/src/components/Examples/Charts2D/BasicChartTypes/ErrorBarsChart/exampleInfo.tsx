import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
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
        href: ExampleStrings.urlErrorBarsChartDocumentation,
        title: ExampleStrings.urlTitleErrorBarsChartDocumentation,
        linkTitle: "JavaScript Impulse Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This SciChart demo demonstrates how to create a <strong>{frameworkName} Error Bars Chart</strong> using{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="SciChart.js">
            SciChart.js
        </a>{" "}
        our High Performance JavaScript Chart component.
    </p>
);

export const errorBarsChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleErrorBarsChart,
    pageTitle: ExampleStrings.pageTitleErrorBarsChart,
    path: ExampleStrings.urlErrorBarsChart,
    filepath: "Charts2D/BasicChartTypes/ErrorBarsChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Create ${frameworkName} Error Bars Chart using high performance SciChart.js. Display uncertainty or statistical confidence of a data-point. Get free demo now.`,
    metaKeywords: "error, bars, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
