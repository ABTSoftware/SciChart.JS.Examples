import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Trading Buy Sell Marker Annotations description</div>;
const Subtitle = () => (<p>Demonstrates how to add Buy/Sell Markers (annotations) and News/Dividend bullets{' '}
    to a <strong>JavaScript Stock Chart</strong> using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const tradeMarkerAnnotationsExampleInfo: TExampleInfo = {
    title: "Trading Buy Sell Marker Annotations",
    path: "/javascript-stock-chart-buy-sell-markers",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
