import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-axis-layout.jpg";

const previewDescription = `Demonstrates the different axis layouts available in Scichart and how they affect the series`;
const description = ``;
const tips = [``, ``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlAxisDocumentation,
        title: ExampleStrings.urlTitleAxisDocumentation,
        linkTitle: "Scichart.js Axis Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        The same data is rendered many to show the Axis Layout options in SciChart.js. Charts support outer, inner,
        central and stacked axes, and use of axis alignment to create vertical charts. Series may be registered on
        specific X,Y axis pairs for infinite layout configuration.
    </p>
);

export const axisLayoutExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleAxisLayout,
    pageTitle: ExampleStrings.titleAxisLayout,
    path: ExampleStrings.urlAxisLayout,
    filepath: "FeaturedApps/FeatureDemos/AxisLayout",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates outer, inner, central and stacked axes, and use of axis alignment to create vertical charts`,
    metaKeywords: "stacked, axis, layout, alignment, vertical, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
