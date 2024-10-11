import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-user-annotated-stock-chart.jpg";

const previewDescription = ``;
const description = ``;
const tips = [``];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlCandlestickChartDocumentation,
        title: ExampleStrings.urlTitleCandlestickChartDocumentation,
        linkTitle: "JavaScript Candlestick Chart Documentation",
    },
];

const Subtitle = (frameworkName: string) => (
    <p>
        This demo shows you how to create a <strong>{frameworkName} User Annotated Stock Chart</strong> using
        SciChart.js. Custom modifiers allow you to add lines and markers, then use the built in serialisation functions
        to save and reload the chart, including the data and all your custom annotations.
    </p>
);

export const userAnnotatedStockChartExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleuserAnnotatedStockChart,
    pageTitle: ExampleStrings.pageTitleuserAnnotatedStockChart,
    path: ExampleStrings.urluserAnnotatedStockChart,
    filepath: "Charts2D/CreateStockCharts/UserAnnotatedStockChart",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `This demo shows you how to create a <strong>{frameworkName} User Annotated Stock Chart</strong> using
        SciChart.js.  Custom modifiers allow you to add lines and markers, then use the built in serialisation functions to save and reload the chart, including the data and all your custom annotations.`,
    metaKeywords: "candlestick, chart, annotations, lines, markers, save, load, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent: undefined,
};
