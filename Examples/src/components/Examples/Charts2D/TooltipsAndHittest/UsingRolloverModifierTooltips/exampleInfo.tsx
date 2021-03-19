import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpes/types/types";
import hitTestApiChart from "../HitTestAPI/javascript-chart-hit-test-on-click.png";
import candlestickImg from "../../BasicChartTypes/CandlestickChart/javascript-candlestick-chart.jpg";
import multiPaneStockChart from "../../CreateStockCharts/MultiPaneStockCharts/javascript-multi-pane-stock-charts.jpg";
import realtimeStockImg from "../../CreateStockCharts/RealtimeTickingStockCharts/javascript-realtime-ticking-stock-charts.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `Demonstrates using the RolloverModifier, part of the ChartModifier API, to add mouse-over feedback of
data-points on time-series to the user.
</p>`;
const description = `This can be used to add Tooltips to a JavaScript chart as well as create Active legends which update values
as the user moves the mouse.`;
const tips = [
    `The hitTest function accepts parameters to control the hit-test logic. See the documentation on Hit-Testing
    for more info!`
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
        href: ExampleStrings.urlRolloverModifierDocumentation,
        title: ExampleStrings.urlTitleRolloverModifierDocumentation,
        linkTitle: "RolloverModifier documentation"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: hitTestApiChart,
                title: ExampleStrings.titleHitTestApi,
                seoTitle: ExampleStrings.urlTitleHitTestDocumentation,
                examplePath: ExampleStrings.urlHitTestApi
            },
            {
                imgPath: realtimeStockImg,
                title: ExampleStrings.titleRealtimeTickingStockCharts,
                seoTitle: ExampleStrings.urlTitleRealtimeTickingStockCharts,
                examplePath: ExampleStrings.urlRealtimeTickingStockCharts
            },
            {
                imgPath: multiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
            },
            {
                imgPath: candlestickImg,
                title: ExampleStrings.titleCandlestickChart,
                seoTitle: ExampleStrings.urlTitleCandlestickChart,
                examplePath: ExampleStrings.urlCandlestickChart
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to create <strong>tooltips on mouse-over</strong> using SciChart.js, High Performance{" "}
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

export const usingRolloverModifierTooltipsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRolloverModifier,
    path: ExampleStrings.urlRolloverModifier,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates adding Tooltips on mouse-move to a JavaScript Chart with SciChart.js RolloverModifier",
    seoKeywords: "rollover, modifier, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-rollovermodifier-tooltips.jpg"
};
