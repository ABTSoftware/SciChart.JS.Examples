import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Candlestick chart description</div>;
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Candlestick Chart</strong> or Stock Chart{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const candlestickChartExampleInfo: TExampleInfo = {
    title: "JavaScript Candlestick Chart",
    path: "/javascript-candlestick-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
