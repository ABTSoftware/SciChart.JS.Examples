import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Heatmap chart description</div>;
const Subtitle = () => (<p>Demonstrates how to create a Real-time <strong>JavaScript Heatmap Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const heatmapChartExampleInfo: TExampleInfo = {
    title: "JavaScript Heatmap Chart",
    path: "/javascript-heatmap-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl
};
