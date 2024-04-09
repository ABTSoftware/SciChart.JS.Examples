import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-realtime-3d-surface-mesh-chart.jpg";

const description = `The Surface Mesh chart type can be used to represent 2D data in a 3D map.
    It looks like a topographical map where values in a 2D array are drawn as heights and mapped to a color.
    The Surface Mesh 3D chart type in SciChart.js is highly dynamic and allows for large volumes of data to be plotted.`;
const tips = [
    `Updating the yValues array in one go using setYValues is more efficient than updating the values one by one`,
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
        Learn how to create a realtime updating <strong>{frameworkName} 3D Surface Mesh Chart</strong> using
        SciChart.js, and our{" "}
        <a
            href={ExampleStrings.urlJavascriptChartFeatures}
            target="_blank"
            title="High Performance JavaScript 3D Chart Library"
        >
            High Performance JavaScript 3D Chart Library
        </a>
    </p>
);

export const realtimeSurfaceMesh3DChartExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleRealtimeSurfaceMesh3D,
    pageTitle: ExampleStrings.pageTitleRealtimeSurfaceMesh3D,
    path: ExampleStrings.urlRealtimeSurfaceMesh3D,
    filepath: "Charts3D/Basic3DChartTypes/RealtimeSurfaceMesh3DChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: (frameworkName: string) =>
        `Design a ${frameworkName} 3D Surface Mesh Chart with SciChart.js - feature-rich JavaScript chart library. Represent 2D data in a 3D map. Get your free demo.`,
    metaKeywords: "3d, surface, mesh, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
