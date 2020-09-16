import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Scatter chart description</div>;
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Scatter Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const scatterChartExampleInfo: TExampleInfo = {
    title: "JavaScript Scatter Chart",
    path: "/javascript-scatter-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
