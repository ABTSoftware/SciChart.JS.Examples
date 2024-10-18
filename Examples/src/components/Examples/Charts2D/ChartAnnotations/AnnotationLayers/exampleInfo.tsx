import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-annotation-layers.jpg";

const previewDescription = `A demonstration of annotation layering.`;

const description = `The chart contains three types of annotations and a line series with data labels.
It demonstrates how they are stacked on each other depending on their type and "annotationLayer" option.`;

const tips = [
    `There are specifics of rendering for each type: TextAnnotation, as well as CustomAnnotation are examples of SVG Annotations (derived from SvgAnnotationBase).`,
    `"annotationLayer" property allows to control the placement an annotation relatively to Renderable Series and Grid Lines.`,
    `SVG Annotations are rendered on an SVG Canvas. SciChart currently provides only two of them - foreground and background SVG layer elements (EAnnotationLayer.AboveChart, EAnnotationLayer.Background correspondingly).`,
    `Other types of annotations, inherited from RenderContextAnnotationBase (e.g. BoxAnnotation, NativeTextAnnotation, LineAnnotation), are rendered natively with WebGl on the HTMLCanvas, which is placed between SVG ones.`,
    `Relative placement between annotations of the same type are defined by their order within the collection.`,
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlAnnotationsDocumentation,
        title: ExampleStrings.urlTitleAnnotationsDocumentation,
        linkTitle: "Annotations API Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates how Annotation layering a <strong>{frameworkName} Chart</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
        <br />
        Notice the difference between annotations rendered to SVG and Canvas, as well as <b>annotationLayer</b> property
        effect.
    </p>
);

const markdownContent: string = undefined;

export const annotationLayersExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleAnnotationLayers,
    pageTitle: ExampleStrings.titleAnnotationLayers,
    path: ExampleStrings.urlAnnotationLayers,
    filepath: "Charts2D/ChartAnnotations/AnnotationLayers",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how layering works a ${frameworkName} Chart using SciChart.js Annotations API`,
    metaKeywords: "annotations, chart, api, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
};
