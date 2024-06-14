import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./zoom-high-precision.jpg";

// chart with zoom with very high precision
const previewDescription = `This examples shows the precision of the SmartDateLabelProvider.`;
const description = `Demonstrates the SmartDateLabelProvider in SciChart.js. This example shows a chart with zoom with very high precision.`;

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlZoomPanModifierDocumentation,
        title: ExampleStrings.urlTitleZoomPanModifierDocumentation,
        linkTitle: "SciChart.js Zooming high precision documentation",
    },
];

const Subtitle = () => (
    <p>Demonstrates the <strong>SmartDateLabelProvider</strong> in SciChart.js.</p>
);

export const zoomHighPrecision2ExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleZoomHighPrecision2,
    pageTitle: ExampleStrings.titleZoomHighPrecision2,
    path: ExampleStrings.urlZoomHighPrecision2,
    filepath: "Charts2D/ZoomingAndPanning/ZoomHighPrecision2",
    subtitle: Subtitle,
    documentationLinks,
    description,
    previewDescription,
    metaDescription: `Demonstrates the SmartDateLabelProvider in SciChart.js.`,
    metaKeywords: "drag, date, axis, scale, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
