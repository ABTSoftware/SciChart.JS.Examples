import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-3d-surface-mesh-chart.jpg";

const description = `The Surface Mesh chart type can be used to represent 2D data in a 3D map.
    It looks like a topographical map where values in a 2D array are drawn as heights and mapped to a color.
    The Surface Mesh 3D chart type in SciChart.js is highly dynamic and allows for large volumes of data to be plotted.`;
const tips = [
    `Bubbles can be colored individually, programmatically selected and scaled using the PointMetadata3D class.
    PointMetadata also allows you to tag individual bubbles with a business object of any type.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlSurfaceMesh3DChartDocumentation,
        title: ExampleStrings.urlTitleSurfaceMesh3DChartDocumentation,
        linkTitle: "JavaScript 3D Surface Mesh Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Learn how to create a detailed <strong>{frameworkName} 3D Surface Mesh Chart</strong> using SciChart.js, and our{" "}
        <a
            href={ExampleStrings.urlJavascriptChartFeatures}
            target="_blank"
            title="High Performance JavaScript 3D Chart Library"
        >
            High Performance JavaScript 3D Chart Library
        </a>
    </p>
);

export const surfaceMesh3DChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleSurfaceMesh3D,
    pageTitle: ExampleStrings.pageTitleSurfaceMesh3D,
    path: ExampleStrings.urlSurfaceMesh3D,
    filepath: "Charts3D/Basic3DChartTypes/SurfaceMesh3DChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Design a ${frameworkName} 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.`,
    metaKeywords: "3d, surface, mesh, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
