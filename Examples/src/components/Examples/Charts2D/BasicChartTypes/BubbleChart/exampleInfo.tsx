import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Bubble chart description</div>;
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Bubble Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const bubbleChartExampleInfo: TExampleInfo = {
    title: "JavaScript Bubble Chart",
    path: "/javascript-bubble-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
