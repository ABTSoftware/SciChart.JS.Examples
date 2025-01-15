import React from "react";
import { IExampleMetadata } from "../../../IExampleMetadata";
import { createExampleInfo } from "../../../exampleInfoUtils";
import { metaData } from "./LineSplittingThresholdsMetadata";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-line-splitting-thresholds.jpg";

const description = `Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds`;
const tips = [``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPaletteProviderDocumentation,
        title: ExampleStrings.urlTitlePaletteProviderDocumentation,
        linkTitle: "SciChart.js PaletteProvider documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how to split lines into multiple segments so they can be individually colored according to
        thresholds, using SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
        . This uses a RenderDataTransform to calculate the intersections between the data and the thresholds and add
        additional points.
    </p>
);

export const oldlineSplittingThresholdsExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleLineSplittingThresholds,
    pageTitle: ExampleStrings.titleLineSplittingThresholds,
    path: ExampleStrings.urlLineSplittingThresholds,
    filepath: "Charts2D/StylingAndTheming/LineSplittingThresholds",
    subtitle: Subtitle,
    documentationLinks,
    metaDescription:
        "Demonstrates how to use a RenderDataTransform to split lines into multiple segments so they can be individually colored according to thresholds",
    metaKeywords: "thresholds, coloring, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};

// New implementation using centralized utility
export const lineSplittingThresholdsExampleInfo = createExampleInfo(metaData as IExampleMetadata);
