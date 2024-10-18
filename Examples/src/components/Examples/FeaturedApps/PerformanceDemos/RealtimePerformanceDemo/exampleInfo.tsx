import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-chart-realtime-performance-demo.jpg";

const Subtitle = (frameworkName: string) => (
    <p>
        Demonstrates appending <strong>millions of points</strong> to a line chart with SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const previewDescription = ``;
const description = `Demonstrates the speed and power of SciChart.js in a real-time example. Creates a timer and pushes 1,000
points every 10ms to 3 line series on the chart (300k points per second). The point count quickly rises into
the millions, and SciChart is still rendering!`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`,
];
const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks",
    },
];

// MoreInfo Header -
const moreInfoHeader = `Candlestick Charts for traders`;
const moreInfo = [
    {
        label: "The most popular chart type for traders</a> is the candlestick chart. Candlestick provides visual support for making decisions in the case of stocks, foreign exchange or commodities.",
    },
    {
        label: " Sometimes, in trading, you are not able to see the volume of data you require. With SciChart.js, there are fewer limitations – for instance, you can visualize a year’s worth of 1-minute OHLC bars in a Candlestick Chart, as opposed to a few days. We help you present even the most complex data sets in a way that’s easy to navigate and understand, all with high performance.",
    },
    {
        label: "Our candlestick graphs support interactive elements including animation, zooming and panning. Our boilerplates integrate easily with all your JavaScript frameworks, including Angular, Vue, Blazor, React, Electron and Next.js. Start creating more sophisticated financial charts to describe the price changes of a security or currency with SciChart.js. Ready to create your JavaScript Candlestick Chart?",
    },
    {
        label: " SciChart.js is the latest software to be added to our award-winning chart library portfolio. Our priority is to enable the creation of high-performance JavaScript charts for all your digital applications. To use locally, simply sign-up and follow the steps. Create complex, fast-rendering financial charts in just a few steps!",
    },
];

const customDescription = ` SciChart.js ships with over 80 <a href="#">JavaScript Chart demos</a> which you can browse, view the source code and see related documentation. Build incredible complex dashboards with SciChart.js, our High Performance <a href="#">JavaScript Chart Library</a.`;
const customDescription1 = `This <a href="#">JavaScript Chart</a> demo shows you how to create a JavaScript Candlestick Chart or
                    Stock Chart using SciChart.js. SciChart.js supports Candlestick Charts with custom colors per bar
                    and a Date X-Axis. Candlestick charts can be animated, dynamically updated for real trading apps or
                    combined with other series types to draw technical indicators or shapes.
               
                    By signing up with SciChart.js, you’ll have access to over 80 chart examples, including customizable
                    financial charts. Compared to other chart software vendors, our samples have more sophisticated
                    features, all with simple to understand instructions and documentation. Your developers can also
                    benefit from our responsive support team.`;

// customheader for the NewLinks
const customheader = `Documentation Link`;
const NewLinks = [
    { url: "https://www.scichart.com/documentation/js/current/", label: "SciChart.js Documentation Home" },
    {
        url: "https://www.scichart.com/javascript-candlestick-chart",
        label: "JavaScript Candlestick Chart Documentation",
    },
    { url: "https://www.scichart.com/javascript-tutorials", label: "SciChart.js Tutorials" },
    {
        url: "https://www.scichart.com/documentation/js/current/webframe.html#CommonRenderableSeriesProperties.html",
        label: "Common RenderableSeries Properties",
    },
];

const NewPoints = [
    { label: "Start for free with our community edition." },
    { label: " Access step-by-step code JavaScript Candlestick Chart samples to create charts with NPM and Webpack." },
    { label: "Access over 80 chart examples and customizable features with our examples app." },
    { label: "Get building your first charting app with our tutorials." },
];

// Benifit section Header
const BenifitsHeader = `Why Use SciChart JavaScript Chart Library?`;
const Benifits = [
    { label: "Supports millions of data points" },
    { label: "Fast rendering for real-time data feeds" },
    { label: "Supports customizable, interactive features" },
    { label: "5-star rated support for developers" },
    { label: "Winner of Queen’s Award for Innovation" },
];

// Question section header
const QuestionsHeader = `Frequently Asked Questions`;
const Questions = [
    {
        label: "Are your JavaScript Candlestick Charts responsive?",
        tag: "Yes – all our JavaScript charts offer cross-browser and device compatibility. This means they will automatically appear in the right format no matter what browser or device your web application viewers are using.",
    },
];

const markdownContent: string = undefined;

export const realtimePerformanceDemoExampleInfo: TExampleInfo = {
    onWebsite: true,
    title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
    pageTitle: ExampleStrings.titleRealtimeJavaScriptChartDemo,
    path: ExampleStrings.urlRealtimeJavaScriptChartDemo,
    filepath: "FeaturedApps/PerformanceDemos/RealtimePerformanceDemo",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    metaDescription: (frameworkName: string) =>
        `This demo showcases the incredible realtime performance of our ${frameworkName} charts by updating the series with millions of data-points!`,
    metaKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage,
    markdownContent,
    customDescription,
    customDescription1,
    customheader,
    NewLinks,
    moreInfoHeader,
    moreInfo,
    NewPoints,
    Questions,
    Benifits,
    BenifitsHeader,
    QuestionsHeader,
};
