import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript Ohlc Chart. This is a chart type used in financial, stock trading
        applications which renders Date, Open, High, Low, Close data.</p>
    <p>The FastOhlcRenderableSeries requires an OhlcDataSeries, which contains X,Open,High,Low,Close data. The
        color of the candles is controlled by the strokeUp, strokeDown properties.
        Further customisation of color per-bar can be achieved with the SciChart.js PaletteProvider API.</p>
    <h4>Tips!</h4>
    <p>Try dragging on the chart to pan or zoom it. Use the mousewheel to zoom and double-click to zoom to fit.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlOhlcChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleOhlcChartDocumentation}>JavaScript Ohlc
            Chart Documentation</a></li>
        <li><a href={ExampleStrings.urlRenderSeriesPropertiesDocumentation}
               title={ExampleStrings.urlTitleRenderSeriesProperties} target="_blank">
            Common RenderableSeries Properties</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlCandlestickChart}
               title={ExampleStrings.urlTitleCandlestickChart}>The
            JavaScript Candlestick Chart Example</a></li>
        <li><a href={ExampleStrings.urlMultiPaneStockChart}
               title={ExampleStrings.urlTitleMultiPaneStockChart}>Multi-Pane Stock Chart Example</a></li>
        <li><a href={ExampleStrings.urlRealtimeTickingStockCharts}
               title={ExampleStrings.urlTitleRealtimeTickingStockCharts}>Realtime Ticking Stock Chart Example</a></li>
    </ul>
</div>);

const Subtitle = () => (
    <p>Demonstrates how to create a <strong>JavaScript Ohlc Chart</strong> or Stock Chart{' '}
        using SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const ohlcChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleOhlcChart,
    path: ExampleStrings.urlOhlcChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `Demonstrates how to create a JavaScript Ohlc Chart. This is a chart type used in financial, stock trading
        applications which renders Date, Open, High, Low, Close data.`,
    seoKeywords: "ohlc, stock, trading, chart, javascript, webgl, canvas"
};
