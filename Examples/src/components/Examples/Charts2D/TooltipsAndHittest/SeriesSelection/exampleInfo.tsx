import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-series-selection.jpg";

const previewDescription = `Demonstrates the Hover and Selection Apu, which can be used to get feedback about clicks or hover on data-points or lines. Click or hover on the data-point and see the result.`;
const description = `Click or hover anywhere on the chart to call BaseRenderableSeries.hitTestProvider. hitTest. The HitTest functionCHANGE CHANGE CHANGE CHANGE
accepts a mouse-point and returns the nearest data-point, plus its location in X,Y coordinate space.`;
const tips = [
    `The hitTest function accepts parameters to control the hit-test logic. See the documentation on Hit-Testing
    for more info!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlSeriesSelectionDocumentation,
        title: ExampleStrings.urlTitleSeriesSelectionDocumentation,
        linkTitle: "SciChart.js Series Selection Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to add <strong>Series Selection</strong> to a chart using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const seriesSelectionExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleSeriesSelection,
    pageTitle: ExampleStrings.titleSeriesSelection,
    path: ExampleStrings.urlSeriesSelection,
    filepath: "Charts2D/TooltipsAndHittest/SeriesSelection",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates Hit-Testing a ${frameworkName} Chart - point and click on the chart and get feedback about what data-points were clicked`,
    metaKeywords: "hit, test, api, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
