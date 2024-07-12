import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-axis-types.jpg";

const previewDescription = `Demonstrates The different axis types available in Scichart, and some of the options for configuring them`;
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
        Demonstrates the Numeric, Category, Date and Logarithmic axis types available SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const axisTypesExampleInfo: TExampleInfo = {
    onWebsite: true,
    // TODO add to example strings
    title: "Axis Types",
    pageTitle: "Axis Types",
    path: `axis-types`,
    filepath: "FeaturedApps/FeatureDemos/AxisTypes",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `Demonstrates how to use arbitrary text for axis labels, rather than formatted data values, using the new TextLabelProvider`,
    metaKeywords: "text, axis, date, logarithmic, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
};
