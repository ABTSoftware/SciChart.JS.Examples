import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-hit-test-on-click.jpg";

const previewDescription = `Demonstrates the Hit Test API, which can be used to get feedback about clicks on data-points or lines and
enable selection, of showing of context menus. Click on the data-point and see hit test info on the right.`;
const description = `Click anywhere on the chart to call BaseRenderableSeries.hitTestProvider. hitTest. The HitTest function
accepts a mouse-point and returns the nearest data-point, plus its location in X,Y coordinate space.`;
const tips = [
    `The hitTest function accepts parameters to control the hit-test logic. See the documentation on Hit-Testing
    for more info!`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlHitTestDocumentation,
        title: ExampleStrings.urlTitleHitTestDocumentation,
        linkTitle: "Hit-Test API documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to add <strong>Hit-Test on click behavior</strong> to a chart using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const hitTestApiExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleHitTestApi,
    pageTitle: ExampleStrings.titleHitTestApi,
    path: ExampleStrings.urlHitTestApi,
    filepath: "Charts2D/TooltipsAndHittest/HitTestApi",
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
