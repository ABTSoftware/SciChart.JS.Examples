import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";
// import multiPaneStockChart from "src/components/Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/javascript-multi-pane-stock-charts.jpg";
// import fanChart from "../FanChart/javascript-fan-chart.jpg";

const previewDescription = `Demonstrates how to create a JavaScript Spline Band Chart. This is a chart type which draws an area (polygon
    or fill) between two lines. The FastBandRenderableSeries requires an XyyDataSeries, which contains one
    X-point and two Y-points`;
const description = `Dual lines are drawn by the stroke, strokeY1 properties and shaded bands are drawn by the fill and fillY1
properties, depending on whether y1 is greater than y2`;
const tips = [
    `If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
    confidence intervals, error margins or Bollinger Bands!`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: ExampleStrings.urlBandChartDocumentation,
        title: ExampleStrings.urlTitleDigitalLineChartDocumentation,
        linkTitle: "JavaScript Band Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            // {
            //     imgPath: multiPaneStockChart,
            //     title: ExampleStrings.titleMultiPaneStockChart,
            //     seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
            //     examplePath: ExampleStrings.urlMultiPaneStockChart
            // },
            // {
            //     imgPath: fanChart,
            //     title: ExampleStrings.titleFanChart,
            //     seoTitle: ExampleStrings.urlTitleFanChartDocumentation,
            //     examplePath: ExampleStrings.urlFanChart
            // }
        ]
    }
];



const Subtitle = () => (
    <p>
        Demonstrates how to create a <strong>JavaScript Band Chart</strong> or High-Low Fill using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}
        />
    </div>
);

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBandChart,
    path: ExampleStrings.urlBandChart,
    subtitle: Subtitle,
    description: Description,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Band Chart. This is a chart type which draws an area (polygon or fill) " +
        "between two lines. The Band series requires one X-point and two Y-points to draw the polygon",
    seoKeywords: "band, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-band-chart.jpg"
};
