import { IExampleMetadata } from "../../../IExampleMetadata";
import { createExampleInfo } from "../../../exampleInfoUtils";
import { metaData } from "./StaticAxisMetadata";
import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-static-axis.jpg";

const description = `Demonstrates a realtime chart where the ticks and gridlines are fixed, but the labels change.  
This is achieved by setting the isStaticAxis property to true on the X axis.`;

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlStaticAxisDocumentation,
        title: ExampleStrings.urlTitleStaticAxisDocumentation,
        linkTitle: "Static Axis",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates a realtime <strong>{frameworkName} static axis chart</strong> - where the ticks and gridlines are
        fixed, but the labels change.
        <br />
        With SciChart.js High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>{" "}
        you can achieve this simply by setting isStaticAxis property to true on the X axis.
    </p>
);

const markdownContent: string = undefined;

export const oldstaticAxisExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleStaticAxis,
    pageTitle: ExampleStrings.titleStaticAxis,
    path: ExampleStrings.urlStaticAxis,
    filepath: "Charts2D/ModifyAxisBehavior/StaticAxis",
    subtitle: Subtitle,
    metaDescription: (frameworkName: string) =>
        `Demonstrates isStaticAxis on a ${frameworkName} Chart using SciChart.js.`,
    metaKeywords: "multiple, axis, static, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
    documentationLinks,
};

// New implementation using centralized utility
export const staticAxisExampleInfo = createExampleInfo(metaData as IExampleMetadata);
