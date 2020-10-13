import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>An example which demonstrates creating static multi-pane stock charts in JavaScript with Price data as
        Candlesticks, Volume bars behind the chart, Moving averages, plus how to link several charts together to draw
        Macd and RSI indicators.</p>
    <p>All charts are synchronized together by using the mouseEventGroup property on chart modifiers and the
        SciChartVerticalGroup type.</p>
    <p>Technical indicators are for demonstration purposes only. We recommend using the open source <a
        href="https://www.npmjs.com/package/talib" target="_blank" rel="nofollow">TA-Lib</a> to add more complex
        indicators to SciChart.js</p>
    <h4>Tips!</h4>
    <p>SciChart.js supports all the features you need to create rich, interactive, realtime JavaScript Stock Chart
        applications.
        Including Candlestick/OHLC charts, Band Series for bollinger bands, multi-panes, plus incredible real-time
        performance.
    </p>
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
        <li><a href={ExampleStrings.urlRealtimeTickingStockCharts}
               title={ExampleStrings.urlTitleRealtimeTickingStockCharts}>The
            Real-time Ticking Stock Charts Example</a></li>
        <li><a href={ExampleStrings.urlCandlestickChart}
               title={ExampleStrings.urlTitleCandlestickChart}>The
            JavaScript Candlestick Chart Example</a></li>
        <li><a href={ExampleStrings.urlOhlcChart}
               title={ExampleStrings.urlTitleOhlcChart}>The
            JavaScript Ohlc Chart Example</a></li>
    </ul>
</div>);

const Subtitle = () => (<p>Demonstrates how create a multi-pane <strong>JavaScript Stock Chart</strong>{' '}
    with indicator panels, synchronized zooming, panning and cursors, using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const multiPaneStockChartsExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleMultiPaneStockChart,
    path: ExampleStrings.urlMultiPaneStockChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
