import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-draggable-event-markers.jpg";

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers, using SciChart.js High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = ``;
const description = `Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers`;
const tips = [
    `Take control of the candle width by overriding series.getDataPointWidth`,
    `FastCandleStickRenderableSeries needs to be given a properly configured DataLabelProvider in order to show labels`,
    `DataPointSelectionPaletteProvider takes care of coloring the selected point, even when you are setting isSelected on the metaData manually`,
];
const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home",
    },
];

export const eventMarkersExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleEventMarkers,
    pageTitle: ExampleStrings.titleEventMarkers,
    path: ExampleStrings.urlEventMarkers,
    filepath: "FeaturedApps/ShowCases/EventMarkers",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to repurpose a Candlestick Series into dragabble, labled, event markers`,
    metaKeywords: "events, drag, edit, datalabels, , layout, demo, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
