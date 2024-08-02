import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-multi-style-series.jpg";

const description = `Demonstrates how to apply multiple different styles to a single series using RenderDataTransform`;
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
        Demonstrates how to use multiple styles on a single series on <strong>{frameworkName} Charts</strong> using
        SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
        . This uses a RenderDataTransform to split the data so that we can draw the selected points using additional
        customised drawingProviders. This means that modifiers still see a single series with the original data.
    </p>
);

export const multiplePointMarkersExampleInfo: TExampleInfo = {
    onWebsite: false,
    title: ExampleStrings.titleMultiStyleSeries,
    pageTitle: ExampleStrings.titleMultiStyleSeries + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlMultiStyleSeries,
    filepath: "Charts2D/StylingAndTheming/MultStyleSeries",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    metaDescription: "Demonstrates how to apply multiple different styles to a single series using RenderDataTransform",
    metaKeywords: "multiple styles, api, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
