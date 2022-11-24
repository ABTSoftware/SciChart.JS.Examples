import * as React from "react";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-2d-3d-chart-tenor-curves-example.jpg";

const description = `Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application. An example
like this could be used to visualize Tenor curves in a financial setting, or other 2D/3D data combined on a
single screen.`;
const tips = [
    `This example uses a SurfaceMeshRenderable Series3D to render a 2-dimensional array as a heightmap. Line
charts are shown on the same example to show that 2D & 3D charts can be combined.`,
    `You can also overlay contours if you use the SurfaceMeshRenderable Series3D and enable contours by setting
    the DrawMeshAs property.`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorials3DHome,
        title: ExampleStrings.titleTutorials3DHome,
        linkTitle: "SciChart3D.js Tutorials"
    },
    {
        href: ExampleStrings.urlSurfaceMesh3DChartDocumentation,
        title: ExampleStrings.urlTitleSurfaceMesh3DChartDocumentation,
        linkTitle: "JavaScript 3D Surface Mesh Chart Documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgSurfaceMeash3D,
                title: ExampleStrings.titleSurfaceMesh3D,
                seoTitle: ExampleStrings.urlTitleSurfaceMesh3D,
                examplePath: ExampleStrings.urlSurfaceMesh3D
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Demonstrates how to visualize <strong>2-dimensional arrays as a height-map</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript 3D Charts
        </a>
    </p>
);

export const tenorCurvesExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleTenorCurvesFeaturedApp,
    pageTitle: ExampleStrings.titleTenorCurvesFeaturedApp + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlTenorCurvesFeaturedApp,
    documentationLinks,
    tips,
    description,
    subtitle: Subtitle,
    seeAlso,
    code,
    githubUrl,
    metaDescription:
        "Demonstrating the capability of SciChart.js to create a composite 2D &amp; 3D Chart application. " +
        "An example like this could be used to visualize Tenor curves in a financial setting, " +
        "or other 2D/3D data combined on a single screen.",
    metaKeywords: "tenor, curves, 3d, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
