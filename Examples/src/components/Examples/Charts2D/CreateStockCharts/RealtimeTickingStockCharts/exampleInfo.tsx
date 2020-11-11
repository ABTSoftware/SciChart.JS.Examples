import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>An example which demonstrates real-time ticking / updating stock charts in JavaScript with Price data as
        Candlesticks or Ohlc and Moving average indicators on the chart.</p>
    <p>Technical indicators are for demonstration purposes only. We recommend using the open source <a
        href="https://www.npmjs.com/package/talib" target="_blank" rel="nofollow">TA-Lib</a> to add more complex
        indicators to SciChart.js</p>
    <h4>Tips!</h4>
    <p>Click <strong>Start</strong> to see the example run in real-time!</p>
    <p>You can change the series type from Candlestick to Ohlc to Mountain and more.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlCandlestickChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleCandlestickChartDocumentation}>JavaScript Candlestick
            Chart Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlMultiPaneStockChart}
               title={ExampleStrings.urlTitleMountainChart}>The
            JavaScript Multi-Pane Stock Chart Example</a></li>
        <li><a href={ExampleStrings.urlCandlestickChart}
               title={ExampleStrings.urlTitleCandlestickChart}>The
            JavaScript Candlestick Chart Example</a></li>
        <li><a href={ExampleStrings.urlOhlcChart}
               title={ExampleStrings.urlTitleOhlcChart}>The
            JavaScript Ohlc Chart Example</a></li>
    </ul>
</div>);

const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Stock Chart</strong>{' '}
    with live real-time ticking and updating, using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const realtimeTickingStockChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeTickingStockCharts,
    path: ExampleStrings.urlRealtimeTickingStockCharts,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: `An example which demonstrates real-time ticking / updating stock charts in JavaScript with Price data as
        Candlesticks or Ohlc and Moving average indicators on the chart.`,
    seoKeywords: "real-time, ticking, updating, stock, chart, javascript, webgl, canvas"
};
